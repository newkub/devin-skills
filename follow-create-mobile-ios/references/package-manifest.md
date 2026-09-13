# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `swift` (Swift toolchain, bundled in Xcode) |
| Registry | `GitHub Releases` |
| Latest Version | `6.3.3` (tag `swift-6.3.3-RELEASE`) |
| Release Date | `2026-06-30` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Apple / swiftlang` |
| License | `Apache-2.0` |
| Repository | `<https://github.com/swiftlang/swift>` |
| Website | `<https://swift.org>` |
| Documentation | `<https://developer.apple.com/documentation/swiftui>` |
| Releases / Changelog | `<https://github.com/swiftlang/swift/releases>` |

## Install

```bash
# Toolchain ships with Xcode — install Xcode from App Store / developer.apple.com
xcodebuild -version
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `Xcode` | `system` | `26.6` | verified per SKILL.md/Apple releases; Xcode 27 is beta (Swift 6.4); requires macOS Tahoe 26.2+ |
| `Factory` | `GitHub Releases` | `unknown` | optional DI via SwiftPM |
| `Alamofire` | `GitHub Releases` | `unknown` | optional networking via SwiftPM |

## Notes

- Breaking changes in latest major: `Swift 6.x — strict concurrency checking; since April 2026 App Store Connect accepts only builds from Xcode >= 26 (iOS 26 SDK)`
- Version pinned in SKILL.md: `Xcode 26.6`, `Swift 6.3.3` (verified 2026-09-12)
