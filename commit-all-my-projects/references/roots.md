# Machine Roots

Single source of truth for where git repositories live on this machine. `/commit-all-my-projects` and `/push-all-my-projects` both read this file — never copy the root table into a skill.

## Root Table

| No. | Root | Windows | Bash | Depth | Why |
|-----|------|---------|------|-------|-----|
| 1 | Drive D | `D:\` | `/d` | 8 | Projects drive, including deep monorepos |
| 2 | Global skills | `C:\Users\<user>\.agents` | `~/.agents` | 4 | Harness root; `skills/` is a submodule |
| 3 | Home | `C:\Users\<user>` | `$HOME` | 6 | Dotfiles and loose repos |
| 4 | Local app data | `%LOCALAPPDATA%` | `$LOCALAPPDATA` | 6 | App repos and local caches |
| 5 | Roaming app data | `%APPDATA%` | `$APPDATA` | 6 | Roaming app repos |
| 6 | User local | `C:\Users\<user>\.local` | `~/.local` | 4 | Unix-style local installs |

Root 2 resolves to root 1 on this machine (`~/.agents` → `D:\dot-agents`); roots 3–5 overlap through `AppData`. Resolve every hit with `readlink -f` and dedupe by real path before planning.

## Discovery

```bash
scan_root() {
  local root="$1" depth="$2"
  find "$root" -maxdepth "$depth" \
    \( -path "$HOME/AppData" -o -name node_modules -o -name target \
       -o -name dist -o -name build -o -name .next -o -name .venv -o -name venv \
       -o -name .cache -o -name .cargo -o -name .rustup -o -name .npm -o -name .bun \
       -o -name pnpm-store -o -name Temp \) -prune -o \
    -name .git -prune -printf '%h\n' 2>/dev/null
}

scan_root /d 8
scan_root "$HOME/.agents" 4
scan_root "$HOME" 6
scan_root "$LOCALAPPDATA" 6
scan_root "$APPDATA" 6
scan_root "$HOME/.local" 4
```

Add appdata-only prunes on roots 4 and 5: `Microsoft`, `Packages`, `Google`, `Mozilla`, `Programs`, `pnpm`, `npm-cache`, `Crashpad`. They hold installed-tool data, not projects.

`-printf '%h\n'` prints the repo directory and requires GNU find, which ships with Git Bash. On a PowerShell-only host:

```powershell
Get-ChildItem -LiteralPath $root -Directory -Recurse -Depth $depth -Force -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -eq '.git' } |
  ForEach-Object { Split-Path $_.FullName -Parent }
```

## Rules

1. Prune names are performance heuristics — when a known repo is missing, rerun that root with the matching prune removed, then confirm before changing this shared list
2. Never scan `C:\Windows`, `C:\Program Files*`, `AppData\Local\Temp`, `AppData\Local\Packages`, or package-manager stores — installed tools and caches are not projects
3. Symlinks are not followed by default — resolve real paths for dedupe, and never plan the same repo twice through two roots
4. Sort hits by path depth descending so a submodule is handled before its parent repo
5. Extra roots are allowed only when the user names them; record the addition in the report
