# Findings Collection

criteria สำหรับเก็บ findings จาก dimensional review reports

## Sources

dimensional reviews ที่รวมได้:

- `review-quality` — code quality, bug-prone, correctness
- `review-realize-implementation` — TODO, MOCK, STUB, incomplete flows, missing features
- `review-delivery` — docs, DX, testing, CI/CD, performance, security
- `review-frontend` — frontend-specific gaps
- `review-backend` — backend-specific gaps
- `review-platform` — platform and infrastructure gaps
- `review-architecture` — architecture and design gaps
- `review-stability` — stability and reliability gaps
- `review-techstack` — tech stack alignment gaps
- `review-writing` — documentation and writing gaps
- `review-rules` — rules and conventions gaps
- `review-codebase` — general codebase gaps

## Finding Fields

แต่ละ finding ต้องมี:

- `id` — identifier เฉพาะ
- `source` — dimensional review ที่พบ
- `category` — หมวดเบื้องต้น
- `severity` — Critical, High, Medium, Low
- `location` — file path และ line number
- `evidence` — code snippet หรือ reference
- `description` — อธิบาย gap

## Collection Steps

1. อ่าน report จากแต่ละ dimensional review
2. ดึงทุก finding พร้อม fields ครบ
3. ติดป้าย `source` เป็นชื่อ dimensional review
4. ถ้า report หาย → ระบุเป็น coverage gap
5. ถ้า finding ไม่มี evidence → ทิ้งและรายงานเป็น noise

## Quality Gate

- ทุก finding ต้องมี source และ location
- ห้ามเดา finding ที่ไม่มีใน report
- ถ้า source ขัดแย้งกัน → เก็บทั้งคู่และทำเครื่องหมาย conflict
