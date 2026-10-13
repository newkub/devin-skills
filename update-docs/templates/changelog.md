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

- **Source of truth first**: If the repo already has a root `CHANGELOG.md` — `docs/references/changelog.md` should link to that file (`../../CHANGELOG.md`) with a brief summary; do not duplicate the content
- Follow keepachangelog.com sections: Added / Changed / Deprecated / Removed / Fixed / Security
- Data from git tags, CHANGELOG.md, or release notes — never invented versions
- Newest first
