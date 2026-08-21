---
name: list-improvements
description: แสดงรายการ improvements ที่ทำได้ใน project
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

แสดงรายการ improvements ที่ทำได้ใน project เพื่อให้ user เลือกได้

## Scope

ใช้สำหรับทุก workspace เพื่อดูว่า improve อะไรได้บ้าง

## Execute

### 1. Analyze Project

วิเคราะห์ project เพื่อดูสิ่งที่ improve ได้

1. ทำ `/analyze-project` เพื่อวิเคราะห์โปรเจกต์
2. ตรวจสอบ dependencies และ tech stack
3. ดู code quality metrics หากมี

### 2. Suggest Improvements

แนะนำ improvements ที่เหมาะสมกับ project

1. วิเคราะห์สิ่งที่ improve ได้จาก project
2. แนะนำ improvements ตาม context ของ project
3. จัดลำดับตาม priority (critical, high, medium, low)
4. แนะนำ workflows ที่เหมาะสมสำหรับแต่ละ improvement

## Rules

### 1. Context-Aware Analysis

วิเคราะห์ improvements ตาม context ของ project

- พิจารณา tech stack, dependencies, และ project type
- วิเคราะห์ issues ที่พบจาก `/analyze-project`
- พิจารณา project size และ complexity
- ดู code quality metrics หากมี

### 2. Prioritize By Impact

จัดลำดับ improvements ตาม impact และ effort

- จัดลำดับตาม priority (critical, high, medium, low)
- พิจารณา impact vs effort ของแต่ละ improvement
- เน้น improvements ที่มี impact สูงและ effort ต่ำ
- แนะนำ improvements ที่เหมาะสมกับ project phase

### 3. Suggest Relevant Workflows

แนะนำ workflows ที่เหมาะสมกับแต่ละ improvement

- ใช้ `/workflow-name` format
- แนะนำ workflows ที่มีอยู่จริงใน global_workflows
- อธิบายสั้นๆ ว่า workflow นั้นทำอะไร
- แนะนำ workflows ที่เกี่ยวข้องกับ context ของ project

## Expected Outcome

- User รู้ว่า improve อะไรได้บ้างใน project
- User เลือก improvements ที่เหมาะสมได้
- User รู้ว่าใช้ workflow ไหนสำหรับ improvement นั้นๆ
- User สามารถ prioritize improvements ได้
