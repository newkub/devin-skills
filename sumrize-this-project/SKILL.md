---
name: sumrize-this-project
description: สรุป project ปัจจุบัน features และ solutions
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

สรุป project ปัจจุบัน features และ solutions ที่ตอบโจทย์

## Scope

ใช้สำหรับสรุป project overview และคุณสมบัติหลัก

## Execute

### 1. Analyze Project Structure

วิเคราะห์โครงสร้าง project

1. อ่าน `package.json` หรือ `Cargo.toml` สำหรับ dependencies
2. อ่าน `README.md` สำหรับ project description
3. ตรวจสอบ folder structure หลัก
4. ดู configuration files

### 2. Identify Features

ระบุ features หลักของ project

1. ดู source code ใน `src/` หรือ `app/`
2. ระบุ modules หรือ components หลัก
3. ดู API endpoints หรือ routes
4. ระบุ integrations กับ external services

### 3. Identify Solutions

ระบุ solutions ที่ตอบโจทย์

1. ระบุ problems ที่ project แก้ไข
2. ดู use cases จาก documentation
3. ระบุ target users หรือ industries
4. ดู competitive advantages

### 4. Summarize Findings

สรุปผลการวิเคราะห์

1. เขียน project overview
2. ระบุ features หลักด้วย bullet points
3. อธิบาย solutions ที่ตอบโจทย์
4. ระบุ tech stack หลัก

## Rules

### 1. Project Analysis

วิเคราะห์ project อย่างเป็นระบบ

- อ่าน configuration files ก่อน
- ดู folder structure หลัก
- ระบุ entry points ของ application
- ดู dependencies และ integrations

### 2. Feature Identification

ระบุ features อย่างชัดเจน

- ใช้ bullet points สำหรับ features
- จัดกลุ่ม features ตาม categories
- ระบุ features ที่ unique หรือ important
- อธิบาย features สั้นกระชับ

### 3. Solution Description

อธิบาย solutions ที่ตอบโจทย์

- ระบุ problems ที่แก้ได้
- อธิบาย value propositions
- ระบุ target users หรือ industries
- ดู competitive advantages

### 4. Summary Format

จัดรูปแบบ summary ให้อ่านง่าย

- ใช้ clear headings
- ใช้ bullet points สำหรับ lists
- ใช้ concise language
- จัดลำดับตามความสำคัญ

## Expected Outcome

- Project overview ที่ชัดเจน
- Features list ที่ครบถ้วน
- Solutions description ที่ตอบโจทย์
- Tech stack summary
