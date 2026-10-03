---
name: deep-plan
description: alias → /create-plan-in-dot-devin (canonical analyze + plan)
argument-hint: "[scope] [chat-only]"
related:
  - create-plan-in-dot-devin
---

## Goal

Alias ของ `/create-plan-in-dot-devin` — analyze + plan ที่ persist ลง `.devin/temp/plan/<workspace>/` (merged เข้า canonical แล้ว — `deep-plan` เป็น stub ไม่มี workflow ของตัวเอง)

## Scope

ใช้เมื่อ user หรือ skill อื่นเรียก `/deep-plan` — workflow จริงอยู่ใน `create-plan-in-dot-devin`

- Default: forward เต็ม workflow (สร้าง plan file)
- Caller ที่ต้องการ chat-only (เช่น `/bench-competitors`) → forward แบบระบุ `chat-only` เพื่อข้าม Steps 6-8

## Execute

ทำ `/create-plan-in-dot-devin` เต็ม workflow — ส่งต่อ `<scope>` และ `chat-only` hint ตามที่ caller ระบุ

## Rules

- ห้าม duplicate workflow ของ `/create-plan-in-dot-devin` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `create-plan-in-dot-devin/SKILL.md` เสมอ
- Chat-only caller ต้องส่ง hint ต่อเสมอ — ห้ามสร้างไฟล์ plan เองในไฟล์นี้

## Expected Outcome

- `/create-plan-in-dot-devin` ถูก execute ครบทุก step จนได้ implementation-ready plan
