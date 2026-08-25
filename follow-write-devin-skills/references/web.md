# Web Creation Guide

skill ที่ระบุ web มี `web/` directory พร้อมรัน

## When To Create Web

ถ้า `## Execute` ระบุว่าต้องแสดงผล web หรือ browser → สร้าง `web/`

## Steps

1. ใช้ `/follow-web-design` เพื่อออกแบบ UI/UX. ใช้ `/visualize-in-web` สร้างไฟล์ HTML entry ใน `web/`
2. รันทดสอบด้วย `bunx serve web/` หรือ `/open-web`. เก็บ generated files ให้ไม่เกิน 250 บรรทัดต่อไฟล์

## Rules

- ถ้า skill ต้องการ web → เรียก `/follow-web-design` ก่อนสร้าง `web/`
- ใช้ `/visualize-in-web` เพื่อสร้าง HTML entry
- ตรวจสอบว่า `bunx serve web/` หรือ `/open-web` ทำงานได้
- รักษา package structure ที่ไม่เกิน 250 บรรทัด
