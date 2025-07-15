#!/bin/bash
set -e

# Clean Xcode DerivedData
echo "Cleaning Xcode DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData

# Go to iOS project directory
cd "$(dirname "$0")"

# Clean Pods and build folders
echo "Cleaning Pods and build folders..."
rm -rf Pods
rm -rf build

# Clean CocoaPods cache
echo "Cleaning CocoaPods cache..."
pod cache clean --all

# Reinstall pods
echo "Installing pods..."
pod install

echo "iOS clean and pod install complete!" 