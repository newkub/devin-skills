# review-flow (merged content)

## Goal

Review workflow ใดๆ แล้วปรับปรุงให้ทำงานรวดเร็ว ปลอดภัย ใช้ง่าย มีประสิทธิภาพ ไม่ซ้ำซ้อน และไม่เกิน scope

## Scope

ใช้สำหรับ workflow, skill, process หรือ script ใดๆ ทีต้องตรวจสอบ flow ให้ดีขึ้น

## Execute

### 1. Read Flow

> Goal: เข้าใจ workflow ปัจจุบัน

1. ดูรายละเอียดใน [read-flow.md](read-flow.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Check Speed

> Goal: ลด latency และ unnecessary steps

1. ดูรายละเอียดใน [check-speed.md](check-speed.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Check Safety

> Goal: ลด risk ของ workflow

1. ดูรายละเอียดใน [check-safety.md](check-safety.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Check Usability

> Goal: ให้ง่ายต่อการเรียกใช้

1. ดูรายละเอียดใน [check-usability.md](check-usability.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Check Efficiency

> Goal: ใช้ resources คุ้มค่า

1. ดูรายละเอียดใน [check-efficiency.md](check-efficiency.md)
2. บันทึก findings พร้อม severity และ evidence

### 6. Remove Redundancy

> Goal: ไม่ซ้ำซ้อน

1. ดูรายละเอียดใน [remove-redundancy.md](remove-redundancy.md)
2. บันทึก findings พร้อม severity และ evidence

### 7. Report

> Goal: สรุปผลการ review

1. ดูรายละเอียดใน [report.md](report.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

- ไม่เพิ่ม complexity โดยไม่จำเป็น
- รักษา backward compatibility ถ้ามีผู้ใช้งานเดิม
- แยก flow ออกเป็นย่อยถ้า SRP ไม่ชัด
- ใช้ existing skills แทนการ duplicate logic
- ถ้ามี destructive change → ต้อง dry-run ก่อน
- ไม่เกิน 250 บรรทัดต่อไฟล์

- ใช้ /review-devin-global-harness ถ้าจำเป็น
- ใช้ /review-devin-global-harness ถ้าจำเป็น
- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /follow-single-responsibility ถ้าจำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [scoring.md](scoring.md)

## Expected Outcome

- Flow ทำงานเร็วขึ้น ปลอดภัยขึ้น ใช้ง่ายขึ้น
- ไม่มี redundancy หรือ duplicated steps
- มี report ชัดเจนพร้อม recommendations
- ผ่าน `/deep-validate` หลังปรับปรุง
