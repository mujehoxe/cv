package main

import (
	"database/sql"
	"log"
	"os"

	_ "modernc.org/sqlite"
)

var db *sql.DB

func connectToDatabase() *sql.DB {
	//how to ask for permission to create cv.db file

	dir, _ := os.UserHomeDir()
	path := dir + "/Documents/" + "cv.db"
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		os.Create(path)
	}

	db, err := sql.Open("sqlite", path)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("PRAGMA foreign_keys = ON;")
	if err != nil {
		log.Fatalf("Failed to enable foreign keys: %v", err)
	}

	return db
}

func GetDBInstance() *sql.DB {
	if db == nil {
		db = connectToDatabase()
	}
	return db
}

func createUsersTable() {
	_, err := GetDBInstance().Exec(`CREATE TABLE IF NOT EXISTS users (
		id            INTEGER primary key autoincrement,
    first_name    TEXT not null,
    last_name     TEXT not null,
    picture       TEXT,
    date_modified DATETIME default CURRENT_TIMESTAMP
	)`)
	if err != nil {
		log.Fatal(err)
	}
}

func createProfilesTable() {
	_, err := GetDBInstance().Exec(`CREATE TABLE IF NOT EXISTS profiles (
		profile_id TEXT
		constraint profiles_pk unique,
		user_id    INTEGER
				references users
						on delete cascade,
		language   TEXT not null,
		json       TEXT,
		primary key (user_id, language)
	)`)
	if err != nil {
		log.Fatal(err)
	}
}
