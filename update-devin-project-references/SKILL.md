---
name: update-devin-project-references
description: gen website.md/api.md/cli.md เป็นตาราง markdown จาก source ด้วย ast-grep + crw map — deterministic
argument-hint: "[website|api|cli]"
related:
  - follow-tool-crw
  - use-astgrep
  - check-types-definition
  - follow-deterministic
  - update-docs
  - report-file-structure
  - deep-review
  - suggest-next-action
---

## Goal

สร้าง CLI (refs-cli) ที่เมื่อ run แล้ว generate reference files เป็นตาราง markdown:

1. `website.md` — ทุก route ทุก segment จาก `crw map`
2. `api.md` — dependencies, exported symbols, endpoints จาก source และ `.d.ts` ด้วย ast-grep programmatic
3. `cli.md` — commands และ flags จาก commander/clap ด้วย ast-grep

รองรับหลายภาษา (ts/tsx/rust, เพิ่มภาษาอื่นได้ที่ `langs.ts`) และ output เป็น deterministic table (sort + dedupe) — re-run แล้ว diff นิ่ง

## Scope

- ใช้กับ project ใดก็ได้โดย `--root <dir>` — ไม่ได้จำกัดเฉพาะ skills repo นี้
- สร้างไฟล์ลง `.devin/references/` (override ด้วย `--out`) — เป็น generated artifact ห้าม edit มือ
- api/cli ทำงาน offline จาก source ล้วนๆ; website ต้องมี site ที่ serve อยู่จริง + `--url`
- ไม่ครอบครอง content writing — ส่งต่อ `/update-docs` / `/follow-tool-vitepress` เมื่อเอา refs ไปเขียน docs ต่อ

## Execute

### 1. Prerequisites

> Goal: ตรวจ tool ที่ refs-cli ต้องการ

1. ต้องการ `bun`, `ast-grep` และ (เฉพาะ website domain) `crw`
2. ตรวจด้วย:

```bash
bun --version
ast-grep --version
crw --version   # เฉพาะ website; ถ้ายังไม่มี → /follow-tool-crw (`curl -fsSL https://fastcrw.com/install | sh`)
```

### 2. Generate api + cli (offline)

> Goal: สร้างตาราง symbols/endpoints/commands/flags จาก source

```bash
bun <skill-dir>/scripts/refs-cli/index.ts api cli --root <project-dir> --dry-run
```

1. `--dry-run` พิมพ์ markdown ออกมาในแชทก่อน — review ว่าตารางไม่ว่าง/ไม่มี junk
2. พอใจแล้วลบ `--dry-run` เพื่อเขียนไฟล์จริงลง `<root>/.devin/references/`
3. ไม่ระบุ domain → default `api cli`

### 3. Generate website.md (crw)

> Goal: ผัง route ทั้งหมดของ site ด้วย `crw map`

```bash
bun <skill-dir>/scripts/refs-cli/index.ts website --url https://staging.example.com --root <project-dir>
```

1. Site ต้องเข้าถึงได้ (dev server, preview, หรือ production)
2. ถ้า `crw` ยังไม่ได้ setup → รัน `crw setup` ก่อน (ดู `/follow-tool-crw`)
3. ตารางที่ได้: `URL | Path | Segments | Depth` ทุก URL ที่ map เจอ

### 4. Extend Languages

> Goal: เพิ่มภาษาใหม่ (เช่น go, python, kotlin)

1. เพิ่ม entry ใน `scripts/refs-cli/langs.ts` (`id`, `glob`, `sg` = ast-grep language)
2. เพิ่ม pattern table ใน `api.ts` (`*_SYMBOL_PATTERNS`) และ `cli.ts` ตามโครงเดิม
3. probe pattern กับ fixture เล็กก่อนเสมอ (`ast-grep run -p <pattern> -l <lang> --json <files>`) — ดู `/use-astgrep`
4. ถ้า pattern ไม่ match (syntax ต่างไป เช่น return-type arrow ใน rust) → เพิ่ม variant ของ pattern อย่าบังคับ pattern เดียวครอบทุก case

### 5. Verify Output

> Goal: ยืนยัน table ถูกรวมทั้งครบ

1. รันคำสั่งเดิมซ้ำ → ไฟล์ต้องไม่ต่าง (deterministic check)
2. เปิด `api.md`/`cli.md` เทียบกับ source จริง 1-2 rows (symbol name, file, line)
3. ตรวจ coverage: section ว่าง (`_No entries._`) → project อาจไม่มี route/CLI จริง หรือ pattern ครบ → เพิ่ม pattern ตาม step 4
4. ถ้าต้องตรวจ type/API surface ลึกกว่าตาราง → ส่งต่อ `/check-types-definition`

## Rules

### 1. Generated Files Are Artifacts

- ไฟล์ใน `.devin/references/` ห้ามแก้ไขด้วยมือ — แก้ที่ source แล้ว re-run
- ห้าม commit generated refs ที่ stale — re-run ก่อน ship เสมอ (ตรวจด้วย `/check-should-update`)
- เพิ่ม `.devin/references` ใน `.gitignore` หรือ commit ทั้งโฟลเดอร์แบบตั้งใจ เลือกเอาเชิงเดียวต่อ project

### 2. Deterministic Output

- ทุกตาราง sort + dedupe ใน `render.table` แล้ว — ห้ามใส่ row ที่ขึ้นกับ time/path สัมบูรณ์
- ใช้ path เทียบ `--root` แบบ POSIX เท่านั้น
- ดู principle: `/follow-deterministic`

### 3. Pattern Discipline (ast-grep)

- ทุก pattern ต้อง probe กับ fixture ก่อน commit เข้า `api.ts`/`cli.ts`
- pattern ที่ error → `sgFind` ข้ามเงียบๆ; ถ้า table ว่างผิดปกติให้ suspect pattern ไม่ใช่ suspect project
- endpoint ต้อง filter สองชั้น: method ∈ HTTP methods และ path ขึ้นต้น `/` — กัน false positive จาก `.get(key)` ของ Map/cache

### 4. Boundaries

- website domain ใช้ `crw map` เท่านั้น — interactive browsing → `/use-agent-browser`
- content/docs writing ต่อจาก refs → `/update-docs` ไม่เขียนทับลง `.devin/references`
- review ความสอดคล้อง refs-vs-code → `/deep-review` domain `review-docs`

### 5. Output Format

- ตารางทุกตารางมี header ชัด: `File` และ `Line` (1-based) ให้ click ไปถึง source ได้
- column details ดู `references/output-format.md`
- CLI flags ครบดู `references/cli.md`

## Expected Outcome

- `website.md`/`api.md`/`cli.md` เป็นตาราง markdown ครบถ้วน deterministic ใน `.devin/references/`
- re-run ได้ผลเท่าเดิม diffสะอาด
- เพิ่มภาษาใหม่ได้ด้วยการแก้ `langs.ts` + pattern table ที่เดียว
- พร้อมส่งต่อ `/update-docs`, `/check-types-definition`, `/deep-review` สำหรับงานถัดไป
