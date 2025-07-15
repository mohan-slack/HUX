#!/bin/bash
set -e

# Go to project root
cd "$(dirname "$0")/.."

# 1. Stop all Metro/packager processes (user must do this manually)
echo "Please ensure all Metro/packager processes are stopped (Ctrl+C in any running terminal)."

# 2. Clean DerivedData and build folders
echo "Cleaning Xcode DerivedData and iOS build folders..."
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ios/build

# 3. Clean Metro cache
echo "Cleaning Metro cache..."
npx react-native start --reset-cache &
PID=$!
sleep 2
kill $PID

# 4. Remove node_modules and reinstall
echo "Removing and reinstalling node_modules..."
rm -rf node_modules
npm install

# 5. Reinstall pods
echo "Installing CocoaPods dependencies..."
cd ios
pod install
cd ..

# 6. Final instructions
echo "\nAll clean! Now open ios/HUXSmartRingApp.xcworkspace in Xcode, clean build folder (Shift+Cmd+K), and build/run your app." 