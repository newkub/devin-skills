# Validation And Reporting

## Validate Findings

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. จัดลำดับตาม severity ตาม `references/severity.md`: Critical → High → Medium → Low
3. จัดกลุ่กตาม critical path: schema → data → API → UI/flow
4. ระบุ false positives
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step Analyze

## Report

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Implementation Metrics Summary ตาม `references/scoring.md`
3. สร้างตาราง Findings by Critical Path: Layer, Finding, Severity, Location, Evidence, Recommendation
4. สร้างตาราง Recommended Implementations: Priority, Action, Impact, Effort, Workflow
5. แสดง implementation completeness score พร้อม grade และ progress bar
6. ทำ `/suggest-next-action`
