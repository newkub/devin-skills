---
name: git-commit-at-devin-global-skills
description: alias → /git-commit at-devin-global-skills (commit devin skills หลัง validation ผ่าน)
argument-hint: "[message]"
related:
  - git-commit

---

## Goal

Alias ของ `/git-commit at-devin-global-skills` — commit ทุกไฟล์ที่เปลี่ยนแปลงใน devin global skills repo หลัง `/review-devin-global-harness`, `/deep-validate` และ reference checks ผ่านเกณฑ์

## Scope

ใช้เมื่อ user เรียก `/git-commit-at-devin-global-skills` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `git-commit/workflows/at-devin-global-skills`

## Execute

ทำ `/git-commit at-devin-global-skills` เต็ม workflow (อ่าน `git-commit/workflows/at-devin-global-skills/SKILL.md`)

## Rules

- ห้าม duplicate workflow ของ `git-commit/workflows/at-devin-global-skills` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `git-commit/workflows/at-devin-global-skills/SKILL.md` เสมอ
- ถ้าต้องการ push ต่อ → ใช้ `/git-commit-and-push` หลังจากนี้

## Expected Outcome

- `/git-commit at-devin-global-skills` ถูก execute ครบทุก step จน commit สำเร็จและ working directory สะอาด
