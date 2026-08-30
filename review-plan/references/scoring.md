# Scoring

คำนวณ review score สำหรับ plan quality

## Plan Quality Score

ดูรายละเอียด categories ใน [plan-quality-score.md](plan-quality-score.md)

## Severity Weights (สำหรับ findings)

- Critical = 0
- High = 25
- Medium = 50
- Low = 75
- Info = 100

## Score Calculation

review score = weighted average ของ findings ทั้งหมด

## Grade Mapping

- A: 90+ (ยอดเยี่ยม)
- B: 80+ (ดี)
- C: 70+ (ผ่าน)
- D: 60+ (ต้องปรับปรุง)
- F: <60 (ไม่ผ่าน)

## Action Threshold

- Score < 70 หรือมี critical findings → No-Go แนะนำให้ปรับ plan ก่อน
- Score >= 70 และไม่มี critical findings → Go

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % ของ plan sections, tasks, categories (risk, dependency, alternatives, timeline, scope, acceptance, rollback, resource) ใน scope ที่ review ครบ | reviewed / total × 100 |
| False Positive Rate | % ของ findings ที่ไม่ใช่ปัญหาจริง | false positives / total findings × 100 |
| Evidence Strength Score | % ของ findings ที่มี evidence (plan section, task, file path) | findings with evidence / total findings × 100 |
| Actionability Score | % ของ findings ที่มีคำแนะนำชัดเจน | actionable findings / total findings × 100 |
| Severity Distribution | จำนวน findings แยกตาม severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | ระยะเวลาโดยประมาณในการแก้ | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | การปรับปรุงคะแนนระหว่างก่อนและหลัง | (after - before) / before × 100 |
| Risk Exposure Index | จำนวน Critical/High findings ใน critical path, high-risk tasks, rollback และ acceptance criteria | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % ของ findings อยู่ใน plan scope ที่ประกาศ | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % ของ findings ที่มี file path/line/reference ครบ | documented findings / total findings × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Plan completeness | % ของส่วนที่จำเป็นใน plan ที่มีครบ | ส่วนที่ครบ / ส่วนที่ต้องมี × 100 |
| 2 | Milestone coverage | % ของ milestone ที่มี deliverable และวันที่ | milestones ที่กำหนด / รวม milestones × 100 |
| 3 | Dependency accuracy | % ของ dependency ที่ระบุถูกต้อง | dependencies ถูกต้อง / รวม dependencies × 100 |
