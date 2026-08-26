---
name: update-readme-md
description: สร้าง README.md ครบถ้วนด้วย template มาตรฐานและข้อมูลจริงจากโปรเจกต์
related:
  - review-readme-md
  - analyze-project
  - translate-to-lang-en
  - report-markdown-table
  - validate
---

## Goal

สร้าง `README.md` และ `LICENSE.md` ครบถ้วนด้วย template มาตรฐานและข้อมูลจริงจากโปรเจกต์ สำหรับ root และ workspaces ใน monorepo

## Scope

ครอบคลุมการสร้าง `README.md` สำหรับ root และทุก workspace ใน monorepo และการตั้งค่า `LICENSE.md` พร้อม package manifest license field — idempotent: รันซ้ำได้โดยไม่เกิด side effects

## Execute

### 1. Prepare

> Goal: เตรียมข้อมูลก่อนเขียน README

ดู `references/prepare.md`

### 2. Read Sample READMEs

> Goal: อ่านตัวอย่าง README ตามมาตรฐาน

1. อ่าน `references/sample-readme-overview.md` เพื่อดูโครงสร้าง README ภาพรวม
2. อ่าน `references/sample-readme-workflows.md` สำหรับส่วน workflows
3. อ่าน `references/sample-readme-contribution.md` สำหรับส่วน contribution
4. อ่าน `references/sample-readme-releases.md` สำหรับส่วน releases
5. ระบุ sections ที่จำเป็นสำหรับ project ปัจจุบัน

### 3. Write Root README

> Goal: เขียน README หลักของ monorepo

ดู `references/write-readme.md`

### 4. Generate UI Sketch

> Goal: สร้าง UX/UI sketch สำหรับ README

ดู `references/generate-sketch.md`

### 5. Draw Usage ANSI

> Goal: วาด ANSI ประกอบสำหรับ Usage section แทนการ capture image

ดู `references/capture-images.md`

### 6. Update Workspaces READMEs

> Goal: อัปเดต README ทุก workspace ใน monorepo

ดู `references/update-workspaces.md`

### 7. Setup License

> Goal: ตั้งค่า LICENSE.md และ package manifest license field สำหรับ root

ดู `references/setup-license.md`

### 8. Validate

> Goal: ตรวจสอบคุณภาพและอัปเดต references

ดู `references/validate.md`

## Rules

### 1. Section Order And Format

จัดเรียง sections ตามลำดับต่อไปนี้:

- `Status Callout`: ด้านบนสุด — ใช้ `>` เฉพาะ status project เท่านั้น (ดู Rule `Status Callout`)
- `Hero Section`: `#` Title, Description, Badges (ชิดซ้าย, ไม่รวม License badge) — ไม่มี ANSI ใต้ badges
- `UI Sketch`: text codeblock แสดง UX/UI layout sketch จาก `/report-markdown-ansi` — วางด้านบน Get Started โดยไม่ต้องมี heading
- `## Get Started`: numbered steps ตรงๆ ไม่มี `###` subsection — แต่ละ step มี title + codeblock
- `## Features`: Markdown table 3 columns (Icon, Feature, Description) พร้อม colored icon จาก iconify CDN
- `## Usage`: `### Usage via ...` heading สำหรับแต่ละ access method (Web, API, CLI, SDK, TUI, etc.) — ครอบคลุมทุก ways ที่ user ใช้งานได้ — ใช้ ANSI drawing แทน image capture (ดู Rule `Usage ANSI Drawing`)
- `## Contributing`: มีเฉพาะถ้ามี `CONTRIBUTING.md` — สั้นๆ บอกให้อ่านที่ `CONTRIBUTING.md` (ดู Rule `Contributing Section`)
- `## License`: มีเฉพาะถ้ามี `LICENSE.md` — Section แยกด้านล่างสุด ไม่มี badge (root เท่านั้น)

### 2. Status Callout

- ใช้ `>` เฉพาะ status project เท่านั้น — ไม่ใส่ description หรือ emoji อื่น
- ค่าเริ่มต้น: `in development` (ถ้าไม่มี `CHANGELOG.md`)
- ถ้ามี `CHANGELOG.md` → เปลี่ยนเป็น `active`
- ใช้สี: `in development` = red, `active` = green
- รูปแบบ: `> ![Status](https://img.shields.io/badge/status-in_development-red)` หรือ `> ![Status](https://img.shields.io/badge/status-active-brightgreen)`

