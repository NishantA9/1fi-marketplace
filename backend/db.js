import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'marketplace.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize the database schema if it doesn't exist, consists of three tables: products, variants, and emi_plans. 
// The schema is designed to support a marketplace with products that have multiple variants and associated EMI plans.
export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      storage TEXT,
      color TEXT,
      mrp INTEGER NOT NULL,
      price INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      is_default INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS emi_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      variant_id INTEGER NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
      monthly_amount INTEGER NOT NULL,
      tenure_months INTEGER NOT NULL,
      interest_rate REAL NOT NULL,
      cashback INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_variants_product ON variants(product_id);
    CREATE INDEX IF NOT EXISTS idx_emi_variant ON emi_plans(variant_id);
  `);
}
