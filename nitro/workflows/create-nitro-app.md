---
description: สร้าง Nitro application ใหม่ด้วย template
---

## Goal

สร้าง Nitro application ใหม่ด้วย template ที่เหมาะสม

## Execute

### 1. Choose Template

เลือก template ตาม use case:
- **minimal** - สำหรับ API server พื้นฐาน
- **full-stack** - สำหรับ application ที่มี routes หลากหลาย
- **edge** - สำหรับ deployment บน edge platforms

### 2. Create with Template

ใช้ degit สำหรับ clone template:
```bash
bunx degit unjs/nitro-starter my-app
cd my-app
bun install
```

### 3. Customize Configuration

แก้ไข `nitro.config.ts` ตามความต้องการ:
- เปลี่ยน preset
- เพิ่ม plugins
- ตั้งค่า route rules
- เพิ่ม storage

### 4. Add Features

ตามความต้องการ:
- เพิ่ม API routes ใน `server/api/`
- เพิ่ม middleware ใน `server/middleware/`
- เพิ่ม utilities ใน `server/utils/`

### 5. Test

```bash
bun run dev
```

## Rules

- เลือก template ที่ใกล้เคียงกับ use case มากที่สุด
- อย่าเพิ่ม features ที่ไม่จำเป็นในช่วงเริ่มต้น
- ทำตาม `/follow-nitro` สำหรับ best practices
