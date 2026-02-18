<div align="center">

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />

# 📺 SubTracker — Subscription Tracker API

**A smart backend API to manage, monitor, and get reminded about your OTT and other subscriptions — before they silently drain your wallet.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Subscription Reminders](#-subscription-reminders)
- [Rate Limiting](#-rate-limiting)
- [License](#-license)

---

## 🌟 Overview

**SubTrackr** is a robust RESTful API built with **Node.js**, **Express.js**, and **MongoDB** that allows users to track their active subscriptions (Netflix, Spotify, YouTube Premium, and more). It automatically sends **email reminders** via **Upstash Workflows** when a subscription is about to expire — keeping users informed and in control.

It also features **rate limiting** powered by **Arcjet** to protect your endpoints from abuse.

---

## ✨ Features

- 🔐 **User Authentication** — Secure sign up & sign in with hashed credentials + JWT
- 📦 **Subscription Management** — Add, update, delete, and view subscriptions
- ⏰ **Tenure-Based Tracking** — Track subscriptions by monthly, quarterly, or annual tenure
- 📧 **Email Reminders** — Automated email alerts via Upstash Workflows before renewal
- 🛡️ **Rate Limiting** — Protect API with Arcjet's intelligent rate limiting
- 📊 **Subscription Categorization** — Entertainment, Finance, Sports and more
- 🔒 **Secure Routes** — JWT-protected private endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Workflow / Reminders | Upstash QStash Workflows |
| Rate Limiting | Arcjet |
| Email | Nodemailer / Upstash |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Upstash** account for QStash workflows
- **Arcjet** account for rate limiting

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/subscription-tracker.git
cd subscription-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 4. Start the development server
npm run dev
```

The server will start on `http://localhost:5500` (or the port you set in `.env`).

---

## 🔑 Environment Variables

Create a `.env` file in the root directory using the `.env.example` template:

```env
# Server
PORT=5500
NODE_ENV=development

# MongoDB
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/subtrackr

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Upstash (QStash Workflows)
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your_qstash_token
UPSTASH_WORKFLOW_URL=https://your-deployed-api.com/api/v1/workflows/reminder

# Email
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Arcjet
ARCJET_KEY=your_arcjet_key
```

---

## 📡 API Endpoints

### Auth Routes — `/api/v1/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/sign-up` | Register a new user | ❌ |
| `POST` | `/sign-in` | Login and receive JWT token | ❌ |
| `POST` | `/sign-out` | Logout the current user | ✅ |

---

### Subscription Routes — `/api/v1/subscriptions`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/` | Get all subscriptions for the user | ✅ |
| `GET` | `/:id` | Get a specific subscription | ✅ |
| `POST` | `/` | Create a new subscription | ✅ |
| `PUT` | `/:id` | Update a subscription | ✅ |
| `DELETE` | `/:id` | Delete a subscription | ✅ |
| `GET` | `/user/:userId` | Get all subscriptions by user ID | ✅ |
| `PUT` | `/:id/cancel` | Cancel a subscription | ✅ |

---

### Workflow Routes — `/api/v1/workflows`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `subscription/reminder` | Triggered by Upstash to send reminder emails |

---

### Example Request — Create Subscription

```http
POST /api/v1/subscriptions
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Netflix",
  "price": 649,
  "currency": "INR",
  "frequency": "monthly",
  "category": "Entertainment",
  "startDate": "2025-02-01",
  "status": "active"
}
```

### Example Response

```json
{
  "success": true,
  "data": {
    "_id": "64f2a1b3e4c9d7a1b2c3d4e5",
    "name": "Netflix",
    "price": 649,
    "currency": "INR",
    "frequency": "monthly",
    "category": "Entertainment",
    "startDate": "2025-02-01T00:00:00.000Z",
    "renewalDate": "2025-03-01T00:00:00.000Z",
    "status": "active",
    "user": "64f1a1b3e4c9d7a1b2c3d4e0",
    "createdAt": "2025-02-01T12:00:00.000Z"
  }
}
```

---

## 📧 Subscription Reminders

SubTrackr uses **Upstash QStash Workflows** to schedule and deliver email reminders automatically.

### How It Works

```
User creates subscription
        │
        ▼
Upstash Workflow is triggered
        │
        ▼
Workflow sleeps until (renewalDate - 7 days)
        │
        ▼
Email reminder sent: "Your subscription renews in 7 days!"
        │
        ▼
Workflow sleeps until (renewalDate - 3 days)
        │
        ▼
Email reminder sent: "Your subscription renews in 3 days!"
        │
        ▼
Workflow sleeps until (renewalDate - 1 day)
        │
        ▼
Final reminder email sent!
```

Reminders are sent **7 days**,**5 days**, **3 days**, and **1 day** before the renewal date, giving users ample notice to manage their subscriptions.

---

## 🛡️ Rate Limiting

API routes are protected using **[Arcjet](https://arcjet.com/)** to prevent abuse and brute-force attacks.

- **Auth routes** are rate-limited to `5 requests per IP per 10 minutes`
- **General API routes** use a token-bucket algorithm with sensible defaults
- Bot detection is enabled to block automated scraping

```js
// Example Arcjet config
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
```

---


Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---


<div align="center">

Made with ❤️ by [M A Hussain](https://github.com/adammdark)

🤝 Special thanks & credits to [jsmastry](https://github.com/adrianhajdin) for the inspiration and guidance that helped bring this project to life.

⭐ **Star this repo** if you find it useful!

</div>
