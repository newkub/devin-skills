# Global CLI Inventory

Verified via `mise list` + `scoop list` — updated 2026-09-13 — Windows machine (PowerShell)

> Use this file to check whether a tool is already installed before writing your own how-to/script — if the tool exists, call its real command instead of reimplementing the logic

## Search & Files

| Tool | Primary Command | Use Instead/What It Does |
|------|-------------|----------------|
| `rg` (ripgrep 15.2) | `rg "pat" -g "*.ts" -C3` | grep — search content |
| `ast-grep` (0.45) | `ast-grep -p '$F($$$A)' -l ts` | structural search/refactor instead of regex |
| `fd` (10.5) | `fd -e md`, `fd --type f --exec` | find files |
| `fzf` (0.74) | `fd \| fzf --preview 'bat {}'` | fuzzy finder |
| `sad` (0.4) | `sad 'old' 'new' file` | search & replace (preview before writing) |
| `sd` | — (not installed — use `sad`) | — |
| `eza` (0.23) | `eza -la --icons --git` | ls |
| `bat` (0.26) | `bat file.md --style=numbers` | cat with highlighting |
| `broot` (1.60) | `broot` | tree navigation |
| `yazi` (26.9) | `yazi` | TUI file manager |
| `superfile` (1.6) | `spf` | TUI file manager |
| `dua` (2.44) / `duf` (0.9) | `dua i`, `duf` | disk usage |
| `dust`-like | use `dua` | — |
| `tokei`-like `scc` (4.0) | `scc`, `scc src/` | count LOC (faster than tokei) |
| `zoxide` (0.10) | `z <name>`, `zi` | smart cd |
| `chezmoi` (2.72) | `chezmoi add/apply` | dotfiles |
| `dotter` (0.13) | `dotter deploy` | dotfiles templating |
| `gitleaks` (8.30) | `gitleaks git -v` | secret scanning |
| `onefetch` (2.28) | `onefetch` | repo summary |
| `7zip` | `7z a/x` | archive |

## Data & Transform

| Tool | Primary Command | Use Instead/What It Does |
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

| Tool | Primary Command | Use Instead/What It Does |
|------|-------------|----------------|
| `xh` (0.26) | `xh GET url` | HTTP client (fast curl/httpie) |
| `wget` | `wget <url>` | download |
| `slumber` (5.3) | `slumber` | TUI API client (collections) |
| `bruno` (4.1) | `bru run <dir>` | API collections |
| `schemathesis` | `uvx schemathesis run spec` | API fuzzing (via uv) |
| `cloudflared` | `cloudflared tunnel --url` | expose local server |
| `stripe` (1.50) | `stripe listen` | webhook testing |

## Dev & Build

| Tool | Primary Command | Use Instead/What It Does |
|------|-------------|----------------|
| `mise` (2026.8) | `mise use -g <t>`, `mise run <task>` | tool version manager + tasks |
| `task` (3.53) | `task --list` | task runner |
| `watchexec` (2.7) | `watchexec -e ts -- cmd` | watch + rerun |
| `hyperfine` (1.20) | `hyperfine 'a' 'b'` | benchmark commands |
| `mbx` (1.18) | `mbx build`, `mbx doctor`, `mbx tui` | shared Cargo build cache — worktrees/CI, managed `target/`, scheduler (`mr-boxington` via mise; `cache_dir=D:\.cache\mbx`; shim `~\AppData\Local\mbx\bin`) |
| `sccache` (0.17) | `RUSTC_WRAPPER=sccache` | compile cache |
| `bacon` (3.25) | `bacon` | Rust background checker |
| `cargo-nextest` (0.9.146) | `cargo nextest run` | Rust parallel test runner |
| `cargo-llvm-cov` (0.9.1) | `cargo llvm-cov` | Rust coverage reporting |
| `cargo-sweep`/`cargo-clean-all`/`clean-dev-dirs`/`node_module-nuke`/`npkill`/`gleanup` | — | cleanup dev artifacts |
| `uv` (0.12) | `uvx <pkg>`, `uv venv` | Python pkg/runner |
| `pnpm`/`ni`/`bun` | `bun add`, `ni` | package managers |
| `nixpacks` | `nixpacks build .` | OCI image from source |
| `act` (0.2) | `act -l` | run GitHub Actions local |
| `hk` (1.58) / `lefthook` (2.1) | `hk run pre-commit` | git hooks |
| `changelogen` (0.6) | `changelogen --release` | changelog gen |
| `taze` (21.1) | `taze major` | bump deps |
| `jscpd` (5.1) | `jscpd .` | copy-paste detection |
| `giget` (3.3) | `giget gh:user/repo dir` | clone template |
| `playwright` (1.62) / `playwriter` / `agent-browser` (0.35) | `agent-browser open <url>` | browser automation |
| `terminal-shot` | `terminal-shot --output out.png --theme dark` (stdin) | terminal output → image (`agents-capture` CLI `/use-agents-capture terminal`) |
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
| `typescript` 7 (native tsc; `tsgo` folded back since 7.0 RC) | `tsc --noEmit` | fast typecheck |
| `bun` (runtime, ≥ 1.4) | `bun check` | built-in parallel typecheck — same errors as `tsc`; no global install needed |
| `vue-tsc`, `oxlint`, `oxfmt`, `biome`, `selene` | — | lint/format |
| `vsce`, `@native-sdk/cli`, `@tanstack/intent`, `dprint` | — | packaging/format |

## Git & GitHub

| Tool | Primary Command |
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

| Tool | Primary Command |
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

| Tool | Primary Command |
|------|-------------|
| `kubectl` / `k9s` / `helm` | k8s |
| `podman` / `podman-tui` / `docker-compose` | containers |
| `terraform` (1.16) | IaC |
| `rainfrog` | TUI database client |

## AI & Agents

| Tool | Primary Command |
|------|-------------|
| `amp`, `@openai/codex`, `opencode`, `stakpak/agent`, `devin`, `qoder` (`@qoder-ai/qodercli`) | coding agents |
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

`node` 22/26, `bun` 1.4, `python` 3.14, `rust` 1.98, `zig` 0.16, `go` (via scoop/other if available), `pwsh` 7.6, `nu` 0.115

## How To Add/Update The Inventory

```bash
mise list           # all tools via mise
scoop list          # scoop apps
winget list         # system packages (slow — use when needed)
```

When a newly installed tool is found → add a row to this table + add a mapping in `check-my-global-cli/references/tool-map.md` if a related skill exists
