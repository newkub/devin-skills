# Lib Zaidian UI API & Dependencies

## Install

Zaidian ไม่ใช่ npm package แต่ใช้ shadcn CLI เพื่อ pull components จาก Zaidan registry

```bash
# Initialize shadcn/ui in project
npx shadcn@latest init

# Add a Zaidan component
npx shadcn@latest add @zaidan/button
```

หรือสำหรับ TanStack Start: `pnpm dlx shadcn@latest init -t start`

## Version

- ไม่มี npm package version; components ถูก copy จาก registry
- Registry URL: https://zaidan.carere.dev/r/{style}/{name}.json
- Repository: https://github.com/carere/zaidan

## Dependencies

- SolidJS 1.9+
- Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)
- Kobalte และ Corvu primitives
- `class-variance-authority`, `clsx`, `tailwind-merge` สำหรับ `cn` helper

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `npx shadcn@latest init` | Initialize shadcn/ui in project | current project | `--defaults`, `--base-color` |
| `npx shadcn@latest add @zaidan/<component>` | Add Zaidian component | interactive | `-y`, `--overwrite` |
| `npx shadcn@latest add <url>` | Add from custom registry URL | - | - |

## Source

- Official docs: https://zaidan.carere.dev/docs
- Installation: https://zaidan.carere.dev/docs/installation
- Components: https://zaidan.carere.dev/docs/components
- About: shadcn registry for SolidJS, copy-paste components built on Kobalte and Corvu.
