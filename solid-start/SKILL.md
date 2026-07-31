---
name: solid-start
description: "แนวทางการพัฒนา Solid Start ตาม best practices สำหรับ SolidJS meta-framework ที่มี CSR, SSR, SSG,..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

สร้าง SolidJS applications ด้วย CSR, SSR, SSG และ file-based routing


## Scope

ใช้สำหรับการพัฒนา SolidJS applications ที่ต้องการ TypeScript support, server functions และ multi-platform deployment


## Execute

### 1. Create Directory Structure

สร้าง folders ตามมาตรฐานที่แสดงใน Directory Structure

### 2. Write SKILL.md Index

เขียน index file ตามมาตรฐาน `follow-write-skills`

### 3. Research Before Writing

ค้นหาข้อมูลเกี่ยวกับ Solid Start

- ทำตาม workflow `deep-research` สำหรับค้นหาข้อมูลจาก multiple sources
- ค้นหาใน package registries ตามภาษาที่เกี่ยวข้อง
- ใช้ DeepWiki สำหรับ GitHub repositories
- ใช้ Context7 สำหรับ library documentation
- ตรวจสอบ source reputation และ information freshness
- สรุป findings ที่สำคัญก่อนเขียน

### 4. Write Content Files

เขียน content files ใน learn/guide/, learn/key-concepts/, learn/principles/ folders ตามมาตรฐาน

- ทำตามมาตรฐาน `follow-write-skills` สำหรับทุกไฟล์
- เวลาเขียนเกี่ยวกับการติดตั้ง ให้ใช้ `bun add` หรือ `bun add -D` แทน `bun install` เสมอ
- **แต่ละ .md ใต้ heading ต่างๆ ต้องเขียนอธิบายให้เข้าใจ**
  - อธิบายความหมายของแต่ละ heading อย่างชัดเจน
  - ให้ตัวอย่างที่เข้าใจง่ายเมื่อจำเป็น
  - ใช้ประโยคที่สั้น กระชับ และตรงประเด็น
  - หลีกเลี่ยงการใช้คำศัพท์ที่ซับซ้อนโดยไม่จำเป็น
  - อธิบาย "ทำไม" และ "อย่างไร" ให้เข้าใจ

### 5. Write Content Coverage

เขียน content ครอบคลุมทุก features, APIs, และ use cases

- ทำตาม workflow `/write-content-coverage` สำหรับเขียน content ครอบคลุม
- วิเคราะห์ features ที่ยังไม่มี content
- เขียน guides สำหรับ features ที่ขาด
- ตรวจสอบ content ครอบคลุมทุก aspects

### 6. Improve Correctness

ปรับปรุงความถูกต้องของ content

- ทำตาม workflow `/improve-correctness` สำหรับตรวจสอบและปรับปรุง
- ตรวจสอบความถูกต้องของข้อมูล
- แก้ไข issues ตาม priority (Critical, High, Medium, Low)
- ตรวจสอบว่าไม่มี regressions
- อัปเดต references ที่เกี่ยวข้อง

### 7. Validate And Verify

ตรวจสอบความถูกต้อง

- ตรวจสอบ references ถูกต้อง
- ตรวจสอบว่าไม่มี conflicts ระหว่าง skills
- ตรวจสอบโครงสร้างตรงกับมาตรฐาน
- ตรวจสอบ content ครอบคลุมทุก aspects



## Rules

### Structure And Consistency

- ทำตามมาตรฐาน `follow-write-skills` สำหรับโครงสร้างและ consistency
- ทุก `SKILL.md` ต้องมี frontmatter: `title`, `description`, `auto_execution_mode: 3`
- ทุก `SKILL.md` ต้องมี sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- Goal สอดคล้องกับ skill name, Execute สอดคล้องกับ Goal และ Rules
- Expected Outcome สอดคล้องกับ Goal
- ใช้คำศัพท์สม่ำเสมอ

### Installation

- ใช้ `bun create solid@latest` สำหรับสร้าง project
- ใช้ `bun add` หรือ `bun add -D` แทน `bun install` เสมอ

### Development

- ใช้ file-based routing ใน `src/routes/` directory
- ใช้ server functions สำหรับ API routes
- Build สำหรับ CSR, SSR หรือ SSG ตาม requirements

### Content And Style

- ทุกไฟล์ `.md` เขียนเป็นภาษาไทย ยกเว้น headings และศัพท์เทคนิค
- ใช้ตารางสรุปข้อมูลที่เปรียบเทียบได้เมื่อเหมาะสม
- ใช้ `codeblock` สำหรับ code examples, configuration, หรือ commands
- ใช้ `ansi markdown diagrams` สำหรับ flow, architecture, หรือ how-it-works
- **แต่ละ .md ใต้ heading ต่างๆ ต้องเขียนอธิบายให้เข้าใจ**
  - อธิบายความหมายของแต่ละ heading อย่างชัดเจน
  - ให้ตัวอย่างที่เข้าใจง่ายเมื่อจำเป็น
  - ใช้ประโยคที่สั้น กระชับ และตรงประเด็น
  - หลีกเลี่ยงการใช้คำศัพท์ที่ซับซ้อนโดยไม่จำเป็น
  - อธิบาย "ทำไม" และ "อย่างไร" ให้เข้าใจ

### Code Style

- ใช้ backticks สำหรับ `createServerData$()`, `createServerAction$()`, commands
- ใช้ code blocks สำหรับ component examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture

### File Organization

- ใช้ชื่อสื่อความหมายโดยตรง ไม่ใช้ prefix ชื่อ skill
- ใช้ `kebab-case` เสมอ ชื่อไฟล์ต้องสอดคล้องกับเนื้อหา
- แต่ละไฟล์ต้องไม่เกิน 250 บรรทัด ถ้าเกินให้ refactor แยกไฟล์
- ถ้าไฟล์ยาวเกิน ให้แยกเป็น folder และไฟล์ย่อย (เช่น `best-practices/` พร้อม `index.md`)
- ทำตาม Execute ตามลำดับเสมอ

### Scripts

- สร้าง scripts ใน `scripts/temp/` ที่ root workspace เท่านั้น
- ใช้ Bun native APIs, pwsh, หรือ ast-grep ตามความเหมาะสม
- ทำตามมาตรฐาน `use-scripts`
- ลบ scripts หลังใช้งาน


## Expected Outcome

- SolidJS applications ด้วย CSR/SSR/SSG
- File-based routing และ TypeScript support
- Multi-platform deployment
- Server functions สำหรับ API routes
- Devin Skills ที่มีโครงสร้างสม่ำเสมอตามมาตรฐาน
- Folder structure ที่เป็นระบบและ deterministic
- SKILL.md index ที่ครบถ้วนและอ่านง่าย
- File naming ที่สอดคล้องกันทั่วทั้ง skill
- Content ที่มีคุณภาพและถูกต้องตามมาตรฐาน
- References ที่ถูกต้องและอ้างอิงไปยังไฟล์ที่มีอยู่จริง
- Skills ที่ maintainable และ easy to navigate
