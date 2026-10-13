# Source Selection

## Goal

Pick sources by data type

## Source Map

| Data needed | Primary Source | Secondary Source |
|---|---|---|
| Package info | NPM Registry | JSR, PyPI, crates.io, pkg.go.dev |
| Library docs | Context7 | CRW crawl official docs |
| GitHub repo | DeepWiki | GitHub MCP |
| Code examples | GitHub MCP search | Source code |
| Benchmarks | Official benchmarks | Third-party comparisons |
| Security | OSV, Snyk, GitHub Security Advisories | `search_web` |
| Community | GitHub Issues | StackOverflow, Reddit, Discord |
| Web / blog | `search_web` | `read_url_content` |
| License | Official docs | `search_web` |

## Rules

- Pick at least 2-3 sources to cross-reference
- Always treat official docs as the primary source
- Record the version/year of each source
