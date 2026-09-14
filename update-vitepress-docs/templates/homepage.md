---
title: Homepage Template
description: VitePress layout home template for docs/index.md
---

# Homepage Template

Use this for `docs/index.md` — VitePress `layout: home` with hero and features.

```md
---
layout: home

hero:
  name: "<Project Name>"
  text: "<Short tagline>"
  tagline: "<One-line description>"
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/installation
    - theme: alt
      text: Features
      link: /project/features
    - theme: alt
      text: GitHub
      link: https://github.com/<owner>/<repo>

features:
  - title: <Feature 1>
    details: <One-line description>
  - title: <Feature 2>
    details: <One-line description>
  - title: <Feature 3>
    details: <One-line description>
---
```

## Rules

- `hero.name` uses the real project name from `package.json`
- `tagline` is one line, ≤ 120 characters
- `features` lists 3-6 real features — no placeholders
- `actions` link to real pages: installation first, features second, GitHub optional
- GitHub action only for `open-source` and `cli` types — omit for `product`
