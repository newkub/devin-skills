---
name: follow-web-product-saas
description: ปรับปรุง web SaaS product ครบวงจรเพื่อความสมบูรณ์และ scalability
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ปรับปรุง web SaaS product ครบวงจรเพื่อให้มีประสิทธิภาพ ใช้งานง่าย และ scalable

## Scope

ใช้สำหรับ web SaaS products ทุกประเภท (B2B, B2C, marketplace, platform)

## Execute

### 1. Analyze SaaS Structure

วิเคราะห์โครงสร้าง SaaS ปัจจุบัน

1. ทำ `/analyze-project` เพื่อดูโครงสร้าง
2. ตรวจสอบ architecture patterns, multi-tenancy, authentication และ billing/subscription logic
3. ถ้า project มี CLI tools ให้ตรวจสอบ API integration ด้วย
4. ถ้า project มี SDK ให้ตรวจสอบ developer API surface

### 2. Improve Performance

ปรับปรุง performance ครบวงจร

1. ทำ `/review-codebase` สำหรับ web performance
2. ทำ `/review-codebase` สำหรับ caching strategy
3. Optimize database queries, API responses และ implement CDN

### 3. Improve UX/UI

ปรับปรุง UX/UI ครบวงจร

1. ทำ `/review-codebase` สำหรับ UX/UI improvements
2. ปรับปรุง onboarding flow, user dashboard, settings interface และ notification experience

### 4. Improve SEO

ปรับปรุง SEO ครบวงจร

1. ทำ `/review-codebase` สำหรับ SEO improvements
2. Optimize landing pages และ content pages
3. Implement structured data และ monitor search performance

### 5. Improve Integrations

ปรับปรุง integrations ครบวงจร

1. ทำ `/review-codebase` สำหรับ integrations
2. Improve third-party integrations, API integrations, webhook handling และ data synchronization
3. ทำ `/review-codebase` สำหรับ transactional email service (booking confirmations, receipts, password reset, email templates, deliverability)

### 6. Improve Security

ปรับปรุง security ครบวงจร

1. ทำ `/review-codebase` สำหรับ security improvements
2. ทำ `/review-codebase` สำหรับ rate limiting และ DDoS protection
3. ทำ `/review-codebase` สำหรับ audit logging และ compliance trail (who/what/when สำหรับทุก data mutation)
4. ทำ `/review-codebase` สำหรับ idempotency keys ป้องกัน duplicate bookings/payments เมื่อ retry
5. Implement multi-factor authentication, data encryption และ security monitoring

### 7. Improve Scalability

ปรับปรุง scalability

1. ทำ `/review-codebase` สำหรับ scalability improvements
2. ทำ `/review-codebase` สำหรับ tenant isolation และ resource limits
3. ทำ `/review-codebase` สำหรับ background jobs และ task queue (async notifications, report generation, refund processing, dead letter handling)
4. Optimize database for scale, implement horizontal scaling และ load balancing

### 8. Improve Database

ปรับปรุง database operations

1. ทำ `/review-codebase` สำหรับ database improvements
2. Optimize queries, implement proper indexing, connection pooling และ data archiving

### 9. Improve Error Handling

ปรับปรุง error handling

1. ทำ `/review-codebase` สำหรับ error handling
2. ทำ `/review-codebase` สำหรับ external error tracking (Sentry/Datadog) สำหรับ production real-time error alerts
3. Implement global error handling, error tracking และ error recovery

### 10. Improve Monitoring

ปรับปรุง monitoring และ observability

1. ทำ `/review-codebase` สำหรับ monitoring improvements
2. ทำ `/review-codebase` สำหรับ logging strategy
3. Implement application monitoring, business metrics และ alerting

### 11. Improve Developer Experience

ปรับปรุง developer experience

1. ทำ `/review-codebase` สำหรับ DX improvements
2. ทำ `/review-codebase` สำหรับ deployment และ rollback strategy
3. ทำ `/review-codebase` สำหรับ gradual rollout และ kill switches
4. Improve build times, local development และ documentation

### 12. Verify And Report

ตรวจสอบผลการปรับปรุง

1. ทำ `/check-correctness` เพื่อ verify การเปลี่ยนแปลง
2. ทำ `/report` เพื่อสรุปการปรับปรุงครบวงจร

## Rules

### 1. SaaS-Specific Requirements

ข้อกำหนดเฉพาะของ SaaS products ที่ไม่ครอบคลุมโดย `/improve-*` workflows

- Billing: integrate payment gateways, subscription management, usage tracking, handle payment failures gracefully
- Data Privacy: GDPR compliance, data retention policies, data export/deletion, consent management
- Multi-tenancy: tenant isolation, tenant-aware data access, tenant-specific configurations
- Transactional Email: booking confirmations, receipts, password reset, email templates, deliverability (SPF/DKIM/DMARC)
- Background Jobs: async task queue สำหรับ notifications, report generation, refund processing, dead letter handling
- Audit Trail: log ทุก data mutation พร้อม who/what/when สำหรับ compliance และ forensic
- Idempotency: idempotency keys ป้องกัน duplicate operations เมื่อ retry (bookings, payments, webhooks)
- Error Tracking: external service (Sentry/Datadog) สำหรับ production real-time error alerts
- Feature Flags: gradual rollout, kill switches, A/B testing สำหรับ safe deployment

### 2. Performance Targets

ทำตามเป้าหมาย performance สำหรับ SaaS products

- Page load time: < 2s
- API response time: < 200ms
- Database query time: < 100ms
- Uptime: > 99.9%
- Error rate: < 0.1%

## Expected Outcome

- Performance ดีและเร็ว
- UX/UI ใช้งานง่ายและเป็นมิตร
- SEO ดีและ ranking สูง
- Integrations stable และ reliable
- Transactional email ส่งได้ครบทุกประเภท
- Security เข้มงวด พร้อม audit trail
- Scalable และ handle growth ได้
- Background jobs ประมวลผล async ได้
- Database operations efficient
- Error handling robust พร้อม external tracking
- Monitoring ครบถ้วน
- Developer experience ดี
- Idempotency ป้องกัน duplicate operations
- Feature flags สำหรับ safe deployment
- SaaS product พร้อมสำหรับ production
