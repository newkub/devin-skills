# Alternatives Analysis Criteria

## Goal

ตรวจ alternatives analysis ใน plan ก่อน execution

## Checks

### Architectural Decisions

1. ตรวจทุก architectural decision มี trade-off analysis
2. ตรวจมี alternatives ที่ปฏิเสธพร้อมเหตุผล
3. ตรวจ decision มีเหตุผล: modern, type safety, performance, DX, maintenance
4. ตรวจไม่มี premature decisions ที่ข้าม alternatives

### Library Choices

1. ตรวจ library choices มีเหตุผลพร้อม metrics
2. ตรวจมี comparison ระหว่าง alternatives
3. ตรวจ library ที่เลือกมี: modern, type safety, performance, DX, maintenance
4. ตรวจไม่มี library ที่เลือกโดยไม่มีเหตุผล

### Implementation Approaches

1. ตรวจ implementation approaches มี alternatives
2. ตรวจ trade-offs ระหว่าง approaches ชัดเจน
3. ตรวจ approach ที่เลือกมีเหตุผล
4. ตรวจไม่มี over-engineering หรือ under-engineering

### Trade-Off Documentation

1. ตรวจ trade-offs บันทึกพร้อมเหตุผล
2. ตรวจ alternatives ที่ปฏิเสธมีเหตุผล
3. ตรวจ opportunity costs ระบุชัด
4. ตรวจ decisions สามารถ audit ได้

## Severity

- Critical: ไม่มี alternatives analysis, decision ไม่มีเหตุผล, ข้าม trade-offs
- High: library ไม่มี comparison, approach ไม่มี alternatives, trade-offs ไม่บันทึก
- Medium: alternatives ไม่ละเอียด, trade-offs ไม่ชัด, opportunity costs ไม่ระบุ
- Low: documentation ไม่สม่ำเสมอ, missing notes
