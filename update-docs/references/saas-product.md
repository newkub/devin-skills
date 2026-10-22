---
title: SaaS Product Documentation Reference
description: Reference for hosted SaaS product docs (dashboards, managed services)
---

# SaaS Product Documentation Reference

Use for hosted products — dashboards, cloud platforms, managed services (auth, billing, multi-tenant).

## Detection

- Web app with auth (`login`, session, org/tenant) + deployable service
- `private: true` or commercial license; integrates billing/telemetry
- May bundle service workspaces (e.g. `packages/services/*`)

## Index Links

Base order from `references/navigation.md`; this type adds `Operations` after Development and always splits Features into `features/index.md` + one page per surface.

## Page Groups

- `project/` — overview, features, decisions/, `workspaces.md` (monorepo)
- `getting-started/` — quickstart, installation/deploy, usage
- `features/` — `index.md` door + one page per product area (billing, notifications, analytics, ...)
- `development/` — setup, architecture, data-model, workflows, testing, deployment
- `operations/` — scheduler, observability, runbooks, incident, scaling (SaaS-specific)
- `references/` — `api.md`, `errors.md`, `webhooks.md`, `auth.md`, `billing.md`, `security.md`, `changelog.md`

## Content Focus

- `getting-started/quickstart.md` — sign-up → first value in <5min
- `references/auth.md` — providers, sessions, roles, API keys
- `references/billing.md` — plans, meters, invoices
- `operations/runbook.md` — restart/rollback/oncall steps
- `references/security.md` — data handling, compliance notes
