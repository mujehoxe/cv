package main

import (
	"database/sql"
	"errors"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/lithammer/fuzzysearch/fuzzy"
)

type User struct {
	ID           int64          `json:"id"`
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
func (a *App) CreateUser(user User) (int64, error) {
	stmt, err := a.db.Prepare(
		`INSERT INTO users (first_name, last_name, picture) VALUES ($1, $2, $3)`)
	if err != nil {
		return -1, fmt.Errorf("error preparing statement: %w", err)
	}

	result, err := stmt.Exec(user.FirstName, user.LastName, user.Picture)
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
	stmt, err := a.db.Prepare(
		`UPDATE users SET first_name = ?, last_name = ?, picture = ? date_modified = CURRENT_TIMESTAMP WHERE user_id = ?`)
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
// returns the newly created profile ID
func (a *App) CreateProfile(userID int64, language, profileID string) error {
	stmt, err := a.db.Prepare(
		`INSERT INTO profiles (user_id, language, profile_id)
		VALUES(?, ?, ?)`)
	if err != nil {
		return fmt.Errorf("error preparing statement: %w", err)
	}

	result, err := stmt.Exec(userID, language, profileID)

	if err != nil {
		return fmt.Errorf("error executing statement: %w", err)
	}

	_, err = result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert ID: %w", err)
	}

	return nil
}

func (a *App) UpdateProfileID(user User, language, profileID string) error {
	tx, err := a.db.Begin()
	if err != nil {
		return fmt.Errorf("error beginning transaction: %w", err)
	}
	defer tx.Rollback()

	query := `UPDATE profiles SET profile_id =? WHERE user_id =? AND language =?`
	_, err = tx.Exec(query, profileID, user.ID, language)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error updating profile: %w", err)
	}

	query = `UPDATE users SET first_name=?, last_name=?, picture=?, date_modified = CURRENT_TIMESTAMP WHERE id =?`
	_, err = tx.Exec(query, user.FirstName, user.LastName, user.Picture, user.ID)
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

// CreateOrUpdateProfile creates or updates the profile for the given user and language
func (a *App) CreateOrUpdateProfile(user User, language, profileID string) error {
	p, err := a.getProfileByUserIdAndLang(user.ID, language)
	if err != nil {
		return fmt.Errorf("error getting profile by user ID: %w", err)
	}

	if p == nil {
		return a.CreateProfile(user.ID, language, profileID)
	}

	return a.UpdateProfileID(user, language, profileID)
}

func (a *App) GetUserByID(userID int64) (*User, error) {
	query := `SELECT id, first_name, last_name, picture FROM users WHERE id=?`
	row := a.db.QueryRow(query, userID)

	u := &User{}
	err := row.Scan(&u.ID, &u.FirstName, &u.LastName, &u.Picture)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("error scanning user: %w", err)
	}

	return u, nil
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
	_, err := a.db.Exec(`DELETE FROM users WHERE id = ?`, userID)

	if err != nil {
		return fmt.Errorf("error deleting user: %w", err)
	}

	return nil
}

// GetProfilesOfUser given user_id
func (a *App) GetProfilesOfUser(userID int64) ([]*any, error) {
	rows, err := a.db.Query(`SELECT * FROM profiles WHERE user_id = ?`, userID)
	if err != nil {
		return nil, fmt.Errorf("error getting profiles of user: %w", err)
	}
	defer rows.Close()

	dbProfiles, err := rowsToProfiles(rows)
	if err != nil {
		return nil, fmt.Errorf("error converting rows to profiles: %w", err)
	}

	var profiles []*any

	for _, dbProfile := range dbProfiles {
		profile, err := a.GetProfile(dbProfile.ProfileID)
		if err != nil {
			return nil, fmt.Errorf("error getting profile: %w", err)
		}
		profiles = append(profiles, &profile)
	}

	return profiles, nil
}

// getProfile by userId and language
func (a *App) getProfileByUserIdAndLang(userId int64, lang string) (*Profile, error) {
	row := a.db.QueryRow(
		`SELECT * FROM profiles WHERE user_id = ? AND language = ?`, userId, lang)
	profile := Profile{}
	err := row.Scan(&profile.ProfileID, &profile.UserID, &profile.Language)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("error getting profile: %w", err)
	}

	return &profile, nil
}

// rowsToProfiles converts a sql row into a profile
func rowsToProfiles(rows *sql.Rows) ([]*Profile, error) {
	profiles := []*Profile{}
	for rows.Next() {
		profile := Profile{}
		err := rows.Scan(&profile.ProfileID, &profile.UserID, &profile.Language)
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
		userNames = append(userNames, strings.ToLower(u.FirstName+" "+u.LastName))
	}

	ranks := fuzzy.RankFind(strings.ToLower(searchTerm), userNames)
	sort.SliceStable(ranks,
		func(i, j int) bool { return ranks[i].Distance < ranks[j].Distance })

	filteredUsers := []*User{}
	for _, rank := range ranks {
		filteredUsers = append(filteredUsers, users[rank.OriginalIndex])
	}

	return filteredUsers
}
