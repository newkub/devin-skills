---
name: apply
description: Canonical apply — เลือกจาก N options แล้ว apply, validate ก่อน apply, หรือลบอย่างปลอดภัย ในคำสั่งเดียว
argument-hint: "[choose|validate|delete] [context-or-options]"
related:
  - ask-me
  - rethink
  - follow-your-suggestion
  - report
  - report-progress
  - suggest-next-action
  - manage
  - deep-validate
  - run-check
  - check-reference
  - review-devin-global-harness
  - update-references
  - scan-codebase
  - resolve-errors
  - all-this-patterns
  - continue
  - delete-cicd-fails
  - delete-git-branch
  - delete-git-submodules
  - delete-git-worktree
  - delete-projects
  - delete-project-temp
---

## Goal

Apply การกระทำอย่างถูกต้องและปลอดภัย — canonical skill สำหรับทุก apply-pattern — merged จาก `choose-and-apply`, `validate-then-apply`, `delete` เดิม

## Scope

- `choose`: มีหลายทางเลือก (tools, libraries, approaches) → วิเคราะห์ → เลือก → apply
- `validate`: ต้องการยืนยันก่อน apply — code, config, references, architecture, หรือ decision
- `delete`: ลบไฟล์/โฟลเดอร์อย่างปลอดภัย — dry-run, confirm, backup, update references
- ไม่ระบุ mode → detect จาก context/argument แล้ว `/ask-me` ถ้ายังไม่ชัด

สำหรับ domain-specific deletes เรียก skill ตรง: `/delete-cicd-fails`, `/delete-git-branch`, `/delete-git-submodules`, `/delete-git-worktree`, `/delete-projects`, `/delete-project-temp` — แต่ละ skill มี dry-run + confirm gate ของตัวเอง

## Execute

### 0. Detect Mode

> Goal: เลือก workflow ที่ตรง context

1. argument/context ระบุ mode → ใช้ mode นั้น
2. มีหลาย options ให้เลือก → `choose`
3. เป็นการลบ files/folders → `delete`
4. เป็น apply ทั่วไปที่ต้องยืนยันก่อน → `validate`
5. ไม่ชัด → `/ask-me`

### Mode: Choose

> Goal: เลือกจาก N ทางเลือกแล้ว apply สิ่งที่เหมาะสมที่สุด

1. **Capture options** — รับจาก argument/context; ไม่มี → `/ask-me`; option เดียว → `/follow-your-suggestion`
2. **Analyze** — ประเมิน scope, cost, effort, risk, compatibility, maintainability; ทางเลือกใกล้เคียง/trade-off สูง → `/rethink`
3. **Present and confirm** — `/report table` คอลัมน์ `No. | Option | Pros | Cons | Score | Recommended` แนะนำด้วย `✅`; high-risk → `/ask-me` ก่อน
4. **Apply** — ต่อเนื่องจาก context → `/follow-your-suggestion`; action เดียว → `/continue`; หลาย step → `/manage`; กระทบหลายจุด → `/all-this-patterns`
5. **Validate and report** — `/run-check` หรือ `/deep-validate` ตาม nature → `/report table` (`No. | Option | Status | Output`) → `/suggest-next-action`

### Mode: Validate

> Goal: ตรวจสอบก่อน apply ทุกครั้ง — ไม่ apply ถ้ายังไม่ผ่านเกณฑ์

