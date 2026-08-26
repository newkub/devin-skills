# CI/CD Pipeline Checks

## Goal

ปรับปรุง CI/CD และ pipeline ของ project ให้เร็ว น่าเชื่อถือ และ maintain ง่าย

## Scope

ใช้กับ CI/CD configuration, build pipeline, test pipeline, deployment pipeline, release automation ใน project หรือ workspace

## Checks

### Analyze

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/update-review-cli-and-run` เพื่อรายละเอียดเพิ่ม
3. ระบุ CI/CD platform: GitHub Actions, GitLab CI, Azure DevOps, Jenkins
4. ถ้าไม่พบ issues → stop และ report

### Pipeline Setup

1. ทำ `/follow-ci-cd` ถ้า pipeline ยังไม่มีหรือต้องสร้างใหม่
2. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา best practices สำหรับ platform
3. แก้ไขปัญหาตาม priority

### Optimize Pipeline

1. ตรวจสอบ job dependencies และ parallelization
2. ใช้ caching สำหรับ dependencies, build artifacts
3. ลด unnecessary jobs, redundant builds, หรือ matrix ที่ไม่จำเป็น
4. ใช้ conditional jobs เพื่อ skip งานที่ไม่จำเป็น
5. ตรวจสอบ artifact size, retention policy

### Reliability

1. ใช้ `/review-architecture` สำหรับ retry, timeout, idempotency
2. ตรวจสอบ secrets, environment variables, permission
3. ใช้ dry run ก่อน deployment ที่สำคัญ

## Severity

- Critical: pipeline ไม่ทำงาน, secrets exposed ใน logs, ไม่มี permission check ก่อน deployment
- High: missing caching, slow pipeline, missing retry/timeout, no dry run
- Medium: suboptimal job dependencies, redundant jobs, missing retention policy
- Low: minor workflow improvement, naming convention

## Rules

- ใช้ minimal changes ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`
- ไม่ expose secrets ใน pipeline logs
- ตรวจสอบ permissions ก่อน deployment
- ทำ review เท่านั้น ไม่ apply fixes ระหว่าง review
