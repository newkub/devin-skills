---
name: follow-ultracite
description: ตั้งค่า Ultracite กับ Biome สำหรับ zero-config linting และ formatting
---

## Goal

ติดตั้งและตั้งค่า Ultracite กับ Biome สำหรับ linting และ formatting

## Scope

ใช้ `follow-ultracite` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Installation

> Goal: Installation

1. ติดตั้ง Ultracite และ Biome:
   ```bash
   bun add -D ultracite @biomejs/biome
   ```

### 2. Configuration

> Goal: Configuration
1. สร้างหรือแก้ไข `biome.json`:
   ```json
   {
     "extends": ["ultracite/biome/core"]
   }
   ```
2. เพิ่ม framework presets ตามที่ใช้งาน:
   ```json
   {
     "extends": [
       "ultracite/biome/core",
       "ultracite/biome/react",
       "ultracite/biome/next"
     ]
   }
   ```
3. เพิ่ม scripts ใน `package.json`:
   ```json
   {
     "scripts": {
       "lint": "ultracite check",
       "lint:fix": "ultracite fix"
     }
   }
   ```

### 3. Usage

> Goal: Usage
1. Lint โค้ดโดยไม่แก้ไข:
   ```bash
   bun run lint
   ```
2. Lint และแก้ไขอัตโนมัติ:
   ```bash
   bun run lint:fix
   ```
3. ตรวจสอบ setup:
   ```bash
   bunx ultracite doctor
   ```

## Rules

- ใช้ preset configs จาก Ultracite ก่อน custom rules
- Custom overrides ควรเป็น minimum เท่านั้น
- ใช้ extends เพื่อ inherit จาก core configs
- เลือก frameworks ที่ใช้งานจริงเท่านั้น
- Commit config files ที่สร้างขึ้น

## Expected Outcome

- Ultracite ติดตั้งและตั้งค่าเสร็จสมบูรณ์
- Biome configuration สอดคล้องกับ Ultracite presets
- Scripts ใน package.json พร้อมใช้งาน
- Linting และ formatting ทำงานได้อัตโนมัติ
