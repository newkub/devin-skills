# Documentation Quality Checks

## Goal

Review documentation quality ครอบคลุม README, setup guide, API docs, examples, guides, changelogs

## Scope

ใช้สำหรับ review documentation ใน project — ไม่รวม SEO review หรือ code quality review — เน้น review เท่านั้น ไม่แก้ไข docs ระหว่าง review

## Checks

### README And Setup

1. ตรวจสอบ README มี overview, installation, usage, contributing
2. ตรวจสอบ setup guide ระบุ prerequisites, env vars, และ troubleshooting
3. ตรวจสอบว่า setup instructions ทำงานได้จริงบน clean environment
4. ตรวจสอบ link ภายใน README ไม่ broken
5. ตรวจสอบ one-command setup เช่น `bun install && bun dev`

### API And Code Examples

1. ตรวจสอบ API docs ครอบคลุม public functions, classes, endpoints
2. ตรวจสอบ `JSDoc`/`TSDoc` completeness บน public API: `@param`, `@returns`, `@throws`
3. ตรวจสอบ examples runnable และ up-to-date
4. ตรวจสอบ parameter types, return types, และ error cases ใน docs

### Guides And Changelogs

1. ตรวจสอบ guides ตรงกับ code ปัจจุบัน
2. ตรวจสอบ broken links, missing pages, stale screenshots
3. ตรวจสอบ changelog format (Keep a Changelog), entry completeness, breaking changes documentation
4. ตรวจสอบ migration guides ถ้ามี breaking changes

### Content Coverage

1. ทุก features ต้องมี guide
2. ทุก APIs ต้องมี examples
3. ทุก use cases ต้องมี documentation
4. ทุก concepts ต้องมี explanations
5. ทุก best practices ต้องมี guidelines

### Source Priority

1. ลำดับแหล่งข้อมูล: `DeepWiki` → `Context7` → `Web Search` → `Official Docs`
2. ใช้ `DeepWiki` ก่อนถ้าเป็น GitHub repository
3. ใช้ `Context7` สำหรับ libraries และ frameworks
4. อ้างอิง `Official Documentation` เสมอ

## Severity

- Critical: missing README, broken setup guide, incorrect API docs, public API ไม่มี docs, stale docs ที่ทำให้สับสน
- High: outdated example, broken link, missing `@param`/`@returns`, examples ที่ไม่ทำงาน
- Medium: incomplete guide, missing changelog entry
- Low: formatting, cosmetic improvement

## Rules

- ทุก finding ต้องมี file path หรือ URL
- ระบุ doc section ที่ขาดหรือ outdated
- ทำ review เท่านั้น ไม่แก้ไข docs ระหว่าง review
- ห้ามลบไฟล์หรือ content ที่มีอยู่
- ห้าม TODO, MOCK, placeholder, generic filler
