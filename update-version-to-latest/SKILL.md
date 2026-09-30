---
name: update-version-to-latest
description: อัปเดต dependencies, runtime, tools, CI ในทุก workspace ให้ latest พร้อม verify
argument-hint: "[scope|verify]"
related:
  - resolve-errors
  - report
  - test-usage
  - run-verify
  - ask-me
  - run-release
  - keepup-source-code
---

## Goal

อัปเดต dependencies, runtime, tools, CI versions และ versioned config ในทุก workspace/package ให้เป็น latest ทั้งหมด แล้ว verify ว่า build, test, typecheck, lint และ usage examples ยังผ่าน

## Scope

- อัปเดตทุก versioned surface ที่ตรวจพบใน repo: dependencies, devDependencies, peerDependencies, catalog versions, mise tools, GitHub Actions versions, Docker base images, packageManager field, runtime config
- ใช้เครื่องมือตาม ecosystem: `bun`/`bunx taze` สำหรับ Node/Bun, `cargo update` สำหรับ Rust, `go get -u ./...` สำหรับ Go, `pip install -U` หรือ `uv` สำหรับ Python
- รองรับ monorepo: Moon, Turbo, pnpm workspace, Cargo workspace
- รันทีเดียวจบ: dry-run → update → install → build → test → test-usage → report
- fast path: section `update-versions` ใน Merged Details — one-shot flow อัปเดตทุก ecosystem (detect → dry-run → snapshot → update → install → diff report → verify) โดยไม่มี changelog analysis หรือ commit แยก batch; ใช้ flow เต็ม Steps 1-8 เมื่อต้องการ changelog analysis, major-migration หรือ commit แยก batch

## Execute

รัน `/update-version-to-latest [scope]` ครั้งเดียว ระบบจะทำตามลำดับนี้โดยอัตโนมัติ

### 1. Detect Versioned Surfaces

> Goal: รู้ว่าต้องอัปเดตอะไรบ้าง

