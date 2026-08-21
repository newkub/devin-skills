---
name: follow-release-crates
description: ตั้งค่า Cargo สำหรับ automated releases ไปยัง crates.io
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

## Goal

ตั้งค่า Cargo สำหรับ automated releases ไปยัง crates.io ด้วย semantic versioning

## Scope

Use `follow-release-crates` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Setup Package Configuration

1. ตรวจสอบ Cargo.toml มีข้อมูลครบถ้วน
2. เพิ่ม name, version, authors, description
3. เพิ่ม license, repository, homepage
4. เพิ่ม keywords และ categories

### 2. Install Release Tool

1. รัน `cargo install release-plz` หรือ `cargo install cargo-release`
2. ตรวจสอบ installation สำเร็จ
3. หรือใช้ release-plz action บน GitHub

### 3. Configure Release Tool

1. เพิ่ม config ใน release-plz.toml หรือ .release.toml
2. ตั้งค่า changelog_config เป็น conventional
3. ตั้งค่า release_branch เป็น main
4. ระบุ packages ที่ต้องการ publish

### 4. Setup Authentication

1. สร้าง API token จาก crates.io
2. เพิ่ม CARGO_REGISTRY_TOKEN ใน GitHub secrets
3. หรือใช้ trusted publishing

### 5. Create GitHub Workflow

1. สร้างไฟล์ .github/workflows/release.yml
2. เพิ่ม permissions: contents write, pull-requests write
3. ตั้งค่า trigger บน push ไป main branch
4. เพิ่ม release-plz-release และ release-plz-pr jobs

## Rules

## Rules

### 1. Package Configuration

- ต้องมี name, version, authors, description
- ต้องมี license ที่ valid
- ต้องมี repository และ homepage
- ต้องเป็น semantic versioning

### 2. Installation

- ใช้ release-plz action สำหรับ CI/CD
- ใช้ cargo install สำหรับ local development
- ตรวจสอบ version compatibility

### 3. Configuration

- ตั้งค่า changelog_config เป็น conventional
- ตั้งค่า release_branch เป็น main
- ระบุ packages ที่ publish = true
- ใช้ conventional commits

### 4. Authentication

- ต้องมี CARGO_REGISTRY_TOKEN ใน secrets
- ต้องมี permissions ใน workflow
- token ต้องมีสิทธิ์ publish

### 5. GitHub Workflow

- ต้องมี fetch-depth: 0
- ต้องมี persist-credentials: false
- ต้องมี concurrency สำหรับ release-pr job
- ต้องมี GITHUB_TOKEN environment

## Expected Outcome

## Expected Outcome

- Release tool ติดตั้งและทำงานได้
- Config กำหนดค่าถูกต้อง
- Crates.io token พร้อมใช้งาน
- Releases สร้างอัตโนมัติตาม conventional commits
- Crate publish ไปยัง crates.io อัตโนมัติ
