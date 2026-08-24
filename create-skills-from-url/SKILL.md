---
name: create-skills-from-url
description: สร้าง Devin skills จาก URL หรือ domain โดยดึงเนื้อหา จัดกลุ่ม และสร้าง subskills
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
  - webfetch
  - web_search
  - run_subagent
  - read_subagent
triggers:
  - user
  - model
related:
  - check-reference
  - follow-devin-skills-md
  - follow-write-devin-skills
  - git-commit
  - learn-from-web
  - report
  - use-scripts
  - validate
---

## Goal

สร้าง skill ใหม่หรือกลุ่ม subskills จาก URL หรือ domain ที user ให้มา โดยดึงเนื้อหา วิเคราะห์ จัดกลุ่ม และเขียน skill ตามมาตรฐาน

## Scope

รับได้ทั้ง URL หน้าเดียว (เช่น `https://developers.cloudflare.com/workers/ci-cd/`) หรือ domain ทั่วไป โดยจะสร้าง parent skill และ subskills ภายใต้ `subskills/<domain>/<subskill>/SKILL.md`

## Execute

### 1. Get Url Or Domain

> Goal: รู้ URL หรือ domain ทีต้องสร้าง skills

1. ถ้า user ส่ง URL มา → ใช้ URL นั้น
2. ถ้า user ส่ง domain หรือ root website → ใช้ `/web_search` หาหน้าสำคัญทั้งหมด
3. ถ้าไม่มี่อะไรเลย → ทำ `/ask-me` เพื่อขอ URL หรือ domain
4. ถ้าต้องการ crawl ลึก → ใช้ `/learn-from-web` หรือ `/use-scripts` ช่วยดึง links

### 2. Fetch Content

> Goal: ดึงเนื้อหาจาก URL

1. ใช้ `/webfetch` ดึงเนื้อหาหน้าเดียว
2. ถ้ามีหลาย URL → ใช้ `run_subagent` ดึงขนานกัน โดยละ 10 URLs ต่อ batch
3. สรุปเนื้อหาแต่ละหน้าเป็น bullet: หัวข้อหลัก, commands, config, examples

### 3. Group And Name

> Goal: จัดกลุ่มเนื้อหาเป็น subskills

1. อ่าน `subskills/<domain>/<subskill>/SKILL.md` pattern จาก `/follow-write-devin-skills`
2. จัดกลุ่ม topics ตามลักษณะงาน: `setup-*`, `update-*`, `improve-*`, `follow-*`, `use-*`, `review-*`, `write-*`
3. ตั้งชื่อ subskill เป็น `<domain>-<subskill>` เช่น `cloudflare-follow-runtime-api`
4. สร้าง parent skill `<domain>-subskills` โดยมี `related` ชี้ทุก subskill

### 4. Create Subskills

> Goal: เขียน subskills ตาม content

1. สร้าง directory `subskills/<domain>/<subskill>/` สำหรับแต่ละ group
2. เขียน `SKILL.md` ในแต่ละ subskill โดยทำตาม `/follow-write-devin-skills`
3. ทุก subskill ต้องมี `name`, `description` ≤100, `allowed-tools`, `related`
4. ห้ามเกิน 250 บรรทัด ถ้าเกินให้ย่อหรือแยก subskill เพิ่ม

### 5. Create Parent Skill

> Goal: สร้าง orchestrator skill สำหรับ domain

1. สร้าง `<domain>-subskills/SKILL.md`
2. `## Execute` ระบุให้ `read` `subskills/<domain>/<subskill>/SKILL.md` ตาม subskill ที user ระบุ
3. `related` ครบทุก subskill
4. รองรับ syntax `<domain>-subskills[<subskill>, ...]` โดยอ่านจาก prompt และ `glob`

### 6. Validate And Commit

> Goal: ตรวจสอบก่อน commit

1. ทำ `/validate` เพื่อตรวจ frontmatter, sections, ความยาว
2. ทำ `/check-reference` เพื่อตรวจ `related`
3. ทำ `/git-commit` เพื่อ commit skills ใหม่
4. ทำ `/report` พร้อมรายชื่อ skills ทีสร้าง

## Rules

### 1. Domain And Naming

- ใช้ domain เป็นชื่อ parent skill
- subskill ชื่อ `<domain>-<subskill>` เสมอ
- directory `subskills/<domain>/<subskill>/` ตรงกับชื่อ `name`
- ไม่สร้าง duplicate กับ skills ทีมีอยู่

### 2. Content Quality

- เนื้อหาต้องมาจาก official docs หรือ primary source
- แปลง examples ให้สอดคล้องกับ project context ที user ระบุ
- ใช้ backticks สำหรับ commands, paths, skill names
- ไม่ใส่ TODO/MOCK/placeholder

### 3. Crawl Discipline

- ถ้าไม่มี `/follow-crw` ให้ใช้ `/web_search` + `/webfetch` แทน
- ไม่ crawl เกิน 20 URLs ต่อ batch ถ้าไม่จำเป็น
- ถ้า crawl ล้มเหลว → รายงานและหยุด

### 4. Minimal First

- เริ่มจาก parent + 3-5 subskills ก่อน
- ขยายเพิ่มเมื่อ user ต้องการ
- ไม่สร้าง skills จนกว่า user ยืนยัน

## Expected Outcome

- parent skill `<domain>-subskills/SKILL.md` ถูกสร้าง
- subskills อยู่ใน `subskills/<domain>/<subskill>/SKILL.md`
- ทุก skill ผ่าน `/follow-devin-skills-md`
- `related` ถูกต้อง ไม่มี broken references
- commit สำเร็จพร้อม report
