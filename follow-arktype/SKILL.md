---
name: follow-arktype
description: TypeScript runtime validation ด้วย native type syntax 1:1, 20x faster than Zod
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
related: []
---

## Goal

ใช้ ArkType สำหรับ TypeScript runtime validation ด้วย type syntax โดยตรง

## Scope

ใช้สำหรับ schema validation, type checking, และ type-safe validation ทั้ง compile-time และ runtime

## Execute

### 1. Installation
> Goal: Installation

ติดตั้ง ArkType ด้วย `bun add arktype`

### 2. Learn Basics
> Goal: Learn Basics

- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน

### 3. Understand Key Concepts
> Goal: Understand Key Concepts

- อ่าน `key-concepts/overview.md` สำหรับแนวคิดหลัก
- อ่าน `key-concepts/architecture.md` สำหรับสถาปัตยกรรม
- อ่าน `key-concepts/match.md` สำหรับ pattern matching
- อ่าน `key-concepts/declare.md` สำหรับ declare API
- อ่าน `key-concepts/generics.md` สำหรับ generics

### 4. Apply Principles
> Goal: Apply Principles

- อ่าน `principles/best-practices.md` สำหรับ best practices

### 5. Advanced Guides
> Goal: Advanced Guides

- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
- อ่าน `guide/integration.md` สำหรับการ integrate กับ frameworks

### 6. Reference Documentation
> Goal: Reference Documentation

- อ่าน `references/api.md` สำหรับ API reference
- อ่าน `references/configuration.md` สำหรับ configuration options
- อ่าน `references/website.md` สำหรับ official resources

## Rules

- ใช้ `bun add arktype` สำหรับ installation
- ใช้ `bun add -D arktype` สำหรับ dev dependencies
- ใช้ backticks สำหรับ `type()`, `match()`, `declare()`, commands
- ใช้ code blocks สำหรับ schema examples
- ใช้ type inference จาก ArkType เสมอ
- หลีกเลี่ยง type assertions ที่ไม่จำเป็น
- ใช้ `type()` สำหรับ schema definitions
- ใช้ `match()` สำหรับ pattern matching
- ใช้ ArkType สำหรับ performance-critical validation
- หลีกเลี่ยง redundant validations
- ใช้ caching สำหรับ repeated validations
- ตั้งค่า TypeScript strict mode ใน `tsconfig.json`
- ตั้งค่า VSCode quickSuggestions สำหรับ strings
- ใช้ Standard Schema integration เมื่อจำเป็น

## Expected Outcome

- Schema validation ที่รวดเร็วและแม่นยำ
- Type-safe code ทั้ง compile-time และ runtime
- Code ที่ maintainable และ consistent
- Performance ที่ optimized