1. **Capture context** — รับ action/context; ไม่ชัด → `/ask-me`; ระบุ scope, dependencies, expected outcome
2. **Select validation** — code → `/run-check`; skill/rules/config → `/deep-validate`; reference/path → `/check-reference` หรือ `/review-devin-global-harness`; architecture/design → `/review` ที่เหมาะสม; decision → `/rethink`
3. **Run validation** — บันทึก passed/failed, findings, warnings; จัดลำดับตาม severity; `/report table` (`No. | Check | Status | Findings`)
4. **Decide** — ผ่านทั้งหมด → apply; warning ต่ำ → แจ้ง user แล้ว apply เมื่อยืนยัน; error/blocker → แก้ให้ผ่านก่อน; ไม่แน่ใจ → `/ask-me`
5. **Apply** — suggestion เฉพาะ → `/follow-your-suggestion`; file ops หลายจุด → `/all-this-patterns`; หลาย step → `/manage`
6. **Re-validate and report** — validate ซ้ำหลัง apply → `/report table` (`No. | Step | Validation | Apply | Status`); step ค้าง → `/report-progress` → `/suggest-next-action`

### Mode: Delete

> Goal: ลบอย่างปลอดภัย — dry-run + confirm + backup + update references

1. **Identify targets** — รับรายการจาก user; ขยาย pattern/glob เป็น concrete files; บันทึก absolute paths
2. **Assess impact** — `/report` สรุป state; `/scan-codebase` หรือ `/use-astgrep` หา references; เช็ค `git status` tracked/untracked; ระบุ broken refs; reference เยอะ/สำคัญ → `/ask-me` ก่อน
3. **Dry run** — แสดงรายการที่จะลบ + refs ที่จะ broken + ขนาดรวม → ถาม `proceed`/`skip`/`cancel`
4. **Backup** — อยู่ใน git → กู้ผ่าน git ได้ไม่ต้อง backup; ไม่อยู่ใน git/uncommitted → สำรองไป `%TEMP%` หรือ `.trash/` แล้วบันทึก path
5. **Delete** — `Remove-Item`/`rm`; directory → recursive เมื่อ confirm; target สำคัญ (config, กุญแจ) → double confirm; ลบไม่ได้ → report error และ stop
6. **Update references** — `/update-references` แก้/ลบ refs ที่ชี้มา targets; `/review-devin-global-harness` ตรวจ broken refs (แก้ max 3 รอบ)
7. **Validate** — ยืนยันลบจริง; `/run-check`; `/review-devin-global-harness` ซ้ำ; ไม่ผ่าน → `/resolve-errors` แล้ว retry
8. **Report** — รายการที่ลบ + refs ที่แก้ + broken refs ค้าง → `/suggest-next-action`

## Rules

### 1. Confirmation Gates

- ไม่ apply โดยไม่ได้รับ confirm ถ้า high-risk
- Delete: ต้อง dry-run + confirm เสมอ; ห้ามลบนอก scope, git history, หรือ `.git`
- ไม่ apply เมื่อยังมี blocker จาก validation — ห้ามข้ามเพราะ user เร่ง

### 2. Evidence And Context

- ทุก option ต้อง evaluate ตาม context จริง — ห้ามเดา
- เก็บ context เดิมไว้ตลอดการ apply
- เก็บผล validation ไว้ report ก่อน/หลัง apply

### 3. Safety First (Delete)

- ห้ามลบ files ที่มี secrets, API keys, credentials
- target อยู่ใน global config (`~/.config`, `%APPDATA%`) → double confirm
- target ถูกใช้โดย process อื่น → หยุด process ก่อน
- target ไม่อยู่ใน git → ต้อง backup ก่อนลบ และบันทึก backup path ใน report

### 4. No Broken References

- ทุก reference ที่ broken ต้องถูกอัปเดตหรือลบ
- ไม่ปล่อยให้ imports, paths, links broken

## Expected Outcome

- Mode ถูก detect/เลือกถูกต้องตาม context
- Choose: ตารางเปรียบเทียบครบ + option แนะนำพร้อมเหตุผล + apply สำเร็จ
- Validate: ตรวจก่อน apply ทุกครั้ง + ไม่ apply เมื่อมี blocker + report ครบ
- Delete: targets ถูกลบ + ไม่มี broken refs + ผ่าน `/run-check` + rollback ได้ถ้ามี backup
- ทราบ next action ทุก mode
