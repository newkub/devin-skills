---
title: Issue Quality Assessment
description: ประเมินคุณภาพ, ความชัดเจน, และความเป็นไปได้ของ issue
related:
  - review-issue
---

## Goal

ระบุปัญหาด้านความชัดเจนและความเป็นไปได้ของ issue

## Checks

1. ทำเครื่องหมายคำสั่งที่กำกวม เช่น "do the right thing" หรือ "improve" โดยไม่ระบุรายละเอียด
2. ทำเครื่องหมาย evidence, logs, screenshots หรือ file references ที่ขาดหาย
3. ทำเครื่องหมาย scope creep หรือคำขอที่ไม่เกี่ยวข้องกันหลายรายการใน issue เดียว
4. ทำเครื่องหมายข้อความ TODO, MOCK, placeholder ที่ควรพร้อม implement
5. ระบุ issues ที่ซ้ำซ้อนหรือทับซ้อนหากทราบ
6. ตรวจว่า issue สอดคล้องกับ conventions และ global rules ของโปรเจกต์

## Severity

- Critical: scope creep รุนแรง, MOCK/placeholder จำเป็นยังไม่พร้อม
- High: คำสั่งกำกวม, ขาด evidence, ซ้ำซ้อน
- Medium: minor scope creep, ขาด conventions
- Low: formatting, cosmetic
