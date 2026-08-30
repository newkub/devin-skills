# Scoring

คำนวณ review score สำหรับ diff review

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

- Score < 70 → แนะนำแก้ไขก่อน commit หรือ ship
- Score >= 70 → proceed ตาม decision ของ user

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % ของ changed files, untracked files, status categories และ scope ใน scope ที่ review ครบ | reviewed / total × 100 |
| False Positive Rate | % ของ findings ที่ไม่ใช่ปัญหาจริง | false positives / total findings × 100 |
| Evidence Strength Score | % ของ findings ที่มี evidence (`git status`, `git diff`, file path) | findings with evidence / total findings × 100 |
| Actionability Score | % ของ findings ที่มีคำแนะนำชัดเจน | actionable findings / total findings × 100 |
| Severity Distribution | จำนวน findings แยกตาม severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | ระยะเวลาโดยประมาณในการแก้ | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | การปรับปรุงคะแนนระหว่างก่อนและหลัง | (after - before) / before × 100 |
| Risk Exposure Index | จำนวน Critical/High findings ใน deleted/renamed files, secrets, files ยาวเกิน 250 บรรทัด และ out-of-scope changes | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % ของ findings อยู่ใน diff scope ที่ user ร้องขอ | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % ของ findings ที่มี file path/status/reference ครบ | documented findings / total findings × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Diff Coverage | % ของ changes ใน diff ที่ review ครบ | reviewed changes / total changes × 100 |
| 2 | Change Type Distribution | สัดส่วนประเภทของ changes | count per change type / total changes × 100 |
| 3 | Change Risk Score | คะแนนความเสี่ยงของ changes | risk-weighted changes / total changes × 100 |
