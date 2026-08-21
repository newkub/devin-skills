---
name: update-features
description: วิเคราะห์ features ที่มีอยู่ใน project และสร้าง documentation ผ่าน /update-docs
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

วิเคราะห์ features ที่มีอยู่ใน project และสร้าง documentation สำหรับใช้ใน `/idea-features`

## Scope

ครอบคลุมการวิเคราะห์ routes, modules, database schemas, API endpoints เพื่อระบุ features ที่มีอยู่ — ส่วน documentation ทั้งหมด delegate ให้ `/update-docs`

## Execute

### 1. Analyze Project Structure

วิเคราะห์ project structure เพื่อระบุ workspace และ tech stack

> Goal: ระบุ workspace ที่ต้องวิเคราะห์และบันทึก tech stack

1. ทำ `/analyze-project` เพื่อวิเคราะห์ project structure
2. ระบุ workspace ที่ต้องวิเคราะห์ (ถ้าเป็น monorepo ให้ระบุทุก workspace)
3. บันทึก tech stack และ dependencies

### 2. Identify Features

วิเคราะห์ routes, modules, database schemas, และ API endpoints เพื่อระบุ features ทั้งหมด

> Goal: ระบุ features จากทุก source และจัดกลุ่มตาม domain

1. อ่าน routes directory เพื่อระบุ pages และ features ที่ผู้ใช้เห็น
2. อ่าน modules directory เพื่อระบุ business logic features
3. อ่าน database schema files เพื่อระบุ tables และ relationships
4. อ่าน server handlers และ API routes เพื่อระบุ endpoints
5. จัดกลุ่ม features ตาม domain และระบุ name, description, module ของแต่ละ feature
6. ถ้าเป็น monorepo ให้วิเคราะห์ทุก workspace โดยใช้ `/use-scripts` เมื่อเกิน 10 workspaces

### 3. Generate Documentation

สร้าง documentation สำหรับ features ที่วิเคราะห์ได้โดย delegate ทั้งหมดให้ `/update-docs`

> Goal: Documentation สำหรับ features ใน docs/ โดยไม่เขียนซ้ำในแต่ละ workspace

1. ทำ `/update-docs` เพื่อสร้าง documentation สำหรับ features ที่วิเคราะห์ได้
2. แสดง existing features ในแชทเป็นตารางตาม `/report-format-table`

## Rules

### 1. Feature Identification

- ระบุ feature จาก: routes, modules, schemas, API endpoints
- แต่ละ feature ต้องมี name, description, และ module
- ถ้าเป็น monorepo ให้วิเคราะห์ทุก workspace

### 2. Documentation Delegation

- ใช้ `/update-docs` สำหรับ documentation ทั้งหมด — ไม่เขียน docs แยกในแต่ละ workspace
- แสดง existing features ในแชทเป็นตาราง
- ไม่สร้างไฟล์ใน `.devin/features/`

## Expected Outcome

- Documentation สำหรับ features ใน docs/ ผ่าน `/update-docs`
- ตาราง existing features ในแชท
- Features ครอบคลุม routes, modules, schemas, และ API endpoints
