# Content Quality Check

ตรวจ content quality ใน docs pages

## Real Data

1. เนื้อหาต้องมาจาก source code จริง
2. examples ต้องรันได้จริง
3. ห้ามใช้ placeholder หรือ lorem ipsum
4. ห้ามใช้ TODO, MOCK หรือ generic filler

## Markdown Only

1. เขียนเนื้อหาด้วย markdown ธรรมดา
2. ห้ามสร้าง HTML report, interactive table หรือ UX ซับซ้อน
3. ตารางใช้ markdown table ได้
4. ไม่ใช้ Vue components ยกเว้น `:::` ของ VitePress เมื่อจำเป็น

## Language

1. เนื้อหา markdown ใช้ภาษาของ project หรือภาษาอังกฤษ
2. `idea-features` body ภาษาอังกฤษ ตารางภาษาไทย
3. ห้ามผสมภาษาในย่อหน้าเดียวกัน

## Feature Tables

1. `docs/project/features.md` ใช้ table `| Feature | Description | Module | Status |`
2. `docs/roadmap/idea-features.md` ใช้ table 27 คอลัมน์ เรียงตาม impact
3. feature แต่ละตัวละเอียดใต้ heading `###`

## Scoring

- Critical: placeholder แทนข้อมูลจริง, HTML แทน markdown
- High: examples รันไม่ได้, TODO/MOCK
- Medium: ผสมภาษาในย่อหน่า, Vue components ซับซ้อน
- Low: feature table format ไม่ตรง
