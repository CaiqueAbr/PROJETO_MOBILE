require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const configuredPath = process.env.DATABASE_FILE || './data/moviehub.sqlite';
const databasePath = path.resolve(__dirname, '..', configuredPath);
for (const file of [databasePath, `${databasePath}-shm`, `${databasePath}-wal`]) {
  if (fs.existsSync(file)) fs.unlinkSync(file);
}
console.log('Banco local removido. Ele será recriado ao iniciar a API.');
