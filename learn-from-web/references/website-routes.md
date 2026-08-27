# Website Routes Reference

สร้างหรืออัปเดต reference ของ routes ใน website project

## Scope

ใช้เมื่อ skill หรือ project มี dependencies กับ website framework/library/tool ทีต้องการ route map ครอบคลุม page routes, API routes, dynamic segments และ patterns

## Determine Target

1. ถ้าทำงานใน project ทีมี website → ใช้ project root เป็น target
2. ถ้าทำงานใน skill ทีเกี่ยวข้องกับ website → หา sample project หรือ project ที skill อ้างอิง
3. ถ้าไม่มี project ชัดเจน → ใช้ `references/output-template.md` เป็น template แล้วกรอกด้วยข้อมูลจาก docs
4. ระบุ framework จาก `package.json` ก่อน

## List All Routes

1. ทำ `/list-website-all-routes` เพื่อรับรายการ routes
2. บันทึก output ทั้ง page routes, API routes, redirects, catch-all
3. ระบุ routes ทีต้อง authentication หรือ permission
4. ระบุ dynamic segments และ parameters

## Analyze Route Patterns

1. จัดกลุ่ม routes ตาม feature/module เช่น auth, billing, settings, admin
2. หา patterns ทีซ้ำ เช่น nested resources `/resource/:id/subresource`
3. ระบุ public API surface และ internal-only routes
4. ระบุ routes ทีอาจ conflict หรือ duplicate

## Write Reference

1. สร้าง `references/routes.md` ใน project หรือ skill directory
2. ใช้ template จาก `references/output-template.md`
3. ใส่ sections: `## Page Routes`, `## API Routes`, `## Dynamic Patterns`, `## Authentication Required`
4. ใช้ `/report-table` สำหรับ route tables

## Update Cross-References

1. ถ้า skill อื่นอ้างอิง route reference → อัปเดต links
2. ถ้า `AGENTS.md` เกี่ยวข้อง → ระบุ route map
3. ทำ `/check-reference` เพื่อตรวจ broken links

## Rules

### Framework Awareness

- เรียนรู้ convention จาก framework จริง ไม่เดา
- ใช้ `list-website-all-routes/references/frameworks.md` สำหรับ convention
- ถ้า project ใช้หลาย framework ให้แยก section ชัดเจน

### Reference Quality

- reference ต้องถูกต้องและสอดคล้องกับ code จริง
- ไม่รวม test routes หรือ mock routes ยกเว้นระบุชัดเจน
- อัปเดต reference เมื่อ routes เปลี่ยน

### Output Format

- ใช้ frontmatter มาตรฐานถ้า reference เป็น markdown skill reference
- แยก page routes, API routes, redirects, catch-all
- ใช้ backticks สำหรับ paths, methods, parameters
- ไม่เกิน 250 บรรทัดต่อ reference ไฟล์ — ถ้ายาวให้แยกตาม feature

### Dependencies

- ถ้า skill มี dependencies เช่น `lib`, `tool`, `framework` ทีเกี่ยวข้องกับ website → ต้องมี `references/routes.md`
- ใช้ `/learn-from-references` เพื่อสกัด references จาก dependencies ถ้าจำเป็น
