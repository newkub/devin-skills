---
title: Security Page Template
description: Template for docs/references/security.md - vulnerability reporting policy
---

# Security Page Template

```md
---
title: Security
description: How to report vulnerabilities and the security posture
---

# Security

## Reporting

<where to report — e.g. GitHub private vulnerability reporting, email; response expectation>

## Scope

| No. | In Scope | Out of Scope |
|-----|----------|--------------|
| 1 | <what counts> | <what doesn't> |

## Posture

- <real measures from code — e.g. zero runtime deps, input validation via zod, no secrets in repo>
```

## Rules

- Never list real secrets, tokens, or internal endpoints
- Match GitHub `SECURITY.md` conventions when the file exists at root — link it instead of duplicating
