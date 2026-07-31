# Configuration

## Project Structure

```
my_app/
├── lib/
│   └── main.dart          # Entry point
├── test/                  # Unit tests
├── android/               # Android native code
├── ios/                   # iOS native code
├── web/                   # Web specific files
├── pubspec.yaml           # Dependencies configuration
└── pubspec.lock           # Locked versions
```

## pubspec.yaml

```yaml
name: my_app
description: A new Flutter project
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  provider: ^6.1.1
  http: ^1.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true

  assets:
    - assets/images/

  fonts:
    - family: Roboto
      fonts:
        - asset: fonts/Roboto-Regular.ttf
        - asset: fonts/Roboto-Bold.ttf
          weight: 700
```

## Dependencies Management

```bash
# Add dependency
flutter pub add provider

# Add dev dependency
flutter pub add --dev build_runner

# Get all dependencies
flutter pub get

# Upgrade dependencies
flutter pub upgrade
```

## Platform Configuration

### Android (android/app/build.gradle)

```gradle
android {
    defaultConfig {
        applicationId "com.example.my_app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
    }
}
```

### iOS (ios/Runner/Info.plist)

```xml
<key>CFBundleDisplayName</key>
<string>My App</string>
<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>
```

### Web (web/index.html)

```html
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Build Configuration

| Mode | Description | Command |
|------|-------------|---------|
| Debug | Development build with debug | `flutter run` |
| Release | Production build optimized | `flutter build apk --release` |
| Profile | Performance profiling | `flutter run --profile` |
