# Sgconfig And Ast-Grep Rules Check

ตรวจสอบ `sgconfig.yml` และ ast-grep `rules/` ที่ project root

## Sgconfig.yml Validation

- ต้องมีที่ project root
- ต้องมี fields:
  - `ruleDirs` — ระบุ rule directories
  - `languageAliases` — ภาษา aliases
  - `devPaths` — development paths

## Ast-Grep Rules Location

- ต้องอยู่ใน `rules/` ที่ project root (แยกจาก `.devin/rules/`)
- `ruleDirs` ต้องชี้ไปที่:
  - `rules/always-on`
  - `rules/model_decision`
  - `rules/glob`

## Scope Boundary

- ตรวจเฉพาะ location และ structure ของ `sgconfig.yml` และ `rules/`
- ไม่ตรวจเนื้อหา rules — ใช้ `review-rules` แทน

## Scoring

- High: ขาด `sgconfig.yml` หรือ fields สำคัญ
- Medium: `ruleDirs` ชี้ผิด
- Low: ขาดบาง subdirectory
