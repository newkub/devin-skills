---
name: check-unused-deps
description: Detect and remove unused dependencies using Knip and ecosystem-specific tools
---

## Goal

ตรวจจับและระบุ dependencies ที่ไม่ได้ใช้ในโปรเจกต์ และแก้ไขหรือลบออก

## Scope

ใช้กับทุกโปรเจกต์ที่มี package manifest — รองรับทั้ง single project และ monorepo — ไม่รวมการตรวจสอบ unused files หรือ unused exports (ใช้ `/check-unused-files` และ `/follow-tool-knip` แทน)

## Execute

### 1. Detect Ecosystem

> Goal: ระบุ ecosystem และ package manager ที่ใช้

1. ตรวจสอบ `package.json` → JavaScript/TypeScript ใช้ `knip`
2. ตรวจสอบ `Cargo.toml` → Rust ใช้ `cargo-udeps`
3. ตรวจสอบ `requirements.txt` หรือ `pyproject.toml` → Python ใช้ `pip-autoremove` หรือ `ruff`
4. ตรวจสอบ `go.mod` → Go ใช้ `go mod tidy`
5. ถ้าไม่ตรวจพบ ecosystem ใด → stop และ report

### 2. Run Dependency Analysis

> Goal: รัน tool ตรวจสอบ unused dependencies

1. ถ้าเป็น JavaScript/TypeScript → ทำ `/follow-tool-knip` แล้วรัน `bunx knip --include dependencies`
2. ถ้าเป็น Rust → รัน `cargo +nightly udeps`
3. ถ้าเป็น Python → รัน `ruff` หรือ `pip-autoremove`
4. ถ้าเป็น Go → รัน `go mod tidy -v`
5. ถ้าเป็น monorepo → รัน `bunx knip -W <workspace>` เพื่อ filter ตาม workspace

### 3. Verify Results

> Goal: ตรวจสอบผลลัพธ์เพื่อแยก false positives

1. ตรวจสอบ implicit usage — เช่น plugins, runtime config, framework conventions
2. ตรวจสอบ type-only packages — เช่น `@types/*` ที่อาจไม่ปรากฏใน imports โดยตรง
3. ตรวจสอบ peer dependencies — อาจจำเป็นแต่ไม่ import โดยตรง
4. ตรวจสอบ build tools — เช่น `vite`, `biome` ที่ใช้ผ่าน CLI ไม่ใช่ import
5. ถ้าผลลัพธ์ว่าง → ไม่มี unused dependencies และจบ workflow

### 4. Fix Or Remove

> Goal: แก้ไขหรือลบ unused dependencies

1. ลบ dependency ออกจาก `package.json` หรือ manifest file
2. รัน `bun install` หรือคำสั่งเทียบเท่าเพื่อ update lockfile
3. ถ้า dependency มี implicit usage → ใช้ `ignoreDependencies` ใน `knip.json` สำหรับ JS/TS
4. ทำ `/resolve-errors` ถ้ามี build errors หลังลบ
5. รัน `bunx knip --include dependencies` อีกครั้งเพื่อยืนยันว่าไม่มี unused เหลือ

## Rules

### 1. Use Knip For JavaScript

- ใช้ `knip --include dependencies` สำหรับ JS/TS — ไม่ใช้ `depcheck` หรือ manual grep
- ใช้ `knip --production --include dependencies` เพื่อตรวจเฉพาะ production dependencies
- ใช้ `knip --strict --include dependencies` เพื่อตรวจรวม peerDependencies และ type-only imports
- ใช้ `ignoreDependencies` ใน `knip.json` สำหรับ type packages ที่จำเป็นแต่ไม่ปรากฏใน imports

### 2. Monorepo Handling

- ใช้ `knip -W <workspace>` เพื่อ filter ตาม workspace
- ตรวจสอบ cross-workspace dependencies — อาจ unused ใน workspace หนึ่งแต่ใช้ในอีก workspace
- รัน `bunx knip` ที่ root เพื่อตรวจทุก workspace พร้อมกัน

### 3. Safety

- ตรวจสอบ implicit usage ก่อนลบเสมอ — framework plugins, runtime config, build tools
- ห้ามลบ `@types/*` โดยไม่ตรวจสอบ — อาจจำเป็นสำหรับ type inference
- ทดสอบ build และ test หลังลบ dependency
- ถ้าลบแล้วมี error → เพิ่มกลับและใช้ `ignoreDependencies` แทน

### 4. Production vs Development

- รันทั้ง default และ `--production` mode แยกกัน
- `--production` exclude devDependencies — เหมาะสำหรับตรวจสอบ production bundle
- default mode รวม devDependencies — เหมาะสำหรับ cleanup ทั่วไป

## Expected Outcome

- รายการ unused dependencies ที่ยืนยันแล้ว (หรือไม่มีถ้าผ่าน)
- Dependencies ที่ไม่ได้ใช้ถูกลบออกจาก manifest
- Lockfile อัปเดตแล้ว
- Build และ test ผ่านหลังลบ
