# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@vscode/vsce` |
| Registry | `npm` |
| Latest Version | `3.9.2` |
| Release Date | `2026-06-03` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Microsoft |
| License | `MIT` |
| Repository | `https://github.com/Microsoft/vsce` |
| Website | `https://code.visualstudio.com` |
| Documentation | `https://code.visualstudio.com/api/working-with-extensions/publishing-extension` |
| Releases / Changelog | `https://github.com/Microsoft/vsce/releases` |

## Install

```bash
bun add -D @vscode/vsce
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `generator-code` | `npm` | `1.12.0` (2026-06-23) | Official Yeoman generator for VS Code extensions (`yo code`) |
| `yo` | `npm` | `7.0.1` (2026-04-09) | Yeoman CLI required by `generator-code` |
| `reactive-vscode` | `npm` | `1.0.2` (2026-04-26) | Alternative Vue-reactivity-style extension framework |
| `@vscode/test-cli` | `npm` | `0.0.15` (2026-06-22) | CLI for running extension tests in Extension Host |
| `@vscode/test-electron` | `npm` | `unknown` | Downloads VS Code builds for tests (companion to test-cli) |
| VS Code | `GitHub Releases` | `1.137.0` (2026-09-09) | Target editor — `engines.vscode` compatibility (`microsoft/vscode`) |

## Notes

- Breaking changes in latest major: `vsce` was renamed to `@vscode/vsce` (old `vsce` package deprecated); v3 requires Node 20+
- Version pinned in SKILL.md: `VS Code 1.137.0`, `generator-code@1.12.0`, `@vscode/vsce@3.9.2` — all match latest as of 2026-09-12
