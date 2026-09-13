---
name: create-github
description: สร้าง GitHub resources — issue, PR, repo ผ่าน create-github-* skills
argument-hint: "[domain]"
related:
  - list-github
  - open
  - git-push
  - use-gh-cli
  - ask-me
---

## Goal

Dispatch ไป skill ตาม GitHub resource ที่ต้องสร้าง — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: create-github-issue, create-github-repo; pr เป็น submodule `create-github-pr`)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Create GitHub Skills

| Domain | Skill |
|---|---|
| `issue` | `/create-github-issue` — สร้าง issue พร้อม template/labels |
| `pr` | `/create-github-pr` — สร้าง pull request (submodule: create-github-pr) |
| `repo` | `/create-github-repo` — สร้าง repo ใหม่พร้อม init settings |

1. ระบุ domain จาก argument (เช่น `/create-github pr`)
2. ถ้า domain รองรับ → เรียก skill ตามตารางแล้วทำตาม flow ของ skill นั้น
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ target skill
- ใช้ `gh` CLI หรือ GitHub MCP tools ตามที่ available ใน skill นั้น

- ใช้ /list-github ถ้าจำเป็น
- ใช้ /open ถ้าจำเป็น
- ใช้ /git-push ถ้าจำเป็น
- ใช้ /use-gh-cli ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป skill ที่ตรง domain แล้วสร้าง resource ตาม flow นั้น
