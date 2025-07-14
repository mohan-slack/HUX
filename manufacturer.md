# Mobox-Viveon Manufacturer Integration Reference

This document summarizes all requirements, SDKs, protocols, APIs, and missing items for integrating Mobox-Viveon smart ring/band SDKs into a cross-platform React Native (TypeScript) application. Use this as a reference for communication with the manufacturer and for technical planning.

---

## 1. Project Overview

- **App Type:** Cross-platform (iOS/Android) React Native (TypeScript)
- **Purpose:** Health/wellness app for Mobox-Viveon smart rings and bands
- **Features:** Real-time health metrics, device management, analytics, OTA, notifications, and more

---

## 2. Manufacturer SDKs Provided

### iOS
- **SXRSDK.framework** (v1.8.6): Main BLE wearable SDK (multi-protocol)
- **SXREcgSDK.framework** (v1.1.0): ECG data SDK
- **Headers:** SXRSDK.framework/Headers/

### Android
- **android-smartband-sdk-sxrblejy2library-release.aar** (v2.7.0)
- **android-smartband-sdk-sxrblejy2aidl-release.aar** (v2.7.0)
- **Sample Project:** android-smartband-sdk-sxrblejy2client/

### Documentation
- **JYSDK instruction 20231010.docx**
- **20250414-JYSDK使用说明.docx**
- **iOS-SXRSDK-KF协议集成说明-戒指版本.docx**

---

## 3. Supported Device Protocols/Models

The SDKs support multiple device families via protocol types:

- SXRSDKProtoclType_KF (JY/建友, main protocol in demo)
- SXRSDKProtoclType_HJT
- SXRSDKProtoclType_KKasong
- SXRSDKProtoclType_Chomp
- SXRSDKProtoclType_Goband
- SXRSDKProtoclType_Fitrist
- SXRSDKProtoclType_Wannafit
- SXRSDKProtoclType_ZHJ
- SXRSDKProtoclType_WDB

**Note:** Actual product model names are not explicitly listed. Please provide a mapping of product model names to protocol types.

---

## 4. APIs & Device Features

### Core APIs (iOS/Android, via Native Bridge)
- Initialization: `initializeWithProtocolType(protocol, appId, secret, vid)`
- Device Scanning: `scanDevice(serviceUUIDs, options)`
- Connection: `connectDeviceWithUUID(deviceUUID, options)`
- Data Sync: `syncSportData()`, `syncHeartData()`, `syncECGData()`, etc.
- Device Control: Set user info, alarms, notifications, reminders, weather, goals, etc.
- OTA Updates: `startOTA()`, `getFirmwareVersion()`
- Advanced: Custom notifications, AI state, WiFi config, EQ info, etc.

### Device Features (KF Protocol Example)
- WeChat sports, weather, metric/imperial, 12/24h, sleep time, sun up/down, ECG, body temp, call reject, GPS, walk/run/bike/hike/swim, heart range, multi-sport, reminders, blood pressure, SpO₂, dial market, custom notifications, etc.

**See SXRSDK.framework/Headers/SXRSDKProtocolDefine_*.h for full command and feature lists.**

---

## 5. Integration Plan (React Native)

- Use React Native Native Modules to bridge all required SDK APIs for both iOS and Android.
- Expose scanning, connection, data sync, and device control APIs to JavaScript.
- Implement event emitters for device events (connection, data received, OTA progress, etc.).
- Support protocol selection and protocol-specific commands.
- Place native SDKs in `native_sdks/ios/` and `native_sdks/android/`.

---

## 6. What's Missing / To Request from Manufacturer

1. **Official React Native Bridge/Module**
   - If available, request official React Native modules for iOS/Android SDKs.
2. **Comprehensive API Documentation**
   - Full English documentation for all SDK APIs, including parameter types, expected responses, and error codes.
   - Protocol mapping: which device model uses which protocol type.
3. **Sample Code for React Native Integration**
   - Example of bridging native SDKs to React Native (both platforms).
4. **Device Model/Protocol Mapping Table**
   - Explicit mapping of product model names to protocol types (KF, JY, ZHJ, etc.).
5. **List of All Supported Features per Model**
   - Which features (ECG, SpO₂, etc.) are supported by each device model.
6. **OTA/Firmware Update Instructions**
   - Detailed steps and requirements for OTA updates via SDK.
7. **Error Handling & Troubleshooting Guide**
   - Common error codes, troubleshooting steps, and support contacts.
8. **Licensing/Activation Info**
   - Any required appId/secret/vid for production use, and how to obtain them.
9. **SDK Update Policy**
   - How to get SDK updates, changelogs, and support for new device models.
10. **Language/Localization Support**
    - How to handle multi-language support in SDK/device.

---

## 7. References & Documentation

- **iOS SDK:** SXRSDK.framework/Headers/
- **Android SDK:** android-smartband-sdk-sxrblejy2V2.7.0/
- **Sample App:** ZIP-1/SDKKFDemo/
- **Manufacturer Docs:**
  - JYSDK instruction 20231010.docx
  - 20250414-JYSDK使用说明.docx
  - iOS-SXRSDK-KF协议集成说明-戒指版本.docx

---

## 8. Current App Status (from react-native-app-code)

- React Native app structure is in place (feature-based, modular, TypeScript)
- Native SDKs are present but not yet fully bridged
- README and documentation focus on app features, not low-level SDK integration
- No clear mapping of device models to protocol types in code or docs
- No official React Native bridge code from manufacturer

---

## 9. Next Steps

1. Implement Native Modules for all required SDK APIs
2. Request missing items from manufacturer (see above)
3. Update documentation as integration progresses
4. Test with real devices for each supported protocol/model

---

*This document should be sent to the manufacturer for clarification, support, and as a reference for integration planning.* 