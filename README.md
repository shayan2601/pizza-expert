# Pizza Expert

A full-stack pizza ordering platform — customer storefront, cart and checkout, order tracking, and an admin dashboard for managing the menu and fulfilling orders.

**Live demo:** https://pizza-expert.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Overview

This is a monorepo with two independently deployable apps:

| Directory | App | Stack |
|---|---|---|
| `client/` | Customer + admin frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| `server/` | REST API | NestJS 11, MongoDB via Mongoose, JWT auth with Passport |

## Features

**Storefront**
- Menu browsing with category filtering
- Per-product variants (e.g. sizes) with independent pricing
- Persistent cart backed by React context
- Guest checkout — orders accept an optional user reference, so no account is required to order

**Accounts**
- Registration and login with JWT bearer tokens
- Passwords hashed with bcrypt
- Customers can view their own order history at `/orders`

**Admin**
- Role-based access enforced server-side via a `@Roles('admin')` decorator and a guard, not just hidden in the UI
- Full menu CRUD — create, update and delete products
- View all orders across customers
- Advance order status and payment status as orders are fulfilled

## Architecture notes

Authorization is enforced at the API layer. `JwtAuthGuard` validates the token and `RolesGuard` checks the role claim against the `@Roles()` decorator on each route, so admin endpoints stay protected regardless of what the client renders.

The order schema snapshots product name and price onto each line item at purchase time rather than storing only a product reference. Menu prices change; historical orders shouldn't silently change with them.

## API

Base URL defaults to `http://localhost:3001`.

### Auth
| Method | Route | Access |
|---|---|---|
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |

### Products
| Method | Route | Access |
|---|---|---|
| `GET` | `/products` | Public |
| `GET` | `/products/categories` | Public |
| `GET` | `/products/:id` | Public |
| `POST` | `/products` | Admin |
| `PATCH` | `/products/:id` | Admin |
| `DELETE` | `/products/:id` | Admin |

### Orders
| Method | Route | Access |
|---|---|---|
| `POST` | `/orders` | Public (guest checkout) |
| `GET` | `/orders/my-orders` | Authenticated |
| `GET` | `/orders/:id` | Authenticated |
| `GET` | `/orders` | Admin |
| `PATCH` | `/orders/:id/status` | Admin |
| `PATCH` | `/orders/:id/payment` | Admin |

## Running locally

**Prerequisites:** Node.js 20+, and a MongoDB instance (local or Atlas).

### 1. API

```bash
cd server
npm install
```

Create `server/.env`:

```bash
MONGODB_URI=mongodb://localhost:27017/pizza-expert
JWT_SECRET=replace-with-a-long-random-string
PORT=3001
```

```bash
npm run start:dev
```

### 2. Seed an admin user

```bash
cd server
npx ts-node seed-admin.ts
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Tests

```bash
cd server
npm test          # unit
npm run test:e2e  # end-to-end
npm run test:cov  # coverage
```

## Project structure

```
client/src/
├─ app/           # App Router pages: /, cart, checkout, login, signup, orders, admin
├─ components/    # shared UI
├─ context/       # cart state
└─ lib/           # API client

server/src/
├─ auth/          # JWT strategy, guards, roles decorator
├─ products/      # controller, service, schema
├─ orders/        # controller, service, schema
├─ users/         # service, schema
└─ database/      # Mongoose connection module
```
