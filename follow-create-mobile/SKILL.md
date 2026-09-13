---
name: follow-create-mobile
description: สร้าง mobile app — native iOS, Android หรือ cross-platform (Capacitor, Flutter) ผ่าน subskills
argument-hint: "[domain]"
related:
  - follow-create-web
  - follow-best-practice
  - implement-features-to-mvp
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม mobile target — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: follow-create-mobile-ios, follow-create-mobile-android, follow-create-mobile-cross-capacitor, follow-create-mobile-cross-flutter)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `ios` | `subskills/ios/SKILL.md` — native iOS ด้วย Swift + SwiftUI |
| `android` | `subskills/android/SKILL.md` — native Android ด้วย Kotlin |
| `cross-capacitor` | `subskills/cross-capacitor/SKILL.md` — web stack + Capacitor |
| `cross-flutter` | `subskills/cross-flutter/SKILL.md` — Flutter cross-platform |

1. ระบุ domain จาก argument (เช่น `/follow-create-mobile ios`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- เลือก native vs cross ตาม requirement — ถ้าไม่ชัดให้ถาม user ก่อน

- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /implement-features-to-mvp ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง platform แล้ว scaffold ตาม flow นั้น
