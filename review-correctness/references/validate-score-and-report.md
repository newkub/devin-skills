# Validate, Score And Report

## Goal

ตรวจสอบ findings, คำนวณ review score, และ report ผล correctness review

## Scope

ใช้หลัง review ความถูกต้องทุก dimension เพื่อ validate, ให้ score, และสรุป action ถัดไป

## Validate Findings

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ issues จาก scripts
3. ตรวจสอบ evidence: file path, line number, code snippet
4. ยืนยันว่าทุก finding ระบุ expected behavior, actual behavior, reproduction ถ้ามี

## Score And Severity

1. จัดลำดับ severity: Critical → High → Medium → Low → Info
2. คำนวณ review score โดย weighted average
3. ระบุ score ต่อ dimension และ overall score
4. ใช้ grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Report Tables

1. ทำ `/report` พร้อม `/report-table`
2. ตารางทุกใบต้องมี `No.` เป็นคอลัมน์แรก
3. สร้างตาราง Findings by Category: No., Category, Finding, Severity, Location, Recommendation
4. สร้างตาราง Recommended Actions: No., Priority, Action, Impact, Effort, Workflow

## Next Action

1. ทำ `/suggest-next-action`
2. ถ้า score < 70 → แนะนำให้แก้ไขก่อนดำเนินการต่อ

## Rules

- ทุก finding ต้องมี file path, line number, และ code snippet
- ใช้ `tsc`, `ast-grep`, `run-test` สำหรับ verification
- ไม่เดา
- รายงานเป็นตารางด้วย `/report-table`
