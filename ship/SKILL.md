---
name: ship
description: Ship workspace ที่เลือก โดยทำตาม AGENTS.md อัปเดต skills แล้ว verify + commit ตามขนาด project (small=local, large=push+watch CI)
related:
  - ship-to-cloud
  - ship-github-issue
  - ship-release
  - follow-git-flow
  - follow-github
  - ship-continuous
  - update-agents-md
  - follow-agents-md
  - update-devin-global-skills
  - update-all-devin-global-skills
  - run-verify
  - run-test-all
  - review-codebase-everythink
  - review-diff
  - resolve-errors
  - git-commit
  - git-push
  - watch-ci-cd
  - watch-github-actions
  - setup-ci-cd
  - report
---

## Goal

Ship workspace ที่เลือกโดยทำตาม `AGENTS.md` อัปเดต skills ด้วย `/update-devin-global-skills` แล้ว verify + commit ตามขนาด project
- project เล็ก: verify บน local แล้ว commit ใน local
- project ใหญ่: setup CI/CD ถ้าขาด แล้ว commit, push, watch CI/CD และ resolve errors

## Scope

ใช้เมื่องานใน workspace ที่เลือกเสร็จสมบูรณ์
- small project: run verify บน local (scan, lint, typecheck, test, build) แล้ว commit local
- large project: ไม่รัน heavy verify บน local ทั้งหมด แต่ commit แล้ว push ไป trigger CI/CD แล้ว watch และ resolve จนผ่าน
ถ้าต้องการ release/deploy ให้ใช้ `/ship-release`
ถ้าต้องการทำงานตาม issue ให้ใช้ `/ship-github-issue`
สำหรับหลาย workspace ให้หา dependency order จาก `docs/project/dependencies.md`, `package.json` workspaces, `AGENTS.md` หรือ dependency graph แล้วเรียก `/ship` แต่ละ workspace จาก leaf → root

## Execute

### 1. Update AGENTS.md

> Goal: `AGENTS.md` เป็นปัจจุบันก่อน ship

1. ถ้า `AGENTS.md` ไม่มีหรือไม่อัปเดต → ทำ `/update-agents-md`
2. ตรวจสอบว่า `AGENTS.md` มี sections ครบตาม `/update-devin-global-skills`
3. ถ้า `AGENTS.md` ไม่พร้อมใช้ → stop และ report

### 2. Follow AGENTS.md

> Goal: ทำตาม workflows ที่ระบุใน `AGENTS.md`

1. ทำ `/follow-agents-md` เพื่ออ่าน `AGENTS.md`
2. ทำตาม `## Execute` ของ `AGENTS.md` ตามลำดับ ถ้า `AGENTS.md` ระบุให้เรียก `/ship` ซ้ำ → ข้าม และใช้ default verify → commit → report
3. ถ้า `AGENTS.md` ไม่ระบุ workflow → ใช้ default: detect size → verify → commit → (push+watch if large) → report

### 3. Update Skills

> Goal: อัปเดต skills ให้ผ่านมาตรฐานก่อน ship

1. ถ้า ship ทั้ง skills repo → ทำ `/update-all-devin-global-skills`
2. ถ้า ship skill เดี่ยว → ทำ `/update-devin-global-skills <skill-name>`
3. ถ้าไม่ใช่ skills repo → ข้าม

### 4. Detect Project Size

> Goal: ตัดสินใจว่า project เล็กหรือใหญ่

1. ตรวจสอบ signals ของ project ใหญ่:
   - ทำ `/check-monorepo` แล้วพบวว่าเป็น monorepo
   - มี `workspaces` ใน `package.json`, `pnpm-workspace.yaml`, `moon.yml`, `turbo.json`
   - build/test หนัก (เช่น >60 วินาที, กิน RAM/CPU มาก)
   - `AGENTS.md` หรือ user ระบุให้ใช้ CI verify
2. ถ้าพบ signal ใด signal หนึ่ย → ถือว่า project ใหญ่
3. ถ้าไม่พบ → ถือว่า project เล็ก

### 5. Verify

> Goal: ตรวจสอบความพร้อมก่อน commit

#### 5.1 Small Project

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี test suites
3. ทำ `/review-codebase-everythink` ถ้ามี `tools/review-codebase/` หรือ `AGENTS.md` ระบุ
4. ทำ `/deep-validate` เพื่อ validate ผลลัพธ์
5. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry

