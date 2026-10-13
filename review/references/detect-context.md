---
name: detect-context
description: Detect the context before choosing a review skill
---

# Detect Context

## Goal

Know the context before choosing a review skill

## Checks

1. Check workspace files: `package.json`, `AGENTS.md`, `SKILL.md`, `git status`
2. If there are `apps/`, `src/`, `packages/` → likely code
3. If it's `.md` or `AGENTS.md` → likely docs
4. If there's a `/.devin/skills/` or `%APPDATA%/devin/skills` → likely skills
5. If the user names an issue/PR number or `github` → likely GitHub
