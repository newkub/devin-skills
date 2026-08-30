---
name: follow-tool-build-packages
description: ตั้งค่า build pipeline สำหรับ packages ใน monorepo ด้วย tsdown, vitest, turborepo
related:
  - follow-tool-turborepo
  - follow-tool-tsdown
  - follow-tool-vitest
  - follow-tool-vite
  - follow-create-vite-plugins
  - follow-programming-paradigm
  - analyze-project
  - refactor-workspace
---

## Goal

ตั้งค่า

## Scope

ใช้ `follow-tool-build-packages` สำหรับ tasks และ workflows เฉพาะที่กำหนด

## Execute

## Setup

### Configure Build Packages

### Libraries

- /follow-tool-turborepo
- /follow-tool-tsdown
- /follow-tool-vitest
- /follow-programming-paradigm หรือ /follow-programming-paradigm

## Project Structure

```plaintext
packages/
  my-lib/
    src/
    test/
    examples/
    package.json
```

## Core Principles

- เริ่มจาก `/analyze-project` และ `/refactor-workspace`
- เลือก runtime:
  - Node: `/follow-programming-paradigm`
  - Bun: `/follow-programming-paradigm`
- build/test/lint ต้องรันผ่าน pipeline เดียวกันใน monorepo

## Folder Rules

### `packages/*/src/`

- Do
  - แยกไฟล์ตาม single responsibility

### `packages/*/test/`

- Do
  - ทุกไฟล์ใน `utils/` ต้องมี `file.test.ts` และ `file.usage.ts`

```ts
export const add = (a: number, b: number) => a + b
```

## Import Rules

```plaintext
packages/*/src <-- packages/*/src (ผ่าน public API)
tests/examples <-- src
```

## Rules

- Follow the project conventions and global rules
- Use the allowed tools only when needed

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

Completed `follow-tool-build-packages` workflow with correct output
