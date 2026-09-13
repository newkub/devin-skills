---
name: follow-tool-moonrepo-run-ci
description: ใช้ moon ci บน CI providers — affected targets, runInCI, sharding, reports
argument-hint: "[provider]"
related:
  - follow-monorepo
  - follow-tool-github-actions
  - run-verify
  - follow-tool-mise
---

## Goal

ตั้งค่า `moon ci` ให้ CI pipeline รันเฉพาะ affected tasks อย่างถูกต้อง — ครอบคลุม `runInCI`, base/head detection, job sharding, reports และ remote caching

## Scope

ใช้เมื่อ monorepo ใช้ moonrepo แล้วและต้องการ CI integration (GitHub Actions, Buildkite, CircleCI, TravisCI) — ไม่ครอบคลุม setup `.moon/` (ดู `subskills/setup-moonrepo/SKILL.md`) หรือ task definitions (ดู `subskills/config-pipeline/SKILL.md`)

- ถ้ายังไม่มี `.moon/workspace.yml` → ทำ `subskills/setup-moonrepo/SKILL.md` ก่อน

## Execute

### 1. Understand moon ci Behavior

> Goal: เข้าใจว่า `moon ci` ทำอะไรต่างจาก `moon run`

1. `moon ci` = `moon exec` พร้อม prefills: `--affected`, `--ci`, `--on-failure=continue`, `--summary=detailed`, `--upstream=deep`, `--downstream=direct`
2. รันเฉพาะ tasks ที่ affected โดย changed files และมี `options.runInCI: true` (default true)
3. tasks ชื่อ `dev`, `start`, `serve` ถูก `runInCI: false` โดย default — long-running processes ต้อง opt-out เสมอ
4. base/head revisions detect อัตโนมัติจาก CI provider — fallback ไป `vcs.defaultBranch` และ `HEAD`
5. report เขียนที่ `.moon/cache/ciReport.json` — copy ออกถ้าต้อง persist (upload เป็น CI artifact)

### 2. Configure runInCI Per Task

> Goal: ให้เฉพาะ tasks ที่เหมาะรันบน CI

1. ปิด tasks ที่เป็น long-running/interactive:
   ```yaml
   tasks:
     dev:
       options:
         runInCI: false
   ```
2. ปิด tasks ที่ต้อง secrets หรือ external side-effects ที่ไม่ควรรันบน PR (เช่น deploy previews)
3. ตรวจว่า `build`, `lint`, `typecheck`, `test`, `check` ยัง `runInCI: true` (default)

### 3. Choose Targets Explicitly (Optional)

> Goal: ควบคุม task set ที่รันบน CI

1. default `moon ci` รันทุก task ที่ affected — ถ้าต้องการแยก job ให้ระบุ targets:
   - `moon ci :build` — job เดียว build อย่างเดียว
   - `moon ci :test :lint` — job อื่น test + lint
2. explicit targets ยัง filter ด้วย `runInCI` และ affected detection เหมือนเดิม

### 4. Configure Revision Detection

> Goal: affected detection ถูกต้องบน CI

1. moon ต้องการ full commit history — ห้าม shallow clone (`fetch-depth: 1`)
2. GitHub Actions: ใช้ `actions/checkout` พร้อม `fetch-depth: 0` และ `filter: 'blob:none'` (blobless clone — เร็วแต่ history ครบ)
3. override ด้วย `--base`/`--head` หรือ `MOON_BASE`/`MOON_HEAD` env เมื่อ provider detect ผิด
   ```sh
   moon ci --base <BRANCH> --head <SHA>
   ```

### 5. Integrate With Provider

> Goal: pipeline file ถูกต้องตาม provider

1. GitHub Actions (แนะนำ — ใช้ official action):
   ```yaml
   steps:
     - uses: 'actions/checkout@v4'
       with:
         fetch-depth: 0
         filter: 'blob:none'
     - uses: 'moonrepo/setup-toolchain@v0'
     - run: 'moon ci'
   ```
2. provider อื่น: ติดตั้ง moon ผ่าน package manager (`bun add -D @moonrepo/cli`) แล้วรัน `bunx moon ci`
3. PR report comment: ใช้ `moonrepo/run-report-action@v1` หลัง `moon ci` พร้อม `if: success() || failure()`
4. ดู provider matrix ทั้งหมดใน [references/ci.md](../../references/ci.md)

### 6. Shard Across Jobs (Optional)

> Goal: parallelize affected tasks ข้าม CI jobs

1. ใช้ `--job` (0-based index) + `--job-total`:
   ```sh
   moon ci --job ${{ matrix.index }} --job-total 2
   ```
2. GitHub: emulate parallelism ด้วย `strategy.matrix.index`; Buildkite/CircleCI ใช้ native parallelism keys — ตัวอย่างใน [references/ci.md](../../references/ci.md)

### 7. Cache Artifacts

> Goal: artifacts/cache พร้อมใช้ระหว่าง CI runs

1. prefer remote caching ตาม `subskills/optimize-cache/SKILL.md`
2. manual persistence: persist เฉพาะ `.moon/cache/{hashes,outputs}` — ห้าม persist ไฟล์อื่นใน `.moon/cache` (ไม่ portable)
3. อย่า cache แบบไม่มี invalidation — hash เปลี่ยนทุก run ทำให้ cache ขยะ (เหตุผลที่ remote caching service มีอยู่)

### 8. Verify

> Goal: CI run จริงผ่านเกณฑ์

1. รัน `moon ci` บน branch ทดสอบ — ตรวจ affected detection ถูกต้อง
2. ตรวจ `ciReport.json` มี actions ที่คาดหวัง
3. ถ้า affected detection ว่างเปล่า → ตรวจ fetch-depth และ `vcs.defaultBranch`

## Rules

### 1. Never Shallow Clone

- `moon ci` ต้องการ merge base — shallow clone ทำ affected detection พัง
- ใช้ `filter: 'blob:none'` แทน `fetch-depth: 1` เมื่อกังวลความเร็ว

### 2. runInCI Discipline

- task ที่ spawn server หรือ watch process ต้อง `runInCI: false` เสมอ
- tasks `dev`/`start`/`serve` ปิด default — อย่าเปิดกลับ

### 3. Report Artifacts

- `.moon/cache/ciReport.json` ไม่ persist ระหว่าง runs — copy/upload ทันทีถ้าต้องใช้
- ใช้ `run-report-action` สำหรับ PR visibility บน GitHub

- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /follow-monorepo ถ้าจำเป็น

## References

- [CI provider configs, sharding, remote cache](../../references/ci.md)

## Expected Outcome

- `moon ci` รัน affected tasks เท่านั้นบน CI provider
- `runInCI` ตั้งถูกต้อง — ไม่มี server tasks ค้างใน CI
- full git history พร้อม — affected detection แม่นยำ
- `ciReport.json` + PR report (GitHub) พร้อมใช้
