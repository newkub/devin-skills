# Severity Classification For Implementation Gaps

## Critical

- MOCK/FAKE/STUB ใน production path
- Core feature ไม่สมบูรณ์
- Missing critical schema/data
- Missing critical API
- TODO ใน critical path
- Incomplete flow ที่อาจก่อให้เกิดความเสียหายทางกฎหมาย/ข้อมูล/การเงิน
- ฟีเจอร์หลักที่ API/database มีแล้วแต่ไม่มี UX ทำให้ user ไม่สามารถใช้งานได้เลย

## High

- STUB ที่ถูกเรียกใช้
- Error handling ไม่สมบูรณ์
- Hardcoded data ที่ควรมาจาก source
- Missing type ใน critical path
- Missing supporting feature ใน flow
- ฟีเจอร์สำคัญที่ UX ไม่สมบูรณ์ (ขาด create/edit/delete, ขาด error/loading state, ขาด confirmation)

## Medium

- TODO ใน non-critical path
- Partial implementation
- Missing validation
- Incomplete UX/flow state
- Missing integration
- Missing operational readiness
- ฟีเจอร์รองที่ UX ยังไม่มี หรือมีแต่สำหรับบาง role

## Low

- FIXME ใน non-critical path
- Cosmetic placeholder
- Missing docs
- Missing feature flag
- ฟีเจอร์ internal/optional ที่อาจไม่ต้องมี UI ตาม design

## Critical Path Priority

จัดลำดับการแก้ไขตาม critical path:

1. schema — แก้ไข schema ก่อน
2. data — แก้ไข data layer หลัง schema
3. API — แก้ไข API หลัง data
4. UI/flow — แก้ไข UI/flow หลัง API
