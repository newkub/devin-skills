---
name: deep-update
argument-hint: "[target]"
description: อัปเดตเป้าหมายด้วย deep review, planning, cross-reference sync, และ validation ครบวงจร
related:
  - ask-me
  - deep-analyze
  - deep-analyze-by-use-scripts
  - deep-review
  - deep-plan
  - deep-update-project
  - update-project
  - update-config
  - update-devin-global-skills
  - update-all-devin-global-skills
  - deep-productionize-implementation
  - refactor
  - restructure
  - deep-validate
  - run-verify
---

## Goal

อัปเดตเป้าหมายใดก็ได้ (skill, workspace, project docs, config, rules, code, หรือ project) ด้วย deep review, planning, cross-reference sync, และ multi-dimensional validation จนกระทั่งพร้อม ship

## Scope

ใช้เมื่องาน update มีความซับซ้อนสูง ต้องเปลี่ยนแปลงหลายมิติพร้อมตรวจสอบ cross-reference หรือต้องการ continuously improve existing codebase โดยไม่ duplicate กับ `/deep-update-project` ที่ focus ที่ root project

สำหรับ update ทั่วไปของ root project ให้ใช้ `/deep-update-project`; สำหรับ update รวดเร็วของ root project ให้ใช้ `/update-project`

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ

### 1. Define Target And Scope

> Goal: ระบุเป้าหมายและขอบเขตของการ update ให้ชัดเจน

1. รับ `[target]` จาก argument หรือ context; ถ้าไม่ชัด → ทำ `/ask-me`
2. ระบุ target type: `skill`, `workspace`, `project-docs`, `config`, `rules`, `codebase`, `root-project`, หรือ `all`
3. ทำ `/check-monorepo` ถ้าอาจมีหลาย workspace
4. ทำ `/all-workspace` ถ้า target รวมหลาย workspace
5. บันทึก scope, target type, และ dimensions ที่ต้อง update

### 2. Deep Review And Inventory

> Goal: เข้าใจสถานะปัจจุบันและสิ่งที่ต้อง update ทั้งหมด

1. ทำ `/deep-thinking` เพื่อวิเคราะห์เป้าหมายและ assumptions
2. ทำ `/deep-analyze` และ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์ target อย่างลึก
3. ทำ `/deep-review` เพื่อ review ครบทุกมิติ
4. ทำ `/report-scan-todo` เพื่อรวบรวม TODO/FIXME/HACK/placeholder ที่ยังค้าง
5. ทำ `/list-dependencies` เพื่อดู dependencies ที่เก่าหรือขาด
6. บันทึก inventory เป้าหมาย ตาม critical path

### 3. Identify Update Dimensions

> Goal: ระบุมิติที่ต้อง update

