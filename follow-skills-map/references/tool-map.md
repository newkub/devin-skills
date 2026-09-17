# Tool Map

> Canonical map: action → preferred CLI tool → install command → related skill.
> Maintain โดย `/check-my-global-cli` (อัปเดตตาม tools ที่ติดตั้งจริง — inventory เต็มอยู่ที่ `check-my-global-cli/references/global-cli-commands.md`) — verified 2026-09-13

## API Testing And Docs

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| run plain-text API tests | `hurl` | `scoop install hurl` / `winget install hurl` / `bun add -D @orangeopensource/hurl` | `/deep-test api`, `/follow-tool-hurl` |
| run API collections | `bru` | `scoop install bruno` / `bun add -D @usebruno/cli` | `/deep-test api`, `/follow-tool-bruno` |
| import spec → collection | `bru import openapi` | เหมือนข้างบน | `/follow-tool-bruno` |
| serve/mock/validate OpenAPI | `scalar` | `bun add -D @scalar/cli` (Node >=24) | `/run-api-docs`, `/follow-tool-scalar` |
| generate spec from code | generator ของ framework | per framework | `/gen-openapi` |
| property-based API fuzzing | `schemathesis` | `uvx schemathesis` / `pip install schemathesis` | `/deep-test api` |
| quick request / ad-hoc HTTP | `xh` | installed (mise cargo:xh) | `/deep-test api` |
| interactive API client | `slumber` | installed | `/deep-test api` |
| webhook testing | `stripe listen` | installed | `/check-webhook` |
| expose local server | `cloudflared tunnel` | installed | `/run-dev` |

## Search, Files And Code Analysis

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| content search | `rg` | installed (mise rg 15) | `/search-files-patterns` |
| structural code search/refactor | `sg` (ast-grep) | installed (mise ast-grep) | `/use-astgrep` |
| find files | `fd` | installed | `/search-files-patterns` |
| fuzzy pick | `fzf` / `tv` (television) | installed | interactive |
| search & replace | `sad` | installed (scoop) | bulk edits |
| count LOC | `scc` / `loc` / `rloc` | installed | `/follow-tool-loc` |
| disk usage | `dua` / `duf` | installed | `/cleanup-files-in-computer` |
| secrets scan | `gitleaks` | installed | `/check-secrets` |
| copy-paste detection | `jscpd` | installed | `/review-quality` |
| reuse existing code / dedup | `rg` + `sg` + `jscpd` | installed | `/follow-reusable` |
| semantic/doc search | DeepWiki / Context7 MCP / `ctx7` | MCP config | `/learn-from-references`, `/deep-research` |
| compare subject vs competitors | DeepWiki / Context7 MCP / `crw` | MCP config | `/compare-competitors-and-idea-features` |
| markdown lint | `rumdl` | installed | `/check-*` docs |
| find projects | filesystem scan | — | `/search-project-in-drive-d` |

## Data And Transform

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| JSON query | `jq` / `fx` | installed | `/use-scripts` |
| YAML/TOML/XML query | `yq` | installed | `/use-scripts` |
| structured pipelines | `nu` (nushell) | installed | `/use-nushell`, `/use-scripts` |
| pretty diff | `delta` / `git-split-diffs` | installed | `/review-diff` |
| .env lint | `dotenv-linter` | installed | `/check-config-drift` |
| secrets injection | `infisical` / `phase` | installed (scoop) | `/open-web-for-config-secret` |

## Git And GitHub

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| GitHub ops (issue/pr/repo/run) | `gh` | installed (mise gh 2.100) | `/use-gh-cli`, `/create-github-*` |
| git worktrees | `worktrunk` / `git worktree` | installed | `/use-git-worktrees` |
| TUI git | `lazygit` / `gitui` / `gitu` | installed | interactive |
| Linear | `linear` CLI | installed | ad-hoc (`/use-gh-cli` สำหรับ GitHub) |
| update GH Actions versions | `actions-up` | installed | `/setup-cicd` |
| AI commit message | `aicommits` | installed | `/git-commit` |
| commits/branches | `git` | built-in | `/git-commit`, `/list-git` |
| bookmarks | `raindrop` CLI | installed | `/search-raindrop` |

