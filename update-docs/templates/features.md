---
title: Features Page Template
description: Template for docs/project/features.md — feature table from update-docs features-md
---

# Features Page Template

```md
---
title: Features
description: Complete list of shipped features
---

# Features

## <Domain / Module Group>

| No. | Feature | Description | Module | Status |
|-----|---------|-------------|--------|--------|
| 1 | <name> | <what it does> | <path/module> | shipped |

## <Next Group>

...
```

## Rules

- Columns fixed: `Feature | Description | Module | Status` (No. first per report rules)
- Group rows by domain with `##` headings — no dropdowns
- Data comes from `/update-docs-features-md` or real code analysis — never invented features
- Status values: `shipped` / `beta` / `deprecated`
