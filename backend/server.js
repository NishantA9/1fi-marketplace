import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSchema, db } from './db.js';
import productsRouter from './routes/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, 'data', 'marketplace.db');

// Auto-seed on first run if the database is empty
initSchema();
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
if (productCount === 0) {
  console.log('No products found, running seed...');
  await import('./seed.js');
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/products', productsRouter); // Mount the products router
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`1Fi Marketplace API running on http://localhost:${PORT}`);
});
