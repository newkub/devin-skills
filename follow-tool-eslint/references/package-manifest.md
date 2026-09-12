# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `eslint` |
| Registry | `npm` |
| Latest Version | `10.10.0` |
| Release Date | `2026-09-04` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `ESLint / OpenJS Foundation` |
| License | `MIT` |
| Repository | `https://github.com/eslint/eslint` |
| Website | `https://eslint.org` |
| Documentation | `https://eslint.org/docs/latest/` |
| Releases / Changelog | `https://github.com/eslint/eslint/releases` |

## Install

```bash
bun add -D eslint @eslint/js typescript-eslint
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `typescript-eslint` | `npm` | `8.x` | TypeScript support — pair with ESLint 10 |
| `@eslint/js` | `npm` | `10.x` | `js.configs.recommended` |
| `eslint-plugin-vue` | `npm` | `—` | Vue 3 linting |
| `@vue/eslint-config-typescript` | `npm` | `—` | Official Vue + TS config |
| `@nuxt/eslint-config` | `npm` | `—` | Nuxt 3 project-aware config |
| `eslint-config-prettier` | `npm` | `—` | Disables formatting rules — keep last in config |
| `eslint-plugin-import` / `eslint-plugin-unused-imports` | `npm` | `—` | Import ordering / unused imports |
| `eslint-plugin-no-secrets` / `eslint-plugin-regexp` / `eslint-plugin-functional` | `npm` | `—` | Security / RegExp / FP rules |
| `eslint-plugin-oxlint` | `npm` | `—` | Rust-based rules (merged from follow-tool-oxlint; see `references/oxlint.md`) |
| `eslint-plugin-vitest` / `eslint-plugin-vue-a11y` | `npm` | `—` | Testing / a11y rules |

## Notes

- Breaking changes in latest major: `v10 — flat config only (eslintrc removed), config lookup starts from linted file's dir, Node ^20.19 || ^22.13 || >=24; migrate with \`@eslint/v9-to-v10\` codemod`
- Version pinned in SKILL.md: `10.10.0`
