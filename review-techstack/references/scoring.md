# Techstack Review Score Formula

Reference สำหรับคำนวณ tech stack review score

## Score Calculation

คำนวณ review score เป็น percentage (0-100) จาก severity weighted average

### Severity Weights

- Critical = 0
- High = 25
- Medium = 50
- Low = 75
- Info = 100

### Formula

```
review score = sum(severity_weight[finding] for all findings) / count(findings)
```

- 0 = ทุก finding เป็น Critical
- 100 = ไม่มี finding

## Dimension Scores

1. คำนวณ score ต่อ dimension: tech stack, dependencies, library design
2. คำนวณ overall score จาก weighted average ของทุก dimension
3. แสดง score พร้อม progress bar และ grade

## Grade Mapping

- 90-100 = A
- 80-89 = B
- 70-79 = C
- 60-69 = D
- 0-59 = F

## Usage

- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- แสดง score ใน report พร้อม recommended actions
- ถ้า score < 60 → แนะนำ priority actions ก่อนจบ review

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % manifest/workspaces reviewed | reviewed workspaces / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with package/evidence data | findings with evidence / total findings × 100 |
| Actionability Score | % findings with migration/update path | actionable findings / total findings × 100 |
| Dependency Risk Score | vulnerable/outdated exposure | count critical/high CVE / total deps × 100 |
| EOL/Deprecated Count | deprecated or EOL dependencies | count of EOL/deprecated packages |
| Duplicate Package Count | duplicate package versions | count of duplicate packages |
| License Compliance | non-compliant licenses | non-compliant packages / total packages × 100 |
| Tree-Shaking Health | dead-code/exports removed | tree-shaken size / total size × 100 |
| Before/After Trend | score improvement | (after - before) / before × 100 |
