---
name: follow-build-packages
description: Setup
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
  - refactor-packages
  - follow-turborepo
  - follow-tsdown
  - analyze-project
  - follow-functional-programming
---

## Goal

Setup

## Scope

Use `follow-build-packages` for the specific tasks and workflows it covers

## Execute

## Setup

### config

### Libraries

- /follow-turborepo
- /follow-tsdown
- /follow-vitest
- /follow-functional-programming หรือ /follow-functional-programming

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

- เริ่มจาก `/analyze-project` และ `/refactor-packages`
- เลือก runtime:
  - Node: `/follow-functional-programming`
  - Bun: `/follow-functional-programming`
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

## Expected Outcome

Completed `follow-build-packages` workflow with correct output
