package main

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"time"

	"github.com/lithammer/fuzzysearch/fuzzy"
)

type User struct {
	ID           string         `json:"id"`
	FirstName    string         `json:"first_name"`
	LastName     string         `json:"last_name"`
	Picture      sql.NullString `json:"picture"`
	DateModified time.Time      `json:"date_modified"`
	Profiles     []Profile      `json:"profiles"`
}

type Profile struct {
	ProfileID string `json:"profile_id"`
	Language  string `json:"language"`
	UserID    int64  `json:"user_id"`
}

type paginatedUsersResult struct {
	TotalCount int64   `json:"total_count"`
	Users      []*User `json:"users"`
}

// Create a new user in the database
func (a *App) CreateUser(firstName, lastName, picture string) (int64, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return -1, fmt.Errorf("error getting home directory: %w", err)
	}

	picturePath := ""
	if picture != "" {
		location := filepath.Join(homeDir, "images")
		picturePath, err = saveBase64ImageToLocalStorage(picture, location)
		if err != nil {
			return -1, fmt.Errorf("error saving image to local storage: %w", err)
		}
	}

	stmt, err := GetDBInstance().
		Prepare(`INSERT INTO users (first_name, last_name, picture) VALUES ($1, $2, $3)`)
	if err != nil {
		return -1, fmt.Errorf("error preparing statement: %w", err)
	}

	result, err := stmt.Exec(firstName, lastName, picturePath)
	if err != nil {
		return -1, fmt.Errorf("error executing statement: %w", err)
	}

	lastID, err := result.LastInsertId()
	if err != nil {
		return -1, fmt.Errorf("error getting last insert ID: %w", err)
	}

	return lastID, nil
}

// Update an existing user in the database
func (a *App) UpdateUser(id int64, firstName, lastName, picture string) error {
	stmt, err := GetDBInstance().Prepare(
		`UPDATE users SET first_name = ?, last_name = ?, picture = ? date_modified = NOW() WHERE user_id = ?`)
	if err != nil {
		return fmt.Errorf("error preparing statement: %w", err)
	}

	_, err = stmt.Exec(firstName, lastName, picture, id)
	if err != nil {
		return fmt.Errorf("error executing statement: %w", err)
	}

	return nil
}

// Create a new profile for a given user
func (a *App) CreateProfile(userID int64, language, profileID string) (string, error) {
	stmt, err := GetDBInstance().Prepare(
		`INSERT INTO profiles (user_id, language, profile_id)
		VALUES(?, ?, ?)`)
	if err != nil {
		return "", fmt.Errorf("error preparing statement: %w", err)
	}

	result, err := stmt.Exec(userID, language, profileID)

	if err != nil {
		return "", fmt.Errorf("error executing statement: %w", err)
	}

	lastID, err := result.LastInsertId()
	if err != nil {
		return "", fmt.Errorf("error getting last insert ID: %w", err)
	}

	return strconv.Itoa(int(lastID)), nil
}

func (a *App) UpdateProfile(userID int64, language, profileID string) error {
	tx, err := GetDBInstance().Begin()
	if err != nil {
		return fmt.Errorf("error beginning transaction: %w", err)
	}
	defer tx.Rollback()

	queryProfile := `UPDATE profiles SET language =?, profile_id =? WHERE user_id =?`
	_, err = tx.Exec(queryProfile, language, profileID, userID)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error updating profile: %w", err)
	}

	queryUser := `UPDATE users SET date_modified = CURRENT_TIMESTAMP WHERE id =?`
	_, err = tx.Exec(queryUser, userID)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error updating user date_modified: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

func rowsToUsers(rows *sql.Rows) ([]*User, error) {
	var users []*User
	for rows.Next() {
		var u User
		err := rows.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Picture)
		if err != nil {
			return nil, fmt.Errorf("error scanning user: %w", err)
		}
		users = append(users, &u)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return users, nil
}

