# E-Commerce Web (Frontend)

A Vite + React storefront app with product browsing, filtering, cart management, checkout, order history, and basic authentication flow.

## Features

- Product catalog using local seed data (`src/assets/frontend_assets/assets.js`)
- Home page with hero, best-sellers, and latest products
- Collection page with search, category/subcategory filters, and sorting
- Product details page with image preview, size selection, and add-to-cart
- Cart page with quantity controls and order summary
- Checkout (place order) with shipping form and payment method
- Orders page with persisted order history
- Login/logout flow and route guards for checkout/orders
- localStorage persistence for user, cart, and orders
- Optional API integration via `VITE_API_BASE_URL` with local fallback

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Optional API integration

Set `VITE_API_BASE_URL` in an `.env` file to enable remote calls:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

Expected endpoints:

- `GET /products` -> `{ products: [...] }`
- `POST /auth/login` -> `{ user: {...} }`
- `POST /orders` -> `{ order: {...} }`

If API calls fail or env var is absent, the app gracefully falls back to local behavior.

## Run frontend + backend together

1. Start backend:

```bash
cd ../backend
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

2. Start frontend in another terminal:

```bash
cd ../frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
npm run dev
```
