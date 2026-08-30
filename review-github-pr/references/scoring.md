# Scoring

คำนวณ review score สำหรับ pull request review

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

- Score < 70 → แนะนำให้แก้ไข PR ก่อน merge
- Score >= 70 → พร้อม merge ตาม recommendations

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % ของ PR files, commits, metadata, CI checks และ review categories ใน scope ที่ review ครบ | reviewed / total × 100 |
| False Positive Rate | % ของ findings ที่ไม่ใช่ปัญหาจริง | false positives / total findings × 100 |
| Evidence Strength Score | % ของ findings ที่มี file path, line number หรือ commit reference | findings with evidence / total findings × 100 |
| Actionability Score | % ของ findings ที่มีคำแนะนำชัดเจน | actionable findings / total findings × 100 |
| Severity Distribution | จำนวน findings แยกตาม severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | ระยะเวลาโดยประมาณในการแก้ | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | การปรับปรุงคะแนนระหว่างก่อนและหลัง | (after - before) / before × 100 |
| Risk Exposure Index | จำนวน Critical/High findings ใน security-sensitive files, auth, API, breaking changes และ CI | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % ของ findings อยู่ใน changed files และ PR scope ที่ประกาศ | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % ของ findings ที่มี file path/line/reference ครบ | documented findings / total findings × 100 |
