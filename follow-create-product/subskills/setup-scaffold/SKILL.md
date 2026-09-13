---
name: follow-create-product-setup-scaffold
description: Scaffold product structure — monorepo, packages, shared config และ conventions
argument-hint: "[product-name]"
related:
  - follow-create-product
  - follow-monorepo
  - create-new-project-in-drive-d
  - implement-features-to-mvp
  - ask-me
---

## Goal

Scaffold product ใหม่ตาม conventions — structure, workspaces, shared config, tooling baseline

## Scope

- ครอบคลุม initial scaffold เท่านั้น — deploy → `subskills/deploy-mvp`
- tech stack ตาม `/review-dependencies` catalog

## Execute

### 1. Confirm Requirements

> Goal: stack และ scope ชัดก่อน scaffold

1. ถาม/ยืนยัน product type, target users, และ tech stack (`/ask-me` ถ้าไม่ชัด)
2. เลือก defaults จาก techstack catalog — ห้ามเดา stack เอง

### 2. Scaffold Structure

> Goal: structure ตาม monorepo/project conventions

1. สร้าง directory structure ตาม product type
2. workspaces/packages + shared config (tsconfig, lint, format)
3. `AGENTS.md`, `README.md`, `.gitignore`, CI skeleton
4. init git + initial structure เท่านั้น ไม่ implement features

### 3. Verify Scaffold

> Goal: scaffold รันได้

1. install deps + build/typecheck ผ่าน
2. dev server หรือ entry point ทำงาน

## Rules

- scaffold เท่านั้น — features ไปทำ `/implement-features-to-mvp` ต่อ
- ทุก config ตาม `/follow-config` conventions

## Expected Outcome

- product scaffold พร้อม — structure, config, tooling baseline ครบและรันได้
