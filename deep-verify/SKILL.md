---
name: deep-verify
description: Alias for run-verify — merged into the canonical skill
argument-hint: "[scope]"
related:
  - run-verify
---

## Goal

Skill นี้ถูก merge เข้ากับ `/run-verify` แล้ว — ใช้ `/run-verify` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/run-verify` ตามขอบเขตและ workflow เดิมทั้งหมด


## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/run-verify`
