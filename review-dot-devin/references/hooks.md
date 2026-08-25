# Hooks Check

ตรวจสอบ `.devin/hooks/` scripts และ `hooks.json`

## Required Files

- `.devin/hooks/run-lint.ts` — lint hook script
- `.devin/hooks/run-typecheck.ts` — typecheck hook script
- `.devin/hooks/hooks.json` — hook configuration

## Hooks.json Validation

- ต้องเป็น valid JSON
- ต้องมี `show_output: true`
- ต้องระบุ hook events และ script paths

## Script Validation

- ต้องมี shebang `#!/usr/bin/env bun`
- ต้อง parse JSON จาก stdin ด้วย `try/catch`
- ต้องมี `process.exit(0)` สำหรับ success
- ต้องมี `process.exit(1)` สำหรับ failure

## Scoring

- Critical: hooks ไม่ทำงาน หรือ `hooks.json` invalid
- High: ขาด hook scripts สำคัญ
- Medium: `show_output` ไม่เป็น `true`
- Low: ขาด shebang หรือ error handling
