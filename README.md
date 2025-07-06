# Walmart E-Commerce App

A full-stack, production-ready Walmart clone e-commerce app. Features a modern Next.js frontend and Node.js/Express backend, real authentication, cart, orders, address management, Stripe payments, and global state with Zustand.

---

## Things to be changed

1. Remove JWT token from localStorage.
2. I want when the user tries to add a product to his cart, he is prompted to login first if he isnt logged in, if logged in then the product gets added.
3. add orders page.

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
- Global state via Zustand
- Responsive, modern UI

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), React, Zustand, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL (Prisma ORM)
- **Auth:** JWT (localStorage, to be migrated to HTTP-only cookies)
- **Payments:** Stripe
- **Other:** Docker (Postgres), REST API

---

## ⚡ Prerequisites
- Node.js (v18+ recommended)
- Docker (for Postgres DB)
- npm or yarn

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
cp .env.example .env  # Fill out DB, JWT, Stripe, etc.
docker compose up -d  # Start Postgres
npm install
npx prisma migrate dev
npx prisma generate
npm run dev           # or npm start for production
```

### 3. Frontend Setup
```sh
cd ../frontend
cp .env.example .env  # Set NEXT_PUBLIC_API_BASE_URL, etc.
npm install
npm run dev           # Next.js dev server
```

---

## ⚙️ Environment Variables
### Backend `.env`
- `DATABASE_URL=postgresql://postgres:password@localhost:5432/walmart`
- `JWT_SECRET=...`
- `STRIPE_SECRET_KEY=...`
- `RECAPTCHA_SECRET_KEY=...`

### Frontend `.env`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...`

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

<!--
## Dev TODO
1. Remove JWT token from localStorage.
2. Prompt login on add-to-cart if not logged in.
3. Add orders page.
-->



## 🟢 Development Notes
- All global state is managed by Zustand (cart, products, auth, orders, addresses)
- No legacy Context API or prop drilling
- JWT is currently stored in localStorage (see TODO)
- Backend uses Prisma ORM and Dockerized Postgres
- All REST endpoints are protected via JWT where required

---

## 📄 License
MIT