## Build, Run, Package

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| JS runtime/PM | `bun` | installed (mise bun 1.4) | `/follow-lang-nodejs` |
| global tool manager | `mise` | installed (held via scoop) | `/download-program` |
| package manager (alt) | `aube` / `pnpm` / `ni` | installed | `/follow-tool-aube` |
| monorepo tasks | `moon` / `task` | installed | `/follow-monorepo` |
| version bumps | `taze` / `changelogen` | installed | `/follow-tool-taze`, `/follow-tool-changelogen` |
| lint/format JS/TS | `biome` / `oxlint` / `oxfmt` | installed | `/run-lint`, `/run-format` |
| fast typecheck | `tsc` (`typescript@7` native) / `vue-tsc` | installed | `/run-typecheck` |
| watch + rerun | `watchexec` | installed | `/run-watch` |
| benchmark commands | `hyperfine` | installed | `/review-performance` |
| CI local run | `act` | installed | `/follow-tool-act` |
| git hooks | `hk` / `lefthook` | installed | `/follow-tool-hk` |
| clone template | `giget` | installed | `/create-*` |
| compile cache | `sccache` | installed | Rust builds |
| cleanup dev dirs | `clean-dev-dirs` / `npkill` / `gleanup` / `cargo-sweep` | installed | `/cleanup-files-in-computer` |
| OCI image from source | `nixpacks` | installed (scoop) | `/follow-create-docker` |

## Browser And Capture

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| browser automation | `agent-browser` | installed | `/use-agent-browser`, `/watch-browser-*` |
| screenshot web | `agent-browser` | เหมือนข้างบน | `/capture-web` |
| E2E tests | `playwright` | installed (mise npm:playwright 1.62) | `/deep-test e2e`, `/follow-tool-playwright` |
| CDP/DevTools MCP | `chrome-devtools-mcp` / `crw` | installed | `/use-agent-browser` |
| web → desktop | `pake` | installed | `/follow-create-*` |

## Media And Docs Gen

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| video/audio | `ffmpeg` | installed (mise 9.0) | `/edit-video-by-remotion`, `/convert-*` |
| video → gif | `gifify` | installed | media skills |
| download media | `yt-dlp` | installed | `/download-*` |
| images/PDF | `imagemagick` / `resvg` / `poppler` / `ghostscript` | installed (scoop) | `/convert-*` |
| diagrams | `mmdc` (mermaid-cli) | installed | `/report-architecture-diagram` |
| code highlight | `shiki` CLI | installed | docs gen |
| markdown render | `glow` | installed | preview docs |
| LaTeX → PDF | `tectonic` | installed | docs |

## Infra And Deploy

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| Cloudflare | `wrangler` | installed | `/use-wrangler`, `/follow-service-cloudflare` |
| Vercel | `vercel` | installed | deploy skills |
| Supabase | `supabase` | installed (scoop) | `/follow-service-*` |
| containers | `podman` / `docker-compose` / `druk` / `oxker` | installed | `/follow-create-docker` |
| k8s | `kubectl` / `k9s` / `helm` | installed | infra skills |
| IaC | `terraform` | installed | infra skills |
| database TUI | `rainfrog` | installed | `/review-database` |
| releases | `gh release` | เหมือน gh | `/run-release` |

## AI And Agents

| Action | Tool | Install | Skill |
|--------|------|---------|-------|
| coding agents | `amp` / `codex` / `opencode` / `stakpak` | installed | `/use-subagents` |
| skill installer | `skills` (npm) | installed | `/update-devin-global-skills` |
| library docs | `ctx7` / Context7 MCP | installed | `/learn-from-references` |
| shell history | `atuin` | installed | — |
| speech-to-text | `ostt` | installed | — |
| share terminal | `ttyd` | installed | — |

## Usage

1. เมื่อเลือก action จาก map → เช็ค `Get-Command <tool>` หรือ `mise list` ว่าติดตั้ง
2. ถ้าไม่ติดตั้ง → install ตามคอลัมน์ Install (prefer `mise use -g` สำหรับ global)
3. ถ้าไม่มีใน map → ทำ `/check-my-global-cli` เพื่อ inventory เครื่อง แล้วเพิ่มแถวใหม่ใน map นี้
