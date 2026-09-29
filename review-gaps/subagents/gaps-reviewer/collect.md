---
name: collect
description: รวม findings จากทุก dimensional review
---

# Collect

## Goal

รวม findings จากทุก dimensional review

## Checks

1. ดึง findings จากทุก report ที่ run แล้ว
2. บันทึก source dimension, severity, location, และ evidence ต่อ finding
3. ถ้า finding ไม่มี evidence → ข้ามและบันทึกเป็น noise

