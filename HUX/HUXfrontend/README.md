# HUX Smart Ring App (React Native)

This is the mobile app for the HUX Smart Ring platform.

---

## 📦 Structure

```
HUXfrontend/
├── src/
│   ├── features/      # Feature-based screens (auth, main, widgets, etc.)
│   ├── ui/            # Shared UI components, theme
│   ├── services/      # API, business logic, storage
│   ├── utils/         # Utilities/helpers
│   ├── models/        # Data models/types
│   └── App.tsx        # App entry point
├── assets/            # Images, icons, fonts
├── e2e/               # Detox E2E tests
├── __tests__/         # Jest unit tests (if any)
├── android/           # Android native project
├── ios/               # iOS native project
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── README.md
```

---

## 🚀 Getting Started

1. **Install dependencies:**  
   `npm install`

2. **Start Metro bundler:**  
   `npx expo start`  
   (or use Xcode/Android Studio for native)

3. **Run on device/emulator:**  
   - iOS: `npx expo run:ios` or open in Xcode
   - Android: `npx expo run:android` or open in Android Studio

4. **Connect to backend:**  
   - Ensure HUXbackend is running (see [HUXbackend/README.md](../HUXHUXbackend/README.md))
   - Update API base URL in `src/features/auth/AuthScreen.tsx` if needed.

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
