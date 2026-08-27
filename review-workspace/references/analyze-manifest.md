---
name: analyze-manifest
description: ตรวจสอบ manifest quality และ scripts
---

# Analyze Manifest

วิเคราะห์ package manifest ของ workspace

## Goal

ตรวจสอบ manifest quality และ scripts

## Checks

1. อ่าน `package.json` หรือ `Cargo.toml` ของ workspace
2. ตรวจสอบ `name`, `version`, `description`, `main`, `types` หรือ `bin`
3. ตรวจสอบ `scripts` ว่ามี `dev`, `build`, `test`, `lint`, `typecheck`, `verify`, `ci` ตาม `/follow-package-manifest`
4. ตรวจสอบ `exports`, `files`, `publishConfig` สำหรับ library packages
5. บันทึก findings พร้อม evidence

