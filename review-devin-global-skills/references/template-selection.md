# Template Selection Rules

ตรวจสอบว่า skill เลือก template ตรงกับ prefix ตาม `templates/index.md`

## Prefix To Template Mapping

- `follow-*-architecture` → architecture template
- `follow-*` → follow template (ยกเว้น architecture variant)
- `run-*` → run template
- `check-*` → check template
- `review-*` → review template
- `update-*` → update template
- `gen-*` → gen template
- `report-*` → report template
- `idea-*` → idea template
- `lib-*` → lib template

## Architecture Template Rule

- skill ที่ขึ้นต้นด้วย `follow-*-architecture` ต้องใช้ architecture template
- architecture template มี structure เฉพาะเกี่ยวกับ architecture analysis
- ถ้า `follow-*-architecture` ไม่ใช้ architecture template → flag เป็น High

## Mismatch Handling

- ถ้า skill ไม่ตรง template ตาม prefix → ต้องระบุเหตุผลใน `## Scope`
- เหตุผลต้องอธิบายว่าทำไมเลือก template อื่น
- ถ้าไม่มีเหตุผลใน `## Scope` → flag เป็น High
- ถ้ามีเหตุผลแต่ไม่ชัดเจน → flag เป็น Medium

## Validation Steps

1. อ่าน `templates/index.md` เพื่อดู mapping ปัจจุบัน
2. ตรวจ prefix ของ skill name
3. เปรียบเทียบ structure ของ `SKILL.md` กับ template ที่ควรใช้
4. ถ้า mismatch ให้ตรวจ `## Scope` ว่ามีเหตุผลหรือไม่

## Scoring

- High: template ผิดตาม prefix และไม่มีเหตุผลใน `## Scope`
- Medium: template ผิดแต่มีเหตุผล ไม่ชัดเจน
- Low: template ถูกแต่มี deviation เล็กน้อย
