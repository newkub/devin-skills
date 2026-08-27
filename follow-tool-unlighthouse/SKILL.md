---
name: follow-tool-unlighthouse
description: ตั้งค่า Unlighthouse สำหรับ site-wide Lighthouse audit ทั้ง dev และ CI
related:
  - follow-tool-vite
  - follow-tool-playwright
  - follow-test
  - follow-deploy
---

## Goal

ตั้งค่าและใช้ Unlighthouse CLI เพื่อ audit performance, accessibility, SEO ของ website ทั้งเว็บไซต์

## Scope

ใช้สำหรับ projects ที่ต้องการ monitor ทุกหน้าเว็บด้วย Lighthouse ทั้ง development mode และ CI/CD

## Execute

### 1. Setup Environment

> Goal: ตั้งค่า URL สำหรับ scan

1. ตั้งค่า `APP_URL` environment variable
2. ใช้ default `http://localhost:3000` สำหรับ development
3. ตั้งค่าใน `.env` หรือ CI environment
4. ตรวจสอบว่า URL เข้าถึงได้

### 2. Add Package Scripts

> Goal: เพิ่ม scripts สำหรับ dev และ CI

1. เพิ่ม `"audit": "bunx unlighthouse --site \${APP_URL:-http://localhost:3000}"`
2. เพิ่ม `"audit:ci": "bunx unlighthouse-ci --site \${APP_URL:-http://localhost:3000} --budget 75"`
3. เพิ่ม `"audit:ci:strict": "bunx unlighthouse-ci --site \${APP_URL:-http://localhost:3000} --budget 90 --build-static"`
4. รัน `bun run audit` เพื่อทดสอบ
5. ดู CLI options ใน [references/unlighthouse.md](references/unlighthouse.md)

### 3. Run Development Scan

> Goal: scan website ใน development

1. รัน `bun run audit`
2. เปิด Web UI ที `http://localhost:5678`
3. ใช้ `--debug` สำหรับ verbose output
4. ใช้ `--no-cache --throttle --samples 3` สำหรับ accurate results

### 4. Configure Unlighthouse

> Goal: สร้าง config file ถ้าจำเป็น

1. สร้าง `unlighthouse.config.ts` ที root
2. กำหนด `site`, `outputDir`, `scanner` options
3. ตั้งค่า budgets สำหรับ performance, accessibility, best-practices, seo
4. ดูตัวอย่าง config ใน [references/unlighthouse.md](references/unlighthouse.md)

### 5. CI Integration

> Goal: integrate Unlighthouse กับ CI

1. เพิ่ม job รัน `bun run audit:ci` ใน GitHub Actions
2. ใช้ `--build-static` เพื่อ generate HTML report
3. upload `.unlighthouse/` folder สำหรับ static report
4. ตรวจสอบ CI fail ถ้า score ต่ำกว่า budget

## Rules

### 1. Usage

- ใช้ `bunx unlighthouse` สำหรับ development
- ใช้ `bunx unlighthouse-ci` สำหรับ CI
- ไม่ต้องติดตั้ม global dependencies

### 2. Environment Variables

- ใช้ `APP_URL` สำหรับ site URL
- กำหนดใน `.env` หรือ CI environment
- ไม่ hard-code URLs ใน scripts

### 3. Budgets

- ใช้ `--budget 75` สำหรับ standard threshold
- ใช้ `--budget 90` สำหรับ strict threshold
- ตั้งค่า per-category budgets ถ้าจำเป็น

### 4. Reports

- ใช้ `--build-static` สำหรับ HTML report
- ใช้ `--reporter json` สำหรับ machine-readable
- upload report ใน CI

### 5. Scans

- ใช้ `--no-cache` สำหรับ fresh scan
- ใช้ `--throttle` เพื่อจำลอง real network
- ใช้ `--samples N` สำหรับ multiple runs

## Expected Outcome

- Unlighthouse scripts พร้อมใช้
- Development scan ทำงาน
- CI รัน audit อัตโนมัติ
- Budgets enforce ได้
- Reports generate ใน format ทีต้องการ
