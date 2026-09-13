# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `crw` (fastCRW) |
| Registry | `GitHub Releases` (`us/crw`) |
| Latest Version | `0.35.1` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `us/crw (fastCRW)` |
| License | `AGPL-3.0` |
| Repository | `https://github.com/us/crw` |
| Website | `https://fastcrw.com` |
| Documentation | `https://fastcrw.com` |
| Releases / Changelog | `https://github.com/us/crw/releases` |

## Install

```bash
curl -fsSL https://fastcrw.com/install | sh   # or: cargo install crw-cli / brew install us/crw/crw
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `crw-mcp` | `npm` | `0.35.1` (2026-09-11) | MCP server only: `npx crw-mcp` |
| `crw-cli` | `crates.io` | `0.35.1` (2026-09-11) | Rust crate for `cargo install crw-cli` |
| `ghcr.io/us/crw` | `GHCR` | `0.35.1` | Docker image: `docker run ghcr.io/us/crw` |

## Notes

- Breaking changes in latest major: `none observed`
- Version pinned in SKILL.md: `crw-mcp@0.35.1` / `crw` CLI `v0.35.1`
- `crw setup` required before first `crw search` (self-hosted: no key; hosted: `CRW_API_KEY`)
