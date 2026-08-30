# Scoring

คำนวณ review score สำหรับ consistency review

## Severity Weights

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

- Score < 70 → แนะนำปรับปรุง consistency ก่อนดำเนินการ
- Score < 50 → หยุดและ report อย่างเดียว

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % ของ skill files, structure, headings, terminology, formatting และ references ใน scope ที่ review ครบ | reviewed / total × 100 |
| False Positive Rate | % ของ findings ที่ไม่ใช่ปัญหาจริง | false positives / total findings × 100 |
| Evidence Strength Score | % ของ findings ที่มี evidence (file path หรือ line) | findings with evidence / total findings × 100 |
| Actionability Score | % ของ findings ที่มีคำแนะนำชัดเจน | actionable findings / total findings × 100 |
| Severity Distribution | จำนวน findings แยกตาม severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | ระยะเวลาโดยประมาณในการแก้ | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | การปรับปรุงคะแนนระหว่างก่อนและหลัง | (after - before) / before × 100 |
| Risk Exposure Index | จำนวน Critical/High findings ใน global rules, `AGENTS.md` references, frontmatter และ shared conventions | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % ของ findings อยู่ใน skill files ที่ประกาศ | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % ของ findings ที่มี file path/line/reference ครบ | documented findings / total findings × 100 |
