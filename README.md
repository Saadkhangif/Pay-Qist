# Pay Qist

Pay Qist is a React + Vite installment shopping demo with authentication, product browsing, and a cart/checkout flow.

## Project structure

```
Pay QIst/
├── client/          # React frontend (Vite)
├── server/          # Express API
├── api/             # Vercel serverless entry
├── scripts/         # Env merge utilities
└── package.json     # npm workspaces root
```

## Stack

- React 19 + Vite
- Tailwind CSS
- React Router
- Node.js + Express backend

## Features

- Email/password signup and login
- Protected checkout routes
- Featured storefront with installment pricing
- Product detail pages with 3, 6, or 12 month plans
- Cart and mock checkout payment flow

## Run locally

1. Install dependencies from the repo root:

```bash
npm install
```

2. Start the unified dev server (frontend + API on port 8787):

```bash
npm run dev
```

Other scripts:

| Command | Description |
|---------|-------------|
| `npm run build` | Build frontend to `client/dist` |
| `npm run start` | Production server (serves `client/dist`) |
| `npm run dev -w client` | Frontend-only dev with API proxy |
| `npm run lint` | Lint client, server, and api |

## Environment

Copy `.env.example` to `.env` at the repo root. Both `client/` and `server/` read env files from the root.

- Leave `VITE_API_BASE_URL` empty when using the unified server (`npm run dev` / `npm start`)
- Admin account is seeded from `ADMIN_EMAIL` and `ADMIN_PASSWORD` on server start
