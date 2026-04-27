# E-Commerce Web (Backend)

Laravel API backend for the E-Commerce frontend.

## Features

- Product catalog persisted in database (`products` table)
- Auth endpoint with Sanctum token issuance
- Order creation endpoint with server-side price/total calculation
- Seeded product data ported from frontend catalog IDs (`aaaaa` ... `aaabz`)

## API contract

- `GET /api/products` -> `{ products: [...] }`
- `POST /api/auth/login` -> `{ user: { id, name, email, token } }`
- `POST /api/orders` (Bearer token required) -> `{ order: {...} }`

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
