# Framework Capacitor API & Dependencies

## Install

```sh
# Runtime + CLI in a web project
bun add @capacitor/core
bun add -D @capacitor/cli
# or
npm install @capacitor/core
npm install --save-dev @capacitor/cli

# Add native platforms
bun add @capacitor/android @capacitor/ios
# or
npm install @capacitor/android @capacitor/ios
```

## Version

- Latest: 8.5.1 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios` share versions)
- [Package Registry](https://www.npmjs.com/package/@capacitor/core)
- [Repository](https://github.com/ionic-team/capacitor)

## Dependencies

- `@capacitor/core` depends on `tslib` only; `@capacitor/cli` is the dev-time command-line tool.
- Platform packages: `@capacitor/android`, `@capacitor/ios` (installed per target platform).
- Requires native toolchains: Android Studio + JDK for Android, Xcode + CocoaPods/SwiftPM for iOS.
- Config file: `capacitor.config.ts` / `capacitor.config.json` (`appId`, `appName`, `webDir`).

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `npx cap init` | Initialize Capacitor config | interactive prompts | `appName`, `appId`, `--web-dir`, `--package-id` |
| `npx cap add <platform>` | Add native platform project | latest platform version | `android`, `ios` |
| `npx cap sync` | Copy web assets + update plugins | all platforms | `android`, `ios`, `--deployment`, `--inline` |
| `npx cap copy` | Copy web assets to native projects | all platforms | `android`, `ios` |
| `npx cap update` | Update native plugins and projects | all platforms | `android`, `ios` |
| `npx cap open <platform>` | Open project in native IDE | system default IDE | `android` (Android Studio), `ios` (Xcode) |
| `npx cap run <platform>` | Build and run on device/emulator | interactive device pick | `--list`, `--target`, `--live-reload`, `--host`, `--port`, `--scheme` |
| `npx cap build <platform>` | Build native project | debug build | `--keystorepath`, `--keystorealias`, `--configuration`, `--scheme` |
| `npx cap ls` | List installed Capacitor plugins | all platforms | `android`, `ios` |
| `npx cap doctor` | Diagnose environment and setup | all checks | `android`, `ios` |
| `npx cap migrate` | Migrate project to latest Capacitor | current version | `--latest`, `--next` |
| `import { Capacitor }` | Runtime platform API | `@capacitor/core` | `isNativePlatform()`, `getPlatform()`, `registerPlugin()` |
| `CapacitorHttp` / `CapacitorCookies` | Built-in core plugins | opt-in via config | `CapacitorHttp`, `CapacitorCookies`, `SystemBars` |

## Source

- Official docs: https://capacitorjs.com/docs
- CLI reference: https://capacitorjs.com/docs/cli
- Description: Capacitor — cross-platform native apps with JavaScript and the web (iOS, Android, web).
