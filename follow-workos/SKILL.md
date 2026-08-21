---
name: follow-workos
description: ใช้งาน WorkOS สำหรับ SSO, Directory Sync, และ Authentication
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
related:
- follow-better-auth
---

## Goal

ตั้งค่าและใช้งาน WorkOS APIs สำหรับ authentication และ identity management

## Scope

ใช้ใน project ที่ต้องการ WorkOS SSO, SCIM, User Management หรือ Admin Portal

## Execute

### 1. Install SDK

1. ติดตั้ง package ตาม runtime (`@workos-inc/node`, `workos-python`, etc.)
2. สร้าง API key จาก WorkOS Dashboard
3. เก็บ credentials ใน environment variables

### 2. Configure WorkOS

1. กำหนด `WORKOS_API_KEY` และ `WORKOS_CLIENT_ID`
2. ตั้งค่า redirect URI และ allowed origins
3. สร้าง organization และ connection ตาม provider (SAML, OIDC, Microsoft, Google)

### 3. Implement SSO

1. สร้าง `authorization_url` ด้วย `workos.sso.getAuthorizationURL`
2. รับ `code` callback และเรียก `workos.sso.getProfileAndToken`
3. สร้าง/อัปเดต user session
4. ตรวจสอบ `state` และ `code_challenge` สำหรับ PKCE

### 4. Directory Sync

1. สร้าง directory สำหรับ connection
2. ตั้งค่า webhook endpoint สำหรับ events
3. จัดการ users/groups จาก `dsync.*` APIs
4. ตรวจสอบ webhook signature

## Rules

- ไม่ hardcode API key ใน code
- ใช้ environment-based config
- validate webhook signatures ทุกครั้ง
- จัดการ state อย่างปลอดภัย

## Expected Outcome

- SSO/Dsync พร้อมใช้งาน
- Credentials ปลอดภัย
- User data sync ถูกต้อง
