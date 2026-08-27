---
name: review-structure
description: โครงสร้าง workspace สอดคล้องกับ tech stack และ conventions
---

# Review Structure

ตรวจสอบโครงสร้าง directory ของ workspace

## Goal

โครงสร้าง workspace สอดคล้องกับ tech stack และ conventions

## Checks

1. ทำ `/scan-codebase` ใน target workspace
2. ตรวจสอบ source directory, test directory, config directory
3. ตรวจสอบว่ามี `README.md`, `LICENSE`, `.gitignore` หรือไม่
4. ตรวจสอบ file size เกิน 250 บรรทัดหรือไม่
5. ระบุ files ที่ไม่มีการใช้งานหรือ orphan files
6. ตรวจสอบว่า workspace มีขนาดเหมาะสมและ single responsibility — ถ้าใหญ่เกินไป, เล็กเกินไป, ทำหลายสิ่ง, หรือไม่มีเหตุผลชัดเจนที่แยกเป็น workspace ให้พิจารณา `/refactor-workspace`