### 3. Report ANSI

- ไม่มี ANSI ใต้ logo/badges ใน Hero section — ANSI อยู่ที่ Usage section เท่านั้น
- ไม่มี ANSI codeblock ด้านล่างสุดของ README

### 4. Get Started Format

- ใช้ numbered list ตรงๆ ไม่มี `###` subsection
- แต่ละ step: `N. Title — context` ตามด้วย codeblock
- กระชับ ไม่มี description ยาว

### 5. Table Column Specs

- `Features`: 3 columns (Icon, Feature, Description) — ไม่มี Benefit และ Usage
- `Development > Tech Stack`: 4 columns (Layer, Technology, Version, Description)
- `Development > How It Work`: ภาพ diagram แบบ text codeblock
- `Development > Architecture`/`Workflows`/`Skills`: file structure codeblock (tree format with `#` comments)
- `Development > Scripts`: JSON codeblock พร้อม comment

### 6. Content Standards

- ทำ `/translate-to-lang-en` — README.md ทั้งหมดเป็นภาษาอังกฤษ
- ใช้ข้อมูลจริงจาก `/analyze-project`, code รันได้จริง
- ไม่ใช้ placeholder ยกเว้น banner image
- ไม่มี `## Information`, `## Key Concepts`, `## Tech Stack` เป็น section แยก

### 7. Features Writing Standards

- Coverage: ครอบคลุมทุก features จาก source code ไม่มีการข้าม
- Concise Rows: แต่ละ row กระชับ มี row ให้ครบ ไม่เขียน Description ยาว
- Business-Focused: เขียน business value ไม่ใช่แค่ technical details

### 8. Usage Content Types

- Web: text instructions บอกว่ากดอะไรตรงไหน + ANSI drawing แสดง layout (ดู Rule `Usage ANSI Drawing`)
- API: code block พร้อม import และ function call + references table (api, description, options, default)
- CLI: bash code block พร้อม command + ANSI drawing แสดง terminal output
- SDK: code block พร้อม install + import + usage + references table
- TUI: text instructions บอกว่ากด key อะไร + ANSI drawing แสดง TUI layout
- Desktop: text instructions บอกว่าเปิด app อย่างไร ใช้ menu อะไร + ANSI drawing
- Browser Extension: text instructions บอกว่า install จาก store ไหน ใช้ปุ่มอะไร + ANSI drawing

### 9. Usage ANSI Drawing

- ใช้ ANSI box-drawing characters วาด layout/output แทนการ capture image จริง
- ไม่ต้องใช้ `/capture-web` หรือ `/capture-terminal` สำหรับ README
- ทุกบรรทัดใน ANSI codeblock ต้องมีความยาวเท่ากัน — ใช้ space padding ให้ขอบขวาตรงกัน
- ใช้ ` ```text ` codeblock (ไม่ใช่ ` ```ansi ` เพื่อหลีกเลี่ยง color rendering ใน GitHub)
- ตรวจทุกบรรทัดว่ามี box-drawing border ครบทั้งซ้ายและขวา
- ความกว้างควรเท่ากันทุกบรรทัด — ใช้ fixed width เช่น 60 ตัวอักษร
- ตัวอย่าง:
  ```text
  ┌──────────────────────────────────────────────────────────┐
  │  gen-password — Password Generator                       │
  │                                                          │
  │  ┌────────────────────────────────────────────────────┐  │
  │  │  Click to randomize & copy             Length 16/32│  │
  │  │                                                    │  │
  │  │             Xk9$mP2#vQr7&nL4w                       │  │
  │  │                                                    │  │
  │  │  [========================o======================]  │  │
  │  │                     0 / 32                         │  │
  │  └────────────────────────────────────────────────────┘  │
  └──────────────────────────────────────────────────────────┘
  ```

### 10. API References (Inline)

- ไม่มี `## API References` section แยก
- ใส่ references table ใน `### Usage via ...` section ที่เกี่ยวข้อง
- คอลัมน์: api, description, options, default
- แสดงเฉพาะ public API เท่านั้น

### 11. Contributing Section

