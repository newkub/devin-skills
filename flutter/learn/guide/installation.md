# Installation

## การติดตั้ง Flutter SDK

## System Requirements

| Platform | Requirements |
|----------|--------------|
| **Windows** | Windows 10+, 10GB disk space, PowerShell 5+ |
| **macOS** | macOS 10.14+, Xcode 12+, CocoaPods |
| **Linux** | 64-bit Linux, libgl1-mesa-dev, clang |

## Installation Steps

### Windows

```bash
# 1. Download Flutter SDK
# https://docs.flutter.dev/get-started/install/windows

# 2. Extract to C:\src\flutter

# 3. Add to PATH
# C:\src\flutter\bin

# 4. Run flutter doctor
flutter doctor
```

### macOS

```bash
# 1. Download Flutter SDK
# https://docs.flutter.dev/get-started/install/macos

# 2. Extract to ~/development/flutter

# 3. Add to PATH
export PATH="$PATH:$HOME/development/flutter/bin"

# 4. Run flutter doctor
flutter doctor
```

### Linux

```bash
# 1. Download Flutter SDK
# https://docs.flutter.dev/get-started/install/linux

# 2. Extract to ~/development/flutter

# 3. Add to PATH
export PATH="$PATH:$HOME/development/flutter/bin"

# 4. Install dependencies
sudo apt-get install clang cmake ninja-build pkg-config libgtk-3-dev liblzma-dev

# 5. Run flutter doctor
flutter doctor
```

## Setup IDE

### VS Code

```bash
# Install Flutter extension
code --install-extension Dart-Code.flutter

# Install Dart extension
code --install-extension Dart-Code.dart-code
```

### Android Studio

1. Install Android Studio
2. Install Flutter and Dart plugins
3. Configure Flutter SDK path

## Verify Installation

```bash
# Check Flutter version
flutter --version

# Run doctor to check dependencies
flutter doctor

# Accept Android licenses (if needed)
flutter doctor --android-licenses
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **flutter doctor fails** | Check PATH and install missing dependencies |
| **Android license not accepted** | Run `flutter doctor --android-licenses` |
| **Xcode not found** | Install Xcode from App Store and run `sudo xcode-select --switch` |
