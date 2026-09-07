# Lib Shadcn Solid API & Dependencies

## Install

shadcn-solid เป็น CLI สำหรับ copy-paste components ไม่ใช่ npm dependency สำหรับ install แบบ runtime

```bash
# Initialize project
npx shadcn-solid@latest init

# Add components
npx shadcn-solid@latest add [component]
```

หรือติดตั้ง CLI แบบ global ด้วย `mise use -g npm:shadcn-solid`

## Version

- CLI latest: `0.7.7`
- Package Registry: https://www.npmjs.com/package/shadcn-solid
- Repository: https://github.com/hngngn/shadcn-solid

## Dependencies

- Components styled ด้วย Tailwind CSS หรือ UnoCSS
- Built on Kobalte UI primitives
- `class-variance-authority` หรือ `cva` สำหรับ variants
- `clsx`, `tailwind-merge` สำหรับ `cn` helper

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `init` | Initialize configuration and dependencies | current project | `-c, --cwd <path>` |
| `add [components...]` | Add components to project | interactive | `-o, --overwrite`, `-a, --all`, `-c, --cwd` |
| `diff [component]` | Check upstream updates | all components | `-c, --cwd` |

## Source

- Official docs: https://shadcn-solid.com/docs
- CLI docs: https://shadcn-solid.com/docs/cli
- About: shadcn/ui port for SolidJS, copy-paste components built on Kobalte UI.
