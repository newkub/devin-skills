# Lib Iconify Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs home | https://iconify.design/docs/ |
| Icon components | https://iconify.design/docs/icon-components/ |
| Icon data format | https://iconify.design/docs/icons/icon-data.html |
| Iconify API | https://iconify.design/docs/api/ |
| Browse icons | https://icon-sets.iconify.design/ |
| UnoCSS preset | https://unocss.dev/presets/icons |
| Tailwind plugin | https://iconify.design/docs/usage/css/tailwind/ |

## Key Concepts

- Icon name format: `<prefix>:<name>` เช่น `mdi:home`, `lucide:check`
- On-demand: component fetch icon data จาก API แล้ว cache — production แนะนำ bundle offline data
- Tailwind v4: ใช้ `@iconify/tailwind4` plugin หรือ UnoCSS `presetIcons()`
