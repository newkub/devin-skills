---
name: summarize-request
description: สรุป request และแสดงผลเป็นตารางครบถ้วนโดยใช้ /idea-features
argument-hint: "[target]"
---

## Goal

สรุป request จากผู้ใช้และแสดงผลเป็นตาราง features ที่ชัดเจน โดยใช้ `/idea-features`

## Scope

ใช้สำหรับการสรุป request ของผู้ใช้และแสดงผลเป็นตารางในแชท

ไม่รวม: สร้าง feature files (ใช้ `/update-features`), รายงาน features ที่มีอยู่ (ใช้ `/report-features`)

## Execute

### 1. Analyze Request

> Goal: อ่านและวิเคราะห์ request จากผู้ใช้

1. ระบุประเภทของ request (feature, bug fix, refactor, new project)
2. ดึงข้อมูลหลัก (context, requirements, constraints)
3. ระบุสิ่งที่ต้องทำทั้งหมด
4. ระบุ priority และ urgency

### 2. Prepare Context

> Goal: เตรียม context สำหรับ `/idea-features`

1. ระบุ project context และ current state
2. ระบุ features ที่มีอยู่แล้ว
3. ระบุ gaps และ missing capabilities
4. ระบุ user needs และ pain points

### 3. Call /idea-features

> Goal: เรียกใช้ `/idea-features` เพื่อสร้างตาราง features

1. ใช้ `/idea-features` สำหรับสร้างตาราง
2. ตารางมี columns: #, Feature, Description, Problem/Solves, How To, Dependencies, Parent/Category, Type, Difficult, Impact
3. เรียงลำดับตาม Impact (High → Medium → Low)
4. ใช้ continuous numbering 1-N
5. Type ระบุเป็น: Extends หรือ New

### 4. Present Summary

> Goal: นำเสนอสรุปพร้อมภาพรวมและขั้นตอนต่อไป

1. แสดงสรุปภาพรวมของ request ด้านบน
2. แสดงตาราง features จาก `/idea-features`
3. เพิ่มขั้นตอนต่อไปที่แนะนำ
4. ให้ผู้ใช้ยืนยันหรือปรับเปลี่ยนแผน

## Rules

### 1. Use /idea-features

- ใช้ `/idea-features` สำหรับสร้างตารางเสมอ ไม่สร้างตารางซ้ำซ้อนใน workflow นี้
- ตารางใช้ columns และ format ตามที่ `/idea-features` กำหนด

### 2. Context Preparation

- เตรียม context ให้ครบก่อนเรียก `/idea-features`
- ระบุ project context, features ที่มี, gaps, และ user needs ชัดเจน

### 3. Output Format

- แสดงสรุปภาพรวมด้านบนตาราง
- ใช้ markdown table format จาก `/idea-features`
- เพิ่มขั้นตอนต่อไปที่แนะนำ

## Expected Outcome

- Request ถูกสรุปเป็นตาราง features ในแชท
- ตารางครบถ้วนตาม `/idea-features` format
- มีขั้นตอนต่อไปที่แนะนำ
