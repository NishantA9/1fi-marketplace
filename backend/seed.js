import { db, initSchema } from './db.js';

// Standard EMI tenures used across the marketplace (mirrors the reference design):
// 0% interest up to 24 months, 10.5% simple interest beyond that.
const TENURES = [
  { months: 3, rate: 0 },
  { months: 6, rate: 0 },
  { months: 12, rate: 0 },
  { months: 24, rate: 0 },
  { months: 36, rate: 10.5 },
  { months: 48, rate: 10.5 },
  { months: 60, rate: 10.5 },
];

function buildPlans(price) {
  const CASHBACK = 7500;
  return TENURES.map(({ months, rate }) => {
    let monthly;
    if (rate === 0) {
      monthly = Math.round(price / months);
    } else {
      // simple interest spread across the tenure
      const totalInterest = price * (rate / 100) * (months / 12);
      monthly = Math.round((price + totalInterest) / months);
    }
    return { monthly_amount: monthly, tenure_months: months, interest_rate: rate, cashback: CASHBACK };
  });
}

function seed() {
  initSchema();

  db.exec('DELETE FROM emi_plans; DELETE FROM variants; DELETE FROM products;');

  const insertProduct = db.prepare(
    `INSERT INTO products (slug, name, brand, category, description) VALUES (?, ?, ?, ?, ?)`
  );
  const insertVariant = db.prepare(
    `INSERT INTO variants (product_id, label, storage, color, mrp, price, image_url, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertPlan = db.prepare(
    `INSERT INTO emi_plans (variant_id, monthly_amount, tenure_months, interest_rate, cashback)
     VALUES (?, ?, ?, ?, ?)`
  );


const catalog = [
    {
      slug: 'iphone-17-pro',
      name: 'iPhone 17 Pro',
      brand: 'Apple',
      category: 'Smartphones',
      description: 'The latest Apple flagship with A19 Pro chip, ProMotion display and titanium design.',
      variants: [
        { label: '256GB Silver', storage: '256GB', color: 'Silver', mrp: 134900, price: 127400,
          image_url: '/images/iphone-17-pro-silver.png', is_default: 1 },
        { label: '256GB Orange', storage: '256GB', color: 'Orange', mrp: 134900, price: 127400,
          image_url: '/images/iphone-17-pro-orange.png', is_default: 0 },
        { label: '512GB Deep Blue', storage: '512GB', color: 'Deep Blue', mrp: 154900, price: 146900,
          image_url: '/images/iphone-17-pro-deep-blue.png', is_default: 0 },
      ],
    },
    {
      slug: 'samsung-s24-ultra',
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      category: 'Smartphones',
      description: 'Samsung\'s flagship with Snapdragon 8 Gen 3, S Pen and 200MP camera system.',
      variants: [
        { label: '256GB Titanium Black', storage: '256GB', color: 'Titanium Black', mrp: 129999, price: 119999,
          image_url: '/images/samsung-s24-titanium-black.png', is_default: 1 },
        { label: '256GB Titanium Gray', storage: '256GB', color: 'Titanium Gray', mrp: 129999, price: 119999,
          image_url: '/images/samsung-s24-titanium-gray.png', is_default: 0 },
        { label: '512GB Titanium Violet', storage: '512GB', color: 'Titanium Violet', mrp: 144999, price: 134999,
          image_url: '/images/samsung-s24-titanium-violet.png', is_default: 0 },
      ],
    },
    {
      slug: 'oneplus-12',
      name: 'OnePlus 12',
      brand: 'OnePlus',
      category: 'Smartphones',
      description: 'Flagship killer with Snapdragon 8 Gen 3, Hasselblad camera and 100W fast charging.',
      variants: [
        { label: '256GB Silky Black', storage: '256GB', color: 'Silky Black', mrp: 69999, price: 64999,
          image_url: '/images/oneplus-12-silky-black.png', is_default: 1 },
        { label: '512GB Flowy Emerald', storage: '512GB', color: 'Flowy Emerald', mrp: 74999, price: 69999,
          image_url: '/images/oneplus-12-flowy-emerald.png', is_default: 0 },
      ],
    },
  ];

  for (const p of catalog) {
    const productInfo = insertProduct.run(p.slug, p.name, p.brand, p.category, p.description);
    const productId = productInfo.lastInsertRowid;

    for (const v of p.variants) {
      const variantInfo = insertVariant.run(
        productId, v.label, v.storage, v.color, v.mrp, v.price, v.image_url, v.is_default
      );
      const variantId = variantInfo.lastInsertRowid;

      for (const plan of buildPlans(v.price)) {
        insertPlan.run(variantId, plan.monthly_amount, plan.tenure_months, plan.interest_rate, plan.cashback);
      }
    }
  }

  console.log('Seed complete:', catalog.length, 'products inserted.');
}

seed();
