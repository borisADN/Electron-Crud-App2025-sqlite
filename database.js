const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let db;

async function getConnection() {
  if (!db) {
    db = await open({
      filename: path.join(__dirname, 'electron_crud_db.sqlite'),
      driver: sqlite3.Database
    });

    // Crée la table product si elle n'existe pas
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
