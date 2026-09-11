---
title: Architecture Page Template
description: Template for docs/development/architecture.md
---

# Architecture Page Template

```md
---
title: Architecture
description: System structure, conventions and boundaries
---

# Architecture

## Layers / Modules

| No. | Layer | Path | Responsibility | Depends On |
|-----|-------|------|----------------|------------|
| 1 | <name> | `<path>` | <single responsibility> | <deps> |

## Conventions

- <naming / file layout / pattern rules observed in code>

## Boundaries

- What may import what — e.g. `routes/` → `components/` → `data/`, never backwards

## Data Flow

<request/flow description traced from real entry points>
```
