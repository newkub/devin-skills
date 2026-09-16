# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `remotion` |
| Registry | `npm` |
| Latest Version | `4.0.524` |
| Release Date | `2026-09-12` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Jonny Burger <jonny@remotion.dev>` |
| License | `SEE LICENSE IN LICENSE.md` |
| Repository | `https://github.com/remotion-dev/remotion` |
| Website | `https://www.remotion.dev` |
| Documentation | `https://www.remotion.dev/docs` |
| Releases / Changelog | `https://github.com/remotion-dev/remotion/releases` |

## Install

```bash
bunx create-video@latest --yes --blank my-video
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@remotion/cli` | `npm` | `4.0.524` | CLI (`remotion studio`, `remotion render`) |
| `create-video` | `npm` | `4.0.524` | Project scaffolder (`bunx create-video`) |
| `@remotion/zod-types` | `npm` | `4.0.524` | Zod-powered prop schemas (`zColor`, etc.) |
| `@remotion/media` | `npm` | `4.0.524` | `<Video>` component for large media |
| `zod` | `npm` | `4.6.5` | Prop schema validation |

## Notes

- Breaking changes in latest major: `v4 line — remotion preview deprecated (use studio), startFrom/endAt → trimBefore/trimAfter; releases ship near-daily so re-verify often`
- Version pinned in SKILL.md: `4.0.524`
