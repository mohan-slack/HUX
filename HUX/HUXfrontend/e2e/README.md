# HUX Smart Ring Testing Guide

This guide covers all testing for the HUX Smart Ring project: E2E, integration, and unit.

---

## 🧪 Test Types

- **Backend:** Jest + Supertest (E2E, unit)
- **Frontend:** Detox (E2E), Jest (unit)
- **Social Login:** Automated E2E with mocks

---

## 🚀 Running Tests

### **Backend**

1. **Install dependencies:**  
   `cd HUXbackend && npm install`
2. **Run all tests:**  
   `npm test`
3. **Test DB:**  
   Uses in-memory SQLite for isolation.

### **Frontend (E2E with Detox)**

1. **Install dependencies:**  
   `cd HUXfrontend && npm install`
2. **Build app for testing:**  
   - iOS: `detox build --configuration ios.sim.debug`
   - Android: `detox build --configuration android.emu.debug`
3. **Run tests:**  
   - iOS: `detox test --configuration ios.sim.debug`
   - Android: `detox test --configuration android.emu.debug`

### **Frontend (Unit)**

- `npm test` (runs Jest unit tests in `__tests__/`)

---

## 📝 What's Covered

- **Backend:** Auth, profile, password reset, analytics, RBAC, edge cases.
- **Frontend E2E:** Auth, registration, email verification, social login (with mocks), navigation.
- **Test social login:** Uses special test tokens for full automation.

---

## 🟡 What's Missing / Recommendations

- **More E2E:** Add tests for onboarding, settings, widgets, error states.
- **Test cleanup:** Add scripts to remove test users/data after runs.
- **CI/CD:** Integrate tests into build pipeline.
- **Accessibility tests:** Add for frontend.

**My recommendation:**  
Automate test cleanup and integrate all tests into CI for every PR.

---

## 📚 See Also

- [Monorepo README](../../README.md)
- [Backend README](../../HUXHUXbackend/README.md)
- [Frontend README](../README.md) 