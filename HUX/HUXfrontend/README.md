# HUXfrontend – HUX Smart Ring Mobile App

This is the React Native (Expo) mobile application for the HUX Smart Ring ecosystem.  
It supports both iOS and Android, and provides comprehensive health, wellness, and device management features.

---

## 🛠️ Tech Stack & Main Features

- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State Management:** React Context + Hooks
- **UI:** Custom component library, Expo Vector Icons, Lottie
- **APIs:** REST API (backend), Expo Push, OAuth (Google/Apple)
- **Native SDKs:** BLE integration, vendor SDK structure (see native_sdks/)
- **Testing:** Detox (E2E), Jest (unit)

**Main Features:**
- Health metrics: Heart rate, SpO₂, blood pressure, ECG, temperature, sleep, steps, activity, hydration, stress, etc.
- Wellness: Mood, medication, menstrual, breathing, sleep sounds, goals, achievements
- Safety: SOS, auto SOS, family sharing
- Device management: BLE pairing, firmware updates, settings
- Analytics dashboard, AI insights, notifications

---

### 🗂️ App Architecture Diagram

```mermaid
flowchart TD
  App[App Entry - App.tsx]
  Nav[Navigation]
  Features[Features: health, wellness, device, etc.]
  Services[Services: API, BLE, business logic]
  UI[UI Components]
  Native[Native SDKs: iOS/Android]
  Assets[Assets: images, icons, fonts]

  App --> Nav
  Nav --> Features
  Features --> Services
  Features --> UI
  Services --> Native
  UI --> Assets
```

---

## 🚀 Setup, Run & Debug

```sh
# Install dependencies
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on Android
yarn android   # or npm run android

# Run on iOS (macOS only)
yarn ios       # or npm run ios
```

**Debugging:**
- Use Expo/Metro logs for JS errors
- Use Chrome/Flipper for React Native debugging
- For native issues, use Xcode (iOS) or Android Studio (Android)

---

## 📁 Folder Structure

```
HUXfrontend/
├── src/
│   ├── features/           # Feature modules (health, wellness, device, etc.)
│   ├── services/           # Business logic, API, BLE
│   ├── ui/                 # Reusable UI components, theme
│   ├── models/             # Data models and types
│   └── utils/              # Utility functions
├── native_sdks/            # Vendor/native SDKs (ios/, android/, docs/)
├── assets/                 # Images, icons, fonts
├── design/                 # Design system files
├── docs/                   # Project documentation
├── test/                   # Test files
├── e2e/                    # Detox E2E tests
├── android/                # Android native project
├── ios/                    # iOS native project
└── ... (configs, package.json, etc.)
```

### 🗂️ Folder Structure Diagram

```mermaid
flowchart TD
  A[HUXfrontend/]
  B1[src/]
  B2[native_sdks/]
  B3[assets/]
  B4[design/]
  B5[docs/]
  B6[test/]
  B7[e2e/]
  B8[android/]
  B9[ios/]
  B10[configs, package.json, etc.]
  C1[features/]
  C2[services/]
  C3[ui/]
  C4[models/]
  C5[utils/]

  A --> B1
  A --> B2
  A --> B3
  A --> B4
  A --> B5
  A --> B6
  A --> B7
  A --> B8
  A --> B9
  A --> B10
  B1 --> C1
  B1 --> C2
  B1 --> C3
  B1 --> C4
  B1 --> C5
```

---

## 📱 Native (iOS/Android) Notes

- **Native SDKs:** Place vendor SDKs in `native_sdks/ios/` and `native_sdks/android/`.
- **iOS:**
  - Requires Xcode and CocoaPods
  - Run `cd ios && pod install` after adding native modules
  - Debug native code in Xcode
- **Android:**
  - Requires Android Studio
  - Place .aar files in `native_sdks/android/` and link as needed
  - Debug native code in Android Studio
- **BLE/Device:**
  - BLE integration is scaffolded; see `src/services/BleService.ts` and native_sdks/
  - For vendor SDK integration status, see [../../manufacturer.md](../../manufacturer.md)

---

## 🤝 Contributing to the Frontend

- Follow code style (TypeScript, ESLint, Prettier)
- Use feature branches and submit PRs
- Write tests for new features (Jest, Detox)
- Update documentation as needed
- See [README.md](./README.md) for monorepo guidelines

---

**Note:** For backend, testing, and infrastructure details, always refer to the root README. 