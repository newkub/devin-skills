# Prepare And Scan

## Goal

เตรียม context ก่อนเริ่ม review

## Checks

1. ทำ `/scan-codebase` เพื่อเข้าใจ platform setup
2. ระบุ mobile framework, desktop framework, CLI framework, SSR setup, state management library, routing library, PWA setup, i18n library, SEO strategy, battery-sensitive components, compatibility targets
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/review-codebase-everything` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
