---
name: follow-open-web-dependencies
description: เปิด website ของ dependencies จาก package manifest
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

อ่าน package manifest และเปิด website ของ dependencies ที่ใช้ใน project

## Scope

Use `follow-open-web-dependencies` for the specific tasks and workflows it covers

## Execute

### 1. Read Package Manifest
> Goal: Read Package Manifest

1. อ่าน package.json, Cargo.toml, หรือ manifest อื่นๆ
2. ระบุ dependencies ทั้งหมดใน project
3. จัดกลุ่มตามประเภทของ dependencies

### 2. Open Dependencies Websites
> Goal: Open Dependencies Websites

1. ถ้าไม่ระบุ dependencies ที่ต้องการ: เปิด website ทุกตัว
2. ถ้าระบุ dependencies ที่ต้องการ: เปิดเฉพาะตัวนั้นๆ
3. ค้นหาข้อมูล config, API keys, หรือ environment variables ที่จำเป็น
4. คัดลอกค่าที่ได้ไปใช้ใน project

## Rules

1. ต้องมีสิทธิ์เข้าถึง accounts ของ services ต่างๆ
2. เก็บ secrets ไว้อย่างปลอดภัย ห้าม commit ไปยัง repository
3. ใช้ environment variables หรือ secrets management tools
4. อย่าแชร์ secrets กับบุคคลอื่น

## Expected Outcome

- ระบุ dependencies ทั้งหมดจาก package manifest
- เปิด website ของ dependencies ตามที่ต้องการ
- ได้ข้อมูล config, API keys, หรือ environment variables ที่จำเป็น
- ตั้งค่า dependencies ใน project สำเร็จ
