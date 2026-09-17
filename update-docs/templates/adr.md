---
title: ADR Template
description: Template for docs/project/decisions/NNNN-title.md - architecture decision records
---

# ADR Template

One file per decision: `docs/project/decisions/NNNN-kebab-title.md` (NNNN = zero-padded sequence).

```md
---
title: NNNN. Decision Title
description: One-line summary of the decision
---

# NNNN. Decision Title

## Status

accepted | superseded by NNNN | deprecated

## Context

<forces at play — why a decision was needed>

## Decision

<what was decided — concrete, from real code/commits>

## Consequences

- <what became easier / harder / required>
```

## Rules

- Immutable once `accepted` — supersede with a new ADR instead of editing
- Decisions must reflect reality — write from commits/code, not aspirations
