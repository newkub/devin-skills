---
name: restore
description: Alias for restore-files — renamed to clarify it restores deleted files
argument-hint: "[domain]"
related:
  - restore-files
---

## Goal

Skill นี้ถูก rename เป็น `/restore-files` แล้ว — ใช้ `/restore-files` เป็น canonical skill (dispatcher: `deleted-file`, `from-devin-history`, `from-git-log`, `from-my-dotfiles`)

## Scope

Callers ที่ใช้ชื่อเดิมจะถูกส่งต่อไปยัง `/restore-files` เสมอ

## Execute

### 1. Forward To Canonical

> Goal: ส่งต่อไปยัง canonical skill

1. ทำ `/restore-files` ด้วย arguments เดิม

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias นี้ — แก้ที่ canonical skill เท่านั้น
- เก็บไว้เพื่อ backward compatibility กับ callers ที่ใช้ชื่อเดิม

## Expected Outcome

- ผลลัพธ์เหมือนการเรียก `/restore-files` โดยตรง
