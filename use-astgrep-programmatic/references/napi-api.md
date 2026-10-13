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
| `parseAsync` | parse on the libuv thread pool — preferred | `await parseAsync(Lang.TypeScript, src)` |
| `kind` | kind name → numeric kind id | `kind(Lang.JavaScript, 'string')` |
| `findInFiles` | parse+match many files with parallel Rust threads | `findInFiles(lang, { paths: ['src'], matcher: { rule } }, cb)` → `Promise<number>` (file count) |
| `registerDynamicLanguage` | register `@ast-grep/lang-*` parser | `registerDynamicLanguage({ python: langPython })` — once per process |

## SgNode Methods

| method | description |
|--------|-------------|
| `find(m)` / `findAll(m)` | matcher = string pattern / kind number / `NapiConfig` (`{ rule, constraints }`); `find` → `SgNode\|null`, `findAll` → `SgNode[]` |
| `getMatch(m)` / `getMultipleMatches(m)` | `$X` single metavar / `$$$X` multi metavar |
| `range()` / `kind()` / `text()` / `isLeaf()` | inspect — `range()` → `{ start, end }` Pos (`line`, `column`, `index` — 0-indexed) |
| `matches` / `inside` / `has` / `precedes` / `follows` | refinement filters — pattern only |
| `children` / `namedChildren` / `field` / `parent` / `child` / `ancestors` / `next` / `nextAll` / `prev` / `prevAll` | traversal — an FFI call each time, avoid recursion |
| `replace(text)` → `Edit` / `commitEdits(edits)` → `string` | `SgNode` immutable — `replace` creates an `Edit` (`{startPos, endPos, insertedText}`); metavars are not expanded in `replace()` — use `getMatch('A').text()` + string concat yourself (issue #1172) |

## Performance Tips

| prefer | over | why |
|--------|------|-----|
| `parseAsync` | `parse` | parse in parallel across threads (libuv pool) |
| `findAll({ kind })` | manual `children()` recursion | one FFI call vs one per node |
| `findInFiles` | JS loop + `parse` file by file | parallel Rust threads, no per-file FFI cost |

`findInFiles` caveat — the Promise can resolve before all callbacks fire (NodeJS limitation, ast-grep#206) → guard with a counter:

```ts
let i = 0
const total = await findInFiles(Lang.TypeScript, cfg, (err, nodes) => {
  // ...collect nodes
  if (++i === total) done()
})
if (i < total) await waitForAll() // wait until all total-file callbacks fire
```

## Dynamic Languages

napi ships only the JS-ecosystem languages by default — other languages need a prebuilt parser:

```sh
bun add -D @ast-grep/napi @ast-grep/lang-python   # pnpm 10+: requires --allow-build=@ast-grep/lang-python (postinstall places the parser lib)
```

```ts
import langPython from '@ast-grep/lang-python'
import langBash from '@ast-grep/lang-bash'
import { parse, registerDynamicLanguage } from '@ast-grep/napi'

// register all languages in a single call — repeat calls are ignored (first call wins)
registerDynamicLanguage({ python: langPython, bash: langBash })

const sg = parse('python', 'print("hello")')   // use the registered language name
sg.root().kind()
```

Package list: `https://github.com/ast-grep/langs#packages`