// GetUsersPaginated returns all users from the database,
// Paginated by page number and size,
// Along with the total count of users
func (a *App) GetUsersPaginated(
	page int64, pageSize int64) (paginatedUsersResult, error) {

	countRow := a.db.QueryRow(`SELECT COUNT(*) FROM users`)
	var count int64
	err := countRow.Scan(&count)
	if err != nil {
		return paginatedUsersResult{}, fmt.Errorf("error getting count of users: %w", err)
	}

	rows, err := a.db.Query(`SELECT id, first_name, last_name, picture FROM users ORDER BY date_modified DESC LIMIT ? OFFSET ?`,
		pageSize,
		(page-1)*pageSize)
	if err != nil {
		return paginatedUsersResult{}, fmt.Errorf("error querying users: %w", err)
	}
	defer rows.Close()

	users, err := rowsToUsers(rows)
	if err != nil {
		return paginatedUsersResult{}, fmt.Errorf("error converting rows to users: %w", err)
	}

	return paginatedUsersResult{
		TotalCount: count,
		Users:      users,
	}, nil
}

// GetAllUsers returns all users from the database
func getAllUsers() ([]*User, error) {
	rows, err := GetDBInstance().Query(
		`SELECT id, first_name, last_name, picture FROM users ORDER BY date_modified DESC`)
	if err != nil {
		return nil, fmt.Errorf("error getting users: %w", err)
	}
	defer rows.Close()

	users, err := rowsToUsers(rows)
	if err != nil {
		return nil, fmt.Errorf("error converting rows to users: %w", err)
	}

	return users, nil
}

// SearchUsers searches for users based on their first_name and/or last_name
// Along with totalCount of users that match the search term
func (a *App) SearchUsers(
	searchTerm string, page, pageSize int) (paginatedUsersResult, error) {

	users, err := getAllUsers()
	if err != nil {
		return paginatedUsersResult{}, fmt.Errorf("error getting all users: %w", err)
	}

	filteredUsers := fuzzySearchUsers(users, searchTerm)
	// paginated results
	paginatedUsers := paginate(filteredUsers, page, pageSize)
	return paginatedUsersResult{
		Users: paginatedUsers, TotalCount: int64(len(filteredUsers))}, nil
}

func paginate(users []*User, page, pageSize int) []*User {
	startIndex := (page - 1) * pageSize
	endIndex := startIndex + pageSize

	if endIndex > len(users) {
		endIndex = len(users)
	}

	if startIndex < 0 {
		startIndex = 0
	}

	return users[startIndex:endIndex]
}

// DeleteUser deletes the user with the given ID
func (a *App) DeleteUser(userID int64) error {
	_, err := GetDBInstance().Exec(`DELETE FROM users WHERE id = ?`, userID)

	if err != nil {
		return fmt.Errorf("error deleting user: %w", err)
	}

	return nil
}

// GetProfilesOfUser given user_id
func (a *App) GetProfilesOfUser(userID int64) ([]*Profile, error) {
	rows, err := GetDBInstance().Query(`SELECT p.*, u.first_name, u.last_name, u.picture FROM profiles AS p INNER JOIN users AS u ON p.user_id=u.id WHERE p.user_id=?`, userID)
	if err != nil {
		return nil, fmt.Errorf("error getting profiles of user: %w", err)
	}
	defer rows.Close()

	profiles, err := rowsToProfiles(rows)
	if err != nil {
		return nil, fmt.Errorf("error converting rows to profiles: %w", err)
	}

	return profiles, nil
}

// rowsToProfiles converts a sql row into a profile
func rowsToProfiles(rows *sql.Rows) ([]*Profile, error) {
	profiles := []*Profile{}
	for rows.Next() {
		profile := Profile{}
		err := rows.Scan(&profile.UserID, &profile.Language, &profile.UserID)
		if err != nil {
			return nil, fmt.Errorf("error scanning row to profile: %w", err)
		}
		profiles = append(profiles, &profile)
	}

	return profiles, nil
}

// fuzzySearchUsers takes in an array of users and returns the ones that match the search term
func fuzzySearchUsers(users []*User, searchTerm string) []*User {
	var userNames []string
	for _, u := range users {
		userNames = append(userNames, u.FirstName+" "+u.LastName)
	}

	ranks := fuzzy.RankFind(searchTerm, userNames)
	sort.SliceStable(ranks,
		func(i, j int) bool { return ranks[i].Distance < ranks[j].Distance })

	filteredUsers := []*User{}
	for _, rank := range ranks {
		filteredUsers = append(filteredUsers, users[rank.OriginalIndex])
	}

	return filteredUsers
}
