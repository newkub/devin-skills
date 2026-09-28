# Capture Component (merged จาก capture-component)

Capture UI component เฉพาะส่วนสำหรับ docs/review/testing ผ่าน `capture component`

## Execute

### 1. Identify Component

1. ถ้า user ระบุ component file → อ่านไฟล์เพื่อดู props และ variants
2. ถ้า user ระบุ URL + selector → ใช้ตรงๆ
3. ถ้าไม่ระบุ → ค้นหา components จาก `src/components`, `src/ui`, `packages/*/src/components`

### 2. Prepare Component View

> Goal: มีหน้าจอแสดง component เพียงอย่างเดียว

1. ถ้ามี Storybook → เปิด story ของ component นั้น
2. ถ้ามี dev server → สร้างหรือหา URL ที่ render component เปล่า ๆ
3. ถ้าเป็น static HTML → สร้าง temp page ใน `public/screenshots/components/<name>.html`
4. ถ้าเป็น TUI/CLI → ใช้ `capture terminal --cmd ...` แทน

### 3. Capture

```bash
bun <skill-dir>/src/presentation/cli.ts component <url> --selector "<css>" --out public/screenshots/components/<name>.png
```

- CLI จะ `scrollintoview` selector แล้ว screenshot viewport
- หลาย variants → แยกไฟล์ เช่น `<name>-primary.png`, `<name>-disabled.png`
- หลาย selectors บน routes เดียวกัน → ใช้ `capture all --components "nav=header@/,form=form@/request"` แทน

### 4. Verify And Report

1. เปิดดูภาพด้วย `read` — component ต้องชัดเจน
2. ถ้าไม่ชัด → ปรับ viewport (`capture all --devices "name=WxH"`) หรือ theme แล้ว capture ใหม่
3. ลบ temporary HTML หลัง capture เสร็จถ้าไม่ต้องการ

## Rules

- component ต้องแสดงเพียงอย่างเดียวบนหน้าจอ — ไม่ capture navbar/sidebar/layout
- ถ้า component ต้องใช้ provider → setup provider ก่อน capture
- ตั้งชื่อตาม component (PascalCase หรือชื่อไฟล์) + variant suffix
- บันทึกลง `public/screenshots/components/`
- ถ้า component ต้อง authentication → ถาม user ก่อน

## Expected Outcome

- ได้ภาพของแต่ละ component/variant แยกไฟล์ พร้อมใช้กับ `/review-uxui`, `/update-readme-md`
