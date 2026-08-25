---
name: follow-create-oxlint-plugins
description: ตั้งค่าและใช้งาน Oxlint plugins ทั้ง built-in และ JavaScript
---

## Goal

ตั้งค่าและใช้งาน Oxlint plugins ทั้ง built-in และ JavaScript plugins สำหรับ linting

## Scope

ใช้ `follow-create-oxlint-plugins` สำหรับ tasks และ workflows เฉพาะที่กำหนด

## Execute

### 1. Setup
> Goal: Setup

1. ติดตั้ง oxlint ด้วย `bun add -D oxlint`
2. ตรวจสอบว่ามี config file อยู่แล้ว

### 2. Create Config File
> Goal: Create Config File

1. สร้าง `.oxlintrc.json` หรือ `oxlint.config.ts` ที่ root
2. เลือกใช้ format ที่ต้องการ

### 3. Configure Built-in Plugins
> Goal: Configure Built-in Plugins

1. เลือก built-in plugins ที่ต้องการ
2. กำหนดผ่าน `plugins` field ใน config
3. ตั้งค่า categories สำหรับ severity

### 4. Configure JS Plugins (Optional)
> Goal: Configure JS Plugins (Optional)

1. ติดตั้ง ESLint plugin ที่ต้องการ
2. กำหนดผ่าน `jsPlugins` field ใน config
3. ใช้ custom name สำหรับ reserved plugin names

### 5. Verify
> Goal: Verify

1. รัน `oxlint` เพื่อทดสอบ plugins
2. ตรวจสอบว่า rules ทำงานได้ถูกต้อง

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-workspace`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Config File

- ใช้ `.oxlintrc.json` หรือ `oxlint.config.ts`
- วางไฟล์ที่ root ของโปรเจกต์
- oxlint จะ detect config file อัตโนมัติ

### 2. Built-in Plugins

- ใช้ `plugins` field สำหรับ native plugins
- ตั้งค่า plugins จะ overwrite default plugin set
- ระบุทุก plugin ที่ต้องการใน array
- ใช้ CLI flag เช่น `--import-plugin` สำหรับ enable plugin

### 3. JS Plugins

- ใช้ `jsPlugins` field สำหรับ JavaScript plugins
- JS plugins อยู่ใน alpha stage ไม่ subject to semver
- สามารถกำหนดเป็น string หรือ object พร้อม alias
- ใช้ custom name สำหรับ reserved plugin names

### 4. Reserved Plugin Names

- react, unicorn, typescript, oxc, import, jest, vitest, jsx-a11y, nextjs
- เหล่านี้ implemented natively ใน Rust
- ต้องใช้ custom name ถ้าต้องการ JavaScript version

### 5. Categories

- correctness: Code ที่ผิดหรือไม่มีประโยชน์แน่นอน
- suspicious: Code ที่น่าจะผิดหรือไม่มีประโยชน์
- pedantic: Rules เข้มข้นที่อาจมี false positives
- perf: Rules สำหรับปรับปรุง runtime performance
- style: Rules สำหรับ style ที่เป็นไปในทิศทางเดียวกัน
- restriction: Rules ที่ห้าม patterns หรือ features เฉพาะ
- nursery: Rules ที่อยู่ระหว่างพัฒนาอาจเปลี่ยนแปลง

## Expected Outcome

- Config file สร้างขึ้นที่ root
- Built-in plugins กำหนดอย่างถูกต้อง
- JS plugins กำหนดอย่างถูกต้อง (ถ้าใช้)
- Rules ทำงานได้เมื่อรัน `oxlint`
