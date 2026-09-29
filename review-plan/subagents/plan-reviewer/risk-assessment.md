# Risk Identification And Assessment

## Goal

ระบุและประเมิน risks ใน plan ก่อน execution

## Checks

### Risk Identification

1. ตรวจทุก task มี risk identification
2. ตรวจ risks ครอบคลุม: technical, operational, compliance, timeline
3. ตรวจ critical paths ที่อาจได้รับผลกระทบ
4. ตรวจ breaking changes ที่อาจเกิดขึ้น

### Risk Assessment

1. ตรวจแต่ละ risk มี probability: high, medium, low
2. ตรวจแต่ละ risk มี impact: high, medium, low
3. ตรวจ risk score = probability × impact
4. ตรวจ risks จัดลำดับตาม severity: Critical, High, Medium, Low

### Mitigation Plans

1. ตรวจ high-risk tasks มี mitigation plan
2. ตรวจมี rollback strategy สำหรับ high-risk tasks
3. ตรวจ assumptions ระบุชัดเจนและมีพื้นฐานจริง
4. ตรวจ worst-case scenario ได้รับการจำลอง

### Stress Test

1. ตรวจ assumptions ทุกข้อในแผน
2. ตรวจ worst-case scenario ครอบคลุม
3. ตรวจ bottlenecks ระบุชัดเจน
4. ตรวจ plan ยังทำได้ใน worst-case

## Severity

- Critical: ไม่มี risk assessment, high-risk task ไม่มี mitigation, ไม่มี rollback
- High: risk ไม่มี probability หรือ impact, assumptions ไม่ชัด, ไม่มี stress test
- Medium: risk ไม่จัดลำดับ, mitigation ไม่ specific, buffer ไม่เพียงพอ
- Low: risk ระบุแต่ขาดรายละเอียด
