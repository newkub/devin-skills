# shadcn-solid CLI Reference

## Source

- CLI docs: https://shadcn-solid.com/docs/cli
- Package: https://www.npmjs.com/package/shadcn-solid (`shadcn-solid@0.7.7`, verified 2026-09-13)

## Usage

รันผ่าน `bunx`/`pnpm dlx` โดยไม่ต้องติดตั้ง global; ถ้าใช้บ่อยติดตั้ง global ด้วย `mise use -g npm:shadcn-solid`

## Commands

| Command | Description | Options |
|---------|-------------|---------|
| `bunx shadcn-solid@latest init` | Initialize `components.json`, install dependencies, add `cn` util, configure CSS variables | `-c, --cwd <path>` |
| `bunx shadcn-solid@latest add [components...]` | Copy component source เข้า `src/components/ui/` (interactive เมื่อไม่ระบุชื่อ) | `-o, --overwrite`, `-a, --all`, `-c, --cwd` |
| `bunx shadcn-solid@latest diff [component]` | ตรวจสอบ upstream updates ของ components | `-c, --cwd` |

## init Prompts

- CSS framework: `TailwindCSS` หรือ `UnoCSS`
- Base color (เช่น `Slate`)
- Global CSS file (เช่น `src/app.css`)
- CSS variables for colors: `Yes`
- `tailwind.config.cjs` location (เฉพาะ Tailwind)
- Import aliases: `@/components`, `@/lib/utils`

## Notes

- `components.json` จำเป็นเฉพาะเมื่อใช้ CLI — components เป็น copy-to-own ไม่ใช่ npm dependency
- ใช้ `diff` ก่อน `add --overwrite` เพื่อดู upstream changes ก่อน overwrite ไฟล์ที่ customize แล้ว
