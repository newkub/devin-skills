---
name: update-github-metadata
description: อัปเดต GitHub repo metadata (description, homepage, topics, default branch) ให้ตรงกับ project จริง
argument-hint: "[owner/repo]"
related:
  - git-push
  - update-project
  - follow-dot-github
  - list-github-repo
  - create-github-repo
  - view-repo
  - check-reference
  - ask-me
---

## Goal

อัปเดต GitHub repository metadata ให้สะท้อน project จริง ครบทั้ง description, homepage, topics, และ default branch

## Scope

ใช้หลัง push หรือหลัง `update-project` เพื่อ sync GitHub repo metadata กับเนื้อหาใน `README.md`, `package.json` และ `AGENTS.md` ครอบคลุบเฉพาะ metadata ที่ตั้งผ่าน `gh repo edit` ไม่แก้ไข code, docs หรือ license

## Execute

### 1. Prepare

> Goal: ตรวจสภาพแวดล้อมก่อนอ่านไฟล์

1. ตรวจสอบว่า `gh` พร้อมใช้งาน โดยรัน `gh auth status`
2. ถ้า `gh` ไม่ได้ login → stop และ report
3. ระบุ `<owner/repo>` จาก argument, `package.json` field `repository.url` หรือ remote `origin` (`git remote get-url origin`)

### 2. Gather Project Info

> Goal: รวมข้อมูลจาก project files เป้นค่าทีตั้งได้

1. อ่าน `README.md` บรรทัดแรกที่ไม่ใช่ badge (`>`) หรือ heading เป็น `description` สั้น
2. อ่าน `package.json` fields: `name`, `description`, `homepage`, `repository.url`, `license`
3. อ่าน `AGENTS.md` ส่วน `### Architecture`, `### Platform` หรือ `### Skills` เพื่อระบุ `topics` จาก tech stack
4. ถ้า `package.json` ไม่มี `homepage` → ค้นหา `VITE_APP_URL`, `APP_URL` หรือ production URL ใน `wrangler.toml`, `.env.example`, หรือ `AGENTS.md`
5. ถ้าไม่มี `README.md` หรือ `package.json` → stop และ report

### 3. Determine Desired Metadata

> Goal: สร้าง target metadata ทีจะตั้ง

1. `description` = บรรทัดสั้นที่สุดจาก `README.md` หรือ `package.json.description` (ไม่เกิน 350 ตัวอักษร)
2. `homepageUrl` = `package.json.homepage` หรือ production URL ที่พบใน config
3. `defaultBranchRef` = `main` (ถ้า project ใช้ branch อื่น ให้ใช้ค่านั้น)
4. `topics` = ไม่เกิน 10 topics จาก tech stack เรียงลำดับ: framework > language > platform > tool > service > domain
5. ไม่เปลี่ยน `license` — ถ้า `licenseInfo` ไม่ตรงกับ `package.json.license` ให้ report ไว้แต่ไม่อัปเดต

### 4. Check Current Metadata

> Goal: ทราบ metadata ปัจจุบันก่อนอัปเดต

1. รัน `gh repo view <owner/repo> --json defaultBranchRef,description,homepageUrl,licenseInfo,repositoryTopics,isPrivate`
2. ถ้า `repositoryTopics` เป็น `null` ให้ถือว่า topic list ว่าง
3. เปรียบเทียบ current กับ desired
4. ระบุ fields และ topics ที่ต้องอัปเดต

### 5. Update Metadata

> Goal: ตั้งค่า metadata ให้ตรงกับ project

1. ถ้า `description` เปลี่ยน → รัน `gh repo edit <owner/repo> --description "<description>"`
2. ถ้า `homepageUrl` เปลี่ยน → รัน `gh repo edit <owner/repo> --homepage "<homepage-url>"`
3. ถ้า `defaultBranchRef` ไม่ตรง → รัน `gh repo edit <owner/repo> --default-branch <default-branch>`
4. คำนวณ topic diff:
   - `topics_to_add` = desired topics - current topics
   - `topics_to_remove` = current topics - desired topics
5. ถ้า `topics_to_add` ไม่ว่าง → รัน `gh repo edit <owner/repo> --add-topic <t1> --add-topic <t2> ...` สำหรับแต่ละ topic
6. ถ้า `topics_to_remove` ไม่ว่าง → รัน `gh repo edit <owner/repo> --remove-topic <t1> --remove-topic <t2> ...`
7. ถ้า repo เป็น public (`isPrivate: false`) → รัน `gh repo edit <owner/repo> --enable-issues=true --enable-wiki=false`

### 6. Verify

> Goal: ยืนยัน metadata อัปเดตสำเร็จ

1. รัน `gh repo view <owner/repo> --json defaultBranchRef,description,homepageUrl,licenseInfo,repositoryTopics`
2. เปรียบเทียบผลกับ desired metadata
3. ถ้าไม่ตรง → retry ครั้งเดียว ถ้ายังไม่ตรง → report

### 7. Report

> Goal: รายงานผลกระชับ

1. สร้างตาราง Before/After ของ fields ที่เปลี่ยน
2. ระบุ topics ที่เพิ่ม/ลบ
3. ระบุ fields ที่ไม่ต้องอัปเดต
4. รายงานใน chat ไม่สร้างไฟล์

## Rules

### 1. Source Of Truth

- `README.md` บรรทัดแรกไม่ใช่ badge เป็น source หลักของ `description`
- `package.json` เป็น source ของ `homepage` (fallback จาก config/deploy)
- `AGENTS.md` `### Architecture`, `### Platform` และ `package.json` dependencies เป็น source ของ `topics`
- ไม่เปลี่ยน `license` — ถ้าต่างจาก `package.json.license` ให้ report

### 2. Topic Selection

- ห้ามใส่ generic topics เช่น `awesome`, `cool`, `project`
- เลือก topics ที่เกี่ยวข้องกับ tech stack จริง และพบได้บน GitHub
- จำกัดไม่เกิน 10 topics
- ลำดับความสำคัญ: framework > language > platform > tool > service > domain

### 3. Idempotent

- ตรวจ current metadata ก่อนเสมอ
- คำนวณ diff ก่อน `add`/`remove` topics
- ไม่อัปเดต field ใดๆ ถ้าค่าเหมือนเดิม
- ถ้าทุก field ถูกต้อง → report ว่าไม่ต้องอัปเดต ไม่ถือว่า error

### 4. Safety

- ไม่ลบ license ที่ตั้งไว้
- ไม่เปลี่ยน visibility ของ repo (public/private)
- ไม่ rename repo
- ถ้า `gh` ไม่พร้อม → หยุดและ report

### 5. Related Actions

- ใช้ `/git-push` ถ้าจำเป็นต้อง push ก่อน
- ใช้ `/follow-dot-github` ถ้าจำเป็นต้องตรวจ GitHub settings
- ใช้ `/list-github-repo` ถ้าจำเป็นต้อง list repos
- ใช้ `/create-github-repo` ถ้า repo ยังไม่มี
- ใช้ `/ask-me` ถ้าไม่แน่ใจเรื่อง topics หรือ homepage

## Expected Outcome

- GitHub repo metadata ตรงกับ `README.md` และ `package.json`
- description กระชับ สะท้อน project จริง
- homepage ชี้ไปยัง production URL หรือ docs
- topics ครบและเกี่ยวข้องกับ tech stack จริง
- default branch เป็น `main` (หรือค่าที่ project กำหนด)
- รายงาน Before/After ใน chat
