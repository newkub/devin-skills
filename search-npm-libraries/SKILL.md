---
name: search-npm-libraries
description: หา libraries ตาม keyword หรือคล้ายกัน โดย libraries นั้นต้องเป็น TypeScript + ESM
argument-hint: "[keyword]"
related:
  - list-my-npm-packages
  - follow-best-practice
  - suggest-next-action
  - follow-tool-crw
  - learn-web
---

## Goal

ค้นหา Npm Libraries

## Scope

ใช้ `search-npm-libraries` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม (npm libraries)

## Execute

### 1. Search Libraries

> Goal: หา libraries ที่ตรงกับ keyword

1. รับ `<keyword>` จาก argument — ถ้าไม่มีให้ถาม user
2. ใช้ `follow-tool-crw` หรือ `learn-web` ค้นหา libraries ที่ตรงกับ keyword หรือคล้ายกัน
3. กรองเฉพาะ libraries ที่เขียนด้วย TypeScript และเป็น ESM
4. ถ้าไม่เจอที่ตรงเงื่อนไข → แนะนำตัวที่ใกล้เคียงที่สุดพร้อมระบุข้อจำกัด

### 2. Compare And Recommend

> Goal: เปรียบเทียบและแนะนำตัวที่เหมาะสม

1. สรุปในตารางเปรียบเทียบแต่ละตัว — features, bundle size, maintenance, popularity
2. แนะนำตัวที่เหมาะสมที่สุดพร้อมเหตุผล
3. ถ้ามีหลายตัวที่ดีพอๆ กัน → แสดง trade-offs ให้ user เลือก

## Rules

- กรองเฉพาะ TypeScript + ESM เสมอ
- ใช้ `follow-tool-crw` หรือ `learn-web` สำหรับ search
- ใช้ `list-my-npm-packages` ถ้าต้องการดู packages ที่มีอยู่แล้ว
- ใช้ `follow-best-practice` ถ้าต้องการ best practices ของ library ที่เลือก
- ใช้ `suggest-next-action` หลังเสร็จเพื่อแนะนำขั้นตอนถัดไป

## Expected Outcome

- ได้รายการ libraries ที่ตรงกับ keyword และเป็น TypeScript + ESM
- มีตารางเปรียบเทียบ features, bundle size, maintenance
- มี recommendation พร้อมเหตุผลหรือ trade-offs ให้เลือก
