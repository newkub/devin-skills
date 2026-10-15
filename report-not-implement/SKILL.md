---
name: report-not-implement
description: รายงานสิ่งที่ยังไม่ implement: markers/MOCK/stub, dead UI, route ไม่มีของ, สิ่งที่ docs ระบุไว้
argument-hint: "[scope-or-path]"
related:
  - report
  - report-review
  - scan-codebase
  - use-astgrep
  - check-secrets
  - follow-tool-knip
  - check-test-correctness
  - implement-to-production
  - deep-test
  - use-subagents
  - update-todo-md
  - suggest-next-action
  - improve-usage-md
  - no-use-ignore
  - create-plan-in-dot-devin
---

## Goal

ตรวจและรายงานทุกอย่างที่ codebase "อ้างว่าจะมี แต่ยังไม่มีจริง" หรือ "มีโค้ด แต่ไม่ได้ผลจริง" เป็นตารางในแชท พร้อมหลักฐาน file:line เพื่อใช้เป็น work queue ก่อนลงมือ implement — report only, ไม่แก้ code

## Scope

- ใช้ก่อน `/implement-to-production` (ต้องการรายการงานที่ครบถ้วน), ก่อน release (ตรวจว่าของจริงตรงกับที่โฆษณา), หรือเมื่อผู้ใช้ถาม "อะไรยังไม่เสร็จ / ยังไม่ implement"
- argument เป็น path/glob/workspace → สแกนเฉพาะ scope นั้น; ไม่ระบุ → ทั้ง codebase รวม workspaces ใน monorepo
- สแกนตามสัญญา (contract) ที่มีอยู่จริงเท่านั้น: code ที่เขียนค้างไว้, UI ที่ render ได้, route/schema/spec ที่ประกาศ, คำที่ docs ประกาศ — ไม่ใช่รายการฟีเจอร์ในอุดมคติ (งาน net-new ที่ยังไม่เคยถูกออกแบบ → `/idea-features`)
- boundaries: คุณภาพ/ความปลอดภัยของ code → `/deep-review`; dead code ที่ไม่มี consumer → `/follow-tool-knip`; test ที่ assert ไม่มีสาระ → `/check-test-correctness`; แผนการแก้ → `/create-plan-in-dot-devin`; ลงมือแก้ → `/implement-to-production`

## Execute

### 1. Establish The Contract

> Goal: รู้ว่า "ของจริง" ต้องเป็นอะไร จึงจะวัดว่ายังไม่มี

1. ทำ `/scan-codebase` ดู stack, entry points, workspace members, generated/lock/vendor ที่ต้องข้าม และ conventions ของ project
2. เก็บ sources ของ "สิ่งที่สัญญาไว้": manifest (`package.json`/`Cargo.toml` bin+exports), API routes/procedures, schema+migrations, CLI command list, `README.md`/`FEATURES.md`/`USAGE.md`/docs, `TODO.md`, issue/plan ใน `.devin/temp/plan/<workspace>/`
3. อ่าน `AGENTS.md` ของ project ถ้ามี เพื่อไม่รายงานสิ่งที่ project ตีความว่ายังไม่ถึงคิว
4. scope ใหญ่/หลาย workspace → spawn profile `gap-scanner` (ใน `## Subagents`) ขนานตาม directory (read-only) แล้วรวมตาราง

### 2. Scan Markers And Stubs

> Goal: โค้ดที่เขียนค้างและฟังก์ชันที่ยังไม่มี logic

1. หา markers ด้วย `/use-astgrep` หรือ `rg`: `TODO`, `FIXME`, `XXX`, `HACK`, `not implemented`, `unimplemented`, `todo!()`, `NotImplementedError`, `panic!("TODO")` พร้อม `file:line` และ context
2. หา stub bodies: function ว่าง, `return null`/`return []`/`return true` ที่ไม่ได้มาจาก logic จริง, hard-coded array/object แทน query, `setTimeout` simulated delay, in-memory store แทน DB
3. หา error ที่กลืนงาน: `catch {}` ว่าง, fallback ที่เงียบ, `?? default` ที่ปิด path ที่ยังไม่มีของจริง
4. หา ignore/suppression ที่ masking งานค้าง (`@ts-expect-error`, `eslint-disable`, `biome-ignore`, `# noqa`) → รายงานเป็น pending work แล้วส่งต่อ `/no-use-ignore`

### 3. Scan Dead UI And Unreachable Wiring

> Goal: สิ่งที่ผู้ใช้เห็นหรือเรียกได้ แต่ไม่มีผลจริง

