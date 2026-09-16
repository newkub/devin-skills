# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `tsdown` |
| Registry | `npm` |
| Latest Version | `0.23.0` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Rolldown / VoidZero contributors` |
| License | `MIT` |
| Repository | `https://github.com/rolldown/tsdown` |
| Website | `https://tsdown.dev/` |
| Documentation | `https://tsdown.dev/` |
| Releases / Changelog | `https://github.com/rolldown/tsdown/releases` |

## Install

```bash
bun add -D tsdown typescript
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `typescript` | `npm` | `7.0.2` (2026-07-08) | Native TS compiler (tsgo); tsdown supports `^5 \|\| ^6 \|\| ^7` |
| `rolldown` | `npm` | `1.2.8` (2026-09-09) | Bundler engine inside tsdown |

## Notes

- Breaking changes in latest major: `typescript@7.x` is the native (Go) compiler line — same `tsc` binary (`tsgo` folded back ตั้งแต่ RC); removed options: `baseUrl`, `target: es5`, defaults `strict`/`module esnext`/`types []`; no stable programmatic API จนกว่า 7.1
- Version pinned in SKILL.md: `typescript@7.0.2`, `tsdown@0.23.0`
- This skill is a router/chooser — manifest reflects the SDK build toolchain it recommends (framework-agnostic SDK pattern)
