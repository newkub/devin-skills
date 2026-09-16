# Global CLI Inventory

Verified จาก `mise list` + `scoop list` — อัปเดต 2026-09-13 — เครื่อง Windows (PowerShell)

> ใช้ไฟล์นี้เช็คว่า tool ติดตั้งแล้วก่อนเขียน how-to/script เอง — ถ้า tool มีอยู่ให้เรียก command จริง ไม่เขียน logic ซ้ำ

## Search & Files

| Tool | Command หลัก | ใช้แทน/ทำอะไร |
|------|-------------|----------------|
| `rg` (ripgrep 15.2) | `rg "pat" -g "*.ts" -C3` | grep — search content |
| `ast-grep` (0.45) | `ast-grep -p '$F($$$A)' -l ts` | structural search/refactor แทน regex |
| `fd` (10.5) | `fd -e md`, `fd --type f --exec` | find ไฟล์ |
| `fzf` (0.74) | `fd \| fzf --preview 'bat {}'` | fuzzy finder |
| `sad` (0.4) | `sad 'old' 'new' file` | search & replace (preview ก่อนเขียน) |
| `sd` | — (ไม่ได้ติดตั้ง — ใช้ `sad`) | — |
| `eza` (0.23) | `eza -la --icons --git` | ls |
| `bat` (0.26) | `bat file.md --style=numbers` | cat พร้อม highlight |
| `broot` (1.60) | `broot` | tree navigation |
| `yazi` (26.9) | `yazi` | TUI file manager |
| `superfile` (1.6) | `spf` | TUI file manager |
| `dua` (2.44) / `duf` (0.9) | `dua i`, `duf` | disk usage |
| `dust`-like | ใช้ `dua` | — |
| `tokei`-like `scc` (4.0) | `scc`, `scc src/` | count LOC (เร็วกว่า tokei) |
| `zoxide` (0.10) | `z <name>`, `zi` | cd อัจฉริยะ |
| `chezmoi` (2.72) | `chezmoi add/apply` | dotfiles |
| `dotter` (0.13) | `dotter deploy` | dotfiles templating |
| `gitleaks` (8.30) | `gitleaks git -v` | secret scanning |
| `onefetch` (2.28) | `onefetch` | repo summary |
| `7zip` | `7z a/x` | archive |

## Data & Transform

| Tool | Command หลัก | ใช้แทน/ทำอะไร |
|------|-------------|----------------|
| `jq` (1.8) | `jq '.a.b'` | JSON query/transform |
| `yq` (4.53) | `yq '.a.b' file.yaml` | YAML/TOML/XML query |
| `fx` (39.2) | `fx data.json` | interactive JSON viewer |
| `nu` (nushell 0.115) | `open file.csv \| where x > 1` | structured pipelines |
| `delta` (0.19) | `git diff \| delta` | pretty diffs |
| `git-split-diffs` (2.3) | pipe `git diff` | split diff view |
| `dotenv-linter` (4.0) | `dotenv-linter` | lint .env |
| `rumdl` (0.2) | `rumdl check` | markdownlint (fast) |
| `infisical` (0.43) / `phase` (2.3) | `infisical run -- cmd` | secrets injection |

## HTTP & API

| Tool | Command หลัก | ใช้แทน/ทำอะไร |
|------|-------------|----------------|
| `xh` (0.26) | `xh GET url` | HTTP client (curl/httpie แบบเร็ว) |
| `wget` | `wget <url>` | download |
| `slumber` (5.3) | `slumber` | TUI API client (collections) |
| `bruno` (4.1) | `bru run <dir>` | API collections |
| `schemathesis` | `uvx schemathesis run spec` | API fuzzing (via uv) |
| `cloudflared` | `cloudflared tunnel --url` | expose local server |
| `stripe` (1.50) | `stripe listen` | webhook testing |

## Dev & Build

