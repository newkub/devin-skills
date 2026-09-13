---
name: follow-config-config-gitignore
description: จัดการ .gitignore patterns ตาม ecosystem — deps, build, env, OS, IDE files
argument-hint: "[path]"
related:
  - follow-config
  - update-gitignore
  - follow-gitignore
  - check-secrets
---

## Goal

ตรวจและจัดการ `.gitignore` ให้ครบตาม ecosystem — dependencies, build output, env files, OS/IDE files — ไม่ track ไฟล์ที่ไม่ควร และไม่ ignore เกินจำเป็น

## Scope

- ใช้กับ `.gitignore` ที่ root และ per-workspace/subdirectory ถ้ามี
- ครอบคลุม: ecosystem patterns (Node, Rust, Python, Go), build outputs, env/secrets, OS files, IDE files
- รายละเอียด pattern เต็มอยู่ใน `/follow-gitignore` และ `/update-gitignore`

## Execute

### 1. Detect Ecosystems

> Goal: รู้ว่าต้อง ignore อะไรตาม stack

1. ตรวจ manifests: `package.json`/`bun.lock` → Node, `Cargo.toml` → Rust, `pyproject.toml` → Python, `go.mod` → Go
2. ตรวจ tools ที่สร้าง artifacts: `dist/`, `.next/`, `.turbo/`, `.moon/`, `target/`, `__pycache__/`, `.venv/`
3. ตรวจ IDE/OS ที่ใช้: `.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db`

### 2. Audit Current .gitignore

> Goal: หา gaps และ over-ignoring

1. อ่าน `.gitignore` ปัจจุบัน — เทียบกับ patterns ที่ ecosystem ต้องการ
2. หา tracked files ที่ควร ignore: `git ls-files` เทียบกับ patterns — เช่น `.env`, `node_modules`, build output ที่ commit ไปแล้ว
3. หา patterns ที่ ignore เกิน — เช่น ignore `*.json` ทั้งหมดแล้ว config ที่ต้อง commit หลุด
4. ทำ `/check-secrets secrets-leak` — ไฟล์ที่มี secrets ต้องถูก ignore หรือย้ายออก

### 3. Fix Patterns

> Goal: .gitignore ครบและแม่นยำ

1. เพิ่ม missing patterns ตาม ecosystem — ใช้ standard patterns ของแต่ละ stack ดู `/follow-gitignore`
2. แก้ tracked-but-should-ignore: `git rm -r --cached <path>` แล้วเพิ่ม pattern — แจ้ง user ก่อนเพราะเปลี่ยน index
3. แก้ over-broad patterns ให้เฉพาะเจาะจง — ใช้ path prefix แทน global glob เมื่อทำได้
4. จัด group patterns พร้อม comment headers (# Dependencies, # Build, # Env, # OS, # IDE)

### 4. Verify

> Goal: ยืนยัน ignore ทำงานถูก

1. `git check-ignore -v <file>` ทดสอบไฟล์สำคัญทั้งที่ควรและไม่ควร ignore
2. `git status` — ไม่มี artifacts/env files เป็น untracked ที่ควรถูก ignore
3. ยืนยัน config files ที่ต้อง commit ยัง tracked อยู่

## Rules

- ใช้ standard patterns ของ ecosystem — ห้ามเดา pattern เองถ้าไม่แน่ใจ ดู official docs/gitignore templates
- `.env*` ต้องถูก ignore ยกเว้น `.env.example` — secrets ที่ tracked แล้วต้อง rotate ไม่ใช่แค่ untrack
- ห้าม ignore ไฟล์ source หรือ config ที่ project ต้องการ
- `git rm --cached` เป็น index change — แจ้ง user ก่อนทำกับไฟล์จำนวนมาก
- ignore เฉพาะ generated/local files — ห้าม ignore เพื่อซ่อนปัญหา

## Expected Outcome

- `.gitignore` ครอบคลุม deps, build, env, OS, IDE ตาม ecosystem
- ไม่มี generated/secret files ถูก track
- ไม่มี over-ignoring ที่ทำ config หลุด
