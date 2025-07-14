# HUX Smart Ring – Monorepo Overview

Welcome to the HUX Smart Ring project!  
This monorepo contains everything you need to run, develop, and deploy the HUX Smart Ring ecosystem, including the mobile app (frontend) and backend API.

---

## 📁 Project Structure

```
HUX/
├── HUXfrontend/   # React Native mobile app (iOS/Android)
├── HUXbackend/    # Node.js/Express/Prisma backend API
├── HUXfrontend.md # Frontend documentation
├── HUXbackend.md  # Backend documentation
├── HUXtesting.md  # Testing documentation
├── README.md      # (this file)
└── .gitignore
```

---

## 🚀 Quick Start

### 1. **Prerequisites**

- **Node.js** (>= 18)
- **npm** (comes with Node.js)
- **Git**
- **Android Studio** (for Android builds/emulator)
- **Xcode** (for iOS builds/simulator, macOS only)
- **CocoaPods** (for iOS native modules, macOS only)
- **Expo CLI** (optional, for easier React Native workflow)
  ```sh
  npm install -g expo-cli
  ```

---

### 2. **Clone the Repository**

```sh
git clone <repo-url>
cd HUX
```

---

### 3. **Install Dependencies**

#### Backend
```sh
cd HUXbackend
npm install
```

#### Frontend
```sh
cd HUXfrontend
npm install
# For iOS (macOS only)
cd ios && pod install && cd ..
```

---

### 4. **Run the Apps**

#### Backend
```sh
cd HUXbackend
npm run dev
```

#### Frontend (Mobile App)
```sh
cd HUXfrontend
npm start           # Starts Metro bundler
npm run android     # Run on Android device/emulator
npm run ios         # Run on iOS simulator (macOS only)
```

---

## 📱 Deploying to Multiple Devices

- **Android:**  
  - Open Android Studio, launch an emulator, or connect a device with USB debugging enabled.
  - Run `npm run android` in `HUXfrontend`.

- **iOS:**  
  - Open Xcode, launch a simulator, or connect a device.
  - Run `npm run ios` in `HUXfrontend`.

- **Expo Go (optional):**  
  - Install Expo Go app on your device.
  - Scan the QR code from `npm start` to run the app instantly (no native build required).

---

## 📚 Documentation

- **Frontend:** [HUXfrontend.md](./HUXfrontend.md)
- **Backend:** [HUXbackend.md](./HUXbackend.md)
- **Testing:** [HUXtesting.md](./HUXtesting.md)

---

## 🤝 Contributing

- Please read all sub-READMEs before contributing.
- Use feature branches and submit PRs for review.

---

**For detailed setup, troubleshooting, and advanced usage, see the subfolder documentation files.** 