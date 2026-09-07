# Build Packages

(merged from: follow-tool-build-packages)


## Goal

ตั้งค่า

## Scope

ใช้ `follow-tool-turborepo` สำหรับ tasks และ workflows เฉพาะที่กำหนด

## Execute

## Setup

### Configure Build Packages

### Libraries

- /follow-tool-turborepo
- /follow-tool-tsdown
- /follow-tool-vitest
- /review-architecture หรือ /review-architecture

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

- เริ่มจาก `/deep-analyze` และ `/refactor-workspace`
- เลือก runtime:
  - Node: `/review-architecture`
  - Bun: `/review-architecture`
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

- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-create-vite-plugins ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)


## Expected Outcome

Completed `follow-tool-turborepo` workflow with correct output


