# Shared Review Rules Boilerplate

Canonical rules ที่ใช้ร่วมกันใน `review-*`/`check-*` skills — reference ไฟล์นี้แทนการคัดลอก (SSOT); `(<domain>)` คือชื่อ domain ของ skill

## Evidence-Based Findings

- ทุก finding ต้องมี file path, line number และ evidence (`<domain>`)
- ไม่เดา — ใช้ tools สำหรับ verification
- ระบุ false positives ที่พบ

## Severity Classification

- Critical: ใช้ไม่ได้จริง / data loss / security exposure
- High: broken สำหรับ common case / missing protection บน critical path
- Medium: inconsistency หรือ partial failure
- Low: cosmetic, documentation gap
- Info: suggestion, best practice recommendation

## Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (`<domain>`)
- ไม่ลบไฟล์, code หรือ configuration ระหว่าง review
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

## Health Score

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding (`<domain>`)
- แสดง score ต่อ dimension และ overall score (`<domain>`)
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

## Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis (`<domain>`)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`
