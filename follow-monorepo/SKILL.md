---
name: follow-monorepo
description: Implement Monorepo Architecture for large-scale projects with multiple packages or applications
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - run-test
  - follow-architecture
  - follow-turborepo
  - follow-package-manifest
  - run-verify
---

## Goal

สร้าง Monorepo Architecture สำหรับโปรเจกต์ขนาดใหญ่ที่มีหลาย packages หรือ applications

## Scope

ใช้สำหรับโปรเจกต์ขนาดใหญ่ที่มีหลาย packages หรือ applications ที่ต้องการ shared code และ coordinated development

## Execute

### 1. Analyze Requirements
> Goal: Analyze Requirements

วิเคราะห์ความต้องการ monorepo และเลือก tool ที่เหมาะสม

1. ทำ `/follow-architecture` เพื่อเลือก architecture pattern ที่เหมาะสม
2. ระบุจำนวน apps และ packages
3. ระบุ dependencies ระหว่าง packages
4. เลือก build system ตาม ecosystem และ requirements
5. ตรวจสอบ criteria สำหรับ monorepo adoption

### 2. Setup Monorepo
> Goal: Setup Monorepo

ตั้งค่า monorepo ด้วย tool ที่เลือก

1. ทำ `/follow-turborepo` หรือ `/follow-moonrepo` สำหรับ tool setup
2. แยก packages ตาม concerns
3. ตั้งค่า workspace protocol
4. ตั้งค่า dependency catalog ใน root (pnpm `catalog:`, Bun `catalog`/`resolutions`, npm `overrides`) สำหรับ shared versions
5. รัน `/run-verify` เพื่อตรวจสอบ

### 3. Configure Build System
> Goal: Configure Build System

ตั้งค่า build system สำหรับ monorepo

1. ตั้งค่า build config ตาม tool ที่เลือก
2. ระบุ task dependencies
3. ตั้งค่า outputs สำหรับ cache invalidation

### 4. Setup Shared Configuration
> Goal: Setup Shared Configuration

ตั้งค่า shared configs สำหรับทั้ง monorepo

1. Root-level TypeScript config
2. Shared linting, formatting, git hooks configs
3. Use extends ใน workspace configs
4. ทำ `/follow-package-manifest` เพื่อตั้งค่า scripts และ `/update-readme` สำหรับ documentation ทุก workspace

## Rules

### 1. Monorepo Organization

ใช้สำหรับ large-scale projects ที่มีหลาย packages หรือ applications

- `apps/` สำหรับ deployable applications
- `packages/` สำหรับ shared libraries (TypeScript/JavaScript)
- `crates/` สำหรับ Rust packages (optional)
- แยก packages/crates ตาม concerns
- ระบุ dependencies ระหว่าง packages/crates อย่างชัดเจน
- ใช้ workspace protocol (`workspace:*`) สำหรับ internal deps

### 2. Apps Structure

โครงสร้างของ applications ใน monorepo

- แต่ละ app มี `package.json` และ config ของตัวเอง
- ใช้ shared packages จาก `packages/`
- ทำตาม best practices ของ framework แต่ละตัว

### 3. Packages Structure

โครงสร้างของ shared packages ใน monorepo

- `shared/` - shared libraries (required)
  - `ui/` - shared UI components (required)
  - `utils/` - shared utility functions (required)
- `<domain>/` - domain-specific packages
- แต่ละ package มี `package.json` และ `exports` field
- หลีกเลี่ยง circular dependencies

### 4. Crates Structure

โครงสร้างของ Rust crates ใน monorepo (optional)

- `<domain>/` - domain-specific crates
- แต่ละ crate มี `Cargo.toml` และ exports
- หลีกเลี่ยง circular dependencies
- ใช้ `workspace` dependencies ใน `Cargo.toml`

### 5. Dependencies Management

จัดการ dependencies ระหว่าง packages และ crates

- ระบุ dependencies ระหว่าง packages/crates อย่างชัดเจน
- ใช้ workspace protocol สำหรับ internal dependencies
- ใช้ workspace catalog (pnpm `catalog:`, Bun `catalog`/`resolutions`, npm `overrides`) เพื่อ centralize shared dependency versions
- หลีกเลี่ยง circular dependencies
- Workspace-level lockfile
- ใช้ dependency management tools สำหรับ updates
- Pin versions สำหรับ production
- ใช้ `overrides` สำหรับ conflict resolution

### 6. Migration Guide

วิธีการ migrate จาก single repo → monorepo

- สร้าง monorepo structure ใหม่ด้วย tool ที่เลือก
- ย้าย existing code ไปยัง `apps/` หรือ `packages/`
- อัปเดต dependencies ให้ใช้ `workspace:*`
- ตั้งค่า shared configs ที่ root level
- อัปเดต CI/CD pipelines สำหรับ monorepo
- รัน `/run-verify` เพื่อตรวจสอบ

### 7. Common Pitfalls

ปัญหาที่พบบ่อยและวิธีแก้ไข

- Circular dependencies: ใช้ dependency graph เพื่อตรวจสอบ
- Slow builds: ใช้ caching และ parallel execution
- Version conflicts: ใช้ `overrides` ใน root `package.json`
- Missing exports: ตรวจสอบ `exports` field ในทุก package
- Type errors: ใช้ `composite: true` ใน root `tsconfig.json`

### 8. Testing Strategy

กลยุทธ์การทดสอบสำหรับ monorepo

- Unit tests ในแต่ละ package/crate
- Integration tests ข้าม packages
- E2E tests ใน apps
- ใช้ `/run-test` สำหรับทดสอบทั้ง monorepo
- ใช้ task pipeline สำหรับ test orchestration

## Expected Outcome

- โครงสร้าง monorepo ชัดเจนพร้อมการแยกส่วนที่เหมาะสม
- Apps และ packages จัดระเบียบตาม concerns
- Dependencies ระหว่าง packages ชัดเจน
- Build system มีประสิทธิภาพพร้อม caching
- Shared configuration ทั่วทั้ง workspaces
- Code สามารถทดสอบและบำรุงรักษาได้ง่าย
- Architecture ที่ scalable สำหรับการเติบโตของทีม
