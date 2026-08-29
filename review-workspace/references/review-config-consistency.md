---
name: review-config-consistency
description: config files สอดคล้องกับ root workspace และ project standards
---

# Review Config Consistency

ตรวจสอบ config files ของ workspace

## Goal

config files สอดคล้องกับ root workspace และ project standards

## Checks

1. ทำ `/review-codebase-everythink` สำหรับ tsconfig, vite, biome, eslint, prettier, lefthook, turbo
2. เปรียบเทียบ config กับ root workspace ถ้ามี
3. ตรวจสอบ `.env.example`, `.env.local` ว่ามีหรือไม่
4. ตรวจสอบ config drift ระหว่าง workspaces ถ้าเป็น monorepo

