# 1Fi Marketplace

_Built by Nishant Acharekar as part of the 1Fi SDE Intern assignment._

A full-stack marketplace feature built for the 1Fi Shop page — browse smartphones and buy them on EMI plans backed by mutual funds, without liquidating investments.

Built for the **1Fi SDE Intern assignment**. The `Shop` tab of the app now has three entries: `Top Brands` and `Nearby Stores` (placeholders, per the assignment scope) and **`1Fi Marketplace`**, which is fully implemented here.

## Tech stack

- **Frontend:** React 18 + Vite, React Router, Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`)

## Project structure

```
1fi-marketplace/
├── backend/
│   ├── server.js        # Express app entrypoint (auto-seeds DB on first run)
│   ├── db.js             # SQLite connection + schema
│   ├── seed.js            # Seed data: 3 products, variants, EMI plans
│   ├── routes/products.js  # /api/products endpoints
│   └── data/marketplace.db (generated on first run)
└── frontend/
    └── src/
        ├── pages/ShopPage.jsx    # Shop screen: hero banner + Top Brands / Nearby Stores / 1Fi Marketplace pill tabs
        ├── pages/ProductPage.jsx  # Product detail + EMI plan selection (/products/:slug)
        └── components/
            ├── DeviceFrame.jsx    # Phone-frame wrapper for demo purposes
            ├── HeroBanner.jsx     # Purple gradient hero, matches the real 1Fi Shop screen
            ├── PillTabs.jsx       # Segmented tab control (3 tabs)
            ├── ListCard.jsx       # Reusable row card (used for Marketplace products)
            ├── BottomNav.jsx      # Home / Shop / EMI Dues / Limit / Profile
            └── EMIPlanCard.jsx    # Selectable EMI plan row
```

**UI reference:** The Shop screen's hero banner, pill-tab toggle, search bar, and list-card style are built to match screenshots of the actual 1Fi app (provided separately, not included in this repo). `Top Brands` and `Nearby Stores` remain as empty/coming-soon tabs per the assignment scope; `1Fi Marketplace` is the third tab, fully implemented and pulling live data from the backend API.

## Schema

**products**
| column | type | notes |
|---|---|---|
| id | INTEGER PK | |
| slug | TEXT UNIQUE | used in the URL, e.g. `/products/iphone-17-pro` |
| name | TEXT | |
| brand | TEXT | |
| category | TEXT | |
| description | TEXT | |

**variants** (a product has 2+ variants — storage/color combinations)
| column | type | notes |
|---|---|---|
| id | INTEGER PK | |
| product_id | INTEGER FK → products.id | |
| label | TEXT | e.g. "256GB Silver" |
| storage | TEXT | |
| color | TEXT | |
| mrp | INTEGER | in ₹ |
| price | INTEGER | in ₹ |
| image_url | TEXT | |
| is_default | INTEGER | 1 for the variant shown by default |

**emi_plans** (each variant has 7 EMI plans: 3/6/12/24 months at 0%, 36/48/60 months at 10.5%)
| column | type | notes |
|---|---|---|
| id | INTEGER PK | |
| variant_id | INTEGER FK → variants.id | |
| monthly_amount | INTEGER | in ₹ |
| tenure_months | INTEGER | |
| interest_rate | REAL | 0 or 10.5 |
| cashback | INTEGER | in ₹ |

## API endpoints

### `GET /api/products`
Returns all products with their variants (no EMI plans — kept light for list views).

```json
[
  {
    "id": 1,
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "category": "Smartphones",
    "description": "The latest Apple flagship with A19 Pro chip...",
    "variants": [
      {
        "id": 1,
        "label": "256GB Silver",
        "storage": "256GB",
        "color": "Silver",
        "mrp": 134900,
        "price": 127400,
        "discountPercent": 6,
        "imageUrl": "https://...",
        "isDefault": true
      }
    ]
  }
]
```

### `GET /api/products/:slug`
Returns a single product with variants **and** their EMI plans.

```json
{
  "id": 1,
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "variants": [
    {
      "id": 1,
      "label": "256GB Silver",
      "price": 127400,
      "mrp": 134900,
      "emiPlans": [
        { "id": 1, "monthlyAmount": 42467, "tenureMonths": 3, "interestRate": 0, "cashback": 7500 },
        { "id": 2, "monthlyAmount": 21233, "tenureMonths": 6, "interestRate": 0, "cashback": 7500 },
        { "id": 4, "monthlyAmount": 5308, "tenureMonths": 24, "interestRate": 0, "cashback": 7500 },
        { "id": 5, "monthlyAmount": 4654, "tenureMonths": 36, "interestRate": 10.5, "cashback": 7500 }
      ]
    }
  ]
}
```

### `GET /api/health`
Simple liveness check: `{ "status": "ok" }`

## Setup & run instructions

**Requirements:** Node.js 18+

### 1. Backend

```bash
cd backend
npm install
npm start
```

This starts the API on `http://localhost:4000`. On first run it automatically creates the SQLite database at `backend/data/marketplace.db` and seeds it with 3 products (each with 2–3 variants and 7 EMI plans per variant). To reseed manually at any time: `npm run seed`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api/*` requests to the backend on port 4000 (see `vite.config.js`), so both must be running.

### 3. Try it

- `/` or `/shop` — the Shop screen: hero banner, then **Top Brands** / **Nearby Stores** / **1Fi Marketplace** as switchable tabs (matching the real app's tab-toggle pattern). Top Brands and Nearby Stores show a coming-soon state; 1Fi Marketplace loads the product list live from the API.
- `/products/iphone-17-pro`, `/products/samsung-s24-ultra`, `/products/oneplus-12` — product detail pages with variant switching and EMI plan selection

## Live Deployment

- **Frontend:** https://1fi-marketplace-kappa.vercel.app/
- **Backend API:** https://onefi-marketplace-nishant.onrender.com
- **YouTube Explanation Video:** https://youtu.be/oOfSE0CA3g0?si=R-09DXMPXz-_mHiB
- **GitHub Repository:** https://github.com/NishantA9/1fi-marketplace 

Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. If the app has been idle, the first request may take 20–50 seconds while it wakes up.