| Tool | Command หลัก | ใช้แทน/ทำอะไร |
|------|-------------|----------------|
| `mise` (2026.8) | `mise use -g <t>`, `mise run <task>` | tool version manager + tasks |
| `task` (3.53) | `task --list` | task runner |
| `watchexec` (2.7) | `watchexec -e ts -- cmd` | watch + rerun |
| `hyperfine` (1.20) | `hyperfine 'a' 'b'` | benchmark commands |
| `sccache` (0.17) | `RUSTC_WRAPPER=sccache` | compile cache |
| `bacon` (3.25) | `bacon` | Rust background checker |
| `cargo-nextest` (0.9.143) | `cargo nextest run` | Rust parallel test runner |
| `cargo-llvm-cov` (0.9.0) | `cargo llvm-cov` | Rust coverage reporting |
| `cargo-sweep`/`cargo-clean-all`/`clean-dev-dirs`/`node_module-nuke`/`npkill`/`gleanup` | — | cleanup dev artifacts |
| `uv` (0.12) | `uvx <pkg>`, `uv venv` | Python pkg/runner |
| `pnpm`/`ni`/`bun` | `bun add`, `ni` | package managers |
| `nixpacks` | `nixpacks build .` | OCI image จาก source |
| `act` (0.2) | `act -l` | run GitHub Actions local |
| `hk` (1.58) / `lefthook` (2.1) | `hk run pre-commit` | git hooks |
| `changelogen` (0.6) | `changelogen --release` | changelog gen |
| `taze` (21.1) | `taze major` | bump deps |
| `jscpd` (5.1) | `jscpd .` | copy-paste detection |
| `giget` (3.3) | `giget gh:user/repo dir` | clone template |
| `playwright` (1.62) / `playwriter` / `agent-browser` (0.35) | `agent-browser open <url>` | browser automation |
| `chrome-devtools-mcp` / `crw` / `crw-mcp` | MCP servers | web/CDP access |
| `druk` (1.22) | `druk` | docker TUI |
| `oxker` (0.13) | `oxker` | docker TUI |
| `usage` (6.7) | `usage generate` | CLI spec/completions |
| `viteplus` / `tauri` / `wasm-pack` | — | build tools |
| `vercel` / `wrangler` / `supabase` | — | deploy targets |
| `@scalar/cli` | `scalar document convert` | OpenAPI ops |
| `@mermaid-js/mermaid-cli` | `mmdc -i in.mmd -o out.svg` | diagrams |
| `@shikijs/cli` | `shiki` | code highlighting |
| `foam-cli` | `foam` | knowledge base |
| `@typescript/native-preview` (tsgo) / `typescript` 7 | `tsgo --noEmit` | fast typecheck |
| `vue-tsc`, `oxlint`, `oxfmt`, `biome`, `selene` | — | lint/format |
| `vsce`, `@native-sdk/cli`, `@tanstack/intent`, `dprint` | — | packaging/format |

## Git & GitHub

| Tool | Command หลัก |
|------|-------------|
| `git` (2.55) / `git-lfs` | — |
| `gh` (2.100) | `gh pr create`, `gh repo clone`, `gh run watch` |
| `lazygit` / `gitui` / `gitu` | TUI git |
| `git-graph` / `git-x` | git extras |
| `aicommits` | AI commit msgs |
| `actions-up` | update GH Actions |
| `@schpet/linear-cli` | Linear CLI |
| `raindrop-cli` | Raindrop bookmarks |
| `worktrunk` | git worktree manager |

## System & Monitor

| Tool | Command หลัก |
|------|-------------|
| `bottom` (0.14) | `btm` — system monitor |
| `procs` (0.14) | `procs node` — ps |
| `fastfetch` / `neofetch` / `cpufetch` | system info |
| `ttyd` (1.7) | share terminal over web |
| `ostt` | speech-to-text CLI |
| `starship` | prompt |
| `edit` (2.0) / `micro` / `helix` | editors |
| `glow` (3.0) | render markdown |
| `imagemagick` / `resvg` / `poppler` / `ghostscript` | image/PDF ops |
| `ffmpeg` (9.0) | video/audio |
| `gifify` | video → gif |
| `yt-dlp` | download media |
| `tectonic` | LaTeX → PDF |
| `pake-cli` | web → desktop app |
| `powersession-rs` | terminal recorder |

## Infra & K8s

| Tool | Command หลัก |
|------|-------------|
| `kubectl` / `k9s` / `helm` | k8s |
| `podman` / `podman-tui` / `docker-compose` | containers |
| `terraform` (1.16) | IaC |
| `rainfrog` | TUI database client |

## AI & Agents

| Tool | Command หลัก |
|------|-------------|
| `amp`, `@openai/codex`, `opencode`, `stakpak/agent` | coding agents |
| `skills` (npm) | `npx skills add` — skill installer |
| `aube`, `elio`, `rmux`, `rmz`, `rush` | misc agents/terminals |
| `television` (tv) | fuzzy picker |
| `loc` / `rloc` | LOC counters |
| `ast-grep-mcp`, `rust-mcp-filesystem` | MCP servers |
| `longbridge-terminal` | trading terminal |
| `ctx7` | context7 docs CLI |
| `atuin` (18.21) | shell history |
| `helm`-like `helm` 4 | — |

## Runtimes (mise)

`node` 22/26, `bun` 1.4, `python` 3.14, `rust` 1.98, `zig` 0.16, `go` (ผ่าน scoop/other ถ้ามี), `pwsh` 7.6, `nu` 0.115

## วิธีเพิ่ม/อัปเดต inventory

```bash
mise list           # tools ทั้งหมดผ่าน mise
scoop list          # scoop apps
winget list         # system packages (ช้า — ใช้เมื่อจำเป็น)
```

เมื่อพบ tool ใหม่ที่ติดตั้ง → เพิ่มแถวในตารางนี้ + เพิ่ม mapping ใน `follow-skills-map/references/tool-map.md` ถ้ามี skill ที่เกี่ยว
