---
name: use-bun-scripts
description: สร้าง Bun scripts สำหรับ automate งาน
---

## Goal

สร้าง Bun scripts เพื่อ automate งานและประมวลผลไฟล์

## Scope

ใช้ `use-bun-scripts` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Prepare

> Goal: Prepare

1. ทำ `/follow-runtime-bun` เพื่อ setup Bun runtime ก่อนสร้าง scripts
2. ทำตาม `/update-devin-global-skills` เมื่อสร้างหรือแก้ไข workflow

### 2. Create Script

> Goal: Create Script

1. สร้างไฟล์ `.ts` ใน `$env:TEMP` (OS temp directory) เท่านั้น ใช้ `os.tmpdir()` ใน Bun
2. ไม่ต้องสร้าง scripts ในแต่ละ workspace
3. เขียนแบบ composable: `createScript()` return state + actions
4. ใช้ Bun native APIs และ CDN imports

### 3. Execute and Cleanup

> Goal: Execute and Cleanup

1. รัน script ด้วย `bun run <script>.ts`
2. ลบ scripts จาก `$env:TEMP` หลังใช้งาน
3. ลบ scripts ที่สร้างด้วย `/update-devin-global-skills` หลังใช้งาน

## Rules

### File Location

ตำแหน่งไฟล์สำหรับเก็บ scripts

```
$env:TEMP/       # OS temp directory (ลบหลังใช้) — ใช้ os.tmpdir() ใน Bun
```

- สร้าง scripts เฉพาะใน `$env:TEMP` (OS temp directory)
- ไม่สร้าง scripts ใน project workspace หรือ sub-workspaces
- ใช้ `.ts` เท่านั้น
- ตั้งชื่อสื่อถึงการทำงาน

### CDN Imports

ใช้ imports จาก CDN สำหรับ dependencies:

```typescript
import { z } from "https://esm.sh/zod"
import { glob } from "https://esm.sh/glob"
```

- ใช้ `https://esm.sh/` สำหรับ TypeScript packages
- ใช้ `https://deno.land/` สำหรับ Deno-compatible packages
- ไม่ต้อง install dependencies ด้วย package manager

### Bun APIs

Bun native APIs ที่ใช้บ่อย

```typescript
// File operations
const content = await Bun.file(path).text()
await Bun.write(outputPath, content)

// Shell commands
await $`git status`.text()

// File patterns
for await (const file of new Bun.Glob("**/*.ts").scan()) {
  // process file
}
```

### Script Template

ตัวอย่าง script แบบ composable

```typescript
#!/usr/bin/env bun

import { z } from "https://esm.sh/zod"

interface ScriptOptions {
  pattern: string
}

function createScript(options: ScriptOptions) {
  const errors: Error[] = []
  let processed = 0

  async function run() {
    const files = new Bun.Glob(options.pattern).scan()
    for await (const file of files) {
      // Process logic
      processed++
    }
  }

  return { run, errors, processed }
}

const script = createScript({ pattern: "**/*.ts" })
await script.run()
```

### Standards

มาตรฐานการเขียน scripts

- ใช้ `bun` เท่านั้น
- ใช้ Bun native APIs
- ใช้ ESM format
- เขียนแบบ composable: `createScript()` return state + actions
- ใช้ CDN imports สำหรับ external dependencies

## Expected Outcome

- Bun scripts ที่ใช้งานได้จริง
- ไม่ต้อง install dependencies
- Scripts ใน `$env:TEMP` (OS temp directory) เท่านั้น
- Scripts ที่ใช้แล้วลบออก