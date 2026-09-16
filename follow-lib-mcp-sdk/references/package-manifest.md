# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@modelcontextprotocol/sdk` |
| Registry | `npm` |
| Latest Version | `1.30.0` |
| Release Date | `2026-07-27` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Anthropic, PBC` |
| License | `MIT` |
| Repository | `https://github.com/modelcontextprotocol/typescript-sdk` |
| Website | `https://modelcontextprotocol.io` |
| Documentation | `https://modelcontextprotocol.io/docs` |
| Releases / Changelog | `https://github.com/modelcontextprotocol/typescript-sdk/releases` |

## Install

```bash
bun add @modelcontextprotocol/sdk zod
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `zod` | `npm` | `4.6.5` | Schema validation for tool inputs |
| `@modelcontextprotocol/inspector` | `npm` | `2.6.0` | Testing/debugging CLI (`bunx @modelcontextprotocol/inspector`) |

## Notes

- Breaking changes in latest major: `HTTP+SSE transport deprecated in favor of StreamableHTTPServerTransport (backward compat only)`
- Version pinned in SKILL.md: `1.30.0`
