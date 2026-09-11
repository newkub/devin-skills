# Lib Shadcn Solid Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs site | https://shadcn-solid.com |
| Installation | https://shadcn-solid.com/docs/installation |
| Components | https://shadcn-solid.com/docs/components |
| CLI reference | https://shadcn-solid.com/docs/cli |
| Registry | https://shadcn-solid.com/r |
| Repository | https://github.com/hngngn/shadcn-solid |

## Key Concepts

- CLI workflow: `bunx shadcn-solid@latest init` → `components.json` → `add <component>`
- Components copy เข้า project — ไม่ใช่ npm dependency (แก้ source ได้)
- ต้องมี Tailwind CSS หรือ UnoCSS + path alias `@/components`, `@/lib/utils`
- `bunx shadcn-solid@latest diff` ดู upstream updates; `add --overwrite` force update
