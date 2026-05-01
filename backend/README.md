# E-Commerce Web (Backend)

Laravel API backend for the E-Commerce frontend.

## Features

- Product catalog persisted in database (`products` table)
- Auth endpoint with Sanctum token issuance
- Profile + address management for authenticated users
- Order history with server-side price/total calculation
- Password reset endpoints for API-driven flows
- Optional wishlist, saved payment methods, notifications, and loyalty points
- Seeded product data ported from frontend catalog IDs (`aaaaa` ... `aaabz`)

## API contract

- `GET /api/products` -> `{ products: [...] }`
- `POST /api/auth/login` -> `{ user: { id, name, email, phone, loyaltyPoints, token } }`
- `POST /api/auth/password/forgot` -> `{ status, token? }`
- `POST /api/auth/password/reset` -> `{ status }`
- `GET /api/profile` (Bearer token required) -> `{ user: { id, name, email, phone, loyaltyPoints } }`
- `PUT /api/profile` (Bearer token required) -> `{ user: {...} }`
- `GET /api/addresses` (Bearer token required) -> `{ addresses: [...] }`
- `POST /api/addresses` (Bearer token required) -> `{ address: {...} }`
- `PUT /api/addresses/{addressId}` (Bearer token required) -> `{ address: {...} }`
- `DELETE /api/addresses/{addressId}` (Bearer token required) -> `{ deleted: true }`
- `GET /api/orders` (Bearer token required) -> `{ orders: [...] }`
- `POST /api/orders` (Bearer token required) -> `{ order: {...} }`
- `GET /api/wishlist` (Bearer token required) -> `{ items: [...] }`
- `POST /api/wishlist` (Bearer token required) -> `{ item: {...} }`
- `DELETE /api/wishlist/{itemId}` (Bearer token required) -> `{ deleted: true }`
- `GET /api/payment-methods` (Bearer token required) -> `{ methods: [...] }`
- `POST /api/payment-methods` (Bearer token required) -> `{ method: {...} }`
- `DELETE /api/payment-methods/{methodId}` (Bearer token required) -> `{ deleted: true }`
- `GET /api/notifications` (Bearer token required) -> `{ notifications: [...] }`
- `PATCH /api/notifications/{notificationId}/read` (Bearer token required) -> `{ notification: {...} }`
- `GET /api/loyalty-points` (Bearer token required) -> `{ points: number }`

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

## Environment

- `APP_URL=http://localhost:8000`
- `FRONTEND_URL=http://localhost:5173`

## Tests

```bash
php artisan test
```
