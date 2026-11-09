const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const configuredPath = process.env.DATABASE_FILE || './data/moviehub.sqlite';
const databasePath = path.resolve(__dirname, '..', configuredPath);
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 160),
    synopsis TEXT NOT NULL DEFAULT '',
    release_year INTEGER CHECK(release_year IS NULL OR release_year BETWEEN 1888 AND 2200),
    genre TEXT NOT NULL DEFAULT '',
    director TEXT NOT NULL DEFAULT '',
    poster_url TEXT NOT NULL DEFAULT '',
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL DEFAULT '' CHECK(length(comment) <= 2000),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(movie_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY(user_id, movie_id)
  );

  CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(release_year);
  CREATE INDEX IF NOT EXISTS idx_reviews_movie ON reviews(movie_id);
  CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
`);

module.exports = db;
