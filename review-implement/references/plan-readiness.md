# Plan Readiness Checks

## Goal

ตรวจ plan completeness ก่อน execute `implement-plan`

## Checks

### Plan File Structure

1. ตรวจไฟล์ใน `.devin/plan/` มี frontmatter: `title`, `description`, `status`, `created`
2. ตรวจมี sections: `## Goal`, `## Scope`, `## Tasks`, `## Execution Order`, `## Risks`, `## Notes`
3. ตรวจ task table มี columns: Task, Status, Priority, Dependencies
4. ตรวจ `status` เป็น `pending` หรือ `in-progress` ไม่ใช่ `completed`

### Task Quality

1. แต่ละ task มี single responsibility — ไม่รวมหลายงานใน task เดียว
2. แต่ละ task มี clear acceptance criteria ที่ testable ได้
3. แต่ละ task ระบุ files ที่จะสร้าง, แก้ไข, หรือลบ
4. แต่ละ task มี effort estimate: `S`, `M`, `L`, `XL`

### Dependency Mapping

1. ตรวจ dependencies ระหว่าง tasks ไม่มี circular
2. ตรวจ tasks ที่ไม่มี dependencies สามารถทำ parallel ได้
3. ตรวจ critical path ชัดเจน: foundation → core → polish → test
4. ตรวจไม่มี missing dependencies ที่ทำให้ task ไม่สามารถเริ่มได้

### Risk Assessment

1. ตรวจ high-risk tasks มี mitigation plan
2. ตรวจมี rollback strategy สำหรับ high-risk tasks
3. ตรวจ assumptions ระบุชัดเจนและมีพื้นฐานจริง
4. ตรวจ timeline มี buffer สำหรับ unexpected issues

## Severity

- Critical: plan file ไม่มี, task table ว่าง, critical path ขาด, circular dependencies
- High: task ไม่มี acceptance criteria, missing dependencies, ไม่มี rollback สำหรับ high-risk
- Medium: task ไม่มี effort estimate, timeline ไม่มี buffer, assumptions ไม่ชัด
- Low: formatting ไม่สม่ำเสมอ, missing notes section
