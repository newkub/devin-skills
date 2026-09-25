---
name: deep-analyze-by-use-scripts
description: alias → /deep-analyze (วิเคราะห์โปรเจกต์ลึกซึ้งครบทุกมิติ ด้วย tools, scripts, CLI)
argument-hint: "[scope|report]"
related:
  - deep-analyze
---

## Goal

Alias ของ `/deep-analyze` — วิเคราะห์โปรเจกต์อย่างลึกซึ้งครบทุกมิติ (extract จาก `deep-analyze/subskills/by-use-scripts` เดิมที่เป็น alias stub)

## Scope

ใช้เมื่อ user เรียก `/deep-analyze-by-use-scripts` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `deep-analyze`

## Execute

ทำ `/deep-analyze` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/deep-analyze` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `deep-analyze/SKILL.md` เสมอ
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- `/deep-analyze` ถูก execute ครบทุก step
