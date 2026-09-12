# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `msw` |
| Registry | `npm` |
| Latest Version | `2.15.0` |
| Release Date | `2026-07-08` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Artem Zakharchenko` (kettanaito) / Mock Service Worker team |
| License | `MIT` |
| Repository | `https://github.com/mswjs/msw` |
| Website | `https://mswjs.io` |
| Documentation | `https://mswjs.io/docs` |
| Releases / Changelog | `https://github.com/mswjs/msw/releases` |

## Install

```bash
bun add -D msw
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@mswjs/interceptors` | `npm` | — | Internal interception layer shipped as msw dependency — not installed directly |

## Notes

- Breaking changes in latest major: `v2 rewrote the API — http/HttpResponse handlers replace rest/response; setupServer/setupWorker signatures changed`
- Version pinned in SKILL.md: `msw@2.15.0`
- Requires Node.js `>=18`
- Source: `https://registry.npmjs.org/msw`
