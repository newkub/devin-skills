# Tool Map

> Canonical map: action → preferred CLI tool → install command → related skill.
> Maintain โดย `/check-my-global-cli` (อัปเดตตาม tools ที่ติดตั้งจริง) — verified 2026-09-13

## API Testing And Docs

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| run plain-text API tests | `hurl` | `scoop install hurl` / `winget install hurl` / `bun add -D @orangeopensource/hurl` | `/deep-test-api`, `/follow-tool-hurl` |
| run API collections | `bru` | `bun add -D @usebruno/cli` | `/deep-test-api`, `/follow-tool-bruno` |
| import spec → collection | `bru import openapi` | เหมือนข้างบน | `/follow-tool-bruno` |
| serve/mock/validate OpenAPI | `scalar` | `bun add -D @scalar/cli` (Node >=24) | `/run-api-docs`, `/follow-tool-scalar` |
| generate spec from code | generator ของ framework | per framework | `/gen-openapi` |
| property-based API fuzzing | `schemathesis` | `uvx schemathesis` / `pip install schemathesis` | `/deep-test-api` |
| quick request explore | `xh` / `httpie` / `curl` | `scoop install xh` | ad-hoc |

## Search And Code Analysis

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| content search | `rg` | built-in ใน agent / `scoop install ripgrep` | `/search-files-patterns` |
| structural code search | `sg` (ast-grep) | `bun add -D @ast-grep/cli` | `/use-astgrep` |
| semantic/doc search | DeepWiki / Context7 MCP | MCP config | `/learn-web`, `/deep-research` |
| find projects | filesystem scan | — | `/search-project-in-drive-d` |

## Git And GitHub

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| GitHub ops (issue/pr/repo/run) | `gh` | `winget install GitHub.cli` | `/use-gh-cli`, `/create-github-*` |
| git worktrees | `git` | built-in | `/use-git-worktrees` |
| secrets scan | `gitleaks` | `scoop install gitleaks` | `/check-secrets` |
| commits/branches | `git` | built-in | `/git-commit`, `/list-git` |

## Build, Run, Package

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| JS runtime/PM | `bun` | installed | `/follow-lang-nodejs` |
| global tool manager | `mise` | `winget install jdx.mise` | `/download-program` |
| package manager (alt) | `aube` | bun global | `/follow-tool-aube` |
| monorepo tasks | `moon` / `turbo` | per project | `/follow-monorepo` |
| version bumps | `taze` / `changelogen` | `bun add -D` | `/follow-tool-taze`, `/follow-tool-changelogen` |

## Browser And Capture

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| browser automation | `agent-browser` | bun global | `/use-agent-browser`, `/watch-browser-*` |
| screenshot web | `agent-browser` | เหมือนข้างบน | `/capture-web` |
| E2E tests | `playwright` | `bun add -D @playwright/test` | `/deep-test-e2e`, `/follow-tool-playwright` |

## Infra And Deploy

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| Cloudflare | `wrangler` | `bun add -D wrangler` | `/use-wrangler`, `/follow-service-cloudflare` |
| docker | `docker` | system | `/follow-create-docker` |
| CI local run | `act` | `scoop install act` | `/follow-tool-act` |
| releases | `gh release` | เหมือน gh | `/run-release` |

## Docs And Knowledge

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| bookmarks | `raindrop` CLI | per setup | `/search-raindrop`, `/list-*-raindrop` |
| AI media gen | `bunx` CLIs | per tool | `/gen-media-*` |
| terminal capture | script + agent-browser | — | `/capture-terminal` |

## Usage

1. เมื่อเลือก action จาก map → เช็ค `Get-Command <tool>` หรือ `mise list` ว่าติดตั้ง
2. ถ้าไม่ติดตั้ง → install ตามคอลัมน์ Install (prefer `mise use -g` สำหรับ global)
3. ถ้าไม่มีใน map → ทำ `/check-my-global-cli` เพื่อ inventory เครื่อง แล้วเพิ่มแถวใหม่ใน map นี้
