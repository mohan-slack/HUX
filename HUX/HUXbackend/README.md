# HUX Backend (Node.js/Express/Prisma)

This is the HUXbackend API for the HUX Smart Ring platform.

---

## 📦 Structure

```
HUXbackend/
├── src/
│   ├── api/           # Express routes & middlewares
│   ├── models/        # Data models/types
│   ├── services/      # Business logic, DB access
│   ├── utils/         # Utility functions (mail, push, etc.)
│   ├── validation/    # Zod schemas for input validation
│   └── app.ts         # Express app setup
├── prisma/            # Prisma schema & migrations
├── tests/             # Jest/Supertest E2E & unit tests
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

1. **Install dependencies:**  
   `npm install`

2. **Set up environment:**  
   Copy `.env.example` to `.env` and fill in secrets (JWT, DB, email, Apple/Google keys).

3. **Run migrations:**  
   `npx prisma migrate dev`

4. **Start the server:**  
   `npm run dev`

5. **API docs:**  
   Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🗄️ Database

- **Current:** SQLite (dev, file-based, easy for local/test)
- **Recommended for production:** PostgreSQL or MySQL (update `DATABASE_URL` in `.env` and `prisma/schema.prisma`)
- **Migrations:** Managed by Prisma (`npx prisma migrate ...`)
- **Future:** Consider managed DB (AWS RDS, PlanetScale, etc.) for scaling.

---

## 🔑 Authentication & Security

- **JWT-based auth** for all protected endpoints.
- **Zod** for input validation (all endpoints).
- **Email verification** required for access.
- **Password reset** with email token.
- **Role-based access:** (Planned) Add admin/user roles for sensitive endpoints.
- **Security middleware:** (Planned) Add rate limiting, helmet, CORS config.

---

## 📡 API Overview

- **User Auth:** Register, login, social login (Google/Apple), JWT, email verification.
- **Profile:** Update, change password, push token registration.
- **Password Reset:** Request/reset via email.
- **Push Notifications:** Expo push integration.
- **Analytics:** User count, summary, registrations by day, active/inactive.
- **Admin:** (Planned) RBAC, user management.

**See `/api-docs` for full Swagger/OpenAPI documentation.**

---

## 🧪 Testing

- **Unit/E2E:** Jest, Supertest, in-memory SQLite for isolation.
- **Run all tests:**  
  `npm test`
- **Test setup:** See [`tests/`](./tests/) and [Testing Guide](../HUXfrontend/e2e/README.md)

---

## 🛠️ SDKs & Integrations

- **Prisma ORM:** DB access, migrations.
- **Nodemailer:** Email sending (use real SMTP in prod).
- **Expo Server SDK:** Push notifications.
- **Google/Apple Auth:** Social login (see `.env` for keys).
- **Zod:** Input validation.

---

## 📝 What's Implemented

- All major user flows (register, login, social login, email verification, password reset, push, analytics).
- Full input validation.
- E2E and unit tests.
- Swagger API docs.

---

## 🟡 What's Missing / Recommendations

- **Production DB:** Switch to Postgres/MySQL for scale.
- **RBAC:** Add roles, restrict admin endpoints.
- **Security:** Add helmet, CORS, rate limiting.
- **Advanced analytics, logging, monitoring.**
- **Provider failover for email/push.**
- **CI/CD pipeline for automated deploys/tests.**

**My recommendation:**  
Prioritize DB migration, RBAC, and security middleware for production readiness.

---

## 📚 See Also

- [Monorepo README](../README.md)
- [Frontend README](../HUXfrontend/README.md)
- [Testing Guide](../HUXfrontend/e2e/README.md) 