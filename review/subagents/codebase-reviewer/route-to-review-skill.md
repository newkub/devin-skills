---
name: route-to-review-skill
description: เลือก review skill ที่เหมาะสม
---

# Route To Review Skill

## Goal

เรียก review skill ที่ถูกต้อง

## Checks

1. ถ้าผู้ใช้ต้องการ multi-stakeholder review หรือ roleplay หลายบทบาท → ทำ `/deep-review`
2. ถ้า code → ทำ `/deep-review`
3. ถ้า `AGENTS.md` หรือ docs → ทำ `/deep-review`
4. ถ้า GitHub issue → ทำ `/deep-review`
5. ถ้า GitHub PR → ทำ `/review-github-pr`
6. ถ้า devin skills → ทำ `/review-devin-global-harness`
7. ถ้า context ไม่ชัด → ทำ `/scan-codebase` แล้ว `/report-before-after` ก่อน แล้วถาม user
