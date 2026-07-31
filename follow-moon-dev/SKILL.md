---
name: follow-moon-dev
description: แนวทางการใช้ moon dev สำหรับ development mode
---

## Goal

กำหนดแนวทางการใช้ `moon dev` สำหรับ development mode ที่มีประสิทธิภาพ

## Execute

### 1. Setup Dev Mode

1. กำหนด dev tasks ใน `tasks.yml` สำหรับแต่ละ project
2. ใช้ `moon dev` เพื่อรัน development servers ทั้งหมด
3. ตั้งค่า environment variables สำหรับ development
4. กำหนด ports สำหรับแต่ละ service
5. ตั้งค่า watch mode สำหรับ hot reload

### 2. Run Dev Servers

1. รัน `moon dev` เพื่อเริ่ม development mode
2. รัน `moon dev <project>` สำหรับ project เดียว
3. ใช้ `moon dev --filter` สำหรับ specific projects
4. ตรวจสอบว่าทุก services start สำเร็จ
5. ตรวจสอบ logs สำหรับ errors และ warnings

### 3. Watch And Reload

1. ตั้งค่า inputs ใน tasks สำหรับ watch mode
2. ใช้ incremental builds สำหรับ performance
3. ตรวจสอบ hot reload functionality
4. จัดการ file watchers อย่างมีประสิทธิภาพ
5. ตรวจสอบ cache behavior ระหว่าง development

### 4. Environment Management

1. กำหนด environment variables ใน `tasks.yml`
2. ใช้ `.env` files สำหรับ local development
3. ตั้งค่า environment variables สำหรับแต่ละ project
4. ตรวจสอบ environment consistency
5. ใช้ environment inheritance สำหรับ shared configs

### 5. Dependency Management

1. ตรวจสอบ project dependencies ด้วย `moon check`
2. ติดตั้ง dependencies ด้วย `moon install`
3. จัดการ workspace dependencies
4. ตรวจสอบ circular dependencies
5. อัพเดท dependencies ด้วย `moon sync`

### 6. Debug And Troubleshoot

1. ใช้ `moon run <task> --dry-run` สำหรับ debugging
2. ตรวจสอบ task dependencies ด้วย `moon graph`
3. ดู logs สำหรับ errors และ warnings
4. ใช้ verbose mode สำหรับ detailed output
5. ตรวจสอบ cache issues ด้วย `moon prune`

## Rules

### 1. Task Configuration

กำหนด dev tasks ใน `tasks.yml` อย่างถูกต้อง
- ใช้ command ที่รองรับ watch mode
- ตั้งค่า inputs สำหรับ file watching
- กำหนด outputs สำหรับ caching
- ใช้ environment variables สำหรับ configuration
- ตั้งค่า local environment สำหรับ development

### 2. Project Selection

เลือก projects ที่จะรันใน development mode
- ใช้ `moon dev` สำหรับทุก projects
- ใช้ `moon dev <project>` สำหรับ project เดียว
- ใช้ `--filter` สำหรับ specific projects
- ตรวจสอบ dependencies ก่อนรัน
- รัน projects ตาม dependency order

### 3. Watch Mode

ใช้ watch mode อย่างมีประสิทธิภาพ
- ตั้งค่า inputs ให้ครอบคลุม files ที่เปลี่ยน
- ใช้ incremental builds สำหรับ performance
- จัดการ file watchers อย่างมีประสิทธิภาพ
- ตรวจสอบ hot reload functionality
- จัดการ debounce สำหรับ frequent changes

### 4. Environment Variables

จัดการ environment variables อย่างถูกต้อง
- กำหนด environment variables ใน `tasks.yml`
- ใช้ `.env` files สำหรับ local development
- ตั้งค่า environment variables สำหรับแต่ละ project
- ใช้ environment inheritance สำหรับ shared configs
- ตรวจสอบ environment consistency

### 5. Performance

ปรับปรุง performance ใน development mode
- ใช้ incremental builds สำหรับ performance
- ตั้งค่า cache อย่างถูกต้อง
- จัดการ file watchers อย่างมีประสิทธิภาพ
- ใช้ parallel execution สำหรับ multiple projects
- ตรวจสอบ memory usage

## Expected Outcome

- Development mode ที่ทำงานอย่างมีประสิทธิภาพ
- Hot reload ที่ทำงานได้อย่างรวดเร็ว
- Environment variables ที่จัดการอย่างถูกต้อง
- Dependencies ที่ synchronized อย่างสมบูรณ์
- Debugging ที่ง่ายและมีประสิทธิภาพ
