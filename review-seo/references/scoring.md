# SEO Review Score Formula

## Goal

คำนวณ review score เป็น percentage (0-100) สำหรับ SEO review ทุก dimension

## Scope

ใช้สำหรับคำนวณ score ต่อ dimension และ overall score ของ SEO review

## Score Formula

### Per-Dimension Score

แต่ละ dimension คำนวณ score จาก weighted average ของ findings ใน dimension นั้น:

```
dimension_score = sum(finding_weight) / count(findings)
```

### Finding Weights

| Severity | Weight | Score |
|---|---|---|
| Critical | 0 | 0 |
| High | 25 | 25 |
| Medium | 50 | 50 |
| Low | 75 | 75 |
| Info | 100 | 100 |

- ถ้า dimension ไม่มี finding → score = 100
- ถ้าทุก finding เป็น Critical → score = 0

### Overall Score

```
overall_score = sum(dimension_score) / count(dimensions)
```

- นับเฉพาะ dimensions ที่ไม่ถูก skip
- แสดง score ต่อ dimension และ overall score

## Dimensions

1. Technical SEO
2. On-Page SEO
3. Structured Data And Schema
4. Core Web Vitals For SEO
5. International And SSR SEO
6. Content And Semantic HTML

## Usage

- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- แสดง score ในตารางด้วย `/report-table`
- รายงาน score ต่อ dimension และ overall score
- ระบุ dimensions ที่ถูก skip ใน report

## Rules

- คำนวณ score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- ไม่นับ dimensions ที่ถูก skip ใน overall score
- ใช้ score เปรียบเทียบ before/after เท่านั้น ไม่ใช้สำหรับ pass/fail

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % SEO dimensions in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % SEO findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear SEO recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix SEO issues | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical SEO areas | count of Critical/High findings in crawl/index/on-page scope |
| Scope Boundary Adherence | % findings inside declared SEO scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Crawl Coverage | % ของ URLs ที่ crawler เข้าถึงได้ | crawled URLs / total URLs × 100 |
| 2 | Indexability | % ของ pages ที่สามารถ index ได้ | indexable pages / total pages × 100 |
| 3 | Core Web Vitals for SEO | % ของ pages ที่ผ่าน LCP/INP/CLS thresholds | passing pages / total pages × 100 |
| 4 | Schema Markup Coverage | % ของ pages ที่มี structured data ครบ | pages with valid schema / total pages × 100 |
