# E-Commerce Web (Frontend)

A Vite + React storefront app with product browsing, filtering, cart management, checkout, order history, and basic authentication flow.

## Features

- Product catalog using local seed data (`src/assets/frontend_assets/assets.js`)
- Home page with hero, best-sellers, and latest products
- Collection page with search, category/subcategory filters, and sorting
- Product details page with image preview, size selection, and add-to-cart
- Cart page with quantity controls and order summary
- Checkout (place order) with guest checkout, shipping form, and payment methods
- Orders page with persisted order history
- Login/register flow, guest checkout option, and route guards for orders
- Profile management, address book, and password reset screens
- Coupon codes with discount + free shipping support
- localStorage persistence for user, cart, and orders
- Optional API integration via `VITE_API_BASE_URL` with local fallback
- Optional feature flags for wishlist, saved payments, notifications, and loyalty points

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
- `POST /auth/password/forgot` -> `{ status, token? }`
- `POST /auth/password/reset` -> `{ status }`
- `GET /profile` -> `{ user: {...} }`
- `PUT /profile` -> `{ user: {...} }`
- `GET /addresses` -> `{ addresses: [...] }`
- `POST /addresses` -> `{ address: {...} }`
- `PUT /addresses/{addressId}` -> `{ address: {...} }`
- `DELETE /addresses/{addressId}` -> `{ deleted: true }`
- `GET /orders` -> `{ orders: [...] }`
- `POST /orders` -> `{ order: {...} }`
- `GET /wishlist` -> `{ items: [...] }`
- `POST /wishlist` -> `{ item: {...} }`
- `DELETE /wishlist/{itemId}` -> `{ deleted: true }`
- `GET /payment-methods` -> `{ methods: [...] }`
- `POST /payment-methods` -> `{ method: {...} }`
- `DELETE /payment-methods/{methodId}` -> `{ deleted: true }`
- `GET /notifications` -> `{ notifications: [...] }`
- `PATCH /notifications/{notificationId}/read` -> `{ notification: {...} }`
- `GET /loyalty-points` -> `{ points: number }`

If API calls fail or env var is absent, the app gracefully falls back to local behavior.

Optional feature flags (set to `true` to enable):

```bash
VITE_FEATURE_WISHLIST=true
VITE_FEATURE_PAYMENTS=true
VITE_FEATURE_NOTIFICATIONS=true
VITE_FEATURE_LOYALTY=true
```

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
