---
name: follow-tool-portless
description: Use portless instead of port numbers — named .localhost URLs for dev servers
argument-hint: "[app-name-or-command]"
related:
  - check-my-global-cli
---

## Goal

Run dev servers through the `portless` HTTPS proxy so every app has a stable named URL (`https://<name>.localhost`) instead of `localhost:<port>` — for humans and agents

## Scope

Use when a task needs to run a dev server, preview, multi-service wiring, or phone/public sharing on the local machine

- Covers: zero-arg run, config precedence, monorepo/turbo, worktrees, subdomains, custom TLD, LAN, tunnels, routes/aliases, proxy/service lifecycle, diagnostics — not production deploy
- Requirements: Node.js 24+, macOS / Linux / Windows
- `portless` is pre-1.0: check the installed version (`portless --version`) and `npm view portless version` before pinning; the state-directory format can change between releases, which may require re-running `portless trust`
- Version facts and the config schema live in `references/apis.md`; live-check the docs at https://portless.sh before relying on a flag not listed here

## Execute

### 1. Verify Install

> Goal: `portless` ready to use

1. `portless --version` — if missing → `npm install -g portless` (recommended) or `mise use -g portless`
2. Project-local install (`npm install -D portless`) is supported; the tradeoff is that contributors may run different pre-1.0 versions
3. First run generates a local CA, adds it to the trust store, and binds port 443 (auto-elevates with sudo on macOS/Linux) — if the prompt was skipped, run `portless trust`
4. `portless doctor` — read-only check of Node compatibility, state-dir permissions, proxy liveness, routes, CA trust, hostname resolution, LAN prerequisites, plus suggested fixes

### 2. Run An App

> Goal: a named URL for the dev server

```bash
portless                          # run the "dev" script → https://<project>.localhost
portless --script start           # run a different package.json script
portless run next dev             # infer the name, run an explicit command
portless run --name myapp next dev  # override the inferred base name (worktree prefix still applies)
portless myapp next dev           # explicit name, no inference or prefixing
portless api.myapp pnpm start     # subdomain → https://api.myapp.localhost
```

- Name inference order: `portless.json` → `package.json` → git root → directory name
- The proxy auto-starts; the app gets a random port in 4000–4999 via `PORT` (and usually `HOST`)
- Bare `portless` at a monorepo root starts every workspace package that has the script; from a linked worktree it adds the branch prefix
- Non-server scripts (tsup, tsc, esbuild) are detected and run without a route; force the choice with `proxy: false`

### 3. Framework Port Injection

> Goal: frameworks that ignore `PORT` still bind the assigned port

- Auto-injected for Vite, VitePlus, Astro, React Router, Angular, Expo, React Native, Rsbuild — `--port` and, when needed, a matching `--host`
- Injection reaches a package script whose command starts with the framework or a known runner (`"dev": "vite"`, `"dev": "bunx vite"`), and only for server commands (`dev`, `serve`, `preview`, `start`, bare `vite`)
- Left alone on purpose: non-serving commands (`vite build`, `vp test`, `astro check`), compound commands (`&&`, `|`, `;`), a trailing `#` comment, `--`, an env prefix (`NODE_ENV=production vite`), script delegation (`npm run dev:vite`), runner flags before the script (`bun run --bun dev`), and CLIs whose flag grammar portless does not track
- Anything left alone keeps its own port — set `--port` in that script yourself; never duplicate a flag portless already injects

### 4. Configure

> Goal: stable names in single-app and monorepo projects

1. `portless.json` at the project (or repo) root: `name`, `script`, `appPort`, `proxy`, `turbo`, `apps` (per-path overrides)
2. Inline alternative: a `"portless"` key in `package.json` — a string is shorthand for `name`, an object takes the per-app fields
3. Precedence — name: `--name` > `package.json` `"portless"` > `portless.json` app entry > inference; script: `--script` > same order > `"dev"`; app port: `--app-port` > `PORTLESS_APP_PORT` > `package.json` > `portless.json` > auto
4. Monorepo: one root `portless.json`; packages discovered from `pnpm-workspace.yaml` or `"workspaces"`; hostnames default to `<package>.<project>.localhost` (project = most common npm scope, else root dir name)
5. Turborepo: `"dev": "portless"` + real command in another script + `"portless": { "script": "dev:app" }`; portless delegates to the detected package manager, and uses Turbo when `turbo.json`/`turbo.jsonc` is readable (`"turbo": false` for direct spawning)

### 5. Routes, URLs, Aliases

> Goal: wire services without hard-coded ports

```bash
portless list                          # routes, ports, uptime, tunnel URLs
portless get <name>                    # print URL; --no-worktree skips the branch prefix
portless alias my-postgres 5432        # route to a Docker/foreign service (persists)
portless alias --remove my-postgres
portless alias redis 6379 --force      # replace an existing route
```

- Use `BACKEND_URL=$(portless get backend)` in scripts and env vars instead of `localhost:<port>`
- Dotted names create subdomains; aliases survive stale-route cleanup
- `--force` on a run command takes over a route owned by another process (it terminates that owner)

### 6. Worktrees, TLD, LAN, Sharing

> Goal: parallel environments and external access

