# Analytics Checks

## Goal

Review analytics implementation, data accuracy, tracking coverage และ consent

## Scope

ใช้กับ projects ที่มี analytics, event tracking, conversion funnels, data retention

## Checks

1. ตรวจ event tracking, naming, schema consistency, conversion funnels, tracking completeness
2. ตรวจ analytics implementation, data accuracy, tool configuration, consent mode, data retention

## Severity

- Critical: broken tracking, no conversion funnel, data accuracy issue
- High: missing event tracking, inconsistent naming, no consent mode
- Medium: incomplete funnel, missing data retention policy
- Low: naming convention, documentation gap

## Rules

- ถ้า project ไม่มี analytics → ข้าม checks นี้
- ทำ review เท่านั้น ไม่แก้ไข analytics code ระหว่าง review
- ทุก finding ต้องมี file path หรือ tracking tag ที่เกี่ยวข้อง
- ระบุ impact ต่อ metrics หรือ reporting
