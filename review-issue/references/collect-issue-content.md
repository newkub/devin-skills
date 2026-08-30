---
name: collect-issue-content
description: รับข้อความและ context ของ issue
---

# Collect Issue Content

## Goal

รับข้อความและ context ของ issue แบบเต็ม

## Checks

1. หากผู้ใช้ให้ไฟล์หรือ path ของ issue ให้ `read` มัน
2. หากผู้ใช้ให้หมายเลขหรือ URL ของ issue ให้ใช้ tool ที่เกี่ยวข้องหรือ `ask_user_question` เพื่อขอรายละเอียด
3. หากไม่มี issue ให้ `ask_user_question` เพื่อขอ title, body และ source
4. บันทึก source, author และ linked PRs หรือ tasks ใดๆ
