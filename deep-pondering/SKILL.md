---
name: deep-pondering
description: ครุ่นคิดเชิงลึกก่อนตัดสินใจสำหรับงานซับซ้อน ระบุ trade-offs และ uncertainties
---

## Goal

ครุ่นคิดและทบทวนอย่างลึกซึ้งก่อนตัดสินใจหรือดำเนินการในงานที่ซับซ้อนสูง พร้อมระบุ trade-offs, uncertainties, และ goal alignment

## Scope

ใช้สำหรับงานที่ต้องการการครุ่นคิดลึก ทบทวนมุมมองหลายด้าน ก่อนการวิเคราะห์เชิงระบบ (`/deep-thinking`) หรือวางแผน (`/deep-plan`)

## Execute

### 1. Pause And Define Decision

หยุดและระบุสิ่งที่ต้องตัดสินใจ

> Goal: รู้ว่าต้องพิจารณาอะไร

1. ระบุ decision หรือ action ที่กำลังจะทำ
2. ระบุ context และ constraints
3. ถ้าไม่ชัดเจน → ใช้ `/ask-me` ถามผู้ใช้

### 2. Consider Perspectives

พิจารณาจากหลายมุมมอง

> Goal: ครอบคลุมผลกระทบทุกด้าน

1. มุมมองผู้ใช้ — needs, UX, expectations
2. มุมมองระบบ — architecture, performance, security
3. มุมมองทีม — maintainability, DX, onboarding
4. มุมมองธุรกิจ — cost, risk, timeline

### 3. Weigh Trade-Offs

ชั่งน้ำหนัก trade-offs

> Goal: ตัดสินใจด้วยข้อมูลครบ

1. ระบุทางเลือกที่เป็นไปได้อย่างน้อย 2 ทาง
2. เปรียบเทียบ pros/cons ของแต่ละทาง
3. ระบุ trade-offs ที่ยอมรับได้
4. ถ้าข้อมูลไม่พอ → ใช้ `/deep-research` หรือ `/ask-me`

### 4. Surface Uncertainties

ระบุความไม่แน่นอนและความเสี่ยง

> Goal: ไม่ซ่อน unknowns

1. ระบุ known unknowns และ unknown unknowns
2. ประเมินความสำคัญของแต่ละ uncertainty
3. ระบุ risks และ mitigation
4. ถ้าความเสี่ยงสูง → ใช้ `/ask-me` ก่อนดำเนินการ

### 5. Reach Conclusion

สรุปผลการครุ่นคิด

> Goal: ได้ข้อสรุปชัดเจน

1. เลือกแนวทางที่เหมาะสมที่สุดพร้อมเหตุผล
2. ระบุข้อจำกัดและสิ่งที่ยอมรับได้
3. ระบุ next steps
4. ถ้ายังไม่ชัด → ใช้ `/deep-thinking` ต่อ

## Rules

### 1. When To Use

- ใช้ก่อน `/deep-thinking` เมื่อต้องทบทวนทิศทาง
- ใช้ใน `/deep-plan` สำหรับ stress-test และ validate
- ใช้ก่อนการตัดสินใจที่มี impact สูง
- ใช้เมื่อมีหลายทางเลือกที่ดีพอกัน

### 2. Time Budget

- งานเล็ก: ไม่เกิน 2 นาที
- งานกลาง: ไม่เกิน 5 นาที
- งานใหญ่: ไม่เกิน 15 นาที
- ถ้าเกิน → ใช้ `/deep-thinking` หรือ `/deep-plan` ต่อ

### 3. Integration

- ทำ `/deep-thinking` หลัง `/deep-pondering` ถ้าต้องวิเคราะห์เชิงระบบ
- ทำ `/deep-plan` หลัง `/deep-pondering` ถ้าต้องวางแผน
- ทำ `/ask-me` ถ้าต้องการ user confirmation
- ทำ `/suggest-next-action` หลังสรุป

## Expected Outcome

- การตัดสินใจที่รอบคอบและครอบคลุมหลายมิติ
- Trade-offs และ uncertainties ถูกระบุชัดเจน
- แนวทางที่เหมาะสมพร้อมเหตุผล
- Next steps ที่ชัดเจน
