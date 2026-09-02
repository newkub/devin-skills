# Issue Templates

เลือก template ตามประเภท issue:

| Type | Template File | ใช้เมื่อ |
|---|---|---|
| bug | [bug.md](bug.md) | แจ้ง bug |
| feature | [feature.md](feature.md) | ขอ feature หรือ enhancement |
| plan | [plan.md](plan.md) | วางแผนงานใหญ่ หรือ epic |
| question | [question.md](question.md) | ถามคำถาม |

## Rules

- title ต้องขึ้นต้นด้วยประเภท ใช้ Title Case ไม่เกิน 80 ตัวอักษร
- description เขียนด้วยภาษาอังกฤษ ยกเว้น technical terms, project/skill names, commands, paths
- ถ้า repo มี `.github/ISSUE_TEMPLATE/*.yml` → ใช้ repo templates ก่อน
- ถ้า repo ยังไม่มี templates → อ่าน `create-github-issue/templates/<type>.md` เลือกตามประเภท
- ถ้าไม่ชัดว่าใช้ type ไหน → ทำ `/ask-me`
