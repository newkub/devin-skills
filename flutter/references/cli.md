# CLI Commands

Complete reference for Flutter CLI commands

## Project Commands

| Command | Description | Example |
|---------|-------------|---------|
| `flutter create` | สร้างโปรเจกต์ใหม่ | `flutter create my_app` |
| `flutter doctor` | ตรวจสอบ Flutter setup | `flutter doctor -v` |
| `flutter upgrade` | อัพเกรด Flutter | `flutter upgrade` |

## Development Commands

| Command | Description | Example |
|---------|-------------|---------|
| `flutter run` | Run app on device | `flutter run -d chrome` |
| `flutter attach` | Attach debugger | `flutter attach` |
| `flutter devices` | แสดง devices ที่มี | `flutter devices` |
| `flutter screenshot` | ถ่าย screenshot | `flutter screenshot` |

## Build Commands

| Command | Description | Example |
|---------|-------------|---------|
| `flutter build apk` | Build Android APK | `flutter build apk --release` |
| `flutter build ios` | Build iOS | `flutter build ios --release` |
| `flutter build web` | Build Web | `flutter build web` |
| `flutter build macos` | Build macOS app | `flutter build macos` |
| `flutter build linux` | Build Linux app | `flutter build linux` |
| `flutter build windows` | Build Windows app | `flutter build windows` |

## Build Options

| Option | Description |
|--------|-------------|
| `--debug` | Debug build |
| `--release` | Release build (optimized) |
| `--profile` | Profile build |
| `--split-per-abi` | Separate APKs per ABI |
| `--tree-shake-icons` | Remove unused icons |

## Package Commands

| Command | Description | Example |
|---------|-------------|---------|
| `flutter pub get` | Get dependencies | `flutter pub get` |
| `flutter pub add` | Add dependency | `flutter pub add provider` |
| `flutter pub remove` | Remove dependency | `flutter pub remove provider` |
| `flutter pub upgrade` | Upgrade dependencies | `flutter pub upgrade` |
| `flutter pub outdated` | Show outdated deps | `flutter pub outdated` |

## Pub Options

| Option | Description |
|--------|-------------|
| `--dev` | Add as dev dependency |
| `--git-url` | Add from git URL |
| `--git-ref` | Git branch/tag/commit |
| `--path` | Add from local path |

## Test Commands

| Command | Description | Example |
|---------|-------------|---------|
| `flutter test` | Run all tests | `flutter test` |
| `flutter test file_test.dart` | Run specific test | `flutter test test/widget_test.dart` |
| `flutter drive` | Run integration tests | `flutter drive` |

## Code Generation

| Command | Description | Example |
|---------|-------------|---------|
| `flutter pub run build_runner build` | Generate code | `flutter pub run build_runner build` |
| `flutter pub run build_runner watch` | Watch mode | `flutter pub run build_runner watch` |
| `flutter pub run build_runner build --delete-conflicting-outputs` | Overwrite | `flutter pub run build_runner build --delete-conflicting-outputs` |

## Analysis

| Command | Description | Example |
|---------|-------------|---------|
| `flutter analyze` | Analyze code | `flutter analyze` |
| `flutter fix` | Auto-fix issues | `flutter fix --dry-run` |
| `flutter format` | Format code | `flutter format lib/` |

## Configuration

| Command | Description | Example |
|---------|-------------|---------|
| `flutter config` | View/edit config | `flutter config --enable-web` |
| `flutter channel` | Switch channel | `flutter channel stable` |
| `flutter precache` | Download artifacts | `flutter precache` |

## Emulator Commands

| Command | Description | Example |
|---------|-------------|---------|
| `flutter emulators` | List emulators | `flutter emulators` |
| `flutter emulators --launch <id>` | Launch emulator | `flutter emulators --launch Pixel_4_API_33` |

## Help

| Command | Description |
|---------|-------------|
| `flutter --help` | Show all commands |
| `flutter <command> --help` | Show command help |