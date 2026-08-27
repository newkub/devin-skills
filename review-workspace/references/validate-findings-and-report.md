---
name: validate-findings-and-report
description: findings ถูกต้อง พร้อม review score และ recommendations
---

# Validate Findings And Report

validate findings และสรุปผล

## Goal

findings ถูกต้อง พร้อม review score และ recommendations

## Checks

1. ทำ `/validate` เพื่อตรวจสอบ findings
2. ให้ severity ต่อ finding: Critical, High, Medium, Low, Info
3. คำนวณ review score โดย weighted average
4. ทำ `/report-table` สำหรับ summary ด้วยคอลัมน์ `No., Category, Finding, Severity, Evidence, Recommendation` โดย `No.` เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... ตามลำดับของแถว
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

