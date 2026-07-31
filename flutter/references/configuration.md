# Configuration Reference

Complete reference for Flutter configuration files and options

## pubspec.yaml

```yaml
name: app_name
description: App description
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
```

### Dependencies Section

| Option | Type | Description |
|--------|------|-------------|
| `dependencies` | Map | Runtime dependencies |
| `dev_dependencies` | Map | Development dependencies |
| `dependency_overrides` | Map | Override specific versions |

### Flutter Section

```yaml
flutter:
  uses-material-design: true    # Enable Material Icons

  assets:                         # Asset folders
    - assets/images/
    - assets/icons/

  fonts:                          # Custom fonts
    - family: CustomFont
      fonts:
        - asset: fonts/CustomFont-Regular.ttf
        - asset: fonts/CustomFont-Bold.ttf
          weight: 700

  generate: true                  # Enable code generation
```

## Build Configuration

### Android (android/app/build.gradle)

```gradle
android {
    defaultConfig {
        applicationId "com.example.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
        }
    }

    flavorDimensions "version"
    productFlavors {
        dev { dimension "version" }
        staging { dimension "version" }
        prod { dimension "version" }
    }
}
```

### iOS (ios/Runner.xcconfig)

```xcconfig
FLUTTER_BUILD_NAME=1.0.0
FLUTTER_BUILD_NUMBER=1
```

### Web (web/index.html)

```html
<!DOCTYPE html>
<html>
<head>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="App description">
  <title>App Title</title>
</head>
<body>
  <script src="main.dart.js" defer></script>
</body>
</html>
```

## Flutter Analyze Options (.dart_tool/package_config.json)

```json
{
  "configFileVersion": 2,
  "packages": []
}
```

### analysis_options.yaml

```yaml
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    - prefer_const_constructors
    - prefer_const_literals_to_create_immutables
    - avoid_print
    - prefer_single_quotes

analyzer:
  exclude:
    - "**/*.g.dart"
    - "**/*.freezed.dart"
  errors:
    invalid_annotation_target: ignore
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FLUTTER_ROOT` | Flutter SDK path |
| `PUB_CACHE` | Pub cache location |
| `ANDROID_HOME` | Android SDK path |
| `ANDROID_SDK_ROOT` | Android SDK root |
| `JAVA_HOME` | Java JDK path |

## Flutter Config

```bash
# Enable features
flutter config --enable-web
flutter config --enable-linux-desktop
flutter config --enable-macos-desktop
flutter config --enable-windows-desktop

# Set paths
flutter config --android-sdk /path/to/sdk
flutter config --android-studio-dir /path/to/studio

# Remove analytics
flutter config --no-analytics
```

## Launch Configuration (VS Code - .vscode/launch.json)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Flutter",
      "request": "launch",
      "type": "dart",
      "program": "lib/main.dart"
    }
  ]
}
```

## Build Arguments

| Argument | Description |
|----------|-------------|
| `--no-pub` | Skip pub get |
| `--no-track-widget-creation` | Disable widget tracking |
| `--split-debug-info` | Output debug info |
| `--obfuscate` | Obfuscate release build |
| `--dart-define=key=value` | Define constants |
| `--target-platform` | Set target platform |