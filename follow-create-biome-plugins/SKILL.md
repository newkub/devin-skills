---
name: follow-create-biome-plugins
description: สร้าง custom Biome linter plugins ด้วย GritQL
related:
  - follow-create-sdk
  - follow-tool-biome
  - follow-my-tech-stack
  - review-techstack
  - follow-tool-formatter
  - ship
---
## Goal

สร้าง custom Biome linter plugins ด้วย GritQL เพื่อเพิ่ม rules ที่เฉพาะทางสำหรับโปรเจกต์

## Scope

ครอบคลุมการสร้าง `.grit` plugin files, การเขียน GritQL patterns, การกำหนดค่าใน `biome.jsonc`, และการ verify plugins

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup

> Goal: ตรวจสอบ Biome และ project prerequisites

1. ตรวจสอบว่ามี Biome ติดตั้งแล้วโดยทำ `/follow-tool-biome`
2. ตรวจสอบว่ามี `biome.jsonc` อยู่แล้ว
3. ระบุ target language และ rules ที่ต้องการตรวจสอบ

### 3. Create Plugin File

> Goal: สร้างและเขียน `.grit` plugin file

1. สร้างไฟล์ `.grit` ที่ root ของโปรเจกต์
2. เพิ่ม `language` directive ที่ด้านบนของไฟล์ (เช่น `language css`, `language js`, `language json`)
3. เพิ่ม `engine biome(1.0)` directive เมื่อใช้ Biome CST node names
4. เขียน GritQL patterns สำหรับ custom rules
5. ใช้ `register_diagnostic()` เพื่อรายงาน diagnostics
6. ใช้ `or` block สำหรับรวมหลาย rules ในไฟล์เดียว

ดู [references/gritql-patterns.md](references/gritql-patterns.md) สำหรับ pattern syntax เต็ม

### 4. Configure Plugin

> Goal: ตั้งค่า plugin ใน `biome.jsonc`

1. เพิ่ม plugin path ใน `biome.jsonc` ผ่าน `plugins` array
2. ใช้ relative path จาก root ของโปรเจกต์
3. ใช้ `includes` เพื่อจำกัดไฟล์ที่ plugin ทำงาน (optional)
4. ตรวจสอบว่า plugin ถูก load อย่างถูกต้อง

ดู [references/biome-config.md](references/biome-config.md) สำหรับ configuration options เต็ม

### 5. Discover CST Node Names

> Goal: หา CST node names สำหรับ GritQL patterns

1. เปิด [Biome Playground](https://biomejs.dev/playground/)
2. วาง code snippet ที่ต้องการ match
3. สลับไปที่ Syntax tab เพื่อดู syntax tree
4. ใช้ node name (PascalCase) ใน GritQL pattern
5. ตรวจสอบ node names ใน `.ungram` files ใน Biome repository สำหรับ complete list

### 6. Verify

> Goal: ทดสอบ plugin กับ Biome

1. รัน `bunx biome lint` เพื่อทดสอบ plugin
2. ตรวจสอบว่า custom rules ทำงานได้ถูกต้อง
3. ทดสอบ edge cases และ false positives
4. ทดสอบ rewrites (`=>`) สำหรับ fixable diagnostics

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Plugin File

- ใช้นามสกุล `.grit` สำหรับ plugin files
- วางไฟล์ที่ root ของโปรเจกต์
- ใช้ `language` directive ที่ด้านบนเสมอ
- เพิ่ม `engine biome(1.0)` เมื่อใช้ Biome CST node names
- ใช้ `//` สำหรับ comments

### 2. Target Languages

- `language js` สำหรับ JavaScript (default)
- `language js(typescript)` สำหรับ TypeScript
- `language js(typescript, jsx)` สำหรับ TypeScript + JSX
- `language css` สำหรับ CSS
- `language json` สำหรับ JSON
- ถ้าไม่ระบุ จะใช้ JavaScript เป็น default

### 3. register_diagnostic()

- `span` (required): syntax node ที่ต้องการ attach diagnostic
- `message` (required): message ที่จะแสดง
- `severity` (optional): `hint`, `info`, `warn`, `error` (default: `error`)
- `fix_kind` (optional): `safe` หรือ `unsafe` (default: `unsafe`) ใช้เมื่อมี rewrite `=>`

### 4. GritQL Patterns

- Code snippets: ใช้ backticks `` ` `` ครอบ code
- Metavariables: ใช้ `$` prefix เช่น `$message`, `$value`
- Regex: ใช้ `r"..."` สำหรับ match text content ของ node
- Conditions: `where`, `<:` (match operator), `and`, `or`, `!`
- Pattern modifiers: `contains`, `within`, `after`, `before`, `some`, `every`, `as`
- CST nodes: ใช้ PascalCase function call เช่น `JsIfStatement()`, `CssDeclarationWithSemicolon()`
- CST fields: ใช้ named args เช่น `JsConditionalExpression(consequent = $cons)`
- Rewrites: ใช้ `=>` operator เช่น `` `console.log($msg)` => `console.warn($msg)` ``
- Multiple rules: ใช้ `or` block สำหรับรวมหลาย rules ในไฟล์เดียว

ดู [references/gritql-patterns.md](references/gritql-patterns.md) สำหรับตัวอย่าง patterns ทั้งหมด

### 5. Configuration

- กำหนด plugin ผ่าน `plugins` array ใน `biome.jsonc`
- ใช้ relative path จาก root ของโปรเจกต์
- รูปแบบ string: `["./custom-rules.grit"]`
- รูปแบบ object กับ `includes`: `[{ "path": "./plugin.grit", "includes": ["src//*.css"] }]`
- `includes` ใช้ glob patterns และรองรับ negation (`!`)
- Plugins สามารถกำหนดใน root `biome.jsonc` และ extended โดย child configs

ดู [references/biome-config.md](references/biome-config.md) สำหรับ configuration format เต็ม

### 6. Common CST Node Names

- JavaScript: `JsIfStatement`, `JsCallExpression`, `JsArrowFunctionExpression`, `JsVariableDeclaration`, `JsxElement`, `JsxAttribute`
- TypeScript: `TsAnyType`, `TsTypeAlias`, `TsInterfaceDeclaration`
- CSS: `CssDeclarationWithSemicolon`, `CssComplexSelector`, `CssDeclarationImportant`
- JSON: `JsonMember`, `JsonMemberName`, `JsonObjectValue`, `JsonArrayValue`
- ตรวจสอบ node names ใน [Biome Playground](https://biomejs.dev/playground/) เสมอ

ดู [references/gritql-patterns.md](references/gritql-patterns.md) สำหรับ CST node matching syntax

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-tool-formatter ถ้าจำเป็น

## Expected Outcome

- Plugin file `.grit` สร้างขึ้นที่ root
- `language` และ `engine` directives ถูกต้อง
- GritQL patterns ทำงานตามที่คาดหวัง
- Plugin กำหนดใน `biome.jsonc` อย่างถูกต้อง
- Custom rules ทำงานได้เมื่อรัน `bunx biome lint`
- ไม่มี false positives หรือ missing matches

## Guide

- [Biome Linter Plugins](https://biomejs.dev/linter/plugins/)
- [GritQL Plugin Recipes](https://biomejs.dev/recipes/gritql-plugins/)
- [GritQL Reference](https://biomejs.dev/reference/gritql/)
- [GritQL Language Documentation](https://docs.grit.io/language/overview)
- [Biome Playground](https://biomejs.dev/playground/)