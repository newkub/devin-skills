---
name: follow-open-github-secrets
description: เปิดหน้า GitHub Secrets สำหรับตั้งค่า
---

## Goal

เปิดหน้า GitHub Secrets สำหรับตั้งค่า environment variables และ secrets ใน repository

## Scope

Use `follow-open-github-secrets` for the specific tasks and workflows it covers

## Execute

### 1. Open GitHub Secrets Page
> Goal: Open GitHub Secrets Page

1. เปิด URL: `https://github.com/{GITHUB_USERNAME}/{GITHUB_REPOSITORY}/settings/secrets/actions`
2. แทนที่ `{GITHUB_USERNAME}` ด้วย GitHub username ของคุณ
3. แทนที่ `{GITHUB_REPOSITORY}` ด้วย repository name ของคุณ
4. เพิ่ม secrets ที่จำเป็น

## Rules

1. ต้องมีสิทธิ์เข้าถึง repository settings
2. ต้องเป็น owner หรือ maintainer ของ repository
3. ระบุชื่อ repository และ username ให้ถูกต้อง

## Expected Outcome

- เปิดหน้า GitHub Secrets สำเร็จ
- สามารถเพิ่ม secrets ใหม่ได้
- เข้าถึง environment variables และ secrets ได้
