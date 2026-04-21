import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'matrix.db');
const db = new Database(dbPath);

// Initialize DB schema to match the Frontend Architecture Requirements
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    address TEXT PRIMARY KEY,
    level INTEGER DEFAULT 1,
    joinedDate TEXT,
    directReferrals INTEGER DEFAULT 0,
    totalTeamVolume REAL DEFAULT 0.0,
    totalTeamSeats INTEGER DEFAULT 0,
    validSeats INTEGER DEFAULT 0,
    earnings REAL DEFAULT 0.0,
    referrer TEXT,
    has_approved INTEGER DEFAULT 0,
    total_deducted REAL DEFAULT 0.0,
    account_mode TEXT DEFAULT 'PRODUCTION' -- PRODUCTION, TEST, DEMO
  );

  CREATE TABLE IF NOT EXISTS seats (
    id TEXT PRIMARY KEY,
    owner_address TEXT,
    level INTEGER DEFAULT 1,
    origin TEXT,
    participation_status TEXT,
    rewards REAL DEFAULT 0.0,
    is_active INTEGER DEFAULT 1,
    tx_hash TEXT,
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    address TEXT,
    type TEXT,
    amount REAL,
    timestamp TEXT,
    level INTEGER,
    status TEXT,
    simulated INTEGER DEFAULT 0,
    origin_node TEXT,
    ratio TEXT,
    downstream_payout REAL,
    differential_share REAL,
    to_address TEXT
  );

  CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS global_banners (
    id TEXT PRIMARY KEY,
    message TEXT,
    type TEXT DEFAULT 'info',
    is_active INTEGER DEFAULT 1,
    created_at TEXT
  );
`);

export default db;
