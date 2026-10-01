---
title: ast-grep napi API Reference
description: JS/TS programmatic API surface, dynamic language registration, and performance tips
---

# @ast-grep/napi API Reference

Source: `https://ast-grep.github.io/guide/api-usage/js-api` + `.../performance-tip` (checked 2026-10-01)

## Entry Points

| api | description | signature/example |
|-----|-------------|-------------------|
| `parse` | source string → `SgRoot` (sync, 1 thread) | `parse(Lang.TypeScript, src)` |
| `parseAsync` | parse บน libuv thread pool — preferred | `await parseAsync(Lang.TypeScript, src)` |
| `kind` | kind name → numeric kind id | `kind(Lang.JavaScript, 'string')` |
| `findInFiles` | parse+match หลายไฟล์ parallel Rust threads | `findInFiles(lang, { paths: ['src'], matcher: { rule } }, cb)` → `Promise<number>` (file count) |
| `registerDynamicLanguage` | register `@ast-grep/lang-*` parser | `registerDynamicLanguage({ python: langPython })` — ครั้งเดียวต่อ process |

## SgNode Methods

| method | description |
|--------|-------------|
| `find(m)` / `findAll(m)` | matcher = string pattern / kind number / `NapiConfig` (`{ rule, constraints }`); `find` → `SgNode\|null`, `findAll` → `SgNode[]` |
| `getMatch(m)` / `getMultipleMatches(m)` | `$X` single metavar / `$$$X` multi metavar |
| `range()` / `kind()` / `text()` / `isLeaf()` | inspect — `range()` → `{ start, end }` Pos (`line`, `column`, `index` — 0-indexed) |
| `matches` / `inside` / `has` / `precedes` / `follows` | refinement filters — pattern เท่านั้น |
| `children` / `namedChildren` / `field` / `parent` / `child` / `ancestors` / `next` / `nextAll` / `prev` / `prevAll` | traversal — FFI call ทุกครั้ง หลีกเลี่ยง recursion |
| `replace(text)` → `Edit` / `commitEdits(edits)` → `string` | `SgNode` immutable — `replace` สร้าง `Edit` (`{startPos, endPos, insertedText}`); metavar ไม่ถูก expand ใน `replace()` — ใช้ `getMatch('A').text()` + string concat เอง (issue #1172) |

## Performance Tips

| prefer | over | why |
|--------|------|-----|
| `parseAsync` | `parse` | parse ขนานหลาย thread (libuv pool) |
| `findAll({ kind })` | manual `children()` recursion | FFI ครั้งเดียว vs FFI ต่อ node |
| `findInFiles` | JS loop + `parse` ทีละไฟล์ | parallel Rust threads ไม่เสีย FFI per file |

`findInFiles` caveat — Promise resolve ก่อน callback ครบได้ (NodeJS limitation, ast-grep#206) → guard ด้วย counter:

```ts
let i = 0
const total = await findInFiles(Lang.TypeScript, cfg, (err, nodes) => {
  // ...collect nodes
  if (++i === total) done()
})
if (i < total) await waitForAll() // รอจน callback ครบ total files
```

## Dynamic Languages

napi ships เฉพาะ JS ecosystem langs เป็นค่าเริ่มต้น — ภาษาอื่นต้อง prebuilt parser:

```sh
bun add -D @ast-grep/napi @ast-grep/lang-python   # pnpm 10+: ต้อง --allow-build=@ast-grep/lang-python (postinstall วาง parser lib)
```

```ts
import langPython from '@ast-grep/lang-python'
import langBash from '@ast-grep/lang-bash'
import { parse, registerDynamicLanguage } from '@ast-grep/napi'

// เรียกครั้งเดียวรวมทุกภาษา — call ซ้ำถูก ignore (first call wins)
registerDynamicLanguage({ python: langPython, bash: langBash })

const sg = parse('python', 'print("hello")')   // ใช้ชื่อภาษาที่ register
sg.root().kind()
```

Package list: `https://github.com/ast-grep/langs#packages`
