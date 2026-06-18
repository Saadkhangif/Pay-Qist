# Pay Qist

Pay Qist is a React + Vite installment shopping demo with authentication, product browsing, and a cart/checkout flow.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router
- Node.js + Express + MongoDB backend

## Features

- Email/password signup and login
- Google sign-in button
- Protected checkout routes
- Featured storefront with installment pricing
- Product detail pages with 3, 6, or 12 month plans
- Cart and mock checkout payment flow

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

## Environment

Copy `.env.example` to `.env` and configure your API URL and environment variables.

Admin access is derived from `VITE_ADMIN_EMAIL` in the app frontend. 