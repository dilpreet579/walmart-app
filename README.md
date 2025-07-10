# Walmart E-Commerce App

A full-stack, production-ready Walmart clone e-commerce app with a modern Next.js frontend and Node.js/Express backend. Features real authentication, cart, orders, address management, Stripe payments, Google reCAPTCHA v3 bot protection, and global state with Zustand.

---

## 🤖 Bot Detection Dashboard

Monitor live bot detection analytics for this website at:

[https://bot-detector-model-dashboard.onrender.com/](https://bot-detector-model-dashboard.onrender.com/)

This dashboard provides real-time insights into bot activity and detection results from the checkout and authentication flows of the Walmart E-Commerce App.

---

## Things to be changed

1. Remove JWT token from localStorage.
2. add orders page.

---

## 🚀 Features

- User authentication (register, login, JWT)
- Product catalog with category filtering
- Cart management (add, update, remove, clear)
- Checkout and payment with Stripe
- Order history
- Address book (CRUD)
- Protected routes (cart/orders/addresses require login)
- Real backend API integration everywhere
- Google reCAPTCHA v3 bot protection (register, login, checkout)
- Global state via Zustand
- Responsive, modern UI

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Zustand, Tailwind CSS, Heroicons
- **Backend:** Node.js, Express, PostgreSQL (Prisma ORM)
- **Auth:** JWT (localStorage, to be migrated to HTTP-only cookies)
- **Payments:** Stripe
- **Bot Security:** Google reCAPTCHA v3
- **Other:** Docker (Postgres), REST API

---

## ⚡ Prerequisites

- Node.js (v18+ recommended)
- Docker (for Postgres DB)
- npm or yarn
- Stripe account (for test keys)
- Google reCAPTCHA v3 keys

---

## 🏗️ Setup Instructions

### 1. Clone the repo
```sh
git clone <your-repo-url>
cd Walmart-E-Commerce-App
```

### 2. Backend Setup
```sh
cd backend
cp .env.example .env      # Fill out DB, JWT, Stripe, reCAPTCHA, etc.
docker compose up -d      # Start Postgres
npm install
npx prisma migrate dev
npx prisma generate
npm run dev               # or npm start for production
```

### 3. Frontend Setup
```sh
cd ../frontend
cp .env.example .env      # Set NEXT_PUBLIC_API_BASE_URL, Stripe, reCAPTCHA, etc.
npm install
npm run dev               # Next.js dev server
```

---

## ⚙️ Environment Variables

### Backend `.env`
- `PORT=5000`
- `DATABASE_URL=postgresql://postgres:password@localhost:5432/walmart`
- `JWT_SECRET=...`
- `STRIPE_SECRET_KEY=...`
- `RECAPTCHA_SECRET_KEY=...`

### Frontend `.env`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...`
- `NEXT_PUBLIC_BOT_DETECTION_API=http://localhost:8000/predict_session`  # Bot detection API endpoint for checkout

---

## 🛡️ Google reCAPTCHA v3 Integration

- **Protected Forms:** Registration, Login, Checkout
- **Setup:**  
  - Get site key and secret key from [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/)
  - Add allowed domains (e.g., `localhost`, your production domain)
  - Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` in frontend `.env`
  - Set `RECAPTCHA_SECRET_KEY` in backend `.env`

---

## 💳 Stripe Test Cards

Use the following card numbers in Stripe's test mode for payment testing:

| Card Type                  | Card Number           | Expiry      | CVC    | ZIP   | Notes                   |
|----------------------------|----------------------|-------------|--------|-------|-------------------------|
| Visa (Success)             | 4242 4242 4242 4242  | Any future  | Any 3  | Any   | Always succeeds         |
| Visa (Requires Auth)       | 4000 0000 0000 9995  | Any future  | Any 3  | Any   | Requires 3D Secure     |
| Visa (Declined)            | 4000 0000 0000 0002  | Any future  | Any 3  | Any   | Always declined         |
| Mastercard (Success)       | 5555 5555 5555 4444  | Any future  | Any 3  | Any   | Always succeeds         |
| American Express (Success) | 3782 8224 6310 005   | Any future  | Any 4  | Any   | Always succeeds         |
| Discover (Success)         | 6011 1111 1111 1117  | Any future  | Any 3  | Any   | Always succeeds         |

➡️ **Use these in Stripe's test mode only.** You'll see transactions in the Stripe Dashboard under "Test Mode".

---

## 🟢 Development Notes

- All global state is managed by Zustand (cart, products, auth, orders, addresses)
- JWT is currently stored in localStorage (see TODO)
- Backend uses Prisma ORM and Dockerized Postgres
- All REST endpoints are protected via JWT where required
- reCAPTCHA v3 is enforced on sensitive forms for bot protection

---

<!--
## Dev TODO
1. Remove JWT token from localStorage.
2. Add orders page.
-->

## 📄 License
MIT