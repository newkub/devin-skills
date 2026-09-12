# Platform Review Score Formula

## Review Metrics

| Metric | Description | How To Calculate |
|---|---|---|
| Review Coverage Ratio | % platform features reviewed | `reviewed features / total platform features × 100` |
| False Positive Rate | % findings that are false positives | `false positives / total findings × 100` |
| Evidence Strength Score | % findings with file + line + evidence | `findings with evidence / total findings × 100` |
| Actionability Score | % findings with actionable recommendation | `actionable findings / total findings × 100` |
| Platform Coverage | % target platforms verified | `verified platforms / target platforms × 100` |
| Core Web Vitals Score | LCP, INP, CLS pass rate | `passing CWV / total pages × 100` |
| Accessibility Coverage | % screens meeting WCAG | `compliant screens / total × 100` |
| i18n Completeness | % locale keys translated | `translated keys / total keys × 100` |
| Battery/Energy Score | high-impact battery patterns found | `battery findings / total checks × 100` |
| Before/After Trend | score improvement | `(after - before) / before × 100` |

## Score Calculation

คำนวณ review score เป็น percentage (0-100)

### Weighted Average Formula

```
score = sum(severity_weight[finding] for all findings) / total_findings
```

### Severity Weights

| Severity | Weight |
|---|---|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

### Interpretation

- `0` = ทุก finding เป็น Critical
- `100` = ไม่มี finding
- คะแนนระหว่าง 0-100 คือ weighted average ของ severity weights ทั้งหมด

## Per-Dimension Score

1. คำนวณ score ต่อ dimension: mobile, desktop, CLI/TUI, SSR, state management, routing, PWA, i18n, SEO, battery, compatibility
2. แต่ละ dimension ใช้สูตรเดียวกัน — เฉพาะ findings ใน dimension นั้น
3. ถ้า dimension ถูกข้าม (skip condition) → ไม่นับใน overall score

## Overall Score

```
overall = sum(dimension_score[dimension] for non-skipped dimensions) / non_skipped_dimension_count
```

## Usage

- แสดง score ต่อ dimension และ overall score ใน report
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- ถ้า Critical/High พบ → แนะนำ `/resolve-errors` เป็น action ถัดไป
- ทำ review ซ้ำหลังแก้ไขสูงสุด 3 รอบ

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Browser/device pass rate | % ของ browser/device เป้าหมายที่ผ่านทดสอบ | คอนฟิกที่ผ่าน / คอนฟิกเป้าหมาย × 100 |
| 2 | i18n completeness | % ของ locale keys ที่แปลแล้ว | translated keys / รวม keys × 100 |
| 3 | Accessibility violations | จำนวนการละเมิด WCAG ที่พบ | นับ findings ด้าน accessibility ตาม severity |
| 4 | Hydration mismatch count | จำนวน hydration mismatch ที่ตรวจพบ | นับ mismatches จาก logs หรือ tests |
