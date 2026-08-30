# Writing Review Score Formula

สูตรคำนวณ review score สำหรับ writing, naming, และ discoverability

## Score Weights

คำนวณ score จาก severity ของ findings แต่ละรายการ:

- `Critical` = 0
- `High` = 25
- `Medium` = 50
- `Low` = 75
- `Info` = 100

## Calculation

```
review_score = sum(severity_score) / count(findings)
```

- ถ้าไม่มี findings → score = 100
- ถ้ามีเฉพาะ Critical → score = 0
- weighted average ระหว่าง areas (writing, naming, discoverability) ตามจำนวน findings ในแต่ละ area

## Score Interpretation

- `90-100`: ผ่าน — คุณภาพดี มีแค่ minor issues
- `70-89`: ผ่านเงื่อนไข — มี issues ปานกลาง ต้องติดตามแก้ไข
- `50-69`: ไม่ผ่าน — มี issues สำคัญ ต้องแก้ไขก่อนส่งมอบ
- `0-49`: ไม่ผ่าน — มี Critical issues ต้องแก้ไขทันที

## Area Weights

แต่ละ area มีน้ำหนักตามจำนวน findings:

- `writing-quality`: นับ findings จาก documentation, comments, commit messages, changelogs, consistency
- `naming`: นับ findings จาก naming improvements ที่มี impact 🔴 และ 🟡
- `discoverability`: นับ findings จาก code, docs, feature discoverability

## Report Format

ตาราง report รวม:

`area` | `category` | `issues found` | `issues fixed` | `severity` | `status`

- `area`: writing-quality, naming, discoverability
- `severity`: Critical, High, Medium, Low
- `status`: fixed, pending, skipped

## Before And After Comparison

เทียบ before/after สำหรับ writing quality:

- `unclear count` — จำนวนปัญหาที่อ่านแล้วไม่เข้าใจ
- `verbose count` — จำนวนปัญหาที่เขียนยาวเกินจำเป็น
- `inconsistent count` — จำนวนปัญหาที่ใช้คำไม่สม่ำเสมอ
- `missing context count` — จำนวนปัญหาที่ขาดบริบท

รายงานเป็นตาราง: `metric` | `before` | `after` | `delta`

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % writing/naming/discoverability items in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical areas (README, public API docs, or core naming) | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % findings inside declared scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | grammar consistency | % writing samples without grammar or spelling issues | clean writing samples / total samples × 100 |
| 2 | clarity score | % writing that is immediately understandable and concise | clear and concise items / total items reviewed × 100 |
| 3 | terminology consistency | % terminology that matches the project glossary consistently | consistent terminology / total checked terms × 100 |
