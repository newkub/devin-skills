# Update Docs Templates Index

Every page template lives here — one file per docs page. `content-page.md` is the generic fallback when no specific template applies.

## Core Pages

| No. | File | Docs Page |
|-----|------|-----------|
| 1 | [docs-index.md](docs-index.md) | `docs/index.md` — markdown TOC landing page |
| 2 | [content-page.md](content-page.md) | generic fallback |
| 3 | [overview.md](overview.md) | `docs/project/overview.md` |
| 4 | [features.md](features.md) | `docs/project/features.md` — feature table |
| 5 | [quickstart.md](quickstart.md) | `docs/getting-started/quickstart.md` — <5min path |
| 6 | [installation.md](installation.md) | `docs/getting-started/installation.md` |
| 7 | [usage.md](usage.md) | `docs/getting-started/usage.md` |
| 8 | [architecture.md](architecture.md) | `docs/development/architecture.md` |
| 9 | [workflows.md](workflows.md) | `docs/development/workflows.md` |
| 10 | [testing.md](testing.md) | `docs/development/testing.md` — Latest Results from `.devin/reports/` |
| 11 | [deployment.md](deployment.md) | `docs/development/deployment.md` |
| 12 | [troubleshooting.md](troubleshooting.md) | `docs/development/troubleshooting.md` |
| 13 | [roadmap.md](roadmap.md) | `docs/roadmap/index.md` |

## References Pages

| No. | File | Docs Page |
|-----|------|-----------|
| 14 | [api.md](api.md) | `docs/references/api.md` — public surface map |
| 15 | [configuration.md](configuration.md) | `docs/references/configuration.md` — env vars + config files |
| 16 | [changelog.md](changelog.md) | `docs/references/changelog.md` |
| 17 | [faq.md](faq.md) | `docs/references/faq.md` |
| 18 | [glossary.md](glossary.md) | `docs/references/glossary.md` |
| 19 | [security.md](security.md) | `docs/references/security.md` — vuln reporting |
| 20 | [performance.md](performance.md) | `docs/references/performance.md` — budgets + benchmarks |
| 21 | [migration.md](migration.md) | `docs/references/migration.md` — version upgrades |
| 22 | [comparison.md](comparison.md) | `docs/references/comparison.md` — vs alternatives |
| 23 | [i18n.md](i18n.md) | `docs/references/i18n.md` — locales + translate pipeline |

## Conditional Pages

| No. | File | Docs Page | When |
|-----|------|-----------|------|
| 24 | [workspace.md](workspace.md) | `docs/workspaces/<name>.md` | monorepo |
| 25 | [commands.md](commands.md) | `docs/commands/<name>.md` | cli type |
| 26 | [contributing.md](contributing.md) | `docs/references/contributing.md` | open-source type |
| 27 | [auth.md](auth.md) | `docs/references/auth.md` | product type |
| 28 | [adr.md](adr.md) | `docs/project/decisions/NNNN-*.md` | non-obvious decisions |

## Conventions

| No. | File | Use |
|-----|------|-----|
| 29 | [diagram.md](diagram.md) | mermaid rules — GitHub-native rendering |
| 30 | [badges.md](badges.md) | optional badge row for `index.md`/`README.md` |
