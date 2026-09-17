---
title: Changelog Page Template
description: Template for docs/references/changelog.md
---

# Changelog Page Template

```md
---
title: Changelog
description: Release history
---

# Changelog

## [<version>] — <YYYY-MM-DD>

### Added
- <feature>

### Changed
- <change>

### Fixed
- <fix>
```

## Rules

- **Source of truth first**: ถ้า repo มี root `CHANGELOG.md` อยู่แล้ว — `docs/references/changelog.md` ให้ link ไปหาไฟล์นั้น (`../../CHANGELOG.md`) พร้อมสรุปสั้นๆ อย่า duplicate เนื้อหา
- Follow keepachangelog.com sections: Added / Changed / Deprecated / Removed / Fixed / Security
- Data from git tags, CHANGELOG.md, or release notes — never invented versions
- Newest first
