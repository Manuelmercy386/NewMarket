# NewMarket

NewMarket is a campus-focused multi-vendor storefront platform built for student buyers and student vendors. It combines a shared cart, split-store checkout, escrow-style order tracking, and a vendor dashboard for managing products and fulfillment.

## What It Does

- Browse student-run campus stores and products by category, campus, and search term.
- Add items from multiple vendors into one shared cart.
- Place orders with escrow-style checkout and fee handling.
- Track buyer orders and item-level fulfillment timelines.
- Switch to a vendor dashboard to manage inventory and update sub-order status.
- Register a new store and add products from the UI.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Express
- Prisma
- SQLite
- Framer Motion
- Lucide React

## Project Structure

- `src/` - React app, pages, shared components, contexts, and API client
- `server/` - Express backend with in-memory demo data and API routes
- `prisma/` - Prisma schema for the marketplace data model

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install Dependencies

```bash
npm install
```

### Run the Frontend

The Vite dev server runs on port 3000 and proxies `/api` requests to the backend.

```bash
npm run dev
```

### Run the Backend

Start the Express API in a second terminal.

```bash
npm run server
```

### Optional Prisma Commands

If you want to work with the Prisma schema, run:

```bash
npm run prisma:generate
npm run prisma:push
```

## Available Scripts

- `npm run dev` - Start the Vite frontend on port 3000
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run server` - Start the Express API on port 5000
- `npm run prisma:generate` - Generate the Prisma client
- `npm run prisma:push` - Push the Prisma schema to the database

## API Overview

The frontend calls the backend under `/api/v1`.

### Public Routes

- `GET /api/v1/health` - Health check
- `GET /api/v1/stores` - List stores
- `GET /api/v1/products` - List products
- `POST /api/v1/auth/register` - Register a user
- `POST /api/v1/auth/login` - Log in a user

### Authenticated Routes

- `POST /api/v1/stores` - Create a store
- `POST /api/v1/products` - Create a product
- `POST /api/v1/orders/checkout` - Create a multi-vendor checkout order
- `GET /api/v1/orders/my-orders` - Fetch the current buyer's orders
- `GET /api/v1/vendor/orders` - Fetch vendor orders
- `PATCH /api/v1/vendor/orders/:id/status` - Update a vendor order item status

## App Notes

- Buyer and vendor personas are mocked in the UI for quick demo flows.
- Cart and user state persist in `localStorage`.
- The backend currently serves in-memory demo data, so restarting the server resets that data.
- The Prisma schema in `prisma/schema.prisma` documents the intended relational model for users, stores, products, orders, and order items.

## Demo Flow

1. Open the marketplace home page.
2. Browse stores or search products.
3. Add items from multiple vendors to the cart.
4. Open checkout to create an order.
5. Switch to buyer orders to inspect the timeline.
6. Switch to the vendor dashboard to update fulfillment states.

## License

ISC