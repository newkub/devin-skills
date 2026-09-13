# Validator Tools

## Install

```sh
bun add zod   # or: valibot, arktype, yup, joi, class-validator
```

## Version

- Latest: `zod@4.6.4` (verified 2026-09-13)
- Repository: https://github.com/colinhacks/zod
- Docs: https://zod.dev/

## Commands

Validation libraries เป็น runtime libraries — ไม่มี standalone CLI หลัก; ใช้ผ่าน `import` ใน code และทดสอบผ่าน test runner ของ project (`vitest`, `bun test`)

## Notes

- ใช้ `schema.parse` / `schema.safeParse` ใน code แทน CLI invocation
- zod v4 ใช้ `error` param แทน `message`/`invalid_type_error` — ดู rules ใน SKILL.md
