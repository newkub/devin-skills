# Quality Score Formula

formula สำหรับคำนวณ review score รวมทุก dimension ของ quality review

## Dimensions

quality score คำนวณจาก 4 dimensions หลัก:

1. code quality — static analysis, architecture, types, naming, readability, hardcode, simplicity, redundancy, consistency
2. bug-prone — null safety, type assertions, exhaustive control flow, arithmetic, mutable state, async/promise, parse/regex, resource cleanup
3. correctness — logic correctness, edge cases, invariant checks, validation
4. general quality — refactor readiness, deprecation, techstack alignment

## Metric Scoring

แต่ละ dimension มี metrics ย่อย คะแนนต่อ metric:

- ✅ = 1 (ผ่าน)
- ⚠️ = 0.5 (มี warning)
- ❌ = 0 (ไม่ผ่าน)

## Dimension Score

dimension score = (total metric score / number of metrics in dimension) × 100%

## Overall Score

overall score = (code quality score + bug-prone score + correctness score + general quality score) / 4

## Grade

- A: 90 ขึ้นไป
- B: 80 ขึ้นไป
- C: 70 ขึ้นไป
- D: 60 ขึ้นไป
- F: ต่ำกว่า 60

## Severity Weighted Alternative

สำหรับ findings-based score:

- Critical = 0
- High = 25
- Medium = 50
- Low = 75
- Info = 100

review score = weighted average ของ findings ตาม severity

## Usage

- แสดง score ต่อ dimension และ overall score
- แสดง grade และ progress bar
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % source files audited | reviewed files / total source files × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with tool/line evidence | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear fix | actionable findings / total findings × 100 |
| Tech Debt Score | accumulated debt weighted by severity | weighted severity / max possible × 100 |
| Cognitive Complexity | average complexity per function | total complexity / function count |
| Dead Code Count | unused exports/functions | count from `knip`/`madge` |
| Code Duplication Rate | % duplicated code | duplicated lines / total lines × 100 |
| Hardcode Count | magic numbers/strings on critical paths | count of hardcoded values |
| Before/After Trend | score improvement | (after - before) / before × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Cognitive complexity | ค่าความซับซ้อนทางความคิดเฉลี่ยต่อ function | รวม cognitive complexity / จำนวน function |
| 2 | Code duplication rate | % ของ code ที่ซ้ำกัน | บรรทัดซ้ำ / บรรทัดทั้งหมด × 100 |
| 3 | Dead code count | จำนวน exports/function ที่ไม่ถูกใช้ | นับจาก static analysis (เช่น knip/madge) |
| 4 | Hardcode count | จำนวน magic numbers/strings บน critical paths | นับค่าที่ hardcode ใน code |