1. dead UI: `onClick={() => {}}`, `href="#"`, `disabled` ถาวรโดยไม่มีเงื่อนไข, dialog/modal/menu ที่ไม่มี open logic, form ที่ไม่มี submit handler, `alert()`/`console.log` แทน action, ข้อความ 'coming soon'/'ยังไม่พร้อม'/'暂未实现'
2. render จริงแล้วตรวจ ไม่ใช่อ่าน source อย่างเดียว → ใช้ `/deep-test website` หรือ `/deep-test e2e` click-through ทุก route แล้วจำแนกแต่ละ element เป็น `works`/`fake`/`missing`
3. unwired code: component/handler/usecase ที่มีอยู่แต่ไม่มีใครเรียก (ไม่ลงทะเบียน route, ไม่ export ผ่าน barrel, ไม่ได้ mount) → ยืนยันด้วย `/follow-tool-knip` ก่อนสรุป
4. config/env ที่ code อ่านแต่ไม่มีใน `.env.example`/manifest → ถือว่ายังไม่ implement (รันไม่ได้จริง) — ใช้ `/check-secrets env-vars`

### 4. Compare Promised Versus Real

> Goal: สิ่งที่ docs/API spec ประกาศไว้แต่ code ไม่มี

1. เทียบ route/procedure/command ที่ประกาศ (docs, OpenAPI, CLI help, manifest exports) กับที่มีจริงทีละตัว — ไม่มี handler, ไม่มี flag, ไม่มี command = `promised`
2. เทียบ schema/table/field กับ migration ที่ apply จริง — field ที่ประกาศแต่ไม่มี migration = `missing`
3. เทียบ `TODO.md` และ items ใน plan file กับ status จริงใน code (`/update-todo-md` อ่านให้) — mark `done` ใน docs แต่ของไม่จริง = `fake`
4. ถ้าต้องเทียบ docs promise ทั้งไฟล์กับ API/CLI จริง → ใช้ `/improve-usage-md` เป็นแหล่งตรวจ แล้วนำ findings มารวมในตารางเดียวกัน (ไม่ duplicate การตรวจ)

### 5. Verify Each Candidate

> Goal: ไม่รายงาน false positive

1. ทุก candidate ต้องมี evidence ที่อ่านเอง: `file:line` + ประโยค/บล็อกที่ยืนยัน + ผลรันจริงถ้าตรวจสอบได้ (เรียก endpoint, รัน command)
2. จำแนก status เดียวต่อ item:
   - `missing` ไม่มีโค้ดของนั้นเลย
   - `fake` มีโค้ดแต่คืนค่า mock/hardcoded/no-op ทำให้อาจดูผ่านโดยไม่มีของจริง
   - `partial` ทำงานได้เฉพาะ happy path ขาด error/empty/loading/edge states หรือ validation
   - `unwired` มีโค้ดครบแต่ไปไม่ถึงจาก entry point ของผู้ใช้
   - `promised` ถูกอ้างใน docs/spec/plan แต่ไม่มีใน code
3. ไม่ dedupe ด้วยการเดา — ตำแหน่งต่างกันแต่ same root cause → รวมเป็น item เดียวแล้ว listing ทุก site (หนึ่ง fact หนึ่ง source → `/follow-single-of-source`)
4. ข้าม generated code, lockfiles, vendor, snapshots และ tests ที่ mock by design (mock ใน test ไม่ใช่ gap); ไฟล์ที่อยู่ใน `.gitignore` แต่ยังถือเป็น source จริงของ project ให้รวมไว้ด้วย — ครอบคลุมทุก workspace ไม่ใช่แค่ root

### 6. Report And Hand Off

> Goal: รายงานที่ใช้เป็น work queue ได้ทันที

1. แสดงสรุปด้านบน: จำนวน items ต่อ status, ต่อ domain (`schema`/`data`/`api`/`ui`/`infra`/`test`/`docs`), และเปอร์เซ็นต์ของ scope ที่ตรวจจริง
2. รายละเอียดส่งผ่าน `/report-review` เป็นตารางเดียวในแชท: `No.` | `Location` | `Domain` | `Item` | `Status` | `Evidence` | `Blocking` | `Effort` | `Verify`
3. เรียงตาม critical path ก่อน: `schema` → `data` → `api` → `ui` → `infra` → `docs`; item ที่ item อื่น depend อยู่บน → ใส่ `Blocking` เป็น id ของมัน
4. ระบุ source + วันที่/commit ที่สแกน (`git rev-parse --short HEAD`) เพื่อให้เทียบผลรอบถัดไปได้
5. handoff: จะลงมือทำ → `/implement-to-production` (ต้อง implement ทั้งหมดที่ report ไว้ ไม่ใช่เลือกทำ); อยากได้คุณภาพควบคู่ → `/improve`; ต้องแผนหลายขั้น → `/create-plan-in-dot-devin`; ปิดท้าย `/suggest-next-action`
6. ถ้า user ต้องการไฟล์รายงาน explicitly เท่านั้น → `/create-report-in-dot-devin`; default ไม่สร้างไฟล์

## Rules

### 1. Read Only

