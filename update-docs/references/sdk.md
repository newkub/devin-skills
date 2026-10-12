---
title: SDK Documentation Reference
description: Reference for SDK/client-library docs detection, page groups, and content
---

# SDK Documentation Reference

Use for client SDKs — packages that wrap a service/API (`@wrikka/notification` SDK, REST/GraphQL/MCP clients). Consumers call a remote product through it.

## Detection

- `package.json` has `exports`/`main` + `types`; source has a client entry (`createClient`, `new XClient`, endpoint config)
- Talks to a server/service via HTTP/SDK protocol; env vars like `*_URL`, `*_KEY` for the target service
- License usually permissive; versioning follows the service API

## Index Links

`Project`, `Getting Started`, `Development`, `References` (api, endpoints, events/webhooks, errors, migration, changelog, security, license)

## Page Groups

- `project/` — overview, features, decisions/
- `getting-started/` — quickstart, installation, usage (auth/env setup first)
- `development/` — setup, architecture, workflows, testing
- `references/` — **api.md (required, per-method)**, `endpoints.md` (service endpoints + env vars), `errors.md` (error/result types), `webhooks.md` or `events.md` (if the service emits), migration, changelog, security, license

## Content Focus

- `getting-started/quickstart.md` — install + init client + first call end-to-end
- `references/api.md` — every public method: signature, params, returns, errors
- `references/endpoints.md` — server routes the SDK calls (method, path, payload)
- `references/errors.md` — error taxonomy + retry guidance
- `references/migration.md` — API/version upgrades
