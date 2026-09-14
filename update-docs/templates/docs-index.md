---
title: Docs Index Template
description: Plain markdown table of contents template for docs/index.md
---

# Docs Index Template

Use this for `docs/index.md` — a plain markdown landing page with links to every section. No site-generator syntax; must render correctly on GitHub.

```md
---
title: <Project Name> Docs
description: Documentation for <Project Name>
---

# <Project Name>

<One-line description from package.json>

## Project

- [Overview](project/overview.md)
- [Features](project/features.md)
- [Workspaces](project/workspaces.md) <!-- monorepo only -->

## Getting Started

- [Installation](getting-started/installation.md)
- [Usage](getting-started/usage.md)

## Development

- [Setup](development/setup.md)
- [Architecture](development/architecture.md)
- [Workflows](development/workflows.md)
- [Testing](development/testing.md)

## References

- [References](references/)

## Roadmap

- [Roadmap](roadmap/index.md)
```

## Rules

- Include only sections that actually exist — add `commands/` for `cli` type, `references/contributing.md` for `open-source`, `references/auth.md` for `product`, `workspaces/` for monorepo
- Section order follows `references/<type>.md` page groups
- All links are relative paths to `.md` files — never `/path` site routes
- No `layout: home` or generator frontmatter keys — title + description only
