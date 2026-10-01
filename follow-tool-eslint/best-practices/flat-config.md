# ESLint Best Practices

แนวทางตั้งค่าและใช้งาน ESLint ด้วย flat config — plugin ordering, performance, CI integration

## Recommended Patterns

### 1. Config layering — ลำดับสำคัญ

Flat config คือ array — config ที่อยู่ท้าย override ตัวก่อนหน้า:

```typescript
// eslint.config.ts
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // 1. base configs ก่อน
  js.configs.recommended,
  ...ts.configs.recommended,
  // 2. plugin configs
  // 3. project-specific rules
  // 4. formatter compat ตัวสุดท้ายเสมอ (ปิด style rules ที่ชน prettier)
  prettier,
  // 5. ignores วางท้ายหรือเป็น object แยก
  { ignores: ['dist/', 'node_modules/', 'coverage/'] }
])
```

### 2. Scope rules ด้วย files patterns

อย่าเปิด plugin ทั้ง project ถ้าใช้เฉพาะบางไฟล์:

```typescript
{
  files: ['**/*.test.ts', '**/*.spec.ts'],
  ...vitest.configs.recommended
},
{
  files: ['**/*.vue'],
  rules: { 'vue/multi-word-component-names': 'off' }
}
```

ประโยชน์: lint เร็วขึ้น, rules ไม่ false-positive บนไฟล์ที่ไม่เกี่ยว

### 3. Lint ≠ Format

- ESLint จัดการ code quality (unused vars, bugs, patterns)
- formatter (prettier/biome/dprint) จัดการ style (spacing, quotes)
- ใส่ `eslint-config-prettier` เป็นตัวสุดท้ายเพื่อปิด style rules ที่ชน — อย่าให้ ESLint report formatting issues

### 4. Severity strategy

- `error` — bugs, security (`no-secrets/no-secrets`), correctness
- `warn` — style preferences, gradual adoption rules
- CI ใช้ `--max-warnings 0` ถ้าต้องการ gate warnings ด้วย — ไม่งั้น warn จะกลายเป็น noise ที่ไม่มีใครแก้

## Do / Don't

| Do | Don't |
|---|---|
| ใช้ `eslint.config.ts` flat config เดียวที่ root | ผสม `.eslintrc` + flat config ใน repo เดียวกัน |
| ใช้ `ignores` ใน flat config | สร้าง `.eslintignore` (ESLint 10 ไม่อ่านแล้ว) |
| ใช้ `typescript-eslint` package เดียว | ติดตั้ง `@typescript-eslint/parser` + `plugin` แยกแบบเก่า |
| ใช้ `--cache` กับ codebase ใหญ่ | lint ทั้ง repo ทุกครั้งโดยไม่มี cache |
| fix ใน local/pre-commit เท่านั้น | รัน `eslint --fix` ใน CI (ควร check-only) |
| ใช้ `eslint --inspect-config` debug config resolution | เดาว่า rules ไหน apply กับไฟล์นั้น |

## Common Pitfalls

- Plugin version mismatch: `typescript-eslint` major version ต้องรองรับ ESLint version — ตรวจ peer deps ก่อน upgrade; plugin เก่าอาจ error `context.getSource is not a function` บน flat API ใหม่
- Config lookup ผิด path: ESLint 10 lookup config จาก directory ของ linted file ขึ้นไป — monorepo ที่รันจาก subdir อาจไม่เจอ root config ให้ระบุ `--config <path>` ชัดเจน
- `files` glob ผิด scope: `'*.ts'` match เฉพาะ root — ต้อง `'**/*.ts'` สำหรับทุก directory
- ignores ใน object เดียวกับ rules: `{ files, ignores, rules }` จะ scope ignores กับ config นั้น — global ignores ต้องเป็น object ที่มีแต่ `ignores` หรือใช้ `globalIgnores()`
- Duplicate plugin registration: register plugin เดียวกันหลาย config objects ด้วย key เดียวกัน → error — register ครั้งเดียวใน object เดียวหรือ base config
- Prettier ไม่อยู่ท้ายสุด: rules ของตัวเองเขียนทับ prettier overrides → style rules กลับมา conflict

## Performance Notes

- ใช้ `--cache` (`.eslintcache`) ใน local dev และ CI — lint เฉพาะไฟล์ที่เปลี่ยน; commit `.eslintcache` ใน `.gitignore` แล้ว cache ผ่าน CI cache action
- โปรเจกต์ใหญ่พิจารณา `eslint-plugin-oxlint` — delegate rules ที่ oxlint รองรับไป Rust-based linter (เร็วกว่ามาก) แล้วปิด rule ซ้ำใน ESLint
- type-aware rules (`typescript-eslint` `recommendedTypeChecked`) ช้าเพราะต้อง build type info — scope เฉพาะ `files: ['**/*.ts']` และใช้ `projectService` แทน `project` list ยาวๆ
- `import/no-cycle`, `import/no-unresolved` มี resolver overhead — ใน CI เท่านั้น หรือปรับ `import/resolver` cache

## CI Notes

```bash
eslint . --max-warnings 0 --format json --output-file eslint-report.json
```

- รัน check mode เท่านั้น — ไม่มี `--fix` ใน CI
- `--max-warnings 0` สำหรับ zero-warning policy (optional แต่แนะนำ)
- cache `node_modules` + `.eslintcache` ระหว่าง runs
- ใน monorepo: lint เฉพาะ changed files (`--affected` ผ่าน moon/nx หรือ hk staged files) แทน lint ทั้ง repo ทุก PR
