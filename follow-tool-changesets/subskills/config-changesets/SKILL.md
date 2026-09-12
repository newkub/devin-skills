---
name: follow-tool-changesets-config-changesets
description: ตั้งค่า `.changeset/config.json` — access, baseBranch, linked/fixed packages
argument-hint: "[scope]"
related:
  - setup-cicd
  - run-release
  - follow-secret-manager
---

## Goal

ตั้งค่า `.changeset/config.json` ให้ตรง versioning policy ของ project — `access`, `baseBranch`, `fixed`/`linked` packages, `updateInternalDependencies`, `ignore` — โดย merge ไม่ clobber

## Scope

ใช้เมื่อต้องแก้ Changesets config ที่มีอยู่ — install/init อยู่ใน `subskills/setup-changesets/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. อ่าน `.changeset/config.json` — บันทึก keys ปัจจุบัน
2. อ่าน root `package.json` workspaces — list ทุก publishable package
3. ถ้าไม่มี `.changeset/` → ทำ `subskills/setup-changesets/SKILL.md` ก่อน

### 2. Core Options

> Goal: ตั้งค่า core keys ให้ถูกต้อง

1. `"$schema"` — ชี้ไป schema ของ `@changesets/config` ที่ตรงกับ installed major version
2. `baseBranch` — default `"main"` ตาม branch จริงของ repo
3. `access` — `"restricted"` สำหรับ scoped/private packages, `"public"` สำหรับ public npm packages
4. `updateInternalDependencies` — `"patch"` เพื่อ bump internal deps เมื่อ patch เปลี่ยน
5. `commit` — `false` ให้ git จัดการ commit เอง หรือ `true`/`@changesets/cli/commit` ตาม workflow
6. `ignore` — list packages ที่ไม่ publish (private apps, tooling packages)
7. `changelog` — default `"@changesets/cli/changelog"` หรือ custom changelog generator ถ้าต้องการ PR links

### 3. Linked And Fixed Packages

> Goal: กำหนด version coupling ของ packages

1. `fixed` — array of package groups ที่ version เดียวกันเสมอ (bump พร้อมกันและ version เท่ากัน) เช่น `[["@scope/a", "@scope/b"]]`
2. `linked` — array of package groups ที่ bump พร้อมกันแต่ versions อาจต่างกัน
3. เลือก `fixed` เมื่อ packages ต้อง release lockstep; `linked` เมื่อ coordinate แต่ versions ต่างได้
4. ตรวจว่าทุก package ใน groups มีอยู่จริงใน workspaces — typo = config error

### 4. Verify

> Goal: ตรวจ config ถูกต้อง

1. รัน `bunx changeset status` — config ต้อง parse ผ่านและแสดง pending changesets
2. สร้าง changeset ทดสอบแล้วรัน `bunx changeset version` บน branch แยก — ตรวจ fixed/linked bumps ทำงานตามที่ตั้งใจ (revert หลังตรวจ)
3. ถ้าพัง → revert keys ที่แก้แล้ว report diff ด้วย `/report-before-after`

## Rules

### 1. Merge Discipline

- แก้เฉพาะ keys ที่จำเป็น — ห้าม overwrite ทั้งไฟล์
- เก็บ `$schema` ตรงกับ installed `@changesets/cli` major version

### 2. Version Coupling

- `fixed` = same version เสมอ; `linked` = bump พร้อมกันแต่ version ต่างได้ — เลือกให้ตรง release policy
- private packages ที่ไม่ publish ต้องอยู่ใน `ignore`

### 3. Access

- `access: "restricted"` สำหรับ scoped packages ที่ไม่เปิด public — ผิดจะทำ publish fail
- secrets (`NPM_TOKEN`) ห้ามใส่ใน config — ผ่าน env/secrets manager

- ใช้ /run-release ถ้าจำเป็น

## Expected Outcome

- `.changeset/config.json` ถูกต้องตาม versioning policy
- `fixed`/`linked` groups ทำงานตามที่ตั้งใจ
- `changeset status` และ `version` รันผ่าน
