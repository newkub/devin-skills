---
name: prepare-and-scan
description: เข้าใจ business logic setup ใน codebase
---

# Prepare And Scan

เตรียม context ก่อนเริ่ม review

## Goal

เข้าใจ business logic setup ใน codebase

## Checks

1. ทำ `/scan-codebase` เพื่อเข้าใจ business logic setup
2. ระบุ payment provider, subscription model, tenant model, flag provider, realtime protocol, email tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/review-codebase-everything` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

## Skip Conditions

- ถ้า project ไม่มี payment processing ให้ข้าม Payment Review
- ถ้า project ไม่มี subscription model ให้ข้าม Subscription Review
- ถ้า project ไม่มี multi-tenancy ให้ข้าม Multi-Tenancy Review
- ถ้า project ไม่มี feature flags ให้ข้าม Feature Flags Review
- ถ้า project ไม่มี realtime features ให้ข้าม Realtime Review
- ถ้า project ไม่มี email sending ให้ข้าม Email Review

