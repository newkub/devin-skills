---
name: follow-config
description: ตั้งค่า configuration ตาม dependencies และ tech stack ที่ใช้
---

## Goal

ตั้งค่า configuration ตาม dependencies และ tech stack ที่ใช้ใน project

## Scope

ใช้สำหรับตั้งค่า configuration ทั้งใน root workspace และ packages/apps ใน monorepo

## Execute

### 1. Analyze Dependencies

ตรวจสอบ dependencies และ config files ใน project

> Goal: รู้ dependencies, config files ที่มี และ tech stack ที่ใช้

1. อ่าน `package.json` ใน root และทุก workspace
2. ตรวจสอบ config files ที่มีอยู่ (`biome.jsonc`, `tsconfig.json`, `turbo.json`, `lefthook.yml`)
3. ระบุ tech stack ที่ใช้ (Bun, TypeScript, Biome, Turborepo, Drizzle, etc.)

### 2. Check Workflows And Skills

ตรวจสอบ global workflows และ skills ที่เกี่ยวข้อง

> Goal: รู้ workflows และ skills ที่ต้องรันตาม stack

1. ทำ `/read-related-workflows` สำหรับ config-related workflows
2. ตรวจสอบ skills ที่เกี่ยวข้องกับ stack ที่ใช้
3. ระบุ workflows ที่ต้องรันตาม stack (เช่น `/follow-biome`, `/follow-turborepo`, `/follow-typescript`)

### 3. Run Required Workflows

รัน workflows ที่จำเป็นตาม stack ที่ใช้

> Goal: Config files ถูกต้องครบถ้วนสอดคล้องกับ tech stack

1. รัน `/follow-package-manifest` สำหรับ scripts ใน `package.json`
2. รัน workflows ตาม tech stack (เช่น `/follow-biome`, `/follow-turborepo`, `/follow-typescript`)
3. รัน workflows สำหรับ tools ที่มี (เช่น `/follow-lefthook`, `/follow-ast-grep`)
4. รัน `/follow-dot-vscode` สำหรับ `.vscode/` directory setup
5. รัน `/follow-dot-github` สำหรับ `.github/` directory setup
6. ตรวจสอบว่า config files ถูกต้องและสอดคล้องกัน

## Rules

### 1. Stack-Specific Configuration

ตั้งค่าตาม tech stack ที่ใช้

- ใช้ `bun` สำหรับ package manager และ runtime
- ใช้ `biome` สำหรับ linting และ formatting
- ใช้ `turborepo` สำหรับ monorepo management
- ใช้ `typescript` สำหรับ type safety
- ใช้ `lefthook` สำหรับ git hooks
- ใช้ `ast-grep` สำหรับ code search และ transformation

### 2. Minimal And Necessary

รันเฉพากที่จำเป็น

- รันเฉพาะ workflows ที่เกี่ยวข้องกับ stack ที่ใช้
- ไม่รัน workflows ที่ไม่จำเป็น
- ตรวจสอบ dependencies ก่อนรัน workflows
- รัน workflows ตามลำดับที่เหมาะสม (foundation ก่อน)

### 3. Consistency Across Workspaces

รักษาความสม่ำเสมอทั่ว monorepo

- Config files ใน root ควรเป็น base สำหรับทุก workspace
- Workspace-specific config ควร override เฉพาะที่จำเป็น
- Scripts ใน `package.json` ควรสอดคล้องกัน
- Linting rules ควรสอดคล้องกันทั่วทั้ง project

## Expected Outcome

- Configuration files ตั้งค่าถูกต้องตาม tech stack
- Workflows ที่จำเป็นถูกรันและผ่าน
- Config สอดคล้องกันทั่ว monorepo
- Scripts ใน `package.json` พร้อมใช้งาน