- skill นี้ห้ามแก้ code, ห้ามลบ marker, ห้าม implement — สร้างความรู้สถานะอย่างเดียว
- งานแก้ทั้งหมดส่งต่อ `/implement-to-production`/`/fix`/`/refactor` ตามประเภท

### 2. Evidence Over Guess

- ทุก row ต้องชี้ `file:line` จริงหรือผลรันจริง — ห้ามสรุปจากคำว่า "น่าจะยังไม่ได้ทำ"
- สงสัยระหว่าง `fake` กับ `works` → รัน/คลิกจริงก่อนตัดสิน (`/deep-test website`, `/run-dev` + browser)
- ไม่ filter เองเพื่อรายงาน "เฉพาะที่ดูแย่"; รายงานครบแล้วจัด priority แทน
- หนึ่ง item หนึ่ง status; ถ้าข้อมูลไม่พอจำแนก → ใส่ `unknown` พร้อมสิ่งที่ต้องตรวจเพิ่ม

### 3. Coverage Of Scope

- ต้องครอบคลุมทั้ง scope ที่ผู้ใช้ให้ ไม่ใช่ตัวอย่างบางส่วน; ตรวจไม่ครบ → บอกชัดว่าครอบคลุมกี่ routes/files และส่วนใดไม่ได้ตรวจ
- ทุก workspace ใน monorepo ต้องถูกรวม — ใช้ `/check-monorepo` แล้วไล่ทีละ member หรือ spawn ขนาน
- งานซ้ำได้: รันคำสั่งเดิมบน commit ต่างกันเพื่อเทียบว่า gap ปิดหรือเปิดเพิ่ม

### 4. Report Format

- ใช้ `/report table` สำหรับตารางหลัก และสรุป numbered ด้านล่าง
- backticks สำหรับ paths/commands/symbols; ไม่ใช้ bold markers; ตอบในแชทเท่านั้น (ไฟล์เฉพาะเมื่อ user ขอ)

## Subagents

> Goal: งานสแกนอิสระที่ spawn ขนานได้ — profile inline ที่นี่ไม่ต้องมีไฟล์แยก; spawn ผ่าน `/use-subagents` โดยส่ง inputs ตามที่ profile กำหนด; เป็น read-only เท่านั้น ผลทั้งหมด parent เป็นคนรวมและ verify

### gap-scanner — inventory TODO/MOCK/placeholder/hardcoded ใน scope ที่ได้รับ (read-only)

- Inputs: `root` (directory ที่ต้องสแกน), `markers` optional (เพิ่มจาก `TODO|FIXME|XXX|HACK|MOCK|FAKE|STUB|placeholder`), `plan-file` optional (path plan/`TODO.md` ที่ต้องเทียบ items), `contract` optional (รายการ routes/commands ที่ต้องตรวจว่ามี handler จริง)
- Tools: `exec` — `rg`/ast-grep หา markers + hardcoded values; `read`/`grep` — context รอบ marker; `find_file_by_name` — หา `TODO.md`, `.env.example`, config files
- Execute: 1) สแกน markers ทั้งหมดใน `root` พร้อม `file:line`+context รวม dead-UI (`onClick={() => {}}`, `href="#"`, `disabled` ถาวร, `alert(`, 'coming soon') → 2) จำแนกแต่ละ item ตาม domain `schema`/`data`/`api`/`ui`/`infra`/`test`/`docs`/`unknown` → 3) เช็คว่าเป็น mock data / stub function / hardcoded value / missing implementation แล้วกำหนด `Status` ตาม `### 5` ของ parent → 4) ถ้ามี `contract` เทียบรายการกับของจริงใน code → 5) ถ้ามี `plan-file` เทียบ items → 6) ห้ามแก้ไขไฟล์ (inventory อย่างเดียว)
- Output: ตาราง `No.` | `Location` | `Domain` | `Item` | `Status` | `Evidence` | `Blocking` | `Effort` | `Verify` พร้อมสรุป total ต่อ domain, suggested order, critical path candidates
- Constraints: model `sonnet`; tools จำกัด `read`/`grep`/`glob`/`find_file_by_name`/`exec`, deny `write`/`edit` — สแกนอย่างเดียว; รายงานทุก marker ที่เจอ ไม่ filter เอง (parent จัด priority); อยู่เฉพาะใน `root` ที่กำหนด; ข้าม generated/lock/vendor

## Expected Outcome

- ได้รายการครบของสิ่งที่ยังไม่ implement จริงทั้ง scope พร้อม `file:line` evidence และ status (`missing`/`fake`/`partial`/`unwired`/`promised`)
- รู้ว่าอะไร block อะไร และลำดับที่ควรทำ (critical path) — ใช้เป็น work queue ของ `/implement-to-production` ได้ทันที
- ไม่มี false positive เพราะทุก item ผ่านการ verify ด้วยอ่าน context หรือรันจริง
- รายงานในแชทตารางเดียว ไม่สร้างไฟล์ ไม่มีการแก้ไข code
