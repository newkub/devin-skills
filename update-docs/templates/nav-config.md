---
title: Nav Config Template
description: VitePress nav arrays for product and open-source docs
---

# Nav Config Template

## Product Nav

```ts
nav: [
  { text: 'Project', link: '/project/overview' },
  { text: 'Features', link: '/project/features' },
  { text: 'Auth', link: '/references/auth' },
  { text: 'Admin', link: '/references/admin' },
  { text: 'Review', link: '/review/' },
  { text: 'Release', link: '/release/' },
  { text: 'Development', link: '/development/setup' },
]
```

## Open Source Nav

```ts
nav: [
  { text: 'Project', link: '/project/overview' },
  { text: 'Features', link: '/project/features' },
  { text: 'Contributing', link: '/references/contributing' },
  { text: 'Review', link: '/review/' },
  { text: 'Release', link: '/release/' },
  { text: 'Development', link: '/development/setup' },
]
```

## CLI Nav

```ts
nav: [
  { text: 'Project', link: '/project/overview' },
  { text: 'Getting Started', link: '/getting-started/installation' },
  { text: 'Commands', link: '/commands/' },
  { text: 'Roadmap', link: '/roadmap/' },
  { text: 'Development', link: '/development/setup' },
]
```

## Notes

- `Review` and `Release` can be directories with their own `index.md`.
- `Development` links to the first development page.
- Add `activeMatch` to top-level items when linking to directory indexes.
