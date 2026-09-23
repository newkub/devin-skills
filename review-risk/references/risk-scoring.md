# Risk Scoring

## Goal

กำหนดวิธีประเมิน risk สำหรับ `review-risk` แบบชัดเจนและวัดผลได้

## Individual Risk Score

| Probability | Value |
|-------------|-------|
| high        | 3     |
| medium      | 2     |
| low         | 1     |

| Impact | Value |
|--------|-------|
| high   | 3     |
| medium | 2     |
| low    | 1     |

risk score = probability value × impact value

## Severity Levels

| Score | Severity |
|-------|----------|
| 9     | Critical |
| 6-8   | High     |
| 3-5   | Medium   |
| 1-2   | Low      |

## Category Score

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- category ถือว่าผ่านเมื่อไม่มี critical/high risk ที่ไม่มี mitigation
- category ถือว่าเตือนเมื่อมี high risk แต่มี mitigation ไม่ชัดเจน
- category ถือว่าไม่ผ่านเมื่อมี critical risk ที่ไม่มี mitigation หรือ rollback

## Overall Risk Readiness Score

risk readiness score = (total category score / total categories) × 100%

## Grade

- A: 90+
- B: 80-89
- C: 70-79
- D: 60-69
- F: <60

## Recommendation Threshold

- Score >= 90: proceed
- 70-89: proceed with caution
- <70: stop and mitigate before proceed
