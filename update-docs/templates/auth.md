---
title: Auth Page Template
description: Template for docs/references/auth.md in product docs
---

# Auth Page Template

```md
---
title: Authentication
description: How auth works — providers, sessions, roles
---

# Authentication

## Providers

| No. | Provider | Type | Where Configured |
|-----|----------|------|------------------|
| 1 | <name> | <oauth/credentials/sso> | `<config path>` |

## Session / Token Model

<cookie / JWT / session store — from real code>

## Roles And Permissions

| No. | Role | Can Access |
|-----|------|-----------|
| 1 | <role> | <routes/scopes> |

## Protected Routes

<list of auth-gated routes>
```

## Rules

- Describe the real auth mechanism — no generic boilerplate
- Never include secrets, keys, or real credentials
