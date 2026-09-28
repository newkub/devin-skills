---
name: review-devin-global-harness-check-subagents
description: Check subagents layer — AGENT.md ทุกตัวตามมาตรฐาน skills + safety
argument-hint: "[agent-name|all]"
related:
  - update-devin-global-subagents
  - use-subagents
  - report
---

## Goal

Run the `subagents` layer of `/review-devin-global-harness` แบบ focused — AGENT.md ทุกตัวใน `%APPDATA%\devin\agents` ตรงมาตรฐาน

## Scope

- ใช้เมื่อ `/review-devin-global-harness` dispatch มาที่ `subagents`/`agents` หรือเรียก standalone
- ไม่มี script — manual เท่านั้น

## Execute

### 1. Inventory

> Goal: รายการ agents ทั้งหมด

เก็บ `AGENT.md` ทุกตัวใน `%APPDATA%\devin\agents` — เทียบกับ `subagents/` ใน skills และ profile references ใน code

### 2. Agent Checks

> Goal: แต่ละ agent ตรงมาตรฐาน

ใช้มาตรฐานเดียวกับ skills ตาม `../../references/frontmatter.md`, `sections.md`, `style.md`

1. frontmatter — name/description/tools ครบและถูกต้อง
2. sections — Goal/Scope/Execute/Rules/Expected Outcome
3. safety — permissions เหมาะสม (read-only vs write), ไม่มี destructive default
4. usage — agent ที่ไม่มี skill ไหนอ้างถึง = orphan candidate

### 3. Report

> Goal: findings ต่อ agent

ทำ `/report` ตาราง: `No.`, `Agent`, `Category`, `Severity`, `Finding`, `Evidence`, `Action`

## Rules

- Review เท่านั้น ไม่แก้ไข AGENT.md ระหว่าง check
- ทุก finding มี agent path + evidence
- orphan agents รายงานแยก — ห้ามลบโดยไม่ confirm

## Expected Outcome

- Per-agent findings พร้อม severity
- Orphan/misaligned agents identified พร้อม action
