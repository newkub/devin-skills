---
title: Issue Completeness Checks
description: ตรวจ completeness ของ issue ก่อน implementation
related:
  - review-issue
---

## Goal

ยืนยันว่า issue มีข้อมูลเพียงพอที่จะเริ่มงานได้

## Checks

1. title กระชับและอธิบายปัญหาหรือเป้าหมาย
2. มี `## Goal` หรือ goal statement ที่ชัดเจน
3. `## Scope` หรือขอบเขตระบุชัดเจน
4. acceptance criteria ระบุเป็นลิสต์และตรวจสอบได้
5. dependencies, blockers และ related skills ระบุชื่อ
6. environment, version หรือ context รวมอยู่หากเกี่ยวข้อง

## Severity

- Critical: ไม่มี goal, ไม่มี scope, ไม่มี acceptance criteria
- High: ขาด dependencies หรือ blockers, ขาด environment/context
- Medium: title ไม่กระชับ, acceptance criteria ไม่ testable
- Low: formatting, missing version
