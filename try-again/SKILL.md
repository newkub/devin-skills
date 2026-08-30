---
name: try-again
description: ทำตาม user prompt ล่าสุดอีกครั้ง
argument-hint: "[prompt]"
related:
  - ask-again
  - follow-best-practice
  - suggest-next-action
---

## Goal

ทำตาม user prompt ล่าสุดอีกครั้ง

## Scope

ใช้เมื่อต้องการทำงานซ้ำตาม user prompt ล่าสุด

## Execute

### 1. Identify Latest Prompt

> Goal: Identify Latest Prompt

1. อ่าน user prompt ล่าสุดจาก conversation history
2. ถ้าไม่พบ ให้ถามผู้ใช้

### 2. Re-Execute

> Goal: Re-Execute

1. ทำตาม user prompt ล่าสุดอีกครั้ง
2. แก้ไขปัญหาที่ root cause

## Rules

- ทำตาม user prompt ล่าสุดเท่านั้น
- แก้ที่ root cause ไม่ใช่ symptoms
- ใช้ minimal changes เสมอ

- ใช้ /ask-again ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- งานที่ทำซ้ำเสร็จสมบูรณ์
- ปัญหาถูกแก้ไขที่ root cause