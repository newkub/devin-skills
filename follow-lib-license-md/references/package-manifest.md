# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `license-md` |
| Registry | `npm` |
| Latest Version | `0.3.6` |
| Release Date | `2013-09-14` (unmaintained — package เก่ามาก) |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `angleman` |
| License | `MIT` |
| Repository | `https://github.com/angleman/license-md` |
| Website | `https://www.npmjs.com/package/license-md` |
| Documentation | `https://github.com/angleman/license-md#readme` |
| Releases / Changelog | `https://github.com/angleman/license-md/releases` |

## Install

```bash
bun add -D license-md
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| none | — | — | Skill ส่วนใหญ่เป็น version-agnostic SPDX/license guidance — ไม่พึ่ง package |

## Notes

- `license-md` เป็น tool เก่าสำหรับ generate markdown license badges จาก dependencies — ไม่มี `bin` entry, รันผ่าน `node node_modules/license-md`
- งานหลักของ skill คือ `LICENSE` file + SPDX declaration ซึ่งทำผ่าน `gh api licenses/{key}` และ manifest fields โดยตรง — ไม่จำเป็นต้องติดตั้ง package
- Version pinned in SKILL.md: version-agnostic (guide); package `license-md@0.3.6`
