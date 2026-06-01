# Pay Qist

Pay Qist is a React + Vite installment shopping demo with authentication, product browsing, a cart/checkout flow, and an admin portal.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router
- Firebase-ready service boundary for auth/data integration

## Features

- Email/password signup and login
- Google sign-in button
- Protected checkout and admin routes
- Featured storefront with installment pricing
- Product detail pages with 3, 6, or 12 month plans
- Cart and mock checkout payment flow
- Admin product CRUD and order overview

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

Copy `.env.example` to `.env` and fill in Firebase values if you want to connect the service layer to real infrastructure.

The app works in local demo mode without secrets, storing demo auth, products, cart, and orders in `localStorage`.

## Firebase Setup

1. Enable Email/Password and Google sign-in in Firebase Authentication.
2. Create Firestore and Storage in your Firebase project.
3. Copy the values into `.env` from `.env.example`.
4. Deploy [firestore.rules](firestore.rules) and [storage.rules](storage.rules).

Admin access is derived from `VITE_ADMIN_EMAIL` in the app and the matching admin email check in the Firebase rules. If you change the admin email, update the rules to match.