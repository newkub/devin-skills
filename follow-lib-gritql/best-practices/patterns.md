# GritQL — Pattern Authoring

## Recommended Patterns

### Snippet Patterns และ Variables

- code snippet ใน backticks คือ pattern พื้นฐาน: `` `console.log($message)` `` — parse เป็น AST แล้ว match structurally ไม่ใช่ text
- metavariable `$name` match node ใดก็ได้; ใช้ variable เดิมซ้ำ = บังคับ equality เช่น `` `$x === $x` `` match เฉพาะ compare ตัวเดียวกัน
- spread metavariable `$$$args` match argument list ยาวเท่าไหร่ก็ได้ — `` `foo($$$args)` ``
- ใช้ `as $name` capture node span ทั้งก้อนเมื่อต้องชี้ตำแหน่งใน diagnostic หรือ rewrite

### Conditions ด้วย where

- `where` clause กรอง match เพิ่มเติม: `where { $x <: `literal` }` หรือ combine ด้วย `or`/`and`/`not`
- operator `<:` = pattern subsumption — `$x <: pattern` หมายถึง node ใน `$x` match pattern นั้น
- ใช้ `contains`, `within`, `includes` สำหรับ structural relations (เช่น ต้องอยู่ใน class ที่ชื่อ X)
- pattern ที่ซับซ้อนแยกเป็น named pattern แล้ว compose — อ่านง่ายกว่า where ยาวๆ เส้นเดียว

### Language และ Engine Selection

- ประกาศ target เสมอ: `language js(typescript,jsx)` / `language css` / `language json` — ไม่ประกาศ = default ตาม context
- `engine biome(1.0)` ให้ match Biome AST node โดยตรง เช่น `JsIfStatement` — ใช้เมื่อ snippet syntax match ไม่พอ
- เช็ค integration status ของ language ก่อน — บางภาษาอยู่ระหว่าง experimental

## Do / Don't

| Do | Don't |
|---|---|
| ประกาศ `language ...` ชัดเจนทุก pattern | assume default language ถูกเสมอ |
| ใช้ same `$var` ซ้ำเมื่อต้องการ equality | ใช้ regex ใน where เมื่อ structural match ทำได้ |
| แยก named pattern สำหรับ logic ซับซ้อน | เขียน where clause ยาวอ่านไม่รู้เรื่อง |
| test pattern บน `biome search` กับ code จริงก่อน | assume pattern ทำงานจาก spec เพียงอย่างเดียว |
| match specific node type เมื่อรู้ target | ใช้ `$x` เดี่ยวๆ แล้ว filter ทีหลัง (ช้า) |

## Common Pitfalls

- backtick ใน pattern ต้อง escape เมื่อยิงผ่าน shell — ห่อทั้ง pattern ด้วย single quotes
- metavariable `$x` ไม่ match ข้าม statement boundary — statement-level vs expression-level ต่างกัน
- pattern ที่ match whitespace/formatting ต่างกันได้ — GritQL match AST ไม่ใช่ text ดังนั้น formatting ไม่สำคัญ แต่ semicolon/structure สำคัญ
- `$$$args` อยู่ได้เฉพาะตำแหน่ง spread (argument list, elements) — ใส่ผิดที่ match ไม่ติด

## Performance Notes

- specific node type pattern เร็วกว่า generic snippet — engine prune ได้ตั้งแต่ node kind
- หลีกเลี่ยง pattern ที่ root เป็น `$x` โล่งๆ — บังคับ walk ทุก node ในทุกไฟล์
- `within`/`contains` constraints ช่วย prune tree ได้เร็วกว่า where ที่เช็คทีหลัง
- benchmark บน codebase จริง — pattern ที่ดูเล็กอาจ scan ช้ามากบน monorepo ใหญ่

## Ecosystem / Integration

- GritQL ใน Biome ใช้ผ่าน `biome search` และ `.grit` lint plugins เท่านั้น — ไม่มี standalone binary
- codemod ข้ามภาษาที่ Biome ไม่รองรับ → พิจารณา ast-grep (`/use-astgrep`) แทน
- เอกสาร canonical: `https://biomejs.dev/reference/gritql/`
