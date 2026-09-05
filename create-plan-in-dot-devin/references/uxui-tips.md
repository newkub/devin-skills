# UX/UI Tips For Plan Files

## Goal

ทำให้ไฟล์แผนที่สร้างอ่านง่าย สวยงาม และใช้งานได้จริงใน markdown renderer ใดก็ได้

## Visual Hierarchy

- `##` สำหรับ main sections
- `###` สำหรับ subsections
- ห้ามกระโดดข้าม heading level
- ใช้ `>` สำหรับ highlight สั้นๆ เท่านั้น

## Icons And Color

- ใช้ Iconify CDN icons ใน column `Icon` และ headings
- ใช้ color query `?color=%23hex` เพื่อบ่งบอกระดับ เช่น green สำหรับ Low risk, red สำหรับ High risk
- ไม่ใช้ emoji ถ้าไม่จำเป็น

## Tables

- หัวตารางใช้ภาษาอังกฤษ Title Case
- ข้อมูลใน row สั้น ไม่เกิน 1-2 บรรทัด
- ใช้ align ธรรมดา (ไม่ต้องระบุ)

## Diagrams

- วาง ANSI diagram ใน `<div align="center">`
- ใช้ code block ภายใน plain text
- ไม่ใช้ image ถ้าไม่มีหลักฐานจริง

## Checkboxes

- ใช้ `- [ ]` สำหรับ acceptance criteria
- 1 checkbox ต่อ 1 criterion
- ระบุ action ที่ต้องทำชัดเจน

## Accessibility

- ไม่พึ่งพิงสีเพียงอย่างเดียว
- ใช้ label ข้อความประกอบ icon
- หลีกเลี่ยง table ที่กว้างเกินไป
