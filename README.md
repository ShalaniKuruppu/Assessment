# MO Marketplace

MO Marketplace is a full-stack demo application for product and variant management with JWT authentication and a React frontend.

It includes:
- NestJS backend APIs for products, variants, and authentication
- React frontend for product browsing, variant selection, cart, quick buy, and checkout demo flow
- Validation on both frontend and backend
- Role-aware behavior (admin vs user)

## Tech Stack

Backend:
- NestJS
- TypeORM
- PostgreSQL
- JWT (passport-jwt)
- class-validator / class-transformer

Frontend:
- React + TypeScript
- Vite
- React Router
- Axios

## Project Structure

- mo-marketplace-api: NestJS backend
- mo-marketplace-web: React frontend

## Key Features

### Backend
- Product APIs with variant support
- Variant combination key generation
- Duplicate variant prevention within a product
- JWT-based auth (signup/login)
- Protected product management endpoints
- Global request validation using ValidationPipe

### Frontend
- Product listing page
- Product detail page with variant selection
- Out-of-stock handling in selection flow
- Product creation form with validations
- Login/signup flows
- Cart page and  checkout page
- Quick Buy flow redirected to checkout page

## Prerequisites

- Node.js 18
- npm 9+
- PostgreSQL running locally (or reachable DB)

## Environment Variables (Backend)

Create a file named .env inside mo-marketplace-api and copy values from .env.example.

Example values:

PORT=3001
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=mo_marketplace
JWT_SECRET=mysecret
JWT_EXPIRES_IN=1h
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@mo-marketplace.local
ADMIN_PASSWORD=Admin@12345

## Installation

Install dependencies in each app:

Backend:

cd mo-marketplace-api
npm install

Frontend:

cd mo-marketplace-web
npm install

## Run the Project

Start backend:

cd mo-marketplace-api
npm run start:dev

Start frontend:

cd mo-marketplace-web
npm run dev

Default URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Live Demo

- Deployed Frontend: https://assessment-rho-red.vercel.app/

## Build

Backend build:

cd mo-marketplace-api
npm run build

Frontend build:

cd mo-marketplace-web
npm run build

## API Summary

Auth:
- POST /auth/signup
- POST /auth/login

Products:
- GET /products
- GET /products/:id
- POST /products (JWT required)
- PATCH /products/:id (JWT + admin role)
- DELETE /products/:id (JWT + admin role)

## Validation and Edge Cases Covered

- Frontend form validation for product creation
- Backend DTO validation with whitelist and forbidNonWhitelisted enabled
- Duplicate variant combinations return clear errors
- Out-of-stock state is handled in product detail flow

## Assumptions

- Local development is the primary target environment.
- PostgreSQL is available and reachable using values from mo-marketplace-api/.env.
- JWT auth is sufficient for this project scope (no OAuth/SSO integration required).
- Checkout is intentionally demo-only and does not include payment gateway integration.
- Cart persistence is client-side (localStorage) for simplicity.
- Admin account can be bootstrapped using environment variables.

## Key Technical Decisions and Trade-offs

- Monorepo-style folder split: backend and frontend are kept in separate apps for clear ownership and independent run/build commands.
- NestJS + TypeORM + PostgreSQL: chosen for fast API development with entity modeling and relational data support.
- JWT-based stateless authentication: simple to implement and easy to integrate with React via Authorization header.
- Global ValidationPipe with whitelist and forbidNonWhitelisted: strict payload validation to reduce malformed input risks.
- Product-scoped variant combination keys: prevents duplicate variant combinations within the same product while allowing reuse across different products.
- Role-based authorization on management endpoints: admin-only update/delete APIs enforce business control boundaries.
- React Router page flows for quick buy/cart/checkout: clear UX navigation with simple state passing between screens.
- In-page feedback messages instead of browser alerts: cleaner UX and better control over messaging behavior.

## Notes

- Checkout is currently a demo page (no payment integration).
- Cart is localStorage-based in current implementation.
- API enables CORS for local development.

## Troubleshooting

If backend fails to start:
- Verify PostgreSQL is running and DB credentials are correct
- Check if port 3001 is already in use
- Re-run backend build: npm run build

If frontend cannot call API:
- Confirm backend is running at http://localhost:3001
- Confirm token exists after login for protected endpoints

## License

UNLICENSED
