# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@modelcontextprotocol/sdk` |
| Registry | `npm` |
| Latest Version | `1.30.0` |
| Release Date | `2026-07-27` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `modelcontextprotocol` (Anthropic / MCP steering committee) |
| License | `MIT` |
| Repository | `https://github.com/modelcontextprotocol/typescript-sdk` |
| Website | `https://modelcontextprotocol.io` |
| Documentation | `https://modelcontextprotocol.io/docs` |
| Releases / Changelog | `https://github.com/modelcontextprotocol/typescript-sdk/releases` |

## Install

```bash
bun add @modelcontextprotocol/sdk
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| MCP spec | `system` | `2026-07-28` | Protocol version — stateless core, no initialize handshake / Mcp-Session-Id; Streamable HTTP replaces HTTP+SSE |
| `agent-browser` | `npm` | `0.37.1` (2026-09-08) | `agent-browser mcp` exposes an MCP server over stdio |

## Notes

- Breaking changes in latest major: `spec 2026-07-28 removes initialize/initialized handshake and Mcp-Session-Id; Roots, Sampling, Logging deprecated`
- Version pinned in SKILL.md: `spec 2026-07-28`, SDK `1.30.0` (verified 2026-09-12) — matches latest
