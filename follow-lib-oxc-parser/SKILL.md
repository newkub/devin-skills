---
name: follow-lib-oxc-parser
description: "ใช้ oxc-parser parse JS/TS เป็น AST เร็วมาก — analysis, tooling, review CLI"
argument-hint: "[files-or-goal]"
related:
  - use-astgrep-programmatic
  - follow-lang-typescript
  - use-scripts
  - follow-best-practice
---

## Goal

ใช้ `oxc-parser` (NAPI binding ของ Oxc — Rust-based JS/TS parser) เพื่อ parse source code เป็น ESTree-compatible AST อย่างเร็ว สำหรับงาน analysis, tooling, review automation

## Scope

ใช้เมื่อต้องวิเคราะห์ JS/TS/JSX/TSX/dts แบบ programmatic AST access เช่น:

- ดึง imports/exports/symbols จากไฟล์จำนวนมาก
- สร้าง analyzer/linter เฉพาะทาง (เช่น review CLI)
- หา call sites, unused exports, dependency graph
- เดิน AST ด้วย visitor pattern

เลือก `oxc-parser` เมื่อต้องการ full AST + types; เลือก `/use-astgrep-programmatic` เมื่อต้องการ pattern matching แบบ declarative rules; ทำตาม `/follow-best-practice` และดู `/follow-lang-typescript` หรือ `/use-scripts` ตาม context

- Latest: `oxc-parser@0.149.0` (verified 2026-09-11)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Install

> Goal: ติดตั้ง version ที่ stable

1. `bun add -d oxc-parser` — pin version ที่ publish แล้วอย่างน้อย 7 วัน
2. ถ้าต้องการ type ของ AST เพิ่ม `bun add -d @oxc-project/types`

### 2. Parse Source

> Goal: ได้ ParseResult ที่ใช้งานได้

1. ใช้ `parseSync(filename, sourceText, options?)` เป็นหลัก — Oxc แนะนำ sync เพราะ AST deserialization ทำบน main thread อยู่แล้ว (async `parse` ช้ากว่าในหลายเคส)
2. ใช้ `parse()` เฉพาะเมื่อ I/O-bound จริง
3. ตั้ง `filename` ให้ตรง extension — parser เลือก dialect จาก `.ts`, `.tsx`, `.jsx`, `.mts`, `.cts`, `.d.ts` อัตโนมัติ
4. อ่าน `result.program` (ESTree AST), `result.comments`, `result.errors`, `result.module` (imports/exports/import.meta)

```ts
import { parseSync } from 'oxc-parser';

const result = parseSync('file.tsx', sourceText);
if (result.errors.length) console.warn(result.errors);
const program = result.program; // ESTree Program
```

### 3. Traverse AST

> Goal: เดิน AST ด้วย Visitor

1. ใช้ `new Visitor({ NodeType(node) {}, "NodeType:exit"(node) {} })` แล้ว `visitor.visit(result.program)`
2. Node type ตาม ESTree spec (`VariableDeclaration`, `CallExpression`, `ImportDeclaration` ฯลฯ)
3. ถ้าต้อง manual walk → เดิน recursive ผ่าน `program.body`

```ts
import { Visitor } from 'oxc-parser';

const visitor = new Visitor({
  ImportDeclaration(node) {
    console.log('import from', node.source.value);
  },
});
visitor.visit(result.program);
```

### 4. Parallel Parsing

> Goal: parse หลายไฟล์พร้อมกัน

1. ห้ามใช้ `parse()` เพื่อ "parallelize" — spawn thread overhead เกินประโยชน์
2. ใช้ worker threads (`node:worker_threads` หรือ Bun workers) + `parseSync` ภายใน worker
3. หรือ parse sequential — Oxc เร็วพอสำหรับหลายพันไฟล์

### 5. Print / Transform (ถ้าต้องการ)

> Goal: แปลง AST กลับเป็น code หรือ transform

1. Print AST → code: ใช้ `esrap` (`import ts from 'esrap/languages/ts'`)
2. Transform (TS→JS, JSX): ใช้ `oxc-transform` แยก package
3. Minify: `oxc-minify`; resolve: `oxc-resolver`

## Rules

### 1. Error Handling

- เช็ค `result.errors` เสมอ — parser เป็น error-tolerant ไม่ throw
- เลือก `options.showSemanticErrors` เมื่อต้องการเช็คลึกกว่า syntax

### 2. Options ที่ใช้บ่อย

- `sourceType: 'module' | 'script' | 'unambiguous'` — default `unambiguous`
- `lang: 'js' | 'jsx' | 'ts' | 'tsx' | 'dts'` — override เมื่อ filename ไม่ตรงจริง
- `preserveParens`, `allowReturnOutsideFunction` ตาม use case

### 3. เมื่อไหร่ใช้อะไร

- `oxc-parser` → full AST, type info, traversal, module analysis
- `/use-astgrep-programmatic` → pattern rules (`kind`, `pattern`, `has`, `inside`) สำหรับ lint-style checks
- `oxc-transform` → compile/transpile
- Tree-sitter/Babel → เฉพาะเมื่อต้องการ API ที่เข้ากันได้กับ ecosystem เดิม

### 4. Bun Compatibility

- `oxc-parser` ใช้ NAPI `.node` binaries — ทดสอบบน Bun ก่อน production; ถ้าเจอปัญหาให้ fallback `bun x tsx` หรือ Node runtime

## Expected Outcome

- Parse JS/TS ได้ AST ที่ถูกต้องและเร็ว (เร็วกว่า Babel ~3x, SWC ~2x)
- เดิน AST ด้วย Visitor หรือ manual walk ได้
- Handle parse errors และเลือก dialect ถูกจาก filename
