# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `devin` (Devin CLI) |
| Registry | `system` (local install — not published on npm; `@devin/cli` 404, `devin` npm is an unrelated 0.0.0 stub) |
| Latest Version | `3000.6.14` (from `devin --version`) |
| Release Date | `unknown` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Cognition` |
| License | `unknown` |
| Repository | `unknown` |
| Website | `https://devin.ai` |
| Documentation | `https://docs.devin.ai` |
| Releases / Changelog | `unknown` |

## Install

```bash
devin --version   # verify local install; install per https://docs.devin.ai
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| Devin plugin format | `spec` | `n/a` | `.devin-plugin/plugin.json` + `skills/`, `AGENTS.md`, `rules/`, `agents/`, `hooks.json`, `.mcp.json`; precedence `.devin-plugin/` > `.claude-plugin/` > root `plugin.json` |

## Notes

- Breaking changes in latest major: unknown — Devin CLI is distributed outside public registries; check `devin plugins` subcommand output for current behavior.
- Version pinned in SKILL.md: Devin CLI `3000.6.14`
