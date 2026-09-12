# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `degit` |
| Registry | `npm` |
| Latest Version | `3.10.0` |
| Release Date | `2026-09-06` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Rich Harris` |
| License | `MIT` |
| Repository | `<https://github.com/Rich-Harris/degit>` |
| Website | `<https://github.com/Rich-Harris/degit#readme>` |
| Documentation | `<https://github.com/Rich-Harris/degit#readme>` |
| Releases / Changelog | `<https://github.com/Rich-Harris/degit/blob/master/CHANGELOG.md>` |

## Install

```bash
bunx degit <user>/<repo>/<subdir> <target-dir>   # tar snapshot, no git history
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `newkub/template-starter` | `GitHub` | `n/a` | Template source repo — not a registry package; cloned via degit subdir path `templates/<name>` |

## Notes

- Breaking changes in latest major: `v3 requires Node.js >= 20; --mode=git deprecated (degit is always a tar snapshot — use git clone for history)`
- Version pinned in SKILL.md: `3.10.0`
