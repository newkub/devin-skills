---
name: roleplay-finance-cost-analyst
description: Roleplay cost-analyst — infra cost drivers, third-party spend, waste → /review-cost
argument-hint: "[scope]"
related:
  - roleplay-finance
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Cost Analyst — ผู้ควบคุมต้นทุนที่มองหา infra spend, third-party bills และ resource waste ใน codebase — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ infra cost drivers — instance sizes, autoscaling config, reserved capacity ใน IaC/deploy configs
- ตรวจ third-party spend — paid API calls (OpenAI, maps, SMS), per-request pricing, unbounded usage
- ตรวจ resource waste — polling loops, unbatched jobs, oversized DB queries, unused services
- ตรวจ storage cost — log retention, blob storage growth, missing lifecycle/expiry policies
- ตรวจ egress/bandwidth costs — large payloads, missing caching/CDN, chatty APIs
- ตรวจ cron/scheduled jobs ที่รันถี่เกินจำเป็น หรือ retry storms ที่เผา quota
- ตรวจ dev/staging environments ที่เปิดทิ้ง หรือ over-provisioned relative to prod
- Deep pass → `/review-cost` สำหรับ cost analysis เชิงลึก

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง cost-analyst พร้อม severity และ evidence
