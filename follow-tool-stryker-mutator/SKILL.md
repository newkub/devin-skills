---
name: follow-tool-stryker-mutator
description: ตั้งค่าและใช้งาน Stryker Mutator สำหรับ mutation testing ใน JavaScript/TypeScript projects
---

## Goal

ตั้งค่าและใช้งาน Stryker Mutator สำหรับ mutation testing เพื่อปรับปรุงคุณภาพของ tests

## Scope

ใช้สำหรับ JavaScript, TypeScript, React, Angular, VueJS, Svelte และ NodeJS projects

## Execute

### 1. Installation

> Goal: ติดตั้ง Stryker ด้วย Bun

ติดตั้ง Stryker ด้วย Bun:

```bash
bunx stryker init
```

หรือติดตั้งด้วย Bun:

```bash
bun add -D @stryker-mutator/core
```

### 2. Configuration

> Goal: ตั้งค่า Stryker สำหรับ project

สร้าง `stryker.config.mjs` หรือใช้ initializer:

```bash
bunx stryker init
```

ตั้งค่า test runner และ mutators ใน config file:

```javascript
export default {
  testRunner: 'jest', // หรือ 'mocha', 'karma', 'vitest', 'jasmine'
  mutator: 'javascript', // หรือ 'typescript'
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'perTest',
  tempDirName: '.stryker-tmp',
}
```

### 3. Run Mutation Testing

> Goal: รัน mutation testing ด้วย Stryker

รัน Stryker เพื่อทำ mutation testing:

```bash
bunx stryker run
```

รันด้วย trace logging สำหรับ troubleshooting:

```bash
bunx stryker run --logLevel trace
```

### 4. Supported Mutators

> Goal: ระบุ mutators ที Stryker รองรับ

Stryker รองรับ mutators มากกว่า 30 ชนิด:

- Arithmetic Operator
- Array Declaration
- Assignment Expression
- Block Statement
- Boolean Literal
- Conditional Expression
- Equality Operator
- Logical Operator
- Method Expression
- Object Literal
- Optional Chaining
- Regex
- String Literal
- Unary Operator
- Update Operator

### 5. Reports

> Goal: ตรวจสอบ mutation reports

ตรวจสอบ mutation reports:

- HTML report: `reports/mutation/html/index.html`
- Dashboard: https://dashboard.stryker-mutator.io
- Clear text report: terminal output

### 6. CI Integration

> Goal: เพิ่ม Stryker ใน CI pipeline

เพิ่ม Stryker ใน CI pipeline:

```yaml
- name: Run mutation testing
  run: bunx stryker run
```

## Rules

- ใช้ StrykerJS สำหรับ JavaScript/TypeScript projects
- ใช้ Stryker.NET สำหรับ C# projects
- ใช้ Stryker4s สำหรับ Scala projects
- ตั้งค่า `coverageAnalysis: 'perTest'` สำหรับ test coverage ที่ดีกว่า
- ใช้ `--logLevel trace` เมื่อพบปัญหา
- ตรวจสอบ mutation score และ surviving mutants
- เพิ่ม tests สำหรับ surviving mutants
- ใช้ Stryker Dashboard สำหรับ tracking mutation scores ข้าม runs

## Expected Outcome

- Mutation testing ทำงานได้อัตโนมัติ
- Test coverage และ quality ดีขึ้น
- Surviving mutants ถูกระบุและแก้ไข
- Mutation score ถูก tracking ใน CI/CD
