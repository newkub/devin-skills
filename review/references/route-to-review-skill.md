---
name: route-to-review-skill
description: Choose the fitting review skill
---

# Route To Review Skill

## Goal

Invoke the correct review skill

## Checks

1. If the user wants a multi-stakeholder review or roleplay across several roles → run `/deep-review`
2. If it's code → run `/deep-review`
3. If it's `AGENTS.md` or docs → run `/deep-review`
4. If it's a GitHub issue → run `/deep-review`
5. If it's a GitHub PR → run `/review-github-pr`
6. If it's devin skills → run `/review-devin-global-harness`
7. If the context is unclear → run `/scan-codebase` then `/report-before-after` first, and ask the user
