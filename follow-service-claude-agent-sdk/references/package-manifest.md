# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@anthropic-ai/claude-agent-sdk` |
| Registry | `npm` |
| Latest Version | `0.3.269` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Anthropic |
| License | `SEE LICENSE IN README.md` |
| Repository | `https://github.com/anthropics/claude-agent-sdk-typescript` |
| Website | `https://www.anthropic.com/` |
| Documentation | `https://docs.claude.com/en/api/agent-sdk/overview` |
| Releases / Changelog | `https://github.com/anthropics/claude-agent-sdk-typescript/releases` |

## Install

```bash
bun add @anthropic-ai/claude-agent-sdk
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `claude-code` | `npm` | `unknown` | Legacy package name — SDK was renamed to `@anthropic-ai/claude-agent-sdk` |

## Notes

- Breaking changes in latest major: still `0.x` — API surface may change between minor releases; entry point is `query()`
- Version pinned in SKILL.md: `0.3.269`
