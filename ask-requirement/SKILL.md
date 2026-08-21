---
name: ask-requirement
description: ถามความต้องการโปรเจกต์ผ่าน CLI และ MCP server สร้าง custom data อัตโนมัติ
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

ถามความต้องการโปรเจกต์ผ่าน CLI ที่เรียก MCP server สร้าง custom data พร้อม icons อัตโนมัติ

## Scope

ใช้สำหรับเริ่มต้นโปรเจกต์ใหม่ หรือวิเคราะห์ความต้องการก่อนวางแผนงาน มีทั้ง CLI และ Web UI

## Execute

### 1. Run CLI

รัน CLI เพื่อถามความต้องการแบบ interactive

1. รัน `bun --filter @ask-requirement/cli dev` หรือ `ask-requirement` ถ้า release แล้ว
2. CLI ถามครบ 7 หัวข้อ: Platform, Integrations, Features, Target Users, Competitors, Project Level, Custom Data
3. CLI ส่งข้อมูลไป MCP server เพื่อ generate summary
4. MCP server ส่ง markdown และ JSON กลับมา
5. CLI แสดงผลและถามจะบันทึกไฟล์หรือไม่

### 2. Use Web UI

เปิด Web UI สำหรับกรอกผ่าน browser

1. รัน `bun --filter @ask-requirement/web dev`
2. เปิด browser ที่ `http://localhost:3000`
3. 2-column layout: ซ้าย 3/4 ฟอร์ม, ขวา 1/4 สรุป
4. มี icons จาก Iconify MDI สำหรับทุก option
5. กด Copy Summary เพื่อคัดลอกผลลัพธ์

### 3. Form Sections

ทั้ง CLI และ Web มี 7 หัวข้อ:

1. Platform - เลือก platform (web, desktop, cli, tui, sdk, mobile, api, extension, bot)
2. Integrations - เลือก integrations (payment, auth, email, sms, push, storage, ai, analytics, maps, calendar, chat, video, social)
3. Features - กรอก features ที่ต้องการ พร้อมเพิ่ม/ลบได้
4. Target Users - กรอก target user และจำนวนผู้ใช้ที่คาดการณ์
5. Competitors - กรอกคู่แข่งหรือโปรเจกต์ที่คล้ายกัน
6. Project Level - เลือกระดับโปรเจกต์ (landing, basic-saas, enterprise)
7. Custom Data - เพิ่ม key-value pairs พร้อม icon สำหรับ AI consumption

### 4. MCP Server

MCP server ให้ 5 tools:

1. `get-platforms` - ดึง platform options ทั้งหมด
2. `get-integrations` - ดึง integration options ทั้งหมด
3. `get-project-levels` - ดึง project level options ทั้งหมด
4. `generate-requirement` - สร้าง summary จาก form data (markdown + JSON)
5. `generate-markdown-only` - สร้าง markdown only (lightweight)

### 5. Process Results

หลังจากได้ผลลัพธ์:

1. วิเคราะห์ความต้องการที่ได้รับ
2. ทำ `/deep-plan` เพื่อวางแผนงานตามความต้องการ
3. ทำ `/follow-goal` เพื่อตั้งเป้าหมาย
4. ถ้าต้องการเปรียบเทียบคู่แข่ง ทำ `/bench-competitors`
5. ถ้าต้องการไอเดีย features เพิ่ม ทำ `/compare-and-idea-features`

## Rules

### 1. Architecture

- Turborepo monorepo ที่ `D:\newkub\ask-requirement`
- `packages/shared` - types, schemas, data, generator
- `apps/web` - SolidStart + UnoCSS Web UI
- `apps/mcp-server` - MCP server with stdio transport
- `apps/cli` - Interactive CLI ที่เรียก MCP server

### 2. Platform Options

- ตัวเลือก: `web`, `desktop`, `cli`, `tui`, `sdk`, `mobile`, `api`, `extension`, `bot`
- แต่ละ option มี icon (MDI) และ description
- สามารถเลือกได้หลาย platform

### 3. Integration Options

- ตัวเลือก: `payment`, `auth`, `email`, `sms`, `push`, `storage`, `ai`, `analytics`, `maps`, `calendar`, `chat`, `video`, `social`
- แต่ละ option มี icon (MDI) และ description
- สามารถเลือกได้หลาย integrations

### 4. Project Level Definitions

- Landing: ไม่มี auth, เน้น content และ conversion
- Basic SaaS: มี auth, core features ใช้งานได้จริง
- Enterprise: มี auth + multi-tenant, RBAC, audit log, compliance

### 5. Custom Data

- แต่ละ field มี `key`, `value`, และ `icon` (optional, default `mdi-tag`)
- Icons ดึงจาก Iconify JSON MDI collection
- Custom data สำหรับ AI consumption เพิ่มเติมจาก 6 หัวข้อหลัก

### 6. Output Format

- ผลลัพธ์เป็น markdown และ JSON
- CLI สามารถบันทึกไฟล์ได้
- Web UI มี Copy to Clipboard

## Expected Outcome

- CLI ที่เรียก MCP server สร้าง requirement summary อัตโนมัติ
- Web UI 2-column layout พร้อม icons และ live summary
- MCP server 5 tools สำหรับ AI integration
- Custom data พร้อม icons สำหรับ AI consumption
- นำผลลัพธ์ไปวางแผนงานด้วย `/deep-plan` และ `/follow-goal`
