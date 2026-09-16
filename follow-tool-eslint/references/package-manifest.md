# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `eslint` |
| Registry | `npm` |
| Latest Version | `10.10.0` |
| Release Date | `2026-09-04` |
| Verified | `2026-09-13` (date this file was last checked) |
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
| `typescript-eslint` | `npm` | `8.70.0` | TypeScript support — pair with ESLint 10 |
| `@eslint/js` | `npm` | `10.0.1` | `js.configs.recommended` |
| `eslint-plugin-vue` | `npm` | `10.11.0` | Vue 3 linting |
| `@vue/eslint-config-typescript` | `npm` | `—` | Official Vue + TS config |
| `@nuxt/eslint-config` | `npm` | `1.17.0` | Nuxt 3 project-aware config |
| `eslint-config-prettier` | `npm` | `10.1.8` | Disables formatting rules — keep last in config |
| `eslint-plugin-import` / `eslint-plugin-unused-imports` | `npm` | `2.32.0` / `4.4.1` | Import ordering / unused imports |
| `eslint-plugin-no-secrets` / `eslint-plugin-regexp` / `eslint-plugin-functional` | `npm` | `2.3.3` / `3.3.0` / `10.0.0` | Security / RegExp / FP rules |
| `eslint-plugin-oxlint` | `npm` | `1.83.0` | Rust-based rules (merged from follow-tool-oxlint; see `references/oxlint.md`) |
| `eslint-plugin-vitest` / `eslint-plugin-vue-a11y` | `npm` | `0.5.4` / `0.0.31` | Testing / a11y rules |
| `jiti` | `npm` | `2.7.0` | Required for `eslint.config.ts` on Node.js (Bun/Deno ไม่ต้องใช้) |

## Notes

- Breaking changes in latest major: `v10 — flat config only (eslintrc removed), config lookup starts from linted file's dir, Node ^20.19 || ^22.13 || >=24; migrate with \`npx codemod @eslint/v9-to-v10\` (Codemod Registry)`
- Version pinned in SKILL.md: `10.10.0`
