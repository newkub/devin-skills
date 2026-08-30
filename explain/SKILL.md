---
name: explain
description: อธิบาย concept code skill หรือ term ที user สงสัยอย่างสั้นชัดเจน
argument-hint: "<target> [level]"
related:
  - how-to-works
  - summarize
  - dont-understand
  - write-how-to
  - learn-from-web
  - deep-research
---

## Goal

อธิบาย concept, code, skill, หรือ term ที user สงสัยอย่างสั้น ชัดเจน พร้อมตัวอย่าง

## Scope

ใช้เมื่อ user ถาม "X คืออะไร", "explain X", "Y ทำงานยังไง สั้นๆ" โดยต้องการคำตอบกระชับ

## Execute

### 1. Identify Target And Level

> Goal: Identify Target And Level

1. อ่าน `<target>` จาก argument หรือ context
2. อ่าน `[level]` ถ้ามี เช่น `beginner`, `intermediate`, `advanced`
3. ถ้า target ไม่ชัด → ถาม user กลับสั้นๆ
4. ถ้า level ไม่ระบุ → ใช้ `beginner` เป็นค่าเริ่มต้น

### 2. Gather Context

> Goal: Gather Context

1. ถ้า target อยู่ใน project ปัจจุบัน → อ่านไฟล์ที่เกี่ยวข้อง
2. ถ้า target เป็น skill ใน repo → อ่าน `SKILL.md` ด้วย `/read`
3. ถ้า target เป็น tool/library ภายนอก → ใช้ `/learn-from-web` ดู official docs
4. เก็บ snippets หรือ examples ทีช่วยอธิบาย

### 3. Provide Concise Explanation

> Goal: Provide Concise Explanation

1. ให้ definition หรือ one-sentence summary ก่อน
2. อธิบาย why it matters หรือเมื่อไหร่ใช้
3. ให้ key points 3-5 ข้อ
4. ให้ example หรือ analogy ทีเหมาะสม
5. ถ้าเป็น code → อธิบาย key lines และผลลัพธ์

### 4. Suggest Next Steps

> Goal: Suggest Next Steps

1. ถ้าต้องการลงลึก → แนะนำ `/how-to-works` หรือ `/deep-research`
2. ถ้าต้องการทำตาม → แนะนำ `/write-how-to`
3. ถ้าต้องการสรุป → แนะนำ `/summarize`
4. ถ้ายังไม่เข้าใจ → ส่งต่อ `/dont-understand`

## Rules

### 1. Concise

- คำตอบ 3-5 ประโยคหรือ bullets
- หลีกเลี่ยงเนื้อหายาวเกินจำเป็น
- ถ้าต้องการลงลึก → ส่งต่อ skill อื่น

### 2. Beginner Friendly

- ลด jargon หรืออธิบายศัพท์เทคนิค
- ใช้ analogies ทีคุ้นเคย
- ให้ตัวอย่าง concrete ไม่ใช่ abstract

### 3. Accurate

- ไม่เดาข้อมูล
- ถ้าไม่แน่ใจ → บอกและแนะนำวิธี verify
- ใช้ backticks สำหรับ code, skill names, tools

## Expected Outcome

- คำอธิบายสั้น ชัดเจน ของ target
- ผู้ใช้เข้าใจภายใน 3-5 bullets
- มี example หรือ analogy ทีช่วยให้เข้าใจ
- ระบุ next skill ถ้าต้องการลงลึก
