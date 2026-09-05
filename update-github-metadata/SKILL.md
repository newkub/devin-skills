---
name: update-github-metadata
description: อัปเดต GitHub repo metadata (description, homepage, topics, license, default branch)
argument-hint: "[scope]"
related:
  - git-push
  - update-project
  - follow-dot-github
  - list-github-repo
  - create-github-repo
  - view-repo
---

## Goal

อัปเดต GitHub repository metadata ให้สะท้อน project จริง ครบทั้ง description, homepage, topics, license และ default branch

## Scope

ใช้หลัง push หรือหลัง `update-project` เพื่อ sync GitHub repo metadata กับเนื้อหาใน `README.md` และ `package.json` ครอบคลุมเฉพาะ metadata ที่ตั้งผ่าน `gh repo edit` ไม่แก้ไข code หรือ docs

## Execute

### 1. Gather Project Info

> Goal: รวมข้อมูลจาก project files เพื่อใช้เป็น metadata

1. อ่าน `README.md` บรรทัดแรกที่ไม่ใช่ badge เป็น description สั้น
2. อ่าน `package.json` fields: `name`, `description`, `homepage`, `repository`, `license`
3. อ่าน `AGENTS.md` ส่วน `## Tech Stack` เพื่อระบุ topics จาก stack จริง
4. ถ้าไม่มี `README.md` หรือ `package.json` → หยุดและ report

### 2. Check Current Metadata

> Goal: ทราบ metadata ปัจจุบันก่อนอัปเดต

1. รัน `gh repo view <owner/repo> --json description,homepageUrl,repositoryTopics,licenseInfo,defaultBranchRef`
2. เปรียบเทียบกับข้อมูลจาก Step 1
3. ระบุ fields ที่ต้องอัปเดต
4. ถ้าต้องการดู metadata สรุปก่อนอัปเดต ให้ทำ `/view-repo`

### 3. Update Metadata

> Goal: ตั้งค่า metadata ให้ตรงกับ project

1. รัน `gh repo edit <owner/repo> --description "<description>"` ถ้า description เปลี่ยน
2. รัน `gh repo edit <owner/repo> --homepage "<homepage-url>"` ถ้า homepage เปลี่ยน
3. รัน `gh repo edit <owner/repo> --add-topic <topic>` สำหรับแต่ละ topic จาก tech stack
4. รัน `gh repo edit <owner/repo> --remove-topic <topic>` สำหรับ topic เก่าที่ไม่เกี่ยวข้อง
5. รัน `gh repo edit <owner/repo> --default-branch main` ถ้า default branch ไม่ใช่ `main`
6. ถ้าเป็น public repo → รัน `gh repo edit <owner/repo> --enable-issues=true --enable-wiki=false`

### 4. Verify

> Goal: ยืนยัน metadata อัปเดตสำเร็จ

1. รัน `gh repo view <owner/repo> --json description,homepageUrl,repositoryTopics` อีกครั้ง
2. เปรียบเทียบกับค่าที่ตั้ง
3. ถ้าไม่ตรง → retry ครั้งเดียว ถ้ายังไม่ตรง → report

### 5. Report

> Goal: รายงานผลกระชับ

1. สร้างตาราง Before/After ของ fields ที่เปลี่ยน
2. ระบุ topics ที่เพิ่ม/ลบ
3. รายงานใน chat ไม่สร้างไฟล์

## Rules

### 1. Source Of Truth

- `README.md` และ `package.json` เป็น source of truth สำหรับ description และ homepage
- topics มาจาก tech stack จริงใน `AGENTS.md` หรือ `package.json` dependencies
- ห้ามใส่ generic topics เช่น `awesome`, `cool`, `project`
- ใช้ topics ที่ค้นพบได้บน GitHub explore

### 2. Idempotent

- ตรวจ current metadata ก่อนเสมอ ไม่อัปเดตถ้าค่าเหมือนเดิม
- ถ้าทุก field ถูกต้อง → report ว่าไม่ต้องอัปเดต ไม่ถือว่า error

### 3. Safety

- ไม่ลบ license ที่ตั้งไว้
- ไม่เปลี่ยน visibility ของ repo (public/private)
- ไม่ rename repo
- ถ้า `gh` ไม่พร้อม → หยุดและ report

### 4. Topic Limits

- GitHub จำกัด 20 topics ต่อ repo
- เลือก topics ที่เกี่ยวข้องที่สุดไม่เกิน 10
- ลำดับความสำคัญ: framework > language > platform > tool > domain

- ใช้ /git-push ถ้าจำเป็น
- ใช้ /follow-dot-github ถ้าจำเป็น
- ใช้ /list-github-repo ถ้าจำเป็น
- ใช้ /create-github-repo ถ้าจำเป็น

## Expected Outcome

- GitHub repo metadata ตรงกับ `README.md` และ `package.json`
- description กระชับ สะท้อน project จริง
- homepage ชี้ไปยัง production URL หรือ docs
- topics ครบและเกี่ยวข้องกับ tech stack จริง
- default branch เป็น `main`
- รายงาน Before/After ใน chat
