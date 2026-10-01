---
name: deep-research-setup
description: ค้นหา setup, config, CI และ integration ของ tool/service จากหลายแหล่ง — synthesize เป็น setup plan
argument-hint: "[tool-or-service]"
related:
  - deep-research
  - research-setup-integrations
  - setup-cicd
  - follow-tool-usage
  - follow-best-practice
  - check-reference
  - report-progress
  - report
---

## Goal

ค้นหาและสรุป setup, config, CI/CD และ boilerplate ของ tool, framework หรือ service ที่ต้องติดตั้ง โดย cross-check จากหลายแหล่ง (merged `/research-setup`)

## Scope

ใช้สำหรับ research setup ใหม่, migration หรือ config ที่ซับซ้อน — ติดตั้ง tool, ตั้งค่า CI/CD, เชื่อมต่อ service, หา boilerplate ที่ถูกต้อง — เลือก plugins/extensions/providers เฉพาะ → `/research-setup-integrations`

## Execute

### 1. Clarify Setup Target

> Goal: ระบุเป้าหมายและขอบเขตของ setup

1. ระบุ tool/framework/service/platform + version channel (stable, latest, LTS, preview)
2. ระบุ platform/ecosystem (Bun, Node, Rust, Go, Python, Flutter, Cloudflare, Vercel, ฯลฯ)
3. ระบุ scope: local setup, CI/CD, deployment, integration, monorepo, shared config
4. ระบุ constraints เดิม: existing tools, OS, budget, security policy

### 2. Search Official Sources

> Goal: เก็บข้อมูลหลักจาก official documentation

1. ใช้ `/learn-from-web` หรือ `crw_scrape` เพื่อหา official docs — เริ่มจาก getting started, quickstart, installation, setup guide
2. เก็บลิงก์ official docs และคำสั่ง setup หลัก — CLI tool → บันทึกคำสั่ง install + version ที่แนะนำ
3. ถ้าต้องเลือก integrations/plugins/extensions ของ tool → ส่งต่อ `/research-setup-integrations`

### 3. Search Config And CI Examples

> Goal: หา config files และ CI templates จริงจาก community

1. ใช้ `web_search` หรือ `crw_scrape` หา config templates (`wrangler.toml`, `.github/workflows`, `biome.json`, `tsconfig.json`)
2. ค้นหา GitHub repos ที่มี setup คล้ายกัน (`/search`, `/explore-github-trending`)
3. เก็บตัวอย่าง CI/CD pipeline ที่ถูกต้องและ up-to-date — ระบุ env vars, secrets, permissions ที่ต้องใช้

### 4. Cross-check Multiple Sources

> Goal: ตรวจสอบความถูกต้องก่อนสรุป

1. กลับไป `/deep-research` (general pipeline) เมื่อต้องเปรียบเทียบหลายแหล่งลึก
2. ใช้ `context7` หรือ `deepwiki` สำหรับ libraries/frameworks
3. ตรวจสอบวันที่ของบทความ/release notes — หา known issues, breaking changes, migration guides

### 5. Synthesize Setup Plan

> Goal: รวมข้อมูลเป็นแผน setup ที่ทำตามได้

1. สรุป prerequisites + ขั้นตอนติดตั้ง
2. รายการ config files ที่ต้องสร้าง/แก้ไข พร้อมตัวอย่าง
3. คำสั่ง/scripts ที่ต้องรัน + CI/CD steps ถ้ามี
4. Common pitfalls + วิธีแก้ไข + alternatives ถ้ามีหลายทางเลือก

### 6. Save And Report Findings

> Goal: ส่งมอบข้อมูลให้ใช้ต่อได้

1. ถ้าพบข้อมูลยาว/ซับซ้อน → สร้าง `references/setup-<topic>.md`
2. ทำ `/report-progress` หรือ `/report` สรุปผล + source links ทั้งหมด
3. ถ้าข้อมูลไม่แน่นอน → ระบุเป็น assumption หรือข้อควรระวัง

## Rules

- Official documentation เป็นแหล่งหลักเสมอ — cross-check ≥ 2-3 แหล่งก่อนสรุป
- แยกแยะ stable steps กับ experimental/deprecated — ไม่ copy-paste config โดยไม่ระบุ source
- ระบุ version, platform, constraints เสมอ — dependencies research → `/deep-research dependencies`
- ใช้ `/setup-cicd`, `/follow-tool-usage`, `/follow-best-practice`, `/check-reference` ถ้าจำเป็น

## Expected Outcome

- รายงาน setup ครบถ้วน: prerequisites, config files, commands, CI/CD samples, pitfalls, alternatives + แหล่งอ้างอิง
