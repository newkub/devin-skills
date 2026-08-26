# Step: Write Root README

> Goal: เขียน README หลักของ monorepo

## Execute

1. ทำ `/analyze-project` เพื่อเก็บข้อมูล root
2. อ่าน `manifest files`, `source code`, `config files`
3. เขียน README ตาม template ใน `template-example.md`
4. ใช้ข้อมูลจาก Step Prepare:
   - status → `>` callout (red/green badge)
   - has `CONTRIBUTING.md` → ใส่ `## Contributing` section
   - has `LICENSE.md` → ใส่ `## License` section
5. ถ้าข้อมูลไม่ครบ → stop และ report ไม่ใช้ placeholder
6. ถ้า write fail → retry (max 3 → stop/report)

## Rules

- ไม่มี `>` description ที่ด้านบน — เฉพาะ status badge
- `#` Title เป็นบรรทัดแรกของ README
- `## Get Started` ใช้ numbered list ตรงๆ ไม่มี `###` subsection
- `## Features` 3 columns (Icon, Feature, Description)
- ไม่มี `## API References` แยก — references ใน Usage section
- ไม่มี ANSI codeblock ด้านล่างสุด
