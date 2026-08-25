# Dependency Mapping Checks

## Goal

ตรวจ dependency mapping ระหว่าง tasks ใน plan

## Checks

### Task Dependencies

1. ตรวจ dependencies ระหว่าง tasks ระบุชัดเจน
2. ตรวจไม่มี circular dependencies
3. ตรวจ tasks ที่ไม่มี dependencies สามารถทำ parallel ได้
4. ตรวจ missing dependencies ที่ทำให้ task ไม่สามารถเริ่มได้

### Critical Path

1. ตรวจ critical path ชัดเจน: foundation → core → polish → test
2. ตรวจ critical path length สมเหตุสมผล
3. ตรวจ bottlenecks ระบุชัดเจน
4. ตรวจ tasks ใน critical path มี priority สูงสุด

### Module Dependencies

1. ตรวจ module boundaries ชัดเจน
2. ตรวจ dependency directions: high-level → low-level
3. ตรวจไม่มี circular dependencies ระหว่าง modules
4. ตรวจ shared modules และ data contracts ระบุชัด

### Parallelization

1. ตรวจ parallelizable tasks ระบุชัดเจน
2. ตรวจ parallelizable count สมเหตุสมผล
3. ตรวจ tasks ที่ทำ parallel ไม่มี shared state conflicts
4. ตรวจ execution order รองรับ parallelization

## Severity

- Critical: circular dependencies, critical path ขาด, missing dependencies
- High: dependencies ไม่ชัด, bottlenecks ไม่ระบุ, module boundaries ไม่ชัด
- Medium: parallelizable ไม่ระบุ, dependency direction ไม่ชัด
- Low: shared modules ไม่ระบุ, data contracts ไม่ละเอียด
