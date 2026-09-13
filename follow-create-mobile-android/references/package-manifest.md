# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `com.android.tools.build:gradle` (Android Gradle Plugin) |
| Registry | `Maven (Google)` — `<https://maven.google.com>` |
| Latest Version | `9.4.0` (stable; `9.5.0-alpha05` is latest pre-release) |
| Release Date | `unknown` (stable released September 2026 per official release notes) |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Google` |
| License | `Apache-2.0` |
| Repository | `<https://android.googlesource.com/platform/tools/base>` |
| Website | `<https://developer.android.com/build>` |
| Documentation | `<https://developer.android.com/build/releases/gradle-plugin>` |
| Releases / Changelog | `<https://developer.android.com/build/releases/gradle-plugin>` |

## Install

```kotlin
// gradle/libs.versions.toml
// agp = "9.4.0"  -> plugins { alias(libs.plugins.android.application) }
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `kotlin` (org.jetbrains.kotlin) | `GitHub Releases` | `2.4.20` (2026-09-07) | language + `org.jetbrains.kotlin.plugin.compose` |
| `Android Studio` | `system` | `Quail 4 / 2026.1.4` | verified on `<https://developer.android.com/studio/releases>`; min Otter 2025.2.1 |
| `Gradle` | `system` | `unknown` | AGP 9.x requires Gradle 9.x |

## Notes

- Breaking changes in latest major: `AGP 9.x requires Gradle 9.x and JDK 21; built-in Kotlin; see release notes before upgrading`
- Version pinned in SKILL.md: `AGP 9.4.0`, `Kotlin >= 2.4.20`, `Android Studio Quail 4 2026.1.4` (verified 2026-09-12)
