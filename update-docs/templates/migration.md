---
title: Migration Page Template
description: Template for docs/references/migration.md - version upgrade guides
---

# Migration Page Template

```md
---
title: Migration
description: Upgrade guides between versions
---

# Migration

## <From version> → <To version>

### Breaking Changes

| No. | Change | Before | After |
|-----|--------|--------|-------|
| 1 | <what broke> | <old usage> | <new usage> |

### Steps

1. <ordered upgrade step>
```

## Rules

- One `##` section per version boundary, newest first
- Only real breaking changes from CHANGELOG/commits — no speculation
