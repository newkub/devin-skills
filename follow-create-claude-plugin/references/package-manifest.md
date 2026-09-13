# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@anthropic-ai/claude-code` |
| Registry | `npm` |
| Latest Version | `2.1.269` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Anthropic` |
| License | `SEE LICENSE IN README.md` (proprietary) |
| Repository | `https://github.com/anthropics/claude-code` |
| Website | `https://code.claude.com` |
| Documentation | `https://code.claude.com/docs/en/plugins` |
| Releases / Changelog | `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md` |

## Install

```bash
bun add -g @anthropic-ai/claude-code   # or: npm i -g @anthropic-ai/claude-code
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| Claude plugin format | `spec` | `n/a` | `.claude-plugin/plugin.json` + `skills/`, `agents/`, `hooks/`, `commands/`, `.mcp.json`, `.lsp.json`, `monitors/`, `bin/`, `settings.json` — format is not a versioned package |

## Notes

- Breaking changes in latest major: Claude Code 2.x plugin format supports skills, agents, hooks, commands, MCP, LSP, monitors, `bin/`, and `settings.json`; scaffold via `claude plugin init <name>`, validate via `claude plugin validate`.
- Version pinned in SKILL.md: none (SKILL.md tracks the plugin format capabilities, not a CLI version)

