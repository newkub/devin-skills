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
