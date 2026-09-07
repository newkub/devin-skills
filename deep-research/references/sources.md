# Source Selection

## Goal

เลือก sources ตามประเภทข้อมูล

## Source Map

| ข้อมูลที่ต้องการ | Primary Source | Secondary Source |
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

- เลือกอย่างน้อย 2-3 sources เพื่อ cross-reference
- ให้ official docs เป็นแหล่งหลักเสมอ
- ระบุ version/year ของแต่ละ source
