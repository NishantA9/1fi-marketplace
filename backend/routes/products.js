import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

function serializeProduct(product, variants) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    description: product.description,
    variants: variants.map((v) => ({
      id: v.id,
      label: v.label,
      storage: v.storage,
      color: v.color,
      mrp: v.mrp,
      price: v.price,
      discountPercent: Math.round(((v.mrp - v.price) / v.mrp) * 100),
      imageUrl: v.image_url,
      isDefault: !!v.is_default,
    })),
  };
}

// GET /api/products - list all products with their variants (summary, no EMI plans)
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id').all();
  const variantStmt = db.prepare('SELECT * FROM variants WHERE product_id = ? ORDER BY id');

  const result = products.map((p) => serializeProduct(p, variantStmt.all(p.id)));
  res.json(result);
});

// GET /api/products/:slug - single product with variants + EMI plans per variant
router.get('/:slug', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const variants = db.prepare('SELECT * FROM variants WHERE product_id = ? ORDER BY id').all(product.id);
  const planStmt = db.prepare('SELECT * FROM emi_plans WHERE variant_id = ? ORDER BY tenure_months');

  const serialized = serializeProduct(product, variants);
  serialized.variants = serialized.variants.map((v) => ({
    ...v,
    emiPlans: planStmt.all(v.id).map((plan) => ({
      id: plan.id,
      monthlyAmount: plan.monthly_amount,
      tenureMonths: plan.tenure_months,
      interestRate: plan.interest_rate,
      cashback: plan.cashback,
    })),
  }));

  res.json(serialized);
});

export default router;
