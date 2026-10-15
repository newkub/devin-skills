---
name: plan
description: alias → /create-plan-in-dot-devin (canonical analyze + plan)
argument-hint: "[scope] [chat-only]"
related:
  - create-plan-in-dot-devin
---

## Goal

Alias ของ `/create-plan-in-dot-devin` — analyze + plan ที่ persist ลง `.devin/temp/plan/<workspace>/` (ตัว plan content สร้างโดย `/deep-plan`, skill นี้ owns การเก็บไฟล์)

## Scope

ใช้เมื่อ user หรือ skill อื่นเรียก `/plan` — workflow จริงอยู่ใน `create-plan-in-dot-devin`

- Default: forward เต็ม workflow (สร้าง plan file)
- Caller ที่ต้องการ chat-only → forward แบบระบุ `chat-only`

## Execute

ทำ `/create-plan-in-dot-devin` เต็ม workflow — ส่งต่อ `<scope>` และ `chat-only` hint ตามที่ caller ระบุ

## Rules

- ห้าม duplicate workflow ของ `/create-plan-in-dot-devin` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `create-plan-in-dot-devin/SKILL.md` เสมอ

## Expected Outcome

- `/create-plan-in-dot-devin` ถูก execute ครบทุก step จนได้ implementation-ready plan
