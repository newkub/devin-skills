# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `CSS` (web platform standard — ไม่มี npm package) |
| Registry | `N/A` — specification อยู่ภายใต้ W3C/WHATWG |
| Latest Version | `Baseline 2025` (feature set ที่ Widely available) |
| Release Date | `N/A` — rolling standard |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `W3C CSS Working Group` |
| License | `W3C Document License` |
| Repository | `https://github.com/w3c/csswg-drafts` |
| Website | `https://developer.mozilla.org/en-US/docs/Web/CSS` |
| Documentation | `https://developer.mozilla.org/en-US/docs/Web/CSS` / `https://web.dev/baseline` |
| Releases / Changelog | `https://web.dev/baseline` / `https://caniuse.com` |

## Install

```bash
# CSS ไม่ต้องติดตั้ง — built-in ในทุก browser
# Optional tooling สำหรับ vendor prefixes / minification:
bun add -D postcss autoprefixer
# หรือ
bun add -D lightningcss
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `postcss` | `npm` | — | Optional — PostCSS toolchain สำหรับ transforms |
| `autoprefixer` | `npm` | — | Optional — vendor prefix fallbacks |
| `lightningcss` | `npm` | — | Optional — fast CSS transform/minify |

## Notes

- อย่าสับสนกับ npm package `css` (reworkcss/css) — นั่นคือ CSS parser สำหรับ Node.js ไม่เกี่ยวกับ skill นี้
- Feature availability วัดด้วย Baseline: `Widely available` = รองรับใน Chrome, Edge, Firefox, Safari (รวม mobile) ครบ
