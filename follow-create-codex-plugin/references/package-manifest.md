# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@openai/codex` |
| Registry | `npm` |
| Latest Version | `0.154.0` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `OpenAI` |
| License | `Apache-2.0` |
| Repository | `https://github.com/openai/codex` |
| Website | `https://openai.com/codex` |
| Documentation | `https://developers.openai.com/codex/` |
| Releases / Changelog | `https://github.com/openai/codex/releases` |

## Install

```bash
bun add -g @openai/codex   # or: npm i -g @openai/codex
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| Agent Plugins spec | `spec` | `1.0.0` | Portable plugin format — root `plugin.json` (`agent-plugins.org/schemas/1.0.0`), `mcp.json`, `skills/`, `extensions.com.openai`; `.codex-plugin/plugin.json` is compatibility fallback |

## Notes

- Breaking changes in latest major: Codex CLI is 0.x — releases may include breaking changes; plugin manifest follows the portable Agent Plugins 1.0.0 schema rather than a CLI-versioned format.
- Version pinned in SKILL.md: none (SKILL.md tracks the portable Agent Plugins format, not a CLI version)

