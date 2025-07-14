# HUXfrontend – HUX Smart Ring Mobile App

This is the React Native (Expo) mobile application for the HUX Smart Ring ecosystem.  
It supports both iOS and Android, and provides comprehensive health, wellness, and device management features.

---

## 📚 Documentation & Project Guide

**For full project details, setup instructions, architecture, and contribution guidelines, please see the monorepo root:**  
[../README.md](../README.md)

---

## 📱 Quick Start (App Only)

```sh
# Install dependencies
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## 🛠️ Native Setup & Troubleshooting

- For native SDK integration, BLE troubleshooting, and device-specific setup, see the [docs/](./docs/) folder and the monorepo root README.
- For E2E and unit testing, see [e2e/README.md](./e2e/README.md).

---

## 🛠️ SDKs & Integrations

- **Expo:** Fast dev, OTA updates, push notifications.
- **React Navigation:** Navigation and modals.
- **AsyncStorage:** Local JWT/token storage.
- **Expo Auth Session:** Google login.
- **Expo Apple Auth:** Apple login (iOS only).
- **Detox:** E2E testing.
- **Jest:** Unit testing.

---

## 📱 Features

- **Auth:** Register, login, social login (Google/Apple), email verification.
- **Profile:** View/update, change password, see verification status.
- **Push Notifications:** Register, receive, test push.
- **Widgets:** Health, activity, sleep, etc.
- **Settings:** Dark mode, clear data, test push.
- **E2E Tests:** Automated social login, auth, and more.

---

## 📝 What's Implemented

- All major user flows, navigation, and UI.
- Social login (Google/Apple, with test mode for E2E).
- Email verification modal and badge.
- E2E and unit test scaffolding.

---

## 🟡 What's Missing / Recommendations

- **Onboarding:** Add intro/tutorial screens.
- **Admin/analytics UI:** For admin users.
- **More settings:** Notification preferences, account deletion.
- **Accessibility:** Improve for screen readers, contrast.
- **Production build:** Test on real devices, optimize assets.
- **CI/CD:** Add mobile build/test pipeline.

**My recommendation:**  
Focus on onboarding, accessibility, and production build/test for launch readiness.

---

## 📚 See Also

- [Monorepo README](../README.md)
- [Backend README](../HUXHUXbackend/README.md)
- [Testing Guide](./e2e/README.md)

---

## 🤝 Contributing

- Please follow the monorepo contribution guidelines in [../README.md](../README.md).
- Use feature branches and submit PRs for review.

---

**Note:** This app is part of a larger monorepo. For backend, testing, and infrastructure details, always refer to the root README.
