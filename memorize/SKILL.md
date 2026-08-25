---
name: memorize
description: จดจำสิ่งสำคัญ เช่น การตัดสินใจ ข้อค้นพบ บทเรียน และ context เพื่อใช้ในอนาคต
argument-hint: "[content]"
---

## Goal

จดจำสิ่งสำคัญที่เกิดขึ้นระหว่างการทำงาน เช่น การตัดสินใจ ข้อค้นพบ บทเรียน และ context เพื่อใช้ในอนาคต

## Scope

ใช้สำหรับบันทึกสิ่งสำคัญที่ควรจดจำ ไม่ใช่การวิเคราะห์ปัญหา (ใช้ `/deep-thinking`)

## Execute

### 1. Identify What To Memorize
> Goal: Identify What To Memorize

ระบุสิ่งที่ควรจดจำ:

1. ระบุประเภทของสิ่งที่จะจดจำ:
   - Decision — การตัดสินใจสำคัญและเหตุผล
   - Discovery — ข้อค้นพบ ข้อมูลใหม่ จาก `/deep-research`
   - Lesson — บทเรียนจากความผิดพลาดหรือความสำเร็จ
   - Context — context สำคัญที่มีผลต่องาน
   - Pattern — pattern ที่ใช้ได้ซ้ำ
   - Preference — ความชอบหรือ style ของผู้ใช้
2. ถ้าไม่แน่ใจว่าควรจดจำหรือไม่ ให้ถาม: "สิ่งนี้จะใช้ในอนาคตไหม?"
3. ถ้าคำตอบคือใช่ ให้ดำเนินการจดจำ

### 2. Capture Key Information
> Goal: Capture Key Information

บันทึกข้อมูลสำคัญ:

1. เขียนสิ่งที่จะจดจำใน 1-3 ประโยค
2. ระบุ context: เมื่อไร, เกี่ยวกับอะไร, ทำไมสำคัญ
3. ระบุ source: จากการค้นหา, การตัดสินใจ, การทำงาน, หรือผู้ใช้บอก
4. ระบุ relevance: เกี่ยวข้องกับอะไรในอนาคต
5. ถ้ามีตัวเลขหรือ facts เฉพาะ ให้บันทึกพร้อม source

### 3. Categorize And Tag
> Goal: Categorize And Tag

จัดหมวดและ tag:

1. กำหนด category หลัก (decision, discovery, lesson, context, pattern, preference)
2. กำหนด tags ที่เกี่ยวข้อง เช่น `architecture`, `bug`, `performance`, `user-preference`
3. ระบุ priority: high, medium, low
4. ระบุ scope: global, project, workspace, task

### 4. Store Memory
> Goal: Store Memory

จัดเก็บความจำ:

1. ใช้ `create_memory` tool เพื่อบันทึกลง memory database
2. ระบุ `Title` ที่สื่อความหมาย
3. เขียน `Content` ที่ครบถ้วนและกระชับ
4. ระบุ `Tags` ที่เกี่ยวข้อง
5. ระบุ `CorpusNames` ของ workspace ที่เกี่ยวข้อง
6. ตรวจสอบว่าไม่ซ้ำกับ memory ที่มีอยู่ — ถ้าซ้ำให้ update แทน

### 5. Verify Memory
> Goal: Verify Memory

ตรวจสอบความถูกต้อง:

1. อ่าน memory ที่บันทึกกลับมาเพื่อตรวจสอบ
2. ตรวจสอบว่า Title สื่อความหมาย
3. ตรวจสอบว่า Content ครบถ้วนและเข้าใจได้
4. ตรวจสอบว่า Tags และ Category ถูกต้อง
5. ถ้ามีข้อผิดพลาด ให้ update memory

## Rules

### 1. When To Memorize

จดจำเมื่อ:

- มีการตัดสินใจสำคัญที่มีผลระยะยาว
- ค้นพบข้อมูลใหม่ที่ใช้ซ้ำได้
- เรียนรู้บทเรียนจากความผิดพลาดหรือความสำเร็จ
- ผู้ใช้บอก preference หรือ style ที่ต้องจำ
- มี context ที่สำคัญต่อการทำงานในอนาคต
- พบ pattern ที่ใช้ได้ซ้ำในงานอื่น

### 2. When Not To Memorize

ไม่จดจำเมื่อ:

- เป็นข้อมูลชั่วคราวที่ใช้แค่ task ปัจจุบัน
- เป็นสิ่งที่หาได้จาก code หรือ docs โดยตรง
- เป็นรายละเอียดที่ไม่สำคัญต่ออนาคต
- เป็นสิ่งที่ผู้ใช้บอกว่าไม่ต้องจำ
- มี memory ที่คล้ายกันอยู่แล้ว — ให้ update แทน

### 3. Memory Quality

คุณภาพของ memory ต้อง:

- สั้น กระชับ แต่ครบถ้วน
- มี context เพียงพอที่จะเข้าใจในอนาคต
- มี source และเวลาที่บันทึก
- ไม่กำกวม อ่านแล้วเข้าใจได้ทันที
- สามารถค้นหาได้ด้วย keywords หรือ tags

### 4. Avoid Duplication

- ก่อนบันทึก ให้คิดว่ามี memory คล้ายกันอยู่แล้วไหม
- ถ้ามี ให้ update memory เดิมแทนการสร้างใหม่
- ถ้าไม่แน่ใจ ให้บันทึกใหม่และระบุว่าอาจซ้ำ
- หลีกเลี่ยงการบันทึกสิ่งเดียวกันหลายครั้ง

### 5. Time Budget

- ถ้าเป็น memory เล็ก ใช้เวลาไม่เกิน 1 นาที
- ถ้าเป็น memory กลาง ใช้เวลาไม่เกิน 3 นาที
- ถ้าเป็น memory ใหญ่ ใช้เวลาไม่เกิน 5 นาที
- ถ้าใช้เวลานานเกินไป ให้สรุปให้สั้นลง

### 6. Integration With Other Workflows

เชื่อมโยงกับ workflows อื่น:

- ทำ `/pondering` ก่อน memorize เพื่อทบทวนว่าควรจดจำไหม
- ทำ `/deep-research` แล้ว memorize ข้อค้นพบสำคัญ
- ทำ `/deep-thinking` แล้ว memorize การตัดสินใจ
- ทำ `/resolve-errors` แล้ว memorize บทเรียนจาก error
- ทำ `/learn` แล้ว memorize สิ่งที่เรียนรู้
- ทำ `/deep-review` แล้ว memorize ข้อค้นพบสำคัญจากการ review
- ทำ `/suggest-next-action` หลัง memorize เพื่อรู้ว่าควรทำอะไรต่อ

## Expected Outcome

- สิ่งสำคัญถูกบันทึกและสามารถค้นหาได้ในอนาคต
- ลดการทำซ้ำเพราะจำได้จากครั้งก่อน
- การตัดสินใจมีเหตุผลที่บันทึกไว้
- บทเรียนไม่หายไป
- Context สำคัญถูกเก็บไว้สำหรับอนาคต
