---
name: research-setup
description: ค้นหา setup, config, CI และ integration ของ tool/service จากหลายแหล่ง
argument-hint: "[tool-or-service]"
related:
  - deep-research
  - learn-from-web
  - follow-best-practice
  - research-dependencies
  - setup-cicd
  - follow-tool-usage
  - follow-my-tech-stack
  - check-reference
---

## Goal

ค้นหาและสรุป setup, config, CI/CD, integration และ boilerplate ของ tool, framework หรือ service ทีต้องการติดตั้ง โดย cross-check จากหลายแหล่งบน internet

## Scope

ใช้สำหรับงานทีต้อง research setup ใหม่, migration, หรือ config ทีซับซ้อน เช่น การติดตั้ง tool, ตั้งค่า CI/CD, เชื่อมต่อ service, หรือหา boilerplate ทีถูกต้อง

## Execute

### 1. Clarify Setup Target

> Goal: ระบุเป้าหมายและขอบเขตของ setup

1. ระบุ tool, framework, service หรือ platform ทีต้อง research
2. ระบุ version หรือ channel ทีต้องการ (stable, latest, LTS, preview)
3. ระบุ platform/ecosystem (Bun, Node, Rust, Go, Python, Flutter, Cloudflare, Vercel, ฯลฯ)
4. ระบุ scope: local setup, CI/CD, deployment, integration, monorepo, shared config
5. ระบุ constraints เดิม เช่น existing tools, OS, budget, security policy

### 2. Search Official Sources

> Goal: เก็บข้อมูลหลักจาก official documentation

1. ใช้ `/learn-from-web` หรือ `crw_scrape` เพื่อหา official docs
2. เริ่มจาก getting started, quickstart, installation, setup guide
3. เก็บลิงก์ official docs และคำสั่่ง setup หลัก
4. ถ้ามี CLI tool → บันทึกคำสั่่ง install และ version ทีแนะนำ

### 3. Search Config And CI Examples

> Goal: หา config files และ CI templates จริงจาก community

1. ใช้ `web_search` หรือ `crw_scrape` หา config templates (e.g. `wrangler.toml`, `.github/workflows`, `biome.json`, `tsconfig.json`)
2. ค้นหา GitHub repositories ทีมี setup คล้ายกัน (ใช้ `search-in-github-star` หรือ `explore-github-trending`)
3. เก็บตัวอย่าง CI/CD pipeline ทีถูกต้องและ up-to-date
4. ระบุ environment variables, secrets และ permissions ทีต้องใช้

### 4. Cross-check Multiple Sources

> Goal: ตรวจสอบความถูกต้องก่อนสรุป

1. ใช้ `/deep-research` เมื่อต้องเปรียบเทียบหลายแหล่ง
2. ใช้ `context7` หรือ `deepwiki` สำหรับ libraries/frameworks
3. ตรวจสอบวันทีของบทความ บล็อก หรือ release notes
4. หา known issues, breaking changes หรือ migration guides

### 5. Synthesize Setup Plan

> Goal: รวมข้อมูลเป็นแผน setup ทีทำตามได้

1. สรุป prerequisites และขั้นตอนติดตั้ง
2. รายการ config files ที่ต้องสร้าง/แก้ไข พร้อมตัวอย่าง
3. คำสั่่งหรือ scripts ทีต้องรัน
4. CI/CD steps ถ้ามี
5. Common pitfalls และวิธีแก้ไข
6. Alternatives ถ้ามีหลายทางเลือก

### 6. Save And Report Findings

> Goal: ส่งมอบข้อมูลให้ใช้ต่อได้

1. ถ้าพบข้อมูลยาวหรือซับซ้อน → สร้าง `references/setup-<topic>.md`
2. ทำ `/report-session-status` หรือ `/report-table` สรุปผล
3. ระบุ source links ทั้งหมดทีใช้อ้างอิง
4. ถ้าข้อมูลไม่แน่นอน → ระบุเป็น assumption หรือข้อควรระวัง

## Rules

- ใช้ official documentation เป็นแหล่งหลักเสมอ
- cross-check อย่างน้อย 2-3 แหล่งก่อนสรุป
- แยกแยะระหว่าง stable steps กับ experimental/deprecated steps
- ระบุ version, platform และ constraints เสมอ
- ไม่ copy-paste config โดยไม่ระบุ source
- ถ้า setup เกี่ยวกับ dependencies → ใช้ `/research-dependencies` ก่อน

- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /follow-tool-usage ถ้าจำเป็น
- ใช้ /follow-my-tech-stack ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

## Expected Outcome

รายงาน setup ทีครบถ้วน ประกอบด้วย prerequisites, config files, commands, CI/CD samples, common pitfalls, alternatives และแหล่งอ้างอิง พร้อมใช้งานได้ทันที
