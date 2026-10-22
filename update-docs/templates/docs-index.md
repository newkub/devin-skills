---
title: Docs Index Template
description: Plain markdown nav template for docs/index.md — grouped sections, one page per line
---

# Docs Index Template

Use this for `docs/index.md` — the only nav. Plain markdown: a `##` group is the sidebar and each
line is `- [Page](path.md) — what it answers`. Group order and placement rules live in
`references/navigation.md`.

```md
---
title: <Project Name> Docs
description: Documentation for <Project Name>
---

# <Project Name>

<One-line description from package.json>

## Project

- [Overview](project/overview.md) — what it is, how it is structured, tech stack
- Decisions — architecture decision records:
  [0001 <title>](project/decisions/0001-<slug>.md) ·
  [0002 <title>](project/decisions/0002-<slug>.md)

## Workspaces

<!-- monorepo only — the repo map first, then one line per workspace -->
- [Workspaces](project/workspaces.md) — the repo map: root app and each package
- [<Workspace>](workspaces/<name>.md) — what the standalone workspace does

## Getting Started

- [Installation](getting-started/installation.md) — prerequisites, dependencies, database
- [Quickstart](getting-started/quickstart.md) — seed, run, sign in (under 5 minutes)
- [Usage](getting-started/usage.md) — demo accounts, hosts, route map

## Features

- [Feature Index](features/index.md) — every product area, plus the exhaustive feature table
- [<Area>](features/<area>.md) — what the area does for the business and the customer

## Development

- [Setup](development/setup.md) — toolchain and every script
- [Architecture](development/architecture.md) — layers, conventions, data flow
- [Data Model](development/data-model.md) — tables and how they migrate <!-- schema owners only -->
- [Workflows](development/workflows.md) — scripts, gates, CI/CD
- [Testing](development/testing.md) — unit, e2e, what each suite locks
- [Deployment](development/deployment.md) — target, secrets, rollback
- [Troubleshooting](development/troubleshooting.md) — symptom → cause → fix

## Operations

<!-- saas-product only -->
- [Scheduler](operations/scheduler.md) — scheduled tasks and how they are triggered
- [Observability](operations/observability.md) — logs, request ids, health

## References

- [API](references/api.md) — the HTTP operations and their failure shape
- [Errors](references/errors.md) — machine reason codes
- [Webhooks](references/webhooks.md) — events, signing, retries
- [Auth](references/auth.md) — doors, sessions, second factors
- [Billing And Plans](references/billing.md) — plan fees, quotas, ledger
- [Configuration](references/configuration.md) — env vars and config files
- [Security](references/security.md) — data handling, doors, rate limits
- [i18n](references/i18n.md) — locales and the translate pipeline
- [Glossary](references/glossary.md) — product and code vocabulary

## Roadmap

- [Roadmap](roadmap/index.md) — now / next / later
```

## Rules

- Include only groups whose pages exist — never an empty group, never a placeholder line
- Base order and placement rules: `references/navigation.md`
- One door per concept — `features/index.md` is the Features line; `project/features.md` is linked from it, not repeated here
- A family stays in its group — `project/workspaces.md` + `workspaces/<name>.md` both under Workspaces
- Every line carries the em-dash description; links are relative `.md` paths, never a directory or a `/route`
- No `layout: home` or generator frontmatter keys — title + description only
