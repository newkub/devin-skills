---
name: follow-git-config
description: จัดการ git configuration ครอบคลุม global, local, .gitconfig และ .gitattributes
---

## Goal

จัดการ git configuration อย่างเป็นระบบ ครอบคลุม global, local และ repository-level

## Scope

ครอบคลุม git config, .gitconfig, .gitattributes และ .gitignore (อ้างอิง /follow-gitignore)

## Execute

### 1. Check Current Configuration

1. รัน `git config --list` เพื่อดู configuration ทั้งหมด
2. รัน `git config --list --global` เพื่อดู global configuration
3. รัน `git config --list --local` เพื่อดู repository configuration
4. ตรวจสอบว่า `user.name` และ `user.email` ตั้งค่าถูกต้อง

### 2. Set Global Configuration

1. รัน `git config --global user.name "Your Name"`
2. รัน `git config --global user.email "your@email.com"`
3. รัน `git config --global init.defaultBranch main`
4. รัน `git config --global pull.rebase true` เพื่อใช้ rebase เป็น default
5. รัน `git config --global push.autoSetupRemote true` เพื่อ auto-setup remote

### 3. Set Local Configuration

1. รัน `git config --local user.name "Project Name"` สำหรับ project-specific
2. รัน `git config --local user.email "project@email.com"` สำหรับ project-specific
3. ใช้ local config เมื่อต้องการ different identity สำหรับ project นั้น
4. ตรวจสอบว่า local config ไม่ override global โดยไม่จำเป็น

### 4. Manage .Gitattributes

1. สร้าง `.gitattributes` ที่ root ของ repository
2. เพิ่ม line endings: `* text=auto` สำหรับ cross-platform
3. เพิ่ม binary files: `*.png binary`, `*.jpg binary`
4. เพิ่ม export-ignore: `.devin/ export-ignore` สำหรับไฟล์ที่ไม่ต้อง export

### 5. Validate Configuration

1. รัน `git config --list` เพื่อตรวจสอบครบถ้วน
2. รัน `git config user.name` และ `git config user.email` เพื่อยืนยัน
3. ตรวจสอบว่า `.gitattributes` ทำงานด้วย `git check-attr -a <file>`

## Rules

### 1. Configuration Hierarchy

- Global config ใช้สำหรับ default settings ทุก repository
- Local config ใช้สำหรับ project-specific settings
- ห้ามตั้งค่าใน local config ที่ควรเป็น global
- ตรวจสอบว่าไม่มี conflicting settings

### 2. Line Endings

- ใช้ `* text=auto` ใน `.gitattributes` เสมอ สำหรับ cross-platform
- ระบุ line endings สำหรับไฟล์เฉพาะ เช่น `*.sh text eol=lf`
- หลีกเลี่ยงการตั้งค่า `core.autocrlf` ใน config ใช้ `.gitattributes` แทน

### 3. Binary Files

- ระบุ binary files ใน `.gitattributes` เพื่อป้องกันการ corrupt
- ใช้ `*.png binary`, `*.jpg binary`, `*.pdf binary`
- ห้ามใช้ `text` attribute สำหรับ binary files

### 4. Non-Redundancy

- รายละเอียด .gitignore อยู่ใน `/follow-gitignore` แล้ว
- รายละเอียด config management อยู่ใน `/follow-config` แล้ว

## Expected Outcome

- Git configuration ตั้งค่าอย่างเป็นระบบ
- Line endings จัดการผ่าน .gitattributes
- Binary files ปลอดภัยจากการ corrupt
- ไม่มี conflicting settings ระหว่าง global และ local
