# 🐼 PandaStay (Panda Hotel)

A full-stack hotel booking platform built with **Next.js 14 (App Router)**, **TypeScript**, **PostgreSQL + Prisma**, **Stripe**, and **SendGrid**.

This guide explains how to **set up, run, and develop** the project locally.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript  
- **Backend:** Next.js API routes  
- **Database:** PostgreSQL + Prisma  
- **Auth:** JWT  
- **Payments:** Stripe  
- **Emails:** SendGrid  

---

## 📦 Prerequisites

- Node.js v18 or v20  
- npm / yarn / pnpm  
- PostgreSQL  
- Git (optional)

---

## 📁 Project Setup

### 1️⃣ Clone or Extract

```bash
git clone <repo-url> panda_hotel
cd panda_hotel
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root.

```env
BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public
AUTH_SECRET=your-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

---

## 🗄️ Database Setup

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

Demo user:
```
demo@pandahotel.com
password123
```

---

## ▶️ Run the App

```bash
npm run dev
```

Open: http://localhost:3000

---

## 📍 Routes

| Route | Description |
|------|------------|
| / | Home |
| /dashboard | Dashboard |
| /auth/login | Login |
| /auth/register | Register |
| /booking-history | Bookings |
| /payment | Stripe Checkout |

---

## 💳 Stripe

Use test card:
```
4242 4242 4242 4242
```

---

## ✉️ Email

Handled via SendGrid in:
```
lib/email.ts
```

---

## 📜 Scripts

```bash
npm run dev
npm run build
npm run start
npx prisma migrate dev
npx prisma db seed
```

---

## 🚀 Deployment

Deploy on Vercel, Railway, or Docker with env variables configured.

---

Happy coding 🚀
