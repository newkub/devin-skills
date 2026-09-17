---
title: Badges Block Template
description: Optional shields.io badge row for docs/index.md - markdown-safe
---

# Badges Block

Optional one-line badge row at the top of `docs/index.md` (and `README.md`). Plain markdown images + links — renders on GitHub.

```md
![CI](https://github.com/<owner>/<repo>/actions/workflows/<file>.yml/badge.svg)
![npm](https://img.shields.io/npm/v/<pkg>)
![license](https://img.shields.io/badge/license-MIT-blue)
```

## Rules

- Max ~4 badges — CI, version, license, and one domain-specific
- Only badges backed by real endpoints (real workflow file, published package)
- Never fabricate coverage/version badges without a real source
