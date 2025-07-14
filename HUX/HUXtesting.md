# HUXtesting – HUX Smart Ring Testing Guide

This document covers E2E, unit, and integration testing for the HUX Smart Ring project.

---

## 📚 Documentation & Project Guide

**For full project details, setup instructions, architecture, and contribution guidelines, please see the monorepo root:**  
[README.md](./README.md)

---

## 🧪 Testing Overview

- **Frontend:** Detox E2E tests, Jest unit tests
- **Backend:** Jest, Supertest
- **Test coverage:** Auth, registration, email verification, social login, navigation, and more

---

## 🚀 Quick Start (Testing)

```sh
# Run all frontend E2E tests
cd HUXfrontend
detox test

# Run all frontend unit tests
cd HUXfrontend
npm test

# Run all backend tests
cd HUXbackend
npm test
```

---

## 🤝 Contributing

- Please follow the monorepo contribution guidelines in [README.md](./README.md).
- Use feature branches and submit PRs for review.

---

**Note:** This testing guide is part of a larger monorepo. For backend, frontend, and infrastructure details, always refer to the root README. 