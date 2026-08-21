---
name: follow-unlighthouse
description: ตั้งค่า Unlighthouse CLI และ CI สำหรับ audit website ด้วย Google Lighthouse
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

ตั้งค่าและใช้ Unlighthouse CLI และ CI เพื่อ audit performance, accessibility, SEO ของ website ทั้งเว็บไซต์

## Execute

### 1. Setup Environment Variables

1. ตั้งค่า `APP_URL` environment variable สำหรับ site URL
2. ใช้ default value `${APP_URL:-http://localhost:3000}` สำหรับ development
3. ตั้งค่าใน `.env` file หรือ CI/CD environment
4. ตรวจสอบว่า URL สามารถเข้าถึงได้

### 2. Add Scripts to Package.json

1. เพิ่ม script `audit` สำหรับ development scan: `"audit": "bunx unlighthouse --site ${APP_URL:-http://localhost:3000}"`
2. เพิ่ม script `audit:ci` สำหรับ CI mode: `"audit:ci": "bunx unlighthouse-ci --site ${APP_URL:-http://localhost:3000} --budget 75"`
3. เพิ่ม script `audit:ci:strict` สำหรับ strict CI: `"audit:ci:strict": "bunx unlighthouse-ci --site ${APP_URL:-http://localhost:3000} --budget 90 --build-static"`
4. ใช้ `bun run audit` สำหรับ development scan
5. ใช้ `bun run audit:ci` สำหรับ CI checks

### 3. Run Development Scan

1. รัน `bun run audit` สำหรับ default scan
2. เปิด Web UI ที่ `http://localhost:5678`
3. รัน `bunx unlighthouse --site ${APP_URL:-http://localhost:3000} --debug` สำหรับ debug mode
4. รัน `bunx unlighthouse --site ${APP_URL:-http://localhost:3000} --no-cache --throttle --samples 3` สำหรับ advanced options

### 4. Configure Optional Settings

1. สร้าง `unlighthouse.config.ts` ใน root directory ถ้าจำเป็น
2. ตั้งค่า `site`, `outputDir` ถ้าไม่ใช้ environment variables
3. ตั้งค่า custom budgets ใน config file
4. ใช้ CLI arguments หรือ config file ตามความเหมาะสม

### 5. Setup CI Integration

1. เพิ่ม step ใน GitHub Actions รัน `bun run audit:ci`
2. เพิ่ม job ใน GitLab CI รัน `bun run audit:ci`
3. เพิ่ม command ใน CircleCI รัน `bun run audit:ci`
4. ใช้ `bun run audit:ci:strict` สำหรับ strict checks
5. Upload `.unlighthouse/` folder สำหรับ static reports ถ้าใช้ `--build-static`

### 6. Configure Performance Budgets

1. ใช้ `--budget 75` สำหรับ standard threshold
2. ใช้ `--budget 90` สำหรับ strict threshold
3. ใช้ per-category budgets ถ้าจำเป็น: performance, accessibility, best-practices, seo
4. CI fails ถ้า score ต่ำกว่า budget (exit code 1)
5. ตั้งค่า budgets ใน scripts หรือ config file

### 7. Configure Reporters (Optional)

1. ใช้ `--reporter json` สำหรับ JSON output
2. ใช้ `--reporter csv` หรือ `csvExpanded` สำหรับ CSV output
3. ใช้ `--reporter lighthouseServer` สำหรับ LHCI server upload
4. ใช้ `--build-static` สำหรับ HTML dashboard
5. Upload `.unlighthouse/` folder ไปยัง static host

## Rules

### 1. Bunx Usage

ใช้ `bunx` สำหรับ run Unlighthouse โดยไม่ต้องติดตั้ง

- ใช้ `bunx unlighthouse` สำหรับ development mode
- ใช้ `bunx unlighthouse-ci` สำหรับ CI mode
- ไม่ต้องติดตั้ง global หรือ local dependencies
- Bunx จะ handle dependencies อัตโนมัติ
- Puppeteer ดาวน์โหลด Chromium binary อัตโนมัติ

### 2. Environment Variables

ใช้ environment variables สำหรับ flexible configuration

- ใช้ `${APP_URL:-http://localhost:3000}` สำหรับ site URL
- ตั้งค่า `APP_URL` ใน `.env` สำหรับ development
- ตั้งค่า `APP_URL` ใน CI/CD environment สำหรับ production
- Default เป็น `http://localhost:3000` ถ้าไม่มีค่า
- ใช้ environment variable ทุกที่แทน hardcode URL

### 3. Package.json Scripts

เพิ่ม scripts ลงใน package.json สำหรับ consistency

- เพิ่ม `audit` script สำหรับ development scan
- เพิ่ม `audit:ci` script สำหรับ CI mode ด้วย budget 75
- เพิ่ม `audit:ci:strict` script สำหรับ strict CI ด้วย budget 90 และ build-static
- ใช้ `bun run <script>` สำหรับ execute scripts
- Scripts ใช้ `${APP_URL:-http://localhost:3000}` ทุกตัว

### 4. CLI Options

ใช้ CLI options สำหรับ customize scan behavior

- ใช้ `--debug` flag สำหรับ verbose logging
- ใช้ `--no-cache` สำหรับ disable caching
- ใช้ `--throttle` สำหรับ realistic network conditions
- ใช้ `--samples N` สำหรับ multiple Lighthouse runs
- ใช้ `--budget N` สำหรับ fail threshold (0-100)
- ใช้ `--build-static` สำหรับ generate HTML report

### 5. CI Integration

ใช้ scripts ใน CI/CD pipelines

- ใช้ `bun run audit:ci` สำหรับ standard CI checks
- ใช้ `bun run audit:ci:strict` สำหรับ strict checks
- Exit code 0 = all pages passed, 1 = budget failed
- Wire scripts ใน GitHub Actions, GitLab CI, CircleCI
- Upload `.unlighthouse/` folder ถ้าใช้ `--build-static`

### 6. Configuration Files

ใช้ config file สำหรับ complex setups

- ใช้ `unlighthouse.config.ts` สำหรับ TypeScript config
- ตั้งค่า `site` ถ้าไม่ใช้ environment variables
- ตั้งค่า `outputDir` สำหรับ custom report location
- ใช้ config file สำหรับ per-category budgets
- Config file optional ถ้าใช้ CLI arguments

### 7. Report Formats

เลือก format สำหรับ export results

- ใช้ `--build-static` สำหรับ HTML dashboard
- ใช้ `--reporter json` สำหรับ machine-readable output
- ใช้ `--reporter csv` หรือ `csvExpanded` สำหรับ stakeholders
- ใช้ `--reporter lighthouseServer` สำหรับ LHCI server upload
- Upload `.unlighthouse/` folder ไปยัง static host

## Expected Outcome

- Unlighthouse CLI ใช้งานได้ผ่าน `bunx`
- Scripts ใน package.json ตั้งค่าและใช้งานได้
- Environment variables ใช้งานได้
- CI integration สำเร็จด้วย scripts
- Performance budgets enforce ได้
- Reports generate ใน formats ที่ต้องการ
