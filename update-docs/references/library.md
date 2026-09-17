---
title: Library Documentation Reference
description: Reference for library docs detection, page groups, and content
---

# Library Documentation Reference

Use this for published libraries/packages — `package.json` has `name` + `exports`/`main`/`types`, no `bin`, not an app.

## Detection

A project is `library` when all of these are true:

- `package.json` has `exports` or `main` + `types`, and no `bin` field
- Consumers install it via a package manager (`npm`/`bun add`)
- No auth code; license is typically permissive for OSS libs

## Index Links

`Project`, `Getting Started`, `Development`, `References` (api, comparison, performance, glossary, migration, changelog, security, contributing, license)

## Page Groups

- `project/` — overview, features, decisions/ (ADRs)
- `getting-started/` — quickstart, installation, usage
- `development/` — setup, architecture, workflows, testing
- `references/` — **api.md (required)**, comparison, performance, glossary, migration, changelog, security, contributing, license

## Content Focus

- `getting-started/quickstart.md` — minimal install + first result (template `quickstart.md`)
- `references/api.md` — public export/subpath map (template `api.md`)
- `references/comparison.md` — vs alternatives, facts only (template `comparison.md`)
- `references/performance.md` — bundle size, benchmarks, budgets (template `performance.md`)
- `references/migration.md` — breaking-change upgrade guides (template `migration.md`)
- `references/glossary.md` — domain terms unique to the library (template `glossary.md`)
- `project/decisions/NNNN-*.md` — ADRs for non-obvious architecture choices (template `adr.md`)
- `references/security.md` — vuln reporting (template `security.md`)
