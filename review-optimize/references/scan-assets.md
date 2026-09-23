---
name: scan-assets
description: Scan assets — fonts, icons, media loading strategy vs actual usage
---

# Scan Assets

## Goal

assets load เฉพาะตอนใช้ — fonts/icons/media ไม่ block boot

## Checks

1. Font imports ใน entry — ทุก family/weight load ตอน boot หรือแค่ UI font; preset fonts (whiteboard, slides, print) ควร defer
2. `font-display` — missing `swap`/`optional` → invisible text ตอน load; subset สำหรับ unicode ranges ที่ใช้จริง
3. Icon strategy — `@iconify-json/*/icons.json` ทั้ง set vs per-icon, inline SVG data-URI (UnoCSS) vs runtime fetch
4. Images — `loading="lazy"`, `decoding="async"`, ขนาด vs display size, modern formats (webp/avif)
5. Media — video/audio preload, poster, streaming vs full download
6. public/ assets — large binaries ที่ไม่ได้ใช้, missing compression
7. CSS — safelist size, generated icon CSS, duplicate resets

## Severity

- Critical: multi-MB asset block first paint (icon JSON, video auto-load)
- High: font families ที่ใช้เฉพาะ feature load ตอน boot, missing `font-display`
- Medium: image lazy-loading gaps, safelist bloat
- Low: subset/per-weight tuning
