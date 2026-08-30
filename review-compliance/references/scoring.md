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

- คำนวณ score ต่อ dimension (GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PDPA, etc.)
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

## Action Threshold

- Score < 70 → แนะนำให้แก้ไขก่อน release
- Score 70-79 → แนะนำให้แก้ไขในรอบถัดไป
- Score 80+ → ผ่านเกณฑ์, ติดตาม medium/low ตามลำดับ

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % compliance domains reviewed | reviewed domains / total domains × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with audit evidence | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear remediation | actionable findings / total findings × 100 |
| Regulation Coverage | % applicable regulations checked | checked regulations / total applicable × 100 |
| Consent Coverage | % user flows with consent | flows with consent / total data flows × 100 |
| DSAR Readiness | % DSAR requirements implemented | implemented / required × 100 |
| Audit Trail Coverage | % critical actions logged | logged actions / critical actions × 100 |
| Data Retention Compliance | % data types with retention policy | compliant types / total types × 100 |
| Before/After Trend | score improvement | (after - before) / before × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Regulation Coverage | % applicable regulations checked | checked regulations / total applicable × 100 |
| 2 | Consent Coverage | % user flows with valid consent | flows with consent / total data flows × 100 |
| 3 | DSAR Readiness | % DSAR requirements implemented | implemented / required × 100 |
| 4 | Audit Trail Coverage | % critical actions with complete logs | logged actions / critical actions × 100 |
