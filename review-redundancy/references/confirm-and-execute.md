---
name: confirm-and-execute
description: ดำเนินการตาม recommendations หลัง user ยืนยัน
---

# Confirm And Execute

## Goal

ดำเนินการตาม recommendations หลัง user ยืนยัน

## Checks

1. ทำ `/ask-me` เพื่อยืนยัน actions ก่อนดำเนินการ
2. สำหรับ merge → ทำ `/review-devin-global-skills`
3. สำหรับ rename → ทำ `/rename-files-to` แล้ว `/update-references`
4. สำหรับ remove → ใช้ `git rm` แล้ว `/update-references`
5. ทำ `/validate` หลังจบทุก action

