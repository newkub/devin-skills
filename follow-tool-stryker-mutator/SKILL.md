---
name: follow-tool-stryker-mutator
description: ตั้งค่าและใช้งาน Stryker Mutator สำหรับ mutation testing ใน JavaScript/TypeScript projects
related:
  - follow-test
  - update-test-everything
  - run-test
  - follow-tool-vitest
  - follow-lang-typescript
  - follow-lang-javascript
---

## Goal

ตั้งค่าและใช้งาน Stryker Mutator สำหรับ mutation testing เพื่อปรับปรุงคุณภาพของ JavaScript/TypeScript tests

## Scope

ใช้สำหรับ JavaScript, TypeScript, React, Angular, Vue, Svelte และ Node.js projects ที่มี test runner รองรับ

## Execute

### 1. Installation

> Goal: ติดตั้ง Stryker และ test runner plugin

1. ตรวจสอบ test runner ปัจจุบัน (jest, vitest, mocha, jasmine)
2. ติดตั้ง `@stryker-mutator/core` ด้วย `bun add -D @stryker-mutator/core`
3. ติดตั้ง runner plugin เช่น `bun add -D @stryker-mutator/vitest-runner`
4. ติดตั้ง TypeScript checker ถ้าใช้ TypeScript: `bun add -D @stryker-mutator/typescript-checker`
5. ดูรายละเอียดใน [references/stryker-mutator.md](references/stryker-mutator.md)

### 2. Initialize and Configure

> Goal: สร้าง Stryker config

1. รัน `bunx stryker init` เพื่อ generate config
2. ตรวจสอบ `stryker.config.json` หรือ `stryker.config.mjs`
3. กำหนด `testRunner`, `mutator`, `reporters`, `coverageAnalysis`
4. ตั้งค่า `mutate` และ `ignorePatterns` glob
5. ดู config options ใน [references/stryker-mutator.md](references/stryker-mutator.md)

### 3. Run Mutation Testing

> Goal: รัน mutation testing และตรวจสอบผล

1. รัน `bunx stryker run`
2. ใช้ `bunx stryker run --logLevel trace` ถ้าพบปัญหา
3. ตรวจสอบรายงานใน `reports/mutation/html/index.html`
4. ระบุ surviving mutants, `NOT CAUGHT`, `timeout` mutants

### 4. Improve Tests

> Goal: เพิ่ม tests สำหรับ mutants ทีหลุดรอด

1. วิเคราะห์ surviving mutants
2. เขียน tests เพิ่มเพื่อ catch missing cases
3. ทำ `/update-test-everything` เพื่อเขียน tests ทีมีคุณภาพ
4. รัน tests ธรรมดาก่อน แล้วรัน Stryker ซ้ำ

### 5. CI Integration

> Goal: integrate Stryker กับ CI pipeline

1. เพิ่ม step รัน `bunx stryker run` ใน GitHub Actions
2. ตั้งค่า Stryker Dashboard ถ้าต้องการ track score
3. ใช้ budget หรือ threshold ถ้ามี
4. อัปโหลด reports สำหรับ review

## Rules

### 1. Test Quality

- ต้องมี tests ที่ stable ก่อนรัน Stryker
- ไม่รัน Stryker ถ้า tests flaky
- build ได้บน host platform

### 2. Configuration

- ใช้ `coverageAnalysis: 'perTest'` สำหรับประสิทธิภาพ
- ระบุ `mutate` ให้ชัดเจน
- ใช้ `ignorePatterns` สำหรับไฟล์ที่ไม่ต้องการ mutate

### 3. Mutant Handling

- เพิ่ม tests สำหรับ surviving mutants
- ใช้ `// Stryker disable` เฉพาะเมื่อจำเป็น
- track mutation score ข้าม runs

### 4. Reports

- ดู HTML report หลังรัน
- ใช้ dashboard สำหรับ trend
- ตรวจสอบ `timeout` mutants

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Stryker ติดตั้งและทำงานได้
- Mutation score ถูก track
- Surviving mutants ถูกระบุและแก้ไข
- Tests มีคุณภาพดีขึ้น
- CI รัน mutation testing อัตโนมัติ
