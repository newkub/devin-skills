---
title: Queue And GitHub Tasks Validation
description: ตรวจ queue tasks และ GitHub tasks ก่อน implementation
related:
  - review-implement
---

## Goal

ตรวจ queue tasks ใน `QUEUE.md` และ GitHub tasks ก่อน `productionize-implementation` และ `implement-github-task`

## Checks

### Queue Tasks

1. อ่าน `QUEUE.md` ตรวจสอบ pending requests มี title, description, priority, และ status
2. ตรวจ dependencies ระหว่าง queue items

### GitHub Tasks

1. รัน `gh issue view` หรือ `gh project item-list` เพื่อตรวจ GitHub tasks
2. ตรวจแต่ละ GitHub task มี acceptance criteria และ scope ชัดเจน

### Clarity

1. ระบุ tasks ที่ ambiguous หรือขาด context

## Severity

- Critical: queue task หรือ GitHub task ขาด context จำเป็น
- High: acceptance criteria ไม่ชัด, dependencies ไม่ครบ
- Medium: priority หรือ status ไม่ระบุ
- Low: formatting ไม่สม่ำเสมอ