1. หา manifest ทั้งหมด: `package.json`, `bun.lock` (legacy: `bun.lockb`), `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `Cargo.toml`, `Cargo.lock`, `go.mod`, `go.sum`, `mise.toml`, `.tool-versions`, `pyproject.toml`, `uv.lock`, `.github/workflows/*.yml`
2. บันทึก dependencies, devDependencies, peerDependencies, catalog versions, `packageManager`, `engines`, action versions, mise tool versions
3. ระบุ ecosystems ทีใช้

### 2. Dry-Run Analysis

> Goal: ดูก่อนว่าจะอัปเดตอะไร

1. รัน `bunx taze` (ไม่มี `-w` = dry-run) หรือ `bun outdated` สำหรับ Node/Bun — ใช้ `-r` สำหรับ recursive scan ใน monorepo
2. รัน `cargo update --dry-run` สำหรับ Rust
3. รัน `go list -u -m all` สำหรับ Go
4. รวม major/minor/patch updates และสร้างตาราง `No.`, `Package`, `Current`, `Latest`, `Type`, `Risk`
5. ถ้ามี major updates → อ่าน changelogs คร่าวๆ แล้วถ้าเสี่ยงสูงให้ `/ask-me` ก่อน write

### 3. Update Dependencies

> Goal: อัปเดตทุก dependency เป็น latest

1. อัปเดต patch → `bunx taze patch -w -r` หรือ `bun update`
2. อัปเดต minor → `bunx taze minor -w -r`
3. อัปเดต major → `bunx taze major -w -r` (ทีละ batch พร้อมตรวจ breaking changes)
4. ถ้ามี catalog versions ใน root `package.json` → อัปเดต catalog ก่อน แล้ว install
5. `cargo update` สำหรับ Rust workspace
6. `go get -u ./...` แล้ว `go mod tidy` สำหรับ Go
7. อัปเดต `packageManager` field ถ้ามี

### 4. Update Runtime / Tools / CI

> Goal: อัปเดต runtime, dev tools, GitHub Actions และ versioned config

1. อัปเดต `mise.toml` / `.tool-versions` เครื่องมือเป็น latest stable
2. อัปเดต GitHub Actions versions ใน `.github/workflows/*.yml` — `bunx taze` ตรวจ actions ได้ด้วย (ใช้ `--github-actions` flag) หรือตรวจ latest release tag จาก GitHub API
3. อัปเดต Docker base images (`FROM ...:`) ถ้ามี `Dockerfile`
4. อัปเดต `engines` ใน `package.json` ถ้าจำเป็น
5. ถ้ามี `biome.jsonc`, `.node-version`, `.nvmrc` ที่ระบุ version → sync ให้ตรง

### 5. Install And Sync

> Goal: ให้ lockfile สอดคล้อง

1. `bun install` สำหรับ Bun/Node
2. `cargo fetch` หรือ `cargo generate-lockfile` สำหรับ Rust
3. `go mod tidy` สำหรับ Go
4. ตรวจ `bun.lock`/`pnpm-lock.yaml` ไม่มี conflicts

### 6. Verify

> Goal: ยืนยัน project ยังใช้งานได้

1. รัน `/run-verify` หรือเทียบเท่า: build, typecheck, lint, test
2. สำหรับ Rust: `cargo check --workspace`, `cargo test --workspace`
3. สำหรับ Go: `go build ./...`, `go test ./...`
4. ถ้ามี Moon: `moon run :build :typecheck :lint :test`
5. ถ้า fail → `/resolve-errors` แล้ว recheck

### 7. Test Usage

> Goal: ยืนยัน usage examples ยังทำงาน

1. ทำ `/test-usage [scope]` เพื่อทดสอบ examples ใน `README.md`, `USAGE.md`, `package.json` scripts
2. บันทึก examples ที่พังหรือต้องปรับ

### 8. Commit And Report

> Goal: เก็บ changes พร้อมสรุป

1. แยก commit ตามประเภท: `chore: update patch dependencies`, `chore: update minor dependencies`, `chore: update major dependencies`, `chore: update runtime/CI versions` (ถ้า user ยินยอม push)
2. ใช้ `/report` สรุป: `No.`, `Package`, `Old`, `New`, `Type`, `Status`
3. รายงาน breaking changes หรือ action ที่ต้องทำต่อ

### Workflows

> Goal: dispatch งานเฉพาะทางไปยัง workflow ที่ละเอียดกว่า

| Topic | Section (Merged Details) |
|-------|----------|
| Major version upgrade — breaking changes scan, codemods, staged rollout, rollback | `migrate-major` |
| `verify`, `verify-upgrade` — ยืนยัน versions bumped, lockfile consistent, project green | `verify-upgrade` |
| Fast path — one-shot update ทุก ecosystem ไม่มี changelog analysis | `update-versions` |

1. ถ้า argument เป็น `verify` → ทำตาม flow ใน section `verify-upgrade` — ไม่ re-update
2. ถ้า argument เป็น `fast` → ทำตาม flow ใน section `update-versions`
3. ถ้าไม่ระบุ → ทำ Steps 1-8 ตามปกติ โดย Steps 6-7 อ่าน section `verify-upgrade` มา execute

## Rules

### 1. One-Shot Flow

- ผู้ใช้เรียก `/update-version-to-latest [scope]` ครั้งเดียว ระบบต้องวนทำ steps ให้ครบเอง
- ถ้า step ใด fail → หยุด แจ้งสาเหตุ และ suggest next action
- ไม่ต้องให้ user เรียก sub-command ซ้ำ

### 2. Update Order

- patch → minor → major
- runtime/tools → dependencies
- อัปเดต catalog ก่อน install ถ้าเป็น monorepo
- ไม่อัปเดต major ทุกตัวพร้อมกัน ถ้ามี breaking changes ให้ batch และ test ทีละ batch

### 3. Safety

- ต้อง dry-run ก่อน write
- ตรวจ `minimumReleaseAge` ถ้ามี security policy
- ไม่ downgrade เพื่อแก้ปัญหา
- ถ้า major update มี breaking changes สูง → `/ask-me`
- ไม่ commit ถ้า verify ไม่ผ่าน

### 4. Ecosystem Tools

- Bun: `bunx taze <mode> -w -r`, `bun update`, `bun install`
- Rust: `cargo update`, `cargo check --workspace`
- Go: `go get -u ./...`, `go mod tidy`
- Python: `pip install -U` หรือ `uv pip compile`
- GitHub Actions: ตรวจ latest release tag จาก GitHub API

### 5. Usage Verification

- ต้องทำ `/test-usage` ทุกครั้งหลัง update เสร็จ
- ถ้า usage example พัง → แก้ไขหรืออัปเดต docs ก่อน commit
- ใช้ /run-release ถ้าจำเป็น

## Merged Details

### migrate-major

##### Goal



อัปเกรด dependency/runtime ข้าม major version อย่างปลอดภัย — สแกน breaking changes ครบ, ใช้ codemods, แบ่ง rollout เป็น stages และมี rollback path ชัดเจน



##### Scope



- ใช้เมื่อ `/update-version-to-latest` พบ major updates ที่มี breaking changes เสี่ยงสูง หรือ user สั่ง migrate major โดยตรง

- ครอบคลุม: npm/bun packages, frameworks, runtime majors — ทีละ package หรือทีละ batch ที่เกี่ยวข้องกัน

- ไม่ใช้กับ patch/minor — ทำผ่าน `/update-version-to-latest` flow ปกติ



##### Execute



###### 1. Scan Breaking Changes



> Goal: รู้ทุก breaking change ก่อนแก้ code



1. อ่าน CHANGELOG, migration guide และ release notes ของ package จาก official docs/repo — ถ้าไม่มี guide ให้ `/learn` (web)

2. สร้าง checklist: removed APIs, renamed APIs, behavior changes, new required config, peer dep requirements

3. `scan-codebase` หา call sites ทุกจุดที่ใช้ API ที่เปลี่ยน — ระบุ file:line ทั้งหมด

4. ประเมิน risk — ถ้ากระทบ public API หรือหลาย workspace → `/ask-me` confirm ก่อนเริ่ม



###### 2. Prepare Rollback



> Goal: rollback ได้ทุกเมื่อ



1. ตรวจ `git status` clean — commit หรือ stash งานค้างก่อน

2. บันทึก current version และ lockfile state — rollback = revert commit + reinstall

3. เขียน rollback steps ชัดเจนก่อนเริ่ม migrate



###### 3. Apply Codemods Then Manual Fixes



> Goal: แปลง code ด้วยเครื่องมือก่อน manual edit



1. รัน official codemod ถ้า package มีให้ — ดู migration guide

2. ถ้าไม่มี codemod → ใช้ `/use-astgrep` หรือ `/migration-by-astgrep` เขียน patterns แปลง renamed/removed APIs

3. manual fix ส่วนที่ codemod ทำไม่ได้ — behavior changes, config moves, type changes

4. อัปเดต version ใน manifest แล้ว install — แยก commit: `chore: migrate <pkg> to v<N>`



###### 4. Staged Verify And Rollout



> Goal: verify ทีละชั้น ไม่ big-bang



1. ต่อ package/batch: typecheck → lint → unit tests → `/run-verify` → `/test-usage`

2. monorepo → verify ทีละ workspace ที่ depend, leaf packages ก่อน consumers

3. ทำ `/deep-review` เพื่อหา deprecated usage ที่เหลือ

4. runtime smoke test บน critical paths ที่ใช้ package นั้น



###### 5. Report



> Goal: สรุปผลพร้อมสิ่งที่ค้าง



1. ทำ `/report-before-after` — version, breaking changes ที่เจอ, call sites ที่แก้

2. ระบุ follow-ups ที่ยังไม่ได้ทำ เช่น deprecated APIs ที่ยังใช้อยู่



##### Rules



- ห้ามอัปเดตหลาย unrelated majors พร้อมกัน — ทีละ batch ที่เกี่ยวข้องกันเท่านั้น

- ต้องมี breaking changes checklist และ rollback plan ก่อน write

- ใช้ codemods/ast-grep แทน manual edit เมื่อเป็นไปได้

- ห้าม commit ถ้า verify ไม่ผ่าน — revert แล้ว report

- ถ้า breaking changes กระทบ public API ของ project เอง → `/ask-me` ก่อน



##### Expected Outcome



- major version ถูก migrate ครบ พร้อม verify ผ่านทุก stage

- breaking changes ทั้งหมดถูกจัดการ ไม่มี deprecated usage ค้างโดยไม่รู้ตัว

- rollback path ชัดเจน — revert commit เดียวกลับได้

### verify-upgrade

##### Goal



ยืนยันหลัง `/update-version-to-latest` ว่า versions ถูก bump จริง, lockfile consistent และ project ยังทำงาน — เรียก standalone เมื่อต้อง re-verify หรือสงสัยว่า upgrade ครบไหม



##### Scope



- ใช้เมื่อ parent dispatch มาที่ `verify`/`verify-upgrade` หรือเรียกหลัง update เสร็จ

- ครอบคลุม: manifest versions, lockfile consistency, build/test/typecheck, usage examples

- Read-only: ตรวจสอบ — ไม่ re-update



##### Execute



###### 1. Verify Versions Actually Bumped



> Goal: manifests แสดง versions ใหม่จริง



1. `git diff` manifests — versions เปลี่ยนตามที่ report ไว้

2. `bunx taze` dry-run อีกครั้ง → ไม่ควรเหลือ updates (หรือเหลือเฉพาะที่ defer)

3. flag packages ที่ claimed updated แต่ manifest ยังเป็น version เดิม



###### 2. Verify Lockfile Consistency



> Goal: lockfile ตรง manifest ไม่มี drift



1. `bun install --frozen-lockfile` (dry check) หรือ `cargo metadata`/`go mod verify` ตาม ecosystem

2. flag lockfile ที่ resolve versions ไม่ตรง manifest ranges

3. ตรวจไม่มี duplicate/conflicting resolutions



###### 3. Verify Project Green



> Goal: upgrade ไม่พังอะไร



1. ทำ `/run-verify` — build, typecheck, lint, test

2. ทำ `/test-usage` — usage examples ยังทำงาน

3. ถ้า fail → รายงาน package ที่น่าสงสัย (diff ล่าสุด) เป็น rollback candidate — ไม่ rollback เอง



###### 4. Report



> Goal: สรุป upgrade health



1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`, `Notes`

2. Verdict: `clean-upgrade` / `partial` / `broken` พร้อม packages ที่เป็น rollback candidates



##### Rules



- claimed-but-not-bumped = inconsistency ที่ต้อง report เสมอ

- runtime verification (dev server, actual run) เพิ่มเติมจาก typecheck ถ้า major upgrade

- ไม่ re-update หรือ downgrade ใน workflow นี้



##### Expected Outcome



- ยืนยัน versions/lockfile/project สอดคล้องกันหลัง upgrade

- รายการ rollback candidates ถ้า verify fail

### update-versions

##### Goal



Fast path — อัปเดต dependencies, runtime, tools และ CI versions ทุก workspace/package เป็น latest รันทีเดียวจบ: detect → dry-run → snapshot → update → install → diff report → verify (ไม่มี changelog analysis, ไม่มี commit แยก batch — ถ้าต้องการให้ทำ Steps 1-8 แทน)



##### Scope



- ครอบคลุมทุก ecosystem ที่ตรวจพบ: `Bun/Node` (`package.json` → `bunx taze` + `bun install`), `Rust` (`Cargo.toml` → `cargo update` + `cargo upgrade` ถ้ามี cargo-edit), `Go` (`go.mod` → `go get -u ./...` + `go mod tidy`), `Python` (`uv.lock` → `uv lock --upgrade` / `requirements.txt` → `pip install -U`), `mise` (`mise upgrade --bump`), `GitHub Actions` (`uses:` tags ผ่าน `gh api` latest release)

- `--level`: `patch` / `minor` / `latest` (default `latest` = bump ทั้ง major/minor/patch เป็น newest)

- Dockerfile `FROM img:tag` — detect และ report เท่านั้น (registry check ต้อง tool ภายนอก)



##### Execute



###### 1. Detect Ecosystems



> Goal: รู้ว่า repo มี ecosystem อะไรให้อัปเดต



1. สแกน manifests ใน scope: `package.json`, `Cargo.toml`, `go.mod`, `uv.lock`/`requirements.txt`, `mise.toml`/`.tool-versions`, `.github/workflows/*.yml`, `Dockerfile` — report counts ต่อ ecosystem

2. ถ้าไม่มี ecosystem → report และจบ

3. ตรวจ tools ที่จำเป็น: `bun`/`bunx`, `cargo`, `go`, `uv`/`pip`, `mise`, `gh` — skip ecosystem ที่ tool ไม่มีและระบุเหตุ



###### 2. Dry-Run And Confirm



> Goal: report ก่อนเขียน — ห้ามแก้ manifest/lockfile โดยไม่ confirm



1. รัน dry-run ต่อ ecosystem: `bunx taze`, `cargo update --dry-run`, `go list -u -m all`

2. ทำ `/report` แสดง ecosystems + ตาราง `dep old -> new` — ถาม user ด้วย `ask_user_question` (level `latest`/`minor`/`patch`)

3. เตือน user ถ้า git working tree ไม่ clean (revert ไม่ได้)



###### 3. Snapshot Update And Install



> Goal: อัปเดตเป็น latest ตาม level ทุก ecosystem



1. บันทึก snapshot versions เดิม (manifests + lockfiles) ไว้ทำ diff report

2. รัน updaters ต่อ ecosystem ตาม level: `bunx taze <level> -w -r` + `bun install`, `cargo update` (+ `cargo upgrade --incompatible` ถ้ามี cargo-edit และ level เป็น latest), `go get -u ./...` + `go mod tidy`, `uv lock --upgrade` หรือ `pip install -U`, `mise upgrade --bump`, bump `uses:` tags ผ่าน `gh api` latest release

3. Re-snapshot → ตาราง `No.`, `Package`, `Old`, `New`, `File`



###### 4. Verify And Report



> Goal: ยืนยัน project ยังเขียว



1. Verify อัตโนมัติ: `bun run verify`/`build`, `cargo check --workspace`, `go build ./...` ตาม ecosystem ที่พบ

2. ถ้า fail → ทำ `/resolve-errors` แล้ว recheck (max 3)

3. ทำ `/test-usage` ตาม convention — usage examples ต้องยังทำงาน

4. ทำ `/report` สรุป: `No.`, `Package`, `Old`, `New`, `Type`, `Status`



##### Rules



- Dry-run first — ห้ามเขียน manifest/lockfile โดยไม่ confirm; level `latest` bump majors ด้วย ถ้าเสี่ยงสูงให้ user เลือก `minor`

- Skip ecosystem ที่ tool ไม่มีอย่าง graceful และระบุเหตุเสมอ — ไม่มี silent failures

- ไม่ downgrade เพื่อแก้ปัญหา — ถ้า update แล้วพังให้ `/resolve-errors` ไม่ใช่ rollback versions เองโดยไม่ถาม



##### Expected Outcome



- Ecosystem detection report ก่อนลงมือ

- ทุก deps/tools/CI versions เป็น latest ตาม level ที่เลือก + lockfiles synced

- ตาราง `old -> new` ต่อ dep + verify results

## Expected Outcome

- ทุก dependencies, runtime, tools, CI versions อัปเดตเป็น latest stable
- Lock file อัปเดตและไม่มี conflicts
- Build, typecheck, test, lint ผ่าน
- `/test-usage` ผ่าน
- รายงาน versions ที่เปลี่ยน, breaking changes, และ action ถัดไป
