# Lib License Md API & Dependencies

## Install

```sh
bun add -D license-md
```

## Version

- Latest: `0.3.6` (verified 2026-09-13) — package unmaintained (last publish 2013); skill นี้ส่วนใหญ่เป็น version-agnostic SPDX guidance
- [Package Registry](https://www.npmjs.com/package/license-md)
- [Repository](https://github.com/angleman/license-md)

## Dependencies

- `license-md` deps: `npm-license`, `sort-component` — ใช้ scan license ของ dependencies

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `node node_modules/license-md` | Scan deps → append license badge markdown ลง README | stdout | pipe ผ่าน `sed`/`>>` |
| License declaration | `license` field ใน package.json / pyproject.toml / Cargo.toml | - | SPDX expression |
| `gh api licenses/{key} --jq .body` | ดึง license text ที่ถูกต้องจาก GitHub Licenses API | - | เช่น `mit`, `apache-2.0` |

## Source

- Package registry: https://www.npmjs.com/package/license-md
- Description: Generate markdown npm package license badges; skill ครอบคลุม LICENSE file + SPDX declaration โดยรวม
