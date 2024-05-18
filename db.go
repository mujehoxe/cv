package main

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func connectToDatabase() *sql.DB {
	db, err := sql.Open("sqlite3", "./cv.db")
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
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		picture TEXT,
		date_modified DATETIME DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		log.Fatal(err)
	}
}

func createProfilesTable() {
	_, err := GetDBInstance().Exec(`CREATE TABLE IF NOT EXISTS profiles (
			profileId INTEGER PRIMARY KEY,
			user_id INTEGER,
			language TEXT NOT NULL,
			FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
	)`)
	if err != nil {
		log.Fatal(err)
	}
}
