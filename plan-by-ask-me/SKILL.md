---
name: plan-by-ask-me
description: วางแผนร่วมกับผู้ใช้ ใช้ /follow-deep /deep-report /ask-me เมื่อยังไม่แน่ใจ
argument-hint: "[topic]"
related:
  - plan
  - deep-plan
  - follow-deep
  - deep-report
  - ask-me
  - report-plan
  - create-plan-as-github-issue
---

## Goal

วางแผนงานร่วมกับผู้ใช้ โดยวิเคราะห์เชิงลึก สร้าง deep report เพื่อประกอบการตัดสินใจ และถามผู้ใช้เมื่อยังไม่แน่ใจ

## Scope

ใช้เมื่อผู้ใช้ต้องการ plan ทีต้องการปรึกษา ตัดสินใจร่วม หรือยื่นยันทิศทาง ไม่ใช่ auto-plan โดยไม่ถาม

## Execute

### 1. Clarify Intent

> Goal: เข้าใจสิ่งทีผู้ใช้ต้องการวางแผน

1. รับ `topic` จาก argument หรือ context ปัจจุบัน
2. ถ้า `topic` ไม่ชัดเจน → ทำ `/ask-me` เพื่อถามเป้าหมาย ขอบเขต และ expectations
3. บันทึก scope, constraints, assumptions ทีได้รับมา

### 2. Select Deep Workflows

> Goal: เลือก deep workflows ทีเหมาะสมกับ context

1. ทำ `/follow-deep` เพื่อพิจารณาว่าควรเรียก `deep-plan`, `deep-analyze`, `deep-research`, `deep-thinking`, `deep-pondering` หรือ `deep-validate`
2. ถ้างานซับซ้อนสูง หรือมี risk สูง → เลือก `deep-plan` เป็นหลัก
3. ถ้างานต้องการวิเคราะห์ปัจจุบันก่อน → เลือก `deep-analyze` หรือ `deep-analyze-by-use-scripts`
4. ถ้าต้องการ research ภายนอก → เลือก `deep-research`

### 3. Run Deep Analysis

> Goal: รวบรวมข้อมูลลึกเพื่อสนับสนุนแผน

1. ทำ deep workflows ทีเลือกใน Step 2 ตามลำดับทีเหมาะสม
2. บันทึก findings, risks, alternatives, และ trade-offs
3. ถ้าข้อมูลไม่เพียงพอ → ทำ `/ask-me` เพื่อถามผู้ใช้เพิ่มเติม

### 4. Build Deep Report

> Goal: สรุปข้อมูลทีรวบรวมได้เป็นรายงาน

1. ทำ `/deep-report` เพื่อสร้าง report ละเอียด 7 columns พร้อม evidence
2. ถ้าไม่มี findings หรือ issues ทีต้องรายงาน → สรุปสถานะปัจจุบันและ assumptions แทน
3. ระบุ options หรือทางเลือกทีผู้ใช้ต้องตัดสินใจ

### 5. Ask For Decision

> Goal: ให้ผู้ใช้เลือกทิศทางก่อนดำเนินการต่อ

1. ถ้ามีหลายทางเลือก หรือไม่แน่ใจว่าผู้ใช้ต้องการอะไร → ทำ `/ask-me` พร้อมตัวเลือกและคำแนะนำ
2. ถ้าแผนชัดเจนและผู้ใช้ไม่ต้องการตัดสินใจเพิ่ม → ข้ามไป Step 6
3. บันทึกคำตอบของผู้ใช้และปรับแผนตามทีเหมาะสม

### 6. Document Plan

> Goal: บันทึกแผนทีตกลงร่วมกัน

1. ถ้า tasks มากกว่า 10 → ทำ `/create-plan-as-github-issue` เพื่อสร้าง `.devin/plan/<topic>-<date>.md`
2. ถ้า tasks น้อยกว่าหรือเท่ากับ 10 → บันทึกใน chat report
3. ทำ `/report-plan` เพื่อรายงานแผนในแชทก่อนลงมือ implement

### 7. Suggest Next Action

> Goal: แนะนำ action ถัดไป

1. ทำ `/suggest-next-action` ตามสถานะแผน
2. ถ้าผู้ใช้ยื่นยันแล้ว → แนะนำ `/follow-plan` หรือ `/implement-plan` เพื่อดำเนินการตามแผน
3. ถ้ายังไม่ยื่นยัน → แนะนำ `/ask-me` อีกครั้งหรือปรับแผน

## Rules

### 1. Collaborative By Default

- วางแผนร่วมกับผู้ใช้ ไม่กำหนดทิศทางเองโดยไม่ถาม
- ถ้ามีหลายทางเลือก หรือ impact สูง ต้องถามก่อนตัดสินใจ
- ถ้าผู้ใช้ระบุทิศทางชัดเจน ให้ดำเนินการได้เลย

### 2. Use Deep Workflows

- ทำ `/follow-deep` ก่อนเลือก deep workflows เสมอ
- ไม่เรียก deep workflows ทีไม่เกี่ยวข้อง
- ถ้างานง่ายหรือ risk ต่ำ สามารถใช้ `/plan` ธรรมดาได้

### 3. Use Deep Report

- สรุปข้อมูลทั้งหมดด้วย `/deep-report` ก่อนถามผู้ใช้
- report ต้องมี evidence ทีตรวจสอบได้
- ถ้าไม่มี finding ให้สรุป assumptions และ options แทน

### 4. Use Ask-Me When Uncertain

- ถ้า context ไม่ชัด ถาม `/ask-me`
- ถ้ามีหลายทางเลือก ถาม `/ask-me`
- ถ้าต้องตัดสินใจเรื่องเสี่ยงสูง ถาม `/ask-me`
- ถ้าคำตอบชัดเจนหรืองาน risk ต่ำ ไม่ต้องถาม

### 5. Minimal And Verifiable Plan

- แต่ละ task มี single responsibility
- ระบุ file ทีจะสร้าง/แก้ไข/ลบ
- ระบุ metrics หรือ acceptance criteria ทีวัดผลได้
- ไม่ใส่ placeholder หรือ mock implementation โดยไม่จำเป็น

## Expected Outcome

- แผนทีผู้ใช้เห็นด้วยหรือตกลงร่วมกัน
- รายงาน deep report ทีมี evidence ครบถ้วน
- ไฟล์ plan ใน `.devin/plan/` ถ้ามี tasks มากกว่า 10
- ลำดับ action ถัดไปทีชัดเจน
- ไม่มีการตัดสินใจทีสำคัญโดยไม่ได้ถามผู้ใช้
