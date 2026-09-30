---
name: check-file-relation
description: ตรวจ file relations (imports) + concat ทุกไฟล์หรือเฉพาะไฟล์ที่เกี่ยวข้องเป็น output เดียว — Rust CLI, multi-language + custom regex
argument-hint: "<dir> [--all|--from <file>|--summary|--json] [--ext|--include|--order|--pattern|--max-lines]"
related:
  - read-all-files
  - follow-create-cli
  - update-devin-global-skills
  - deep-review
  - check-long-files
  - analyze-file-structure
  - run-check

---

## Goal

Rust CLI ตรวจ dependency graph ระหว่างไฟล์จาก import statements (TS/JS, Rust, Go, Python, Java, Kotlin, C#, Vue, Svelte) + custom regex — และ concat ไฟล์เป็น output เดียว `===== <path> =====` + content (repomix-style) สำหรับ feed เข้า LLM/review — engine หลักของ `/read-all-files`

## Scope

- Read-only analysis — ไม่แก้ไขไฟล์ที่ scan
- Built-in extractors: `import`/`export from`/`require`/dynamic `import()` (JS/TS family), `use`/`mod`/`crate::`/`super::` (Rust), `import` (Go), `import`/`from x import` (Python), `import` (Java/Kotlin), `using` (C#)
- Custom patterns ผ่าน `--pattern '<regex>'` (repeatable, capture group แรก = module specifier)
- Resolve relative/`crate::`/`@/`/`~/` paths ไปยังไฟล์จริง (เติม extension, `index.*`, `mod.rs`, `__init__.py`)
- Source เดียว: `src/main.rs` + `Cargo.toml` — deps: `ignore`, `regex`, `serde`/`serde_json`, `globset`

## Execute

### 0. Build

> Goal: compile binary (ครั้งแรกหรือหลังแก้ source)

```bash
cd <skill-dir> && cargo build --release
# binary: <skill-dir>/target/release/check-file-relation.exe
```

ตัวอย่างข้างล่างใช้ `cfr` แทน path binary

### 1. Relation Map

> Goal: ได้ dependency graph ของ directory

```bash
cfr <dir>                  # file → imports (resolved path หรือ [external])
cfr src --summary          # top imported internal files เท่านั้น
cfr src --json             # machine-readable graph สำหรับ downstream tooling
```

### 2. Concat Files

> Goal: output เดียวที่มีไฟล์ต่อกัน `===== <path> =====` + content

```bash
cfr src --all                          # ทุกไฟล์ที่ match
cfr src --all --order smart            # config → entry → deps topo → rest
cfr src --from src/index.ts            # เฉพาะไฟล์ที่ reachable จาก entry (default order = deps)
cfr src --all --max-lines 250          # จำกัดบรรทัดต่อไฟล์
cfr src --all --out bundle.txt         # เขียนลงไฟล์แทน stdout
```

### 3. Filters

> Goal: scope เฉพาะภาษา/กลุ่มไฟล์ที่ต้องการ

```bash
cfr . --ext ts,tsx                            # extension filter
cfr . --include "src/**/*.ts"                 # glob vs root-rel path (repeatable, csv ได้)
cfr . --include "*.json" --include "*.toml"   # รวม non-source ด้วย (override --ext)
cfr . --ext rs --no-ignore                    # รวม target/ dist/ ด้วย
```

### 4. Custom Import Patterns

> Goal: รองรับ framework/import style ที่ built-in ไม่ครอบ

```bash
cfr src --pattern '#include\s+"([^"]+)"'
cfr src --pattern 'from\s+([\w./-]+)\s+import' --ext py
```

- `--pattern` ซ้ำได้หลายอัน — merge กับ built-in extractor ของ extension นั้น
- Capture group แรกต้องเป็น module specifier/path

### 5. Options Reference

| Flag | Argument | ความหมาย |
|------|----------|----------|
| (default) | — | relation map `file → imports` |
| `--all` | — | concat ทุกไฟล์ที่ match |
| `--from` | `<file>` | concat เฉพาะ entry + transitive internal deps (default `--order deps`) |
| `--summary` | — | stats + top imported internal files |
| `--json` | — | JSON `{root, files, edges, internal, graph}` |
| `--ext` | `<csv>` | filter นามสกุล (default: `ts,tsx,js,jsx,mts,cts,rs,go,py,java,kt,kts,cs,vue,svelte`) |
| `--include` | `<glob>` | match root-rel path — repeatable/csv; override `--ext` เพื่อ match non-source (`*.json`, `*.toml`) ได้ |
| `--pattern` | `<regex>` | custom import matcher, capture group 1 = specifier (repeatable) |
| `--order` | `alpha\|deps\|smart` | concat order — `alpha` ตามชื่อ, `deps` topo (deps ก่อน), `smart` = config → entry → deps → rest |
| `--max-lines` | `<n>` | truncate แต่ละไฟล์ใน concat modes |
| `--no-ignore` | — | รวม `node_modules`, `.git`, `target`, `dist`, `build`, ... |
| `--out` | `<file>` | เขียน output ลงไฟล์แทน stdout |
| `-h`, `--help` | — | usage |

### 6. Interpret Results

> Goal: ใช้ผลลัพธ์ต่อ workflow หลัก

1. `[external]` = bare specifier/npm package — ไม่ resolve เป็นไฟล์ใน tree
2. Resolved path = internal edge — ใช้หา cycles, orphans, shared hubs
3. `--json` graph ส่งต่อให้ `/deep-review` (domain `review-architecture`) หรือ script อื่นผ่าน `/use-scripts`
4. Concat output ใช้โดย `/read-all-files` — `--order smart` สำหรับ mode `all`, `--from <entry>` สำหรับ related files

## Rules

### 1. Read-Only

- ห้ามแก้ไขไฟล์ที่ scan — เขียนได้เฉพาะผ่าน `--out`/redirect
- `--all`/`--from` output อาจมี credentials — ทำ `/check-secrets` ก่อน feed เข้า LLM

### 2. Performance

- ข้าม `node_modules`, `.git`, `target`, `dist`, `build`, `out`, `.next`, `.nuxt`, `.svelte-kit`, `coverage`, `.output`, `vendor`, `__pycache__` เป็น default (`--no-ignore` ถ้าต้องการ)
- codebase ใหญ่มาก → scope ด้วย `--ext`, `--include`, path ย่อย หรือ `--max-lines`

### 3. Accuracy

- Regex extraction ไม่ใช่ full parser — import ใน comments, re-export chains, conditional imports, macro-generated mods อาจหลุด/เกิน
- ต้องการ precision สูง → `/use-astgrep` หรือ compiler API (`tsc --listFiles`, `cargo modules`) ตาม `/check-my-global-cli` tool map

## Expected Outcome

- Relation map: `file → imports` พร้อม resolved path หรือ `[external]`; `--summary` = internal files ที่ถูก import มากสุด; `--json` = graph สำหรับ downstream tooling
- Concat: output เดียว `===== path =====` + content ในลำดับ `alpha`/`deps`/`smart` หรือเฉพาะกลุ่ม related ผ่าน `--from` — พร้อม pipe/redirect/feed เข้า LLM
