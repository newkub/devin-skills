# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `openai` |
| Registry | `npm` |
| Latest Version | `7.15.0` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `OpenAI` |
| License | `Apache-2.0` |
| Repository | `https://github.com/openai/openai-node` |
| Website | `https://github.com/openai/openai-node#readme` |
| Documentation | `https://platform.openai.com/docs` |
| Releases / Changelog | `https://github.com/openai/openai-node/releases` |

## Install

```bash
bun add openai zod
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `zod` | `npm` | `4.6.4` | Used with `zodResponseFormat` for structured output |

## Notes

- Breaking changes in latest major: `v7 requires Node.js 22+ — verify runtime before upgrading from v6`
- Version pinned in SKILL.md: `7.15.0`
