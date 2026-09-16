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
| Author / Publisher | `Anthropic / modelcontextprotocol` |
| License | `MIT` |
| Repository | `<https://github.com/modelcontextprotocol/typescript-sdk>` |
| Website | `<https://modelcontextprotocol.io>` |
| Documentation | `<https://modelcontextprotocol.io/docs>` |
| Releases / Changelog | `<https://github.com/modelcontextprotocol/typescript-sdk/releases>` |

## Install

```bash
bun add @modelcontextprotocol/sdk
# Rust (skill default stack): cargo add rmcp
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `rmcp` | `crates.io` | `3.4.0` (2026-09-10) | official Rust SDK (modelcontextprotocol/rust-sdk), Apache-2.0 — skill default stack |
| `@modelcontextprotocol/inspector` | `npm` | `unknown` | official inspector CLI for testing (`npx @modelcontextprotocol/inspector`) |
| `zod` | `npm` | `unknown` | input schema validation for TS tools |

## Notes

- Breaking changes in latest major: `SDK 1.x — @modelcontextprotocol/server is legacy, replaced by @modelcontextprotocol/sdk; Streamable HTTP replaces SSE for new remote servers`
- Version pinned in SKILL.md: `@modelcontextprotocol/sdk@1.30.0`, `rmcp@3.4.0` (verified 2026-09-16)
