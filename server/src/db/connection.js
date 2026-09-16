import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'yoga.db'), { timeout: 5000 });

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Close connection gracefully
const handleShutdown = () => {
  db.close();
  process.exit(0);
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

export default db;