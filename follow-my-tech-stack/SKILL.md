---
name: follow-my-tech-stack
description: Alias for review-techstack — merged into the canonical skill
argument-hint: "[scope]"
related:
  - review-techstack
---

## Goal

Skill นี้ถูก merge เข้ากับ `/review-techstack` แล้ว — ใช้ `/review-techstack` เป็น canonical skill (preferred stack catalog → `review-dependencies/references/techstack-catalog.md`)

## Scope

Callers ที่ใช้ชื่อเดิมจะถูกส่งต่อไปยัง `/review-techstack` เสมอ

## Execute

### 1. Forward To Canonical

> Goal: ส่งต่อไปยัง canonical skill

1. ทำ `/review-techstack` ด้วย arguments เดิม

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias นี้ — แก้ที่ canonical skill เท่านั้น
- เก็บไว้เพื่อ backward compatibility กับ callers ที่ใช้ชื่อเดิม

## Expected Outcome

- ผลลัพธ์เหมือนการเรียก `/review-techstack` โดยตรง
