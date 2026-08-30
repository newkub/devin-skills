---
name: detect-context
description: ตรวจ context ก่อนเลือก review skill
---

# Detect Context

## Goal

รู้ context ก่อนเลือก review skill

## Checks

1. ตรวจ workspace files: `package.json`, `AGENTS.md`, `SKILL.md`, `git status`
2. ถ้ามี `apps/`, `src/`, `packages/` → น่าจะเป็น code
3. ถ้าเป็น `.md` หรือ `AGENTS.md` → น่าจะเป็น docs
4. ถ้ามี `/.devin/skills/` หรือ `%APPDATA%/devin/skills` → น่าจะเป็น skill
5. ถ้า user ระบุ issue/PR number หรือ `github` → น่าจะเป็น GitHub
