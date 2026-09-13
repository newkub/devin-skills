# Lib Elysia CLI

Elysia ไม่มี standalone CLI ของตัวเอง — ใช้ Bun commands และ codemod package:

## Commands

```bash
bun create elysia app              # scaffold project ใหม่
bun --hot src/index.ts             # dev server พร้อม hot reload
bun run src/index.ts               # run โดยตรง (Bun รัน TS ได้)
bun build src/index.ts --target bun --outfile dist/index.js   # bundle สำหรับ production
bun build --compile src/index.ts --outfile app                # compile เป็น single binary
bunx @elysia/codemod@latest        # migrate v1 → v2.0 "DayDream" (breaking changes)
```

## Notes

- ใช้ `bun --hot` สำหรับ development — Elysia docs แนะนำ hot reload ผ่าน Bun flag
- Deploy targets และ production build ดู `subskills/deploy-elysia/SKILL.md`
