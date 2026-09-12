# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `flutter` (Flutter SDK, bundles Dart) |
| Registry | `system` (verified via official releases manifest `flutter_infra_release`) |
| Latest Version | `3.47.4` (bundles Dart `3.13.3`) |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Google` |
| License | `BSD-3-Clause` |
| Repository | `<https://github.com/flutter/flutter>` |
| Website | `<https://flutter.dev>` |
| Documentation | `<https://docs.flutter.dev>` |
| Releases / Changelog | `<https://docs.flutter.dev/release/release-notes>` |

## Install

```bash
flutter create <project>
flutter pub add flutter_riverpod go_router fpdart freezed_annotation
flutter pub add --dev build_runner freezed json_serializable riverpod_generator mocktail
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `flutter_riverpod` | `pub.dev` | `3.4.3` (2026-09-03) | state management / DI — Riverpod 3.x (`Notifier`/`AsyncNotifier`, `@riverpod` codegen) |
| `go_router` | `pub.dev` | `18.0.1` (2026-09-02) | declarative navigation |
| `freezed` | `pub.dev` | `4.0.1` (2026-08-29) | codegen for models/DTOs |
| `fpdart` | `pub.dev` | `1.2.0` (2025-10-29) | `Either<Failure, Success>` error handling |

## Notes

- Breaking changes in latest major: `Riverpod 3.x — StateNotifier/StateNotifierProvider moved to riverpod/legacy; go_router 18.x and freezed 4.x have their own breaking changes — check changelogs`
- Version pinned in SKILL.md: `Flutter 3.47.4` (was 3.47.3), `Dart 3.13.3`, `flutter_riverpod@3.4.3`, `go_router@18.0.1`, `freezed@4.0.1`, `fpdart@1.2.0` (verified 2026-09-12)
