# 🍕 Pizza Delivery — Full Stack MERN Application

A complete, production-style pizza ordering platform built with the MERN stack (MongoDB, Express, React, Node.js). Includes user auth with email verification, a step-by-step custom pizza builder, cart & checkout, Razorpay test-mode payments, real-time order tracking via Socket.io, and a full admin dashboard for managing pizzas, inventory, orders, and users.


---

## ✨ Features

### User
- Register / Login with JWT + refresh tokens
- Email verification and forgot/reset password (via Nodemailer)
- Browse pizza menu with search & category filters
- 6-step **Custom Pizza Builder** (base → sauce → cheese → vegetables → size → quantity)
- Cart with quantity controls and coupon codes (`PIZZA10`, `FLAT50`)
- Checkout with tax, delivery charge, and grand total calculation
- Razorpay **test-mode** payment integration
- Order history and **real-time order status tracking** (Socket.io)
- Order cancellation (while still eligible)
- Responsive, glassmorphism-styled UI with loading skeletons & toasts

### Admin
- Separate admin login & protected dashboard
- Manage pizzas (create/edit/delete, image upload)
- Manage inventory (bases, sauces, cheese, vegetables) with stock +/- controls
- Automatic inventory deduction on custom pizza orders
- Low-stock email alerts (hourly cron job)
- Manage orders — update status, which pushes a **real-time update** to the customer
- Manage users
- Dashboard statistics: total orders, today's orders, revenue, pending/completed counts, 7-day order chart

---

## 🛠 Tech Stack

**Frontend:** React 18, React Router, Axios, Context API, Tailwind CSS, Socket.io Client, Vite

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, Bcrypt, Nodemailer, Razorpay (test mode), Socket.io, Node-cron, Multer, Helmet, express-mongo-sanitize, express-rate-limit

---

## 📁 Folder Structure

```
pizza-delivery-app/
├── backend/
│   ├── config/          # db, email, razorpay config
│   ├── controllers/     # route handler logic
│   ├── cron/             # low-stock checker (node-cron)
│   ├── middlewares/     # auth, error, upload, validation
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── services/         # socket.io service
│   ├── uploads/           # uploaded pizza images (created at runtime)
│   ├── utils/             # token gen, email templates, pricing, seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/    # Navbar, Footer, PizzaCard, OrderStatusTracker, ProtectedRoute
    │   ├── context/        # AuthContext, AdminAuthContext, CartContext, SocketContext
    │   ├── layouts/        # MainLayout, AdminLayout
    │   ├── pages/           # all user pages + pages/admin for admin panel
    │   ├── services/        # axios instance + API wrapper functions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend URL (for CORS + email links), e.g. `http://localhost:5173` |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Long random strings for signing tokens |
| `EMAIL_HOST/PORT/USER/PASS/FROM` | SMTP credentials (Gmail App Password recommended) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | From Razorpay dashboard, **test mode** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by the seed script to create the first admin |

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Backend base URL for Socket.io, e.g. `http://localhost:5000` |

---

## 🗄 MongoDB Setup

**Option A — Local MongoDB**
1. Install MongoDB Community Server.
2. Start it (`mongod`), it defaults to `mongodb://127.0.0.1:27017`.
3. Use `MONGO_URI=mongodb://127.0.0.1:27017/pizza_delivery`.

**Option B — MongoDB Atlas (cloud, free tier)**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Add a database user and allow your IP (or `0.0.0.0/0` for testing).
3. Copy the connection string into `MONGO_URI`.

---

## 💳 Razorpay Setup (Test Mode)

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Go to **Settings → API Keys → Generate Test Key**.
3. Copy the **Key ID** and **Key Secret** into `backend/.env`.
4. Copy the **Key ID** into `frontend/.env` as `VITE_RAZORPAY_KEY_ID` (optional — the backend already returns it to the client at checkout).
5. Use Razorpay's test card `4111 1111 1111 1111`, any future expiry, any CVV, to simulate a successful payment.

---

## 📧 Email Setup (Nodemailer)

Using Gmail:
1. Enable 2-Step Verification on your Google account.
2. Generate an **App Password**: Google Account → Security → App Passwords.
3. Set `EMAIL_USER` to your Gmail address and `EMAIL_PASS` to the generated app password.

Any other SMTP provider (SendGrid, Mailgun, Outlook, etc.) works too — just update `EMAIL_HOST` / `EMAIL_PORT` accordingly.

---



### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run seed            # creates admin account + sample pizzas/inventory
npm run dev              # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env    # then fill in your values
npm run dev               # starts on http://localhost:5173
```

Visit `http://localhost:5173` for the storefront and `http://localhost:5173/admin/login` for the admin panel.

**Default admin login** (from the seed script, unless you changed `.env`):
- Email: `admin@pizza.com`
- Password: `Admin@123`

---

## 🚀 Deployment Guide

**Backend** (Render / Railway / any Node host):
1. Push the `backend/` folder to a repo.
2. Set all environment variables from `.env.example` in your host's dashboard.
3. Build command: `npm install`. Start command: `npm start`.
4. Make sure your MongoDB Atlas cluster allows connections from your host's IP.

**Frontend** (Vercel / Netlify):
1. Push the `frontend/` folder to a repo.
2. Set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed backend's URL.
3. Build command: `npm run build`. Output directory: `dist`.


`

---

## 📝 License

This project is provided for educational / internship purposes. Free to use and modify.


## Demo Video

[Watch the Project Demo](https://lnkd.in/p/dAuhK4MG)
