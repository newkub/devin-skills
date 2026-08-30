# Scoring Formula

## Weighted Average

review score = weighted average ของ findings ทั้งหมด

| Severity | Score |
|----------|-------|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Calculation

1. รวบรวม findings ทั้งหมดจากทุก section
2. กำหนด severity ให้แต่ละ finding
3. คำนวณ weighted average: `sum(severity_score) / count(findings)`
4. ถ้าไม่มี finding → score = 100

## Grade Thresholds

| Grade | Score Range | Meaning |
|-------|-------------|---------|
| A | 90+ | Excellent |
| B | 80-89 | Good |
| C | 70-79 | Fair |
| D | 60-69 | Poor |
| F | <60 | Failing |

## Per-Dimension Score

- คำนวณ score ต่อ dimension (authentication, authorization, OWASP, etc.)
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

## Action Threshold

- Score < 70 → แนะนำให้แก้ไขก่อน release
- Score 70-79 → แนะนำให้แก้ไขในรอบถัดไป
- Score 80+ → ผ่านเกณฑ์, ติดตาม medium/low ตามลำดับ

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % security-sensitive files reviewed | reviewed security files / total security files × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with file + line + evidence | findings with evidence / total findings × 100 |
| Actionability Score | % findings with actionable recommendation | actionable findings / total findings × 100 |
| Risk Exposure Index | count of critical/high findings on critical paths | count of Critical/High findings in auth/data paths |
| Regression Risk Score | chance changes break existing flows | weighted severity in public API and auth flows × 100 |
| MTTR Estimate | estimated remediation time by severity | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement after fixes | (after_score - before_score) / before_score × 100 |
| OWASP Coverage | % OWASP Top 10 categories reviewed | categories reviewed / 10 × 100 |
| Dependency Risk Score | vulnerable/outdated dependency exposure | count critical/high CVE / total dependencies × 100 |
