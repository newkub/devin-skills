---
name: try-again
description: ทำตาม user prompt ล่าสุดอีกครั้ง
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

ทำตาม user prompt ล่าสุดอีกครั้ง

## Scope

ใช้เมื่อต้องการทำงานซ้ำตาม user prompt ล่าสุด

## Execute

### 1. Identify Latest Prompt

1. อ่าน user prompt ล่าสุดจาก conversation history
2. ถ้าไม่พบ ให้ถามผู้ใช้

### 2. Re-Execute

1. ทำตาม user prompt ล่าสุดอีกครั้ง
2. แก้ไขปัญหาที่ root cause

## Rules

- ทำตาม user prompt ล่าสุดเท่านั้น
- แก้ที่ root cause ไม่ใช่ symptoms
- ใช้ minimal changes เสมอ

## Expected Outcome

- งานที่ทำซ้ำเสร็จสมบูรณ์
- ปัญหาถูกแก้ไขที่ root cause