- Worktrees: `portless run` in a linked worktree → `<branch>.<app>.localhost`; the main checkout stays bare; no `--force` needed
- Custom TLD: `portless proxy start --tld test` (repeatable, also multi-segment like `dev.example.com`) → `https://myapp.test`; `PORTLESS_URL` uses the first TLD; prefer `.test`, avoid `.local` (mDNS) and `.dev` (HSTS)
- LAN: `portless proxy start --lan` (macOS/Linux only) → `.local` mDNS for phones/tablets; Next.js needs `allowedDevOrigins`; Vite/RR/SvelteKit/Astro are handled via `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`; Expo needs `NSAllowsLocalNetworking`
- Sharing: `--tailscale`, `--funnel`, `--ngrok`, `--cloudflare` (requires `cloudflared`) — expose the dev server only when needed and stop it afterward

### 7. Proxy, Service, Cleanup

> Goal: manage the proxy and remove state safely

```bash
portless proxy start [-p 443 | --no-tls] [--lan] [--ip <addr>] [--tld <tld>] [--cert <pem> --key <pem>] [--foreground]
portless proxy stop
portless service install [proxy flags incl. --state-dir <path> --wildcard]   # launchd / systemd / Task Scheduler
portless service status | uninstall
portless hosts sync | clean            # manual /etc/hosts reconciliation
portless prune [--force]               # kill orphaned dev servers from a dead session
portless clean                          # stop proxy, remove CA, service, hosts block, state files
PORTLESS=0 pnpm dev                     # bypass the proxy
```

- HTTPS is the default and adds HTTP/2 (removes the 6-connection HTTP/1.1 bottleneck); port 80 redirects to 443 when the proxy runs on 443
- Outside LAN mode the proxy binds only `127.0.0.1` and `::1`; LAN mode binds `0.0.0.0` and `::`
- `clean` removes the CA only when portless installed it, and never touches custom `--cert`/`--key` files
- WSL: `trust` and `clean` update both the Linux store and the Windows current-user Root store
- `portless prune` matches process identity before signaling, so a reused PID is never killed; `portless run` does the same cleanup on startup

### 8. Troubleshoot

> Goal: fix trust, resolution, and stale-route failures

1. `portless doctor` first — it reports each subsystem and the suggested fix
2. HTTPS warning or untrusted cert → `portless trust` (regenerate by running it after a state-format change)
3. Hostname does not resolve → `portless hosts sync`; disable auto-sync only with `PORTLESS_SYNC_HOSTS=0`
4. Route points at a dead process → `portless prune`; a stale route from a live process → `portless list`, then `--force` deliberately
5. Cannot bind 443 or write the trust store → run elevated (sudo/admin); on Windows confirm the certificate dialog
6. Proxy-generated 404/502/508 return JSON when the client does not accept HTML — check the response body for the route hint

## Rules

### 1. Prefer Named URLs

- Use `portless` instead of remembering ports whenever a server must open in a browser or be wired to another service
- Derive URLs from `portless get <name>` or the request host; never commit `localhost:<port>` or a hard-coded `.localhost` URL (the TLD and port differ per machine)

### 2. Config And Injection Discipline

- Put app-specific config in `portless.json` or the `package.json` `"portless"` key; keep `package.json` scripts clean (`"dev": "next dev"`)
- Do not add `--port`/`--host` when portless injects them; for a command portless must leave alone, set the port in the script
- In a monorepo, rely on the root config + discovered packages before adding per-package overrides

### 3. State, Elevation, And Cleanup

- Expect one elevation prompt: binding 443 and writing the CA trust store
- Use `portless service install` when the proxy should survive reboot; pass `--state-dir` if state must live outside `~/.portless`
- `clean` is destructive by design (proxy, CA, service, hosts block, state) — confirm before running it on a machine with custom certs in use

### 4. Security Of Sharing

- Treat `--tailscale`, `--funnel`, `--ngrok`, `--cloudflare`, and `--lan` as network exposure: enable for a short window, stop after, and never share a dev server with unauthenticated admin/debug routes
- Keep the proxy loopback-only unless LAN mode is genuinely required

### 5. Platform Notes

- Windows: LAN mode is unsupported; `.localhost` resolves without editing hosts for most clients, while the hosts sync needs admin; `service install` uses a Task Scheduler task running as SYSTEM
- WSL: trust is written to both stores; Windows browsers can verify certs served from WSL
- CI or a machine you cannot trust: use `--no-tls` (plain HTTP on port 80) instead of trusting a CA

## Use Cases

| Scenario | File |
|---|---|
| Monorepo, turbo, and parallel worktrees | `usecases/run-monorepo-and-worktrees.md` |
| Wire frontend, backend, and Docker services | `usecases/wire-services-with-get-and-alias.md` |
| Share with a phone or the internet safely | `usecases/share-dev-server-lan-and-tunnels.md` |

## References

- `best-practices/portless.md` — recommended patterns and pitfalls
- `references/cli.md` — commands, flags, env vars
- `references/apis.md` — package facts, config schema, state files, child-process env

## Expected Outcome

- Dev servers reachable at `https://<name>.localhost` instead of port numbers
- Multi-service wiring through `portless get` with no hard-coded ports
- Monorepos and worktrees get unique hostnames without config changes or `--force`
- Trust, hostname, and orphan-process failures resolved with `doctor` / `trust` / `hosts sync` / `prune`
