| key | value |
|---|---|
| install ESLint | `pnpm add -D @tanstack/eslint-config` |
| install Vite build | `pnpm add -D @tanstack/vite-config` |
| install publish | `pnpm add -D @tanstack/publish-config` |
| install typedoc | `pnpm add -D @tanstack/typedoc-config` |
| package manager | pnpm 10+ only |
| repo | https://github.com/TanStack/config |
| docs | https://tanstack.com/config/latest/docs |

| Package | Status | Purpose |
|---------|--------|---------|
| `@tanstack/eslint-config` | current | flat ESLint config, framework-agnostic |
| `@tanstack/publish-config` | current | Changesets publish script, ESM-only |
| `@tanstack/typedoc-config` | current | shared typedoc setup |
| `@tanstack/vite-config` | legacy | dual ESM/CJS build; tsdown recommended for new packages |
| `@tanstack/config` | deprecated | umbrella re-export of the four packages — do not install |

| Area | Entry point |
|------|-------------|
| Lint | `tanstackConfig` from `@tanstack/eslint-config` |
| Build, legacy | `tanstackViteConfig` from `@tanstack/vite-config` |
| Build, new | `tsdown.config.ts` per `/follow-tool-tsdown` |
| Publish | `publish()` from `@tanstack/publish-config` |
| Conventions | docs pages: ESLint, Publish, Vite, CI/CD, Dependencies, Package Structure |

Prerequisites: Node.js 20.17+, Git CLI, GitHub CLI, pnpm 10+.
