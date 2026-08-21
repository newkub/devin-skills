---
name: follow-oop-to-composables
description: แปลง OOP เป็น composables function style
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

## Goal

แปลง OOP code เป็น composables function style คล้าย Vue composables

## Scope

Use `follow-oop-to-composables` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Identify OOP Code

ระบุ OOP code ที่ต้องแปลง

1. ค้นหา class และ object-oriented patterns
2. ระบุ logic ที่สามารถแปลงเป็น composables
3. วิเคราะห์ dependencies ระหว่าง components

### 2. Convert to Composables

แปลงเป็น composables function style

1. แยก logic ออกจาก classes
2. สร้าง composables functions
3. ใช้ hooks และ reactive patterns

## Rules

## Rules

- แยก logic ออกจาก classes
- ใช้ composables functions แทน classes
- ใช้ reactive patterns
- ทำให้ code ทดสอบได้ง่ายขึ้น

## Expected Outcome

## Expected Outcome

- OOP code ถูกแปลงเป็น composables
- Logic ถูกแยกออกจาก classes
- Code ทดสอบได้ง่ายขึ้น
- Reusable functions
