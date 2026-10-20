| key | value |
|---|---|
| package | `portless` (npm CLI) |
| install | `mise use -g portless` · `npm install -g portless` |
| version | 0.15.8 (npm latest, verified 2026-10-20) |
| license | Apache-2.0 |
| engines | Node >= 24 |
| docs | https://portless.sh |
| repo | https://github.com/vercel-labs/portless |
| URL shape | `https://<name>.localhost` (or `<name>.<tld>` with `--tld`) |

| api | description | signature/example |
|---|---|---|
| name inference | `portless.json` → `package.json` → git root → directory name | override with `--name` |
| `PORT` injection | random port 4000-4999 passed via env | framework port flags auto-injected for Vite/Astro/RR/Angular |
| monorepo mode | at a workspaces root, opens every package with the script | |
| routes | active name → port table | `portless list` |
| URL lookup | script-safe URL read | `BACKEND_URL=$(portless get backend)` |
| aliases | route to services not run through portless (Docker) | `portless alias <name> <port>` |
| subdomains | dotted names create subdomains | `api.myapp` → `https://api.myapp.localhost` |
| worktrees | linked worktree gets a branch prefix | `https://<branch>.<app>.localhost` |
| custom TLD | `portless proxy start --tld test` (repeatable) | prefer `.test`; avoid `.local`/`.dev` |
| LAN mode | reachable from a phone on the same WiFi (macOS/Linux) | `portless proxy start --lan` |
| sharing | tunnel flags on the run command | `--tailscale`, `--funnel`, `--ngrok` |
| bypass | run without the proxy | `PORTLESS=0 <cmd>` |
