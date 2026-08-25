# Missing Flow And Feature Completeness Checks

## Incomplete Flow Checks

### Dead-End Flows

- ตรวจหา flows ที่ไม่มี completion path
- ตรวจหา: user action ที่ไม่มี success state หรือ error state
- ตรวจหา: API call ที่ไม่มี response handling

### Missing Branches

- ตรวจหา: happy path แต่ไม่มี error path
- ตรวจหา: success path แต่ไม่มี failure path
- ตรวจหา: normal flow แต่ไม่มี recovery path
- ตรวจหา: create flow แต่ไม่มี edit/delete flow

### Missing Flow States

- ตรวจหา: loading state, error state, empty state, success state
- ตรวจหา: confirmation dialog สำหรับ destructive actions
- ตรวจหา: rollback หรือ undo สำหรับ reversible actions

## Missing Feature Checks

### API Without UI

- ตรวจหา API endpoints ที่ไม่มี UI เรียกใช้
- เปรียบเทียบ API routes กับ UI components ที่เรียกใช้

### Database Without UX

- ตรวจหา database tables/columns ที่ไม่มี UX จัดการ
- เปรียบเทียบ schema กับ UI forms ที่จัดการข้อมูล

### Backend Without Frontend

- ตรวจหา backend services ที่ไม่มี user-facing flow
- ตรวจหา: service function ที่ไม่มี consumer

### Partial UX

- ตรวจหา: มี list แต่ไม่มี create/edit
- ตรวจหา: มี create แต่ไม่มี delete
- ตรวจหา: มี admin/staff flow แต่ไม่มี customer/user flow

### Feature Flags Without UI

- ตรวจหา feature flags ที่เปิดใช้แล้วแต่ไม่มี UI รองรับ
- ตรวจหา config ที่เปิดใช้แต่ไม่มี user-facing feature

## Missing Supporting Features

- ตรวจหา: validation, auth, audit, notifications, rate limiting
- ตรวจหา: tests, docs สำหรับ features ที่มี
- ตรวจหา: integrations กับ external services

## Detection Tools

- `/roleplay-user` สำหรับจำลอง user journey
- `/review-codebase-everything` สำหรับระบุ gaps ใน code
- `/scan-codebase` สำหรับค้นหา API endpoints, schema, UI components

## Severity

- Critical: ฟีเจอร์หลักที่ API/database มีแล้วแต่ไม่มี UX
- High: ฟีเจอร์สำคัญที่ UX ไม่สมบูรณ์ (ขาด create/edit/delete, ขาด error/loading state)
- Medium: ฟีเจอร์รองที่ UX ยังไม่มี หรือมีแต่สำหรับบาง role
- Low: ฟีเจอร์ internal/optional ที่อาจไม่ต้องมี UI ตาม design
