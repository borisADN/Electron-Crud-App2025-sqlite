const { app } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

async function getConnection() {
  if (!db) {
    // dossier sûr pour le .exe
    const dbPath = path.join(app.getPath('userData'), 'electron_crud_db.sqlite');

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.run(`
      CREATE TABLE IF NOT EXISTS product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT
      )
    `);
  }
  return db;
}

module.exports = { getConnection };
