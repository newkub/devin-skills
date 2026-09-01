---
name: try-in-temp
description: รันคำสั่งหรือการทดลองใน OS temp directory โดยไม่แตะต้อง workspace
argument-hint: "<command-or-experiment>"
allowed-tools:
  - exec
  - read
  - write
  - find_file_by_name
  - ask_user_question
  - skill
  - run_subagent
  - todo_write
triggers:
  - user
  - model
related:
  - run-program
  - run-check
  - deep-validate
  - resolve-errors
  - follow-my-tech-stack
  - use-scripts
---

## Goal

รันคำสั่ง สคริปต์ หรือการทดลองใน temp directory ของ OS เพื่อให้ workspace ไม่ถูกเปลี่ยนแปลง ใช้สำหรับการทดสอบ การทำต้นแบบ หรือการทำซ้ำปัญหาในสภาพแวดล้อมที่แยกออกมา

## Scope

ใช้เมื่อผู้ใช้ต้องการทดลองบางสิ่งโดยไม่เปลี่ยนแปลงโปรเจกต์จริง ใช้ได้กับสคริปต์ติดตั้ง คำสั่ง build การทดสอบ package manager ต้นแบบอย่างรวดเร็ว และการทดลองครั้งเดียว

## Execute

### 1. Prepare Temp Directory

> Goal: เตรียม temp directory

1. สร้าง temp directory ใหม่ภายใต้ `%TEMP%\try-in-temp-<random>` โดยใช้ `[System.IO.Path]::GetTempPath()` และ `New-Item -ItemType Directory`
2. บันทึกเส้นทางไว้ใน `todo_write`
3. ถ้าผู้ใช้ต้องการเริ่มต้นจากไฟล์ที่มีอยู่ ให้คัดลอกไฟล์หรือไดเรกทอรีที่จำเป็นเข้าไปใน temp directory
4. ถ้าการทดลองต้องการ scaffold เฉพาะเจาะจง ให้สร้างไฟล์ขั้นต่ำที่จำเป็น

### 2. Set Up Environment

> Goal: ตั้งค่า environment

1. ตั้ง working directory เป็น temp directory สำหรับการทดลอง
2. ถ้าการทดลองต้องการเครื่องมือ ให้ตรวจสอบความพร้อมใช้งาน หรือติดตั้งด้วย `mise use -g`
3. ถ้าต้องการ package manager ให้รันใน temp directory
4. เก็บ workspace `PATH` และ environment variables ไว้ตามเดิม เว้นแต่ผู้ใช้จะขอแยกออกมา

### 3. Run The Experiment

> Goal: รันการทดลอง

1. รันคำสั่งหรือสคริปต์ที่ผู้ใช้ระบุ
2. จับ stdout, stderr และ exit code
3. ถ้าคำสั่งรันนาน ให้ถามก่อนเริ่ม หรือตั้ง timeout
4. ถ้าคำสั่งต้องการไฟล์ ให้ตรวจสอบว่าอยู่ใน temp directory

### 4. Observe Results

> Goal: สังเกตผลลัพธ์

1. แสดง output ของคำสั่งโดยแทนที่เส้นทางไฟล์ด้วยเส้นทางสัมพันธ์กับ temp directory
2. ตรวจหา errors, warnings หรือ output ที่ไม่คาดคิด
3. ถ้า output มีขนาดใหญ่ ให้สรุปหรือเขียนลงในรายงาน
4. จดบันทึก side effects ภายใน temp directory

### 5. Decide Keep Or Clean

> Goal: ตัดสินใจเก็บหรือล้าง

1. ค่าเริ่มต้น ให้เก็บ temp directory ไว้จนจบ session เพื่อให้ผู้ใช้ตรวจสอบได้
2. ถ้าผู้ใช้บอกว่าล้าง ให้ลบ temp directory ด้วย `Remove-Item -Recurse -Force`
3. ถ้าผู้ใช้ต้องการเก็บผลลัพธ์ ให้คัดลอกไฟล์ที่เลือกกลับไปยัง workspace พร้อมรับการยืนยัน
4. ห้ามคัดลอกหรือเขียนทับไฟล์ใน workspace โดยไม่มีการยืนยันอย่างชัดเจน

### 6. Report

> Goal: รายงาน

1. รายงานสิ่งที่รัน สถานที่ที่รัน และผลลัพธ์
2. ระบุเส้นทาง temp directory ถ้ายังมีอยู่
3. รายการไฟล์ที่คัดลอกกลับไปยัง workspace
4. แนะนำขั้นตอนถัดไปตามผลลัพธ์

## Rules

### 1. Workspace Safety

- ห้ามเปลี่ยนแปลงไฟล์ใน workspace เว้นแต่ผู้ใช้จะขออย่างชัดเจน
- ห้ามติดตั้ง dependencies ลงใน workspace จาก temp directory
- ห้ามรันคำสั่งที่ทำลายข้อมูลนอก temp directory

### 2. Scope

- ใช้ temp directory สำหรับการทดลอง ต้นแบบ และการทดสอบ
- ถ้าผลลัพธ์ควรนำไปใช้ใน workspace ให้ถามเพื่อยืนยันก่อน
- ห้ามใช้ temp directory สำหรับการจัดเก็บระยะยาว

### 3. Cleanliness

- ล้าง temp directory เป็นค่าเริ่มต้นเมื่องานเสร็จสิ้น เว้นแต่ผู้ใช้จะขอเก็บไว้
- ถ้าเก็บไว้ ให้รายงานเส้นทางและเตือนเรื่องการใช้ disk
- ห้ามทิ้ง processes หรือ background jobs ที่กำลังรันอยู่จากการทดลอง

### 4. Evidence

- แสดงคำสั่งจริงและ output ของคำสั่ง
- รายงานเส้นทาง temp directory
- รายงาน exit code และ errors ใดๆ อย่างชัดเจน

## Expected Outcome

- การทดลองรันใน temp directory ที่แยกออกมา โดยไม่แตะต้อง workspace
- ผู้ใช้เห็น output และผลลัพธ์ของคำสั่ง
- temp directory ถูกล้างหรือเก็บไว้ตามที่ผู้ใช้เลือก
- ไฟล์ใน workspace ยังคงไม่เปลี่ยนแปลง เว้นแต่จะคัดลอกกลับไปยัง workspace ด้วยการยืนยันอย่างชัดเจน
