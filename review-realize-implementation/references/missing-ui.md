# Missing UI Detection Criteria

## API Without UI

- ตรวจหา API endpoints ที่ไม่มี UI เรียกใช้
- เปรียบเทียบ API routes กับ UI components ที่เรียกใช้
- ระบุ: endpoint ที่มี handler แต่ไม่มี button, form, หรือ link เรียก

## Database Without UX

- ตรวจหา database tables/columns ที่ไม่มี UX จัดการ
- เปรียบเทียบ schema กับ UI forms ที่จัดการข้อมูล
- ระบุ: table ที่มี CRUD API แต่ไม่มีหน้าจอจัดการ

## Missing UI States

- ตรวจหา: missing loading state สำหรับ async data
- ตรวจหา: missing error state สำหรับ failed requests
- ตรวจหา: missing empty state สำหรับ no data
- ตรวจหา: missing success/confirmation feedback

## Missing UI Components

- ตรวจหา: missing form validation UI
- ตรวจหา: missing confirmation dialog สำหรับ destructive actions
- ตรวจหา: missing undo/rollback UI
- ตรวจหา: missing search/filter/sort UI สำหรับ list views

## Partial UX

- ตรวจหา: มี list แต่ไม่มี create/edit
- ตรวจหา: มี create แต่ไม่มี delete
- ตรวจหา: มี admin/staff flow แต่ไม่มี customer/user flow
- ตรวจหา: มี detail view แต่ไม่มี list view หรือกลับกัน

## Detection Tools

- `/scan-codebase` สำหรับค้นหา API endpoints, UI components
- `/roleplay-user` สำหรับจำลอง user journey
- เปรียบเทียบ route files กับ component imports

## Severity

- Critical: ฟีเจอร์หลักที่ API/database มีแล้วแต่ไม่มี UX เลย
- High: ฟีเจอร์สำคัญที่ UX ไม่สมบูรณ์ (ขาด create/edit/delete, ขาด error/loading state)
- Medium: ฟีเจอร์รองที่ UX ยังไม่มี หรือมีแต่สำหรับบาง role
- Low: ฟีเจอร์ internal/optional ที่อาจไม่ต้องมี UI ตาม design