- เปลี่ยน `## Development` เป็น `## Contributing`
- มีเฉพาะถ้ามี `CONTRIBUTING.md` ใน root
- สั้นๆ 1-2 บรรทัด บอกให้อ่านที่ `CONTRIBUTING.md`
- ถ้าไม่มี `CONTRIBUTING.md` → ไม่มี `## Contributing` section
- ทำ `/update-contributing-md` ก่อนถ้าต้องการสร้าง

### 12. License Section

- มีเฉพาะถ้ามี `LICENSE.md` ใน root
- ถ้าไม่มี `LICENSE.md` → ไม่มี `## License` section

### 13. Icons

- ใช้ iconify CDN: `![icon](https://api.iconify.design/<set>:<name>.svg?color=%23<hex>&width=16)` — ต้องมี `?color=%23<hex>` เสมอ
- ห้ามใช้ emoji ในตาราง — ใช้ icon set: `mdi`, `lucide`, `material-symbols`, `tabler`, `ph`, `iconoir`
- คอลัมน์ Icon จัดกึ่งกลางด้วย `:---:` — แต่ละ icon ต้องมี color ที่แตกต่างกัน
- แนวทางสี: `1976d2` (ฟ้า/core), `388e3c` (เขียว/in scope), `d32f2f` (แดง/out scope), `f57c00` (ส้ม/warning), `7b1fa2` (ม่วง/UI), `c2185b` (ชมพู/features), `303f9f` (คราม/concepts), `0097a7` (ฟ้าขี้ม้า/CLI), `00796b` (เขียวเข้ม/build), `ffa000` (ทอง/content)
- ห้ามใช้ ANSI codeblock ใน README ยกเว้น Report ANSI ใน Hero section

### 14. License Selection

เลือก license ตามประเภทโปรเจกต์:

- MIT: สำหรับ libraries และ templates ที่ต้องการความเรียบง่าย
- Apache-2.0: สำหรับ projects ที่ต้องการ patent protection
- BSD-3-Clause: สำหรับ projects ที่ต้องการความยืดหยุ่น
- Proprietary: สำหรับ commercial products ที่ไม่เปิด source
- CC-BY-4.0: สำหรับ documentation

### 15. License Templates And Manifest

- ใช้ template มาตรฐานตาม SPDX identifier ของ license ที่เลือก (ภาษาอังกฤษ ไม่ต้องมีปี)
- MIT template สั้น: `MIT License\n\nCopyright (c) [COPYRIGHT HOLDER]\n\nPermission is hereby granted...`
- ไม่ระบุปีใน copyright — ระบุชื่อ organization หรือผู้ถือลิขสิทธิ์ชัดเจน
- `package.json`: `"license": "MIT"` หรือ SPDX identifier อื่นๆ
- `Cargo.toml`: `license = "MIT"` หรือ SPDX identifier อื่นๆ
- ใช้ SPDX identifier ที่ถูกต้องเสมอ ตรงกับ `LICENSE.md`

### 16. Example Template

ดู `templates/readme-template.md`

## Expected Outcome

- README.md ครบถ้วน ใช้ข้อมูลจริงจาก `/analyze-project` ไม่มี placeholder ยกเว้น banner image
- Section order: Status > Hero (no ANSI) > UI Sketch > Get Started > Features > Usage (with ANSI) > Contributing (if exists) > License (if exists)
- `## Get Started` ใช้ numbered list ตรงๆ ไม่มี `###` subsection
- `## Features` 3 columns (Icon, Feature, Description)
- `## Usage` ครอบคลุมทุก access methods พร้อม ANSI drawing (ไม่ใช้ capture images)
- ไม่มี `## API References` แยก — references อยู่ใน Usage section
- `## Contributing` มีเฉพาะถ้ามี `CONTRIBUTING.md`
- `## License` มีเฉพาะถ้ามี `LICENSE.md`
- ANSI box-drawing ทุกบรรทัดมีความยาวเท่ากัน (border ตรง)
- ไม่มี ANSI ใต้ logo/badges และไม่มี ANSI ด้านล่างสุด
- `LICENSE.md` ถูกต้องและครบถ้วน ใช้ template มาตรฐานตามประเภทโปรเจกต์
- License ใน package manifest ตรงกับ `LICENSE.md` ใช้ SPDX identifier ที่ถูกต้อง
