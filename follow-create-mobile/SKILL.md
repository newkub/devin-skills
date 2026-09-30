---
name: follow-create-mobile
description: สร้าง mobile app — native (Kotlin Multiplatform) หรือ cross-platform (Capacitor)
argument-hint: "[domain]"
related:
  - follow-create-web
  - follow-best-practice
  - implement-features-to-mvp
  - ask-me

---

## Goal

Dispatch ไป skill ตาม mobile target — parent ทำ routing เท่านั้น

## Scope

- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Target Skills

| Domain | Skill |
|---|---|
| `native`, `ios`, `android`, `kmp` | `/follow-create-ios-android-native-by-kotlin-multiplatform` — native iOS+Android ด้วย Kotlin Multiplatform |
| `cross-capacitor`, `capacitor` | `/follow-create-mobile-cross-with-capacitor` — web stack + Capacitor |

1. ทำ `/deep-research` + `/follow-best-practice` สำหรับ platform ที่เลือก ตาม conventions ใน `/update-devin-global-skills` (ทำใน target skill ที่ dispatch ไป)
2. ระบุ domain จาก argument (เช่น `/follow-create-mobile ios`)
3. ถ้า domain รองรับ → เรียก skill ตามตารางแล้วทำตาม flow ของ skill นั้น
4. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ target skill
- เลือก native vs cross ตาม requirement — ถ้าไม่ชัดให้ถาม user ก่อน

- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /implement-features-to-mvp ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป skill ที่ตรง platform แล้ว scaffold ตาม flow นั้น