#### 5.2 Large Project

1. ทำ `/setup-ci-cd` ถ้ายังไม่มี CI/CD config
2. ทำ `/deep-validate` เบื้องต้น
3. ไม่รัน full local verify (จะรันบน CI หลัง push)

### 6. Commit

> Goal: commit การเปลี่ยนแปลง

1. รัน `git submodule status` เพื่อดู submodules ทั้งหมด
2. ถ้ามี submodules ที่มี changes → `cd` เข้า submodule แต่ละอัน ทำ `/git-commit` หรือ `git add . && git commit` ใน submodule แล้วกลับมา root
3. ทำ `/git-commit` ที่ root พร้อมระบุ submodule pointer updates ถ้ามี
4. ถ้าไม่มี changes → stop และ report

### 7. Push and CI Verify (Large Project Only)

> Goal: ส่ง branch ขึ้น remote แล้ว verify บน CI

1. ถ้า project เล็ก → ข้ามไป Report
2. ทำ `/git-push`
3. ทำ `/run-verify --ci` เพื่อ push ถ้าจำเป็น และ watch CI/CD
4. ถ้า fail → ทำ `/resolve-errors` แล้ว re-push/re-run สูงสุด 3 ครั้ง

### 8. Report

> Goal: สรุปการ ship

1. ทำ `/report` พร้อม `/report-table`
2. สรุป commits ทั้ง root และ submodules (ถ้ามี) และ CI status (ถ้ามี)
3. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. AGENTS.md First

- `/update-agents-md` ต้องทำก่อนทุกครั้งถ้า `AGENTS.md` ไม่อัปเดต
- `/follow-agents-md` ต้องทำหลัง `AGENTS.md` อัปเดต
- ห้าม duplicate เนื้อหาที่มีอยู่ใน `AGENTS.md`

### 2. Commit Scope

- `ship` สิ้นสุดที local commit สำหรับ project เล็ก
- `ship` สิ้นสุดที CI/CD ผ่าน หรือ report ถ้าไม่ผ่าน สำหรับ project ใหญ่
- `ship` ไม่ release, ไม่ deploy โดยอัตโนมัติ
- ถ้า user ต้องการ release/deploy บน `main` → ใช้ `/ship-release`
- ถ้า user ต้องการทำงานตาม issue ทั่งหมด → ใช้ `/ship-github-issue`

### 3. Update Skills Before Ship

- ทำ `/update-all-devin-global-skills` สำหรับ skills repo
- ทำ `/update-devin-global-skills` สำหรับ skill เดี่ยว
- ถ้าไม่ใช่ skills repo → ข้าม

### 4. Submodule First

- commit ใน submodule ก่อนเสมอ แล้วจึง update root pointer
- ห้าม commit root pointer โดยที่ submodule ยังไม่ commit
- บันทึก submodule commit hash ก่อน update root
- ถ้าไม่มี submodules → commit ที่ root โดยตรง

### 5. Sub-Workflow Discipline

- ทุก command ต้องอ่าน `SKILL.md` จริงก่อนทำ
- ทำตาม `## Execute` ของแต่ละ skill จนครบ
- ก่อน mark `completed` ต้อง verify `## Expected Outcome` ของ sub-workflow นั้น

### 6. AGENTS.md Discipline

- ถ้า `AGENTS.md` ระบุ `## Execute` ทีสั่นให้เรียก `/ship` ซ้ำ → ข้าม และใช้ default verify → commit → (push+watch if large) → report
- ไม่ตีความ `/follow-agents-md` เป็นการเรียก `/ship` ซ้ำอัตโนมัติ

## Expected Outcome

- `AGENTS.md` อัปเดตและถูกต้อง
- Workflows ที่ระบุใน `AGENTS.md` ถูก execute ครบ
- small project: code ผ่าน `/run-verify`, `/run-test-all`, `/review-codebase-everythink` (ถ้ามี) และ `/deep-validate`
- large project: CI/CD config พร้อม, branch ถูก push, CI pipeline ผ่าน หรือมี root cause + next action ชัดเจน
- ทุก submodule ที่มี changes ถูก commit ก่อน root
- Root pointer ชี้ไปยัง commit ล่าสุดของ submodules (ถ้ามี)
- Root commit สำเร็จ
- รายงาน commits และ CI status ครบถ้วน
- ไม่มี release/deploy โดยอัตโนมัติ
