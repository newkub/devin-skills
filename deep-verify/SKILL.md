---
name: deep-verify
description: alias → /run-verify (รัน verify ครบทั้ง local และ CI/CD ตาม project)
argument-hint: "[scope]"
related:
  - run-verify
---

## Goal

Alias ของ `/run-verify` — รัน verify ครบทั้ง local และ CI/CD ตาม project

## Scope

ใช้เมื่อ user เรียก `/deep-verify` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `run-verify`

## Execute

ทำ `/run-verify` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/run-verify` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `run-verify/SKILL.md` เสมอ

## Expected Outcome

- `/run-verify` ถูก execute ครบทุก step
