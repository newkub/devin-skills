# Framework Flutter API & Dependencies

## Install

```sh
# Download and extract the stable SDK, then add to PATH
# Windows (PowerShell)
git clone https://github.com/flutter/flutter.git -b stable
# or download the bundle from the SDK archive:
# https://docs.flutter.dev/install/archive

# macOS / Linux alternatives
brew install --cask flutter        # Homebrew
snap install flutter --classic     # Linux snap

# Verify setup
flutter doctor
```

## Version

- Latest stable: 3.47.x (docs.flutter.dev reflects Flutter 3.47.2)
- Dart SDK is bundled with Flutter (check with `flutter --version`)
- [SDK Archive](https://docs.flutter.dev/install/archive)
- [Package Registry (Dart/Flutter packages)](https://pub.dev)
- [Repository](https://github.com/flutter/flutter)

## Dependencies

- Flutter is an SDK, not a package — the `flutter` and `dart` tools ship inside the SDK `bin/` directory.
- App dependencies are managed in `pubspec.yaml` via `flutter pub add <pkg>` / `dart pub add <pkg>` from pub.dev.
- Platform toolchains required per target: Android Studio/SDK, Xcode (iOS/macOS), Chrome (web), Visual Studio (Windows), clang/CMake (Linux).

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `flutter create <name>` | Create a new Flutter project | app template | `--template app|package|plugin|module`, `--org`, `--platforms`, `--project-name` |
| `flutter run` | Run app on connected device | debug mode | `-d <deviceId>`, `--release`, `--profile`, `--flavor`, `--target`, `--web-port`, `--hot` |
| `flutter build <target>` | Build production artifact | per target | `apk`, `appbundle`, `aab`, `ios`, `ipa`, `web`, `windows`, `macos`, `linux`; `--release`, `--flavor`, `--build-name`, `--build-number` |
| `flutter test` | Run unit/widget tests | `test/` directory | `--coverage`, `--name`, `--plain-name`, `--update-goldens`, `-j` |
| `flutter analyze` | Static analysis of Dart code | whole project | `--watch`, `--write`, `--fatal-infos`, `--no-pub` |
| `flutter doctor` | Check environment/toolchain status | summary | `-v` verbose, `--android-licenses` |
| `flutter pub get` | Fetch pubspec dependencies | all deps | `add`, `remove`, `upgrade`, `outdated`, `deps` |
| `flutter pub add <pkg>` | Add pub.dev package | latest compatible | `--dev`, `dev:<pkg>`, `--path`, `--git-url` |
| `flutter clean` | Delete build artifacts | `build/` + `.dart_tool` | (none) |
| `flutter upgrade` | Upgrade Flutter SDK | current channel | `--force` |
| `flutter channel <name>` | Switch release channel | `stable` | `stable`, `beta`, `main`, `master` |
| `flutter devices` | List connected devices | all | `--machine` |
| `flutter emulators` | List/launch emulators | list | `--launch <id>`, `--create` |
| `flutter attach` | Attach debugger to running app | localhost | `-d`, `--debug-uri`, `--app-id` |
| `flutter drive` | Run integration tests | `integration_test/` | `--driver`, `--target`, `-d` |
| `flutter install` | Install app bundle on device | all devices | `-d`, `--uninstall-only` |
| `flutter gen-l10n` | Generate localizations | `l10n.yaml` config | `--synthetic-package` |
| `flutter config` | Configure Flutter settings | global config | `--enable-web`, `--enable-windows-desktop`, `--analytics` |

## Source

- Official docs: https://docs.flutter.dev/
- CLI reference: https://docs.flutter.dev/reference/flutter-cli
- API docs: https://api.flutter.dev/
- Description: Flutter — Google's UI toolkit for building natively compiled, multi-platform apps (mobile, web, desktop) from a single Dart codebase.
