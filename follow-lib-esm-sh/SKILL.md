---
name: follow-lib-esm-sh
description: ใช้ esm.sh CDN สำหรับโหลด ES Modules บน browser โดยไม่ต้อง bundler
related:
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ esm.sh CDN สำหรับโหลด ES Modules บน browser โดยไม่ต้อง bundler

## Scope

ใช้สำหรับการโหลด bun packages ผ่าน ESM format บน browser ด้วย tree-shaking และ optimization อัตโนมัติ

## Execute

### 1. Import Modules

> Goal: โหลด ES Modules ผ่าน esm.sh CDN

1. Import modules ด้วย URL format: `import React from 'https://esm.sh/react@18'`
2. ใช้ query parameters สำหรับ configuration เช่น `?dev` สำหรับ development mode

### 2. Configure Dependencies

> Goal: จัดการ external และ peer dependencies

1. ใช้ `?deps` สำหรับ external dependencies
2. ใช้ `?external` สำหรับ peer dependencies

### 3. Ensure Stability

> Goal: รักษา stability ของ production

1. Pin version เสมอเพื่อ stability
2. Test ใน production ก่อน deploy

## Rules

- ใช้ URL format: `https://esm.sh/package@version`
- ใช้ `?dev` สำหรับ development mode
- ใช้ `?deps` สำหรับ external dependencies
- Pin version เสมอเพื่อ stability
- ใช้ `?external` สำหรับ peer dependencies
- Test ใน production ก่อน deploy

- ใช้ /follow-lib-animejs ถ้าจำเป็น
- ใช้ /follow-lib-arktype ถ้าจำเป็น
- ใช้ /follow-lib-better-auth ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /use-my-packages-on-registry ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Expected Outcome

- Bundle size ที่เล็กลงด้วย tree-shaking
- Loading performance ที่ดีขึ้น
- Development workflow ที่ง่ายขึ้น
