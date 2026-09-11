# Lib Iconify API & Dependencies

## Install

```sh
# Framework component (เลือกตาม framework)
bun add @iconify/vue          # Vue — 5.0.1
bun add @iconify/react        # React
bun add @iconify/svelte       # Svelte
bun add @iconify-icon/solid   # Solid

# Icon data on-demand (ตัวอย่าง set)
bun add -D @iconify-icons/mdi  # หรือ @iconify/json สำหรับ full collection
```

## Version

- `@iconify/vue`: `5.0.1`, `@iconify/react`: `6.x`, `@iconify/svelte`: `5.x` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/@iconify/vue)
- [Repository](https://github.com/iconify/iconify)

## Dependencies

- Framework components มี peer dep ตาม framework (`vue`, `react`, `svelte`, `solid-js`)
- Icon data โหลด on-demand จาก Iconify API หรือใช้ `@iconify/icons-<set>` / `@iconify/json` แบบ offline

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `<Icon icon="mdi:home" />` | Render icon ใน component | inline SVG | `width`, `height`, `color`, `rotate`, `flip` |
| `addIcon(name, data)` | Register icon data | - | offline mode |
| `addCollection(data)` | Register ทั้ง set | - | - |
| `getIcon(name)` | Lookup icon data | - | - |
| `iconToSVG(data)` | Build SVG เอง | - | `customisations` |

## Source

- Official docs: https://iconify.design/docs/
- Description: Universal icon framework — 200k+ icons, framework-agnostic.
