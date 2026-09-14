# Update Docs Templates Index

## Pages

| No. | File | Docs Page |
|-----|------|-----------|
| 1 | [docs-index.md](docs-index.md) | `docs/index.md` — markdown TOC landing page |
| 2 | [content-page.md](content-page.md) | Generic content page fallback |
| 3 | [overview.md](overview.md) | `docs/project/overview.md` |
| 4 | [features.md](features.md) | `docs/project/features.md` — feature table |
| 5 | [installation.md](installation.md) | `docs/getting-started/installation.md` |
| 6 | [usage.md](usage.md) | `docs/getting-started/usage.md` |
| 7 | [architecture.md](architecture.md) | `docs/development/architecture.md` |
| 8 | [workflows.md](workflows.md) | `docs/development/workflows.md` |
| 9 | [testing.md](testing.md) | `docs/development/testing.md` — Latest Results from `.devin/reports/` artifacts |
| 10 | [troubleshooting.md](troubleshooting.md) | `docs/development/troubleshooting.md` |
| 11 | [roadmap.md](roadmap.md) | `docs/roadmap/index.md` |
| 12 | [workspace.md](workspace.md) | `docs/workspaces/<name>.md` (monorepo only) |
| 13 | [commands.md](commands.md) | `docs/commands/<name>.md` (cli type only) |
| 14 | [contributing.md](contributing.md) | `docs/references/contributing.md` (open-source only) |
| 15 | [api.md](api.md) | `docs/references/api.md` — public API surface |
| 16 | [configuration.md](configuration.md) | `docs/references/configuration.md` — env vars + config files |
| 17 | [auth.md](auth.md) | `docs/references/auth.md` (product type only) |
| 18 | [changelog.md](changelog.md) | `docs/references/changelog.md` |
| 19 | [faq.md](faq.md) | `docs/references/faq.md` |
| 20 | [glossary.md](glossary.md) | `docs/references/glossary.md` |
| 21 | [deployment.md](deployment.md) | `docs/development/deployment.md` — app + docs deploy |

## References

| No. | File | Purpose |
|-----|------|---------|
| 1 | `references/<type>.md` | Per-type detection, page groups, content focus |

## VitePress Templates

Nav, sidebar, `config.ts`, and `layout: home` templates moved to `update-vitepress-docs/templates/` — use `/update-vitepress-docs` when the project needs a VitePress site.