1. ตรวจสอบ `README.md`, `AGENTS.md`, `USAGE.md`, `FEATURES.md`, `CHANGELOG.md`
2. ตรวจสอบ `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `mise.toml`
3. ตรวจสอบ `.devin/`, `.vscode/`, `rules/`, `.github/`, `.gitignore`
4. ตรวจสอบ `.devin/skills/` และ `examples/`
5. ตรวจสอบ source code, tests, docs, tooling
6. ระบุ dimensions: docs, config, rules, skills, dependencies, code, tests, ci-cd

### 4. Plan Update

> Goal: วางแผนการ update อย่างปลอดภัย

1. ทำ `/deep-plan` เพื่อวางแผนรายละเอียด
2. ทำ `/deep-impact` สำหรับ changes ที่มีผลกระทบสูง
3. ทำ `/prioritize` เพื่อจัดลำดับตาม impact และ effort
4. กำหนด rollback plan สำหรับ breaking changes
5. สร้าง `.devin/plan/<title>-<date>.md` ถ้างานซับซ้อน

### 5. Apply Targeted Updates

> Goal: อัปเดตตาม target type ด้วย skill ทีเหมาะสม

1. ถ้า target type เป็น `root-project` → ทำ `/deep-update-project`
2. ถ้า target type เป็น `skill` ใน global skills → ทำ `/update-devin-global-skills <skill-name>`
3. ถ้า target type เป็น `all` global skills → ทำ `/update-all-devin-global-skills`
4. ถ้า target type เป็น `config` → ทำ `/update-config`
5. ถ้า target type เป็น `versions` (runtime, deps, tools, CI, Docker) → ทำ `/update-version-latest`
6. ถ้า target type เป็น `project-docs` → ทำ `/update-readme-md`, `/update-agents-md`, `/update-usage-md`, `/update-features-md`
7. ถ้า target type เป็น `rules` → ทำ `/update-project-rules`
8. ถ้า target type เป็น `skills` ใน project → ทำ `/update-project-skills`
9. ถ้า target type เป็น `examples` → ทำ `/update-examples`
10. ถ้า target type เป็น `tests` → ทำ `/update-test-and-fix`
11. ถ้า target type เป็น `todo` → ทำ `/update-todo-md`
12. ถ้า target type เป็น `gitignore` → ทำ `/update-gitignore`
13. ถ้า target type เป็น `vscode` → ทำ `/update-dot-vscode`
14. ถ้า target type เป็น `github-metadata` → ทำ `/update-github-metadata`
15. ถ้า target type เป็น `codebase` → ทำ `/deep-productionize-implementation` ตาม critical path
15. ทำ `/update-references` เพื่อ sync ทุก reference หลัง update

### 6. Restructure And Refactor

> Goal: ปรับปรุง structure และ quality หลัง update

1. ทำ `/refactor` เพื่อปรับ style, boundaries, และ consistency
2. ทำ `/restructure` เพื่อจัดโครงสร้างไฟล์ตาม domain
3. ทำ `/update-references` เพื่อ sync references อีกครั้ง
4. ตรวจไฟล์ไม่เกิน 250 บรรทัด

### 7. Comprehensive Validation

> Goal: ตรวจสอบว่า update สมบูรณ์และถูกต้อง

1. ทำ `/deep-validate` เพื่อ validate cross-reference, type, security, compliance
2. ทำ `/run-verify` เพื่อ lint, typecheck, unit test, build
3. ทำ `/run-test-all` เพื่อรัน test suites ทั้งหมดถ้ามี
4. ทำ `/check-skills-related` ถ้าเป้าหมายเกี่ยวข้องกับ skills
5. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
6. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 8. Report And Suggest

> Goal: รายงานผลและ next action

1. ทำ `/report-before-after` สรุปสิ่งที่เปลี่ยน
2. ทำ `/report-table` สรุป target, dimensions, updates, validation status
3. ทำ `/suggest-next-action` เพื่อแนะนำ next action

## Rules

### 1. Target Clarity

- ต้องระบุ target type ก่อนเริ่ม update
- ถ้า target ไม่ชัด → ทำ `/ask-me` ก่อน
- ไม่เดา scope ของการ update

### 2. Delegation To Specialized Skills

- `/deep-update-project` สำหรับ root project update เท่านั้น
- ใช้ `update-*` skills ตาม target type ไม่ทำงานที `update-*` skills ทำได้เองโดยตรง
- ถ้า target ไม่ตรงกับ skill ใด → ใช้ `/deep-productionize-implementation` สำหรับ code changes

### 3. Cross-Reference Consistency

- ทุก reference ต้อง sync หลัง update ด้วย `/update-references`
- `AGENTS.md`, `README.md`, `package.json` ต้องสอดคล้องกัน
- shared config ต้อง sync ข้าม workspace

### 4. Idempotency

- รัน `/deep-update` ซ้ำได้โดยไม่เกิด side effects
- ไม่ลบหรือ overwrite โดยไม่มี dry run
- ข้าม steps ที่ไม่จำเป็น

### 5. Validation

- ต้องผ่าน `/deep-validate` และ `/run-verify` ก่อนถือว่าเสร็จ
- ไม่อ้างว่า check ผ่าน ถ้า command fail
- ถ้า validation ไม่ผ่านหลัง 3 รอบ → stop และ report

- ใช้ /update-dot-devin ถ้าจำเป็น

## Expected Outcome

- เป้าหมายถูก update ด้วย deep review, planning, และ cross-reference sync
- docs, config, rules, skills, code, tests sync กัน
- ไม่มี TODO/FIXME/HACK/placeholder เหลือ (หรือบันทึกชัดเจน)
- cross-references ถูกต้องทั้งหมด
- ผ่าน `/deep-validate` และ `/run-verify`
- รายงาน before/after, risks, และ next actions ครบถ้วน
