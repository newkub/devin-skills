---
name: follow-esm-sh
description: CDN สำหรับ ES Modules ที่ให้บริการโหลด bun packages ผ่าน ESM format โดยตรงบน browser รองรับ...
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

ใช้ esm.sh CDN สำหรับโหลด ES Modules บน browser โดยไม่ต้อง bundler


## Scope

ใช้สำหรับการโหลด bun packages ผ่าน ESM format บน browser ด้วย tree-shaking และ optimization อัตโนมัติ


## Execute

- Import modules ด้วย URL format: `import React from 'https://esm.sh/react@18'`
- ใช้ query parameters สำหรับ configuration เช่น `?dev` สำหรับ development mode
- ใช้ `?deps` สำหรับ external dependencies
- Pin version เสมอเพื่อ stability
- ใช้ `?external` สำหรับ peer dependencies
- Test ใน production ก่อน deploy


## Rules

- ใช้ URL format: `https://esm.sh/package@version`
- ใช้ `?dev` สำหรับ development mode
- ใช้ `?deps` สำหรับ external dependencies
- Pin version เสมอเพื่อ stability
- ใช้ `?external` สำหรับ peer dependencies
- Test ใน production ก่อน deploy


## Expected Outcome

- Bundle size ที่เล็กลงด้วย tree-shaking
- Loading performance ที่ดีขึ้น
- Development workflow ที่ง่ายขึ้น
