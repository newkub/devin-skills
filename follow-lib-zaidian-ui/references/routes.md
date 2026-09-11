# Lib Zaidian Ui Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs site | https://zaidan.dev / https://ui.zaidan.dev |
| Registry index | `https://zaidan.dev/r/<component>.json` |
| shadcn CLI docs | https://ui.shadcn.com/docs/cli |
| components.json spec | https://ui.shadcn.com/docs/components-json |
| Better Auth UI registry | https://better-auth-ui.com |

## Key Concepts

- Zaidian = SolidJS component registry — pull ผ่าน `bunx shadcn@latest add @zaidan/<component>`
- ตั้งค่า `components.json` `registries: { "@zaidan": "https://zaidan.dev/r/{name}.json" }`
- Components เป็น SolidJS + Tailwind v4 — ต้องมี `@tailwindcss/vite` setup
- ไม่มี npm package — components copy เข้า project โดยตรง
