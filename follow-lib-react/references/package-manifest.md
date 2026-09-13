# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `react` |
| Registry | `npm` |
| Latest Version | `19.3.0` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Meta (React team)` |
| License | `MIT` |
| Repository | `https://github.com/facebook/react` |
| Website | `https://react.dev/` |
| Documentation | `https://react.dev/reference/react` |
| Releases / Changelog | `https://github.com/facebook/react/releases` |

## Install

```bash
bun add react react-dom
bun add -D babel-plugin-react-compiler
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `react-dom` | `npm` | `19.3.0` | DOM renderer — version-lock with `react` |
| `babel-plugin-react-compiler` | `npm` | `1.0.0` | React Compiler plugin for Vite/Next.js setups |

## Notes

- Breaking changes in latest major: `19.3 stabilizes <ViewTransition>, addTransitionType, Fragment refs, use(browser()); 19.2 added useEffectEvent, <Activity>, cacheSignal`
- Version pinned in SKILL.md: `react@19.3.0` / `react-dom@19.3.0`
