# Portless Best Practices

Guidance for using `portless` so named `.localhost` URLs stay stable, never collide, and debug fast

## Recommended Patterns

### Naming And URLs

- Let the name infer from `portless.json`/`package.json`/the directory; set it explicitly with `portless <name> <cmd>` only when the inferred name is unclear (e.g. a monorepo root)
- Use subdomains for clear roles: `api.myapp` → `https://api.myapp.localhost`, separate from the main app
- Reference URLs in scripts/env via `portless get <name>` — never hardcode `localhost:<port>`, and don't commit `.localhost` URLs (the TLD and port differ per machine)
- Read the host from the request in app code (`getRequestHost`) instead of hardcoding an origin, so one page serves every alias
- Keep app config in `portless.json` or the `package.json` `"portless"` key and leave the scripts clean (`"dev": "next dev"`)

### Lifecycle

- Start a session with one `portless doctor` run — know immediately whether proxy/CA/hosts have problems before running apps
- After a crash or machine restart → `portless prune` first to drop routes pointing at dead processes (it matches process identity, so a reused PID is not killed)
- Use `portless service install` when the proxy should survive reboot; pass `--state-dir` if state must live outside `~/.portless`
- When a route looks stale → check `portless list` before rerunning; use `--force` deliberately, since it terminates the current owner
- After upgrading across pre-1.0 releases, run `portless trust` again — the state-dir format can change and the old CA may stop matching

### Ports And Routing

- Leave `appPort` unset unless you have a reason; the auto-assigned 4000-4999 port is collision-checked and passed via `PORT`
- Set `appPort` only for a service that must bind a known port, and make sure nothing else on loopback holds it — portless checks `127.0.0.1` and `::1` separately, so one family can be free while the other is taken
- Prefer strict routing; reach for `--wildcard` only when an app builds hostnames at runtime (tenant subdomains) and you accept that any `*.app.localhost` resolves to that app
- Use `--tld test` when `.localhost` interacts badly with a client; avoid `.local` (mDNS) and `.dev` (HSTS preload)

### Monorepos And Worktrees

- One root `portless.json` plus discovered packages beats per-package overrides; hostnames default to `<package>.<project>.localhost`
- With Turborepo keep `"dev": "portless"` and the real command in another script, then point `"portless": { "script": "dev:app" }` at it — portless delegates through Turbo when `turbo.json`/`turbo.jsonc` is readable
- Set `"turbo": false` only when you need portless to spawn processes directly
- In a linked worktree just run `portless run` — the branch prefix keeps hostnames unique with no `--force`

### Security And Sharing

- `--tailscale`/`--funnel`/`--ngrok`/`--cloudflare` expose the dev server beyond loopback — enable for one session and stop afterwards; never share a URL whose admin/debug routes lack auth
- `--lan` binds `0.0.0.0` and `::` — treat it as exposure, not convenience, and turn it off when the phone test is done
- Keep `portless trust` as one-time setup — don't call it in every script; on machines that can't trust the CA (CI, someone else's computer) use `--no-tls` + HTTP

## Common Pitfalls

- Compound commands break injection: an `&&`/`|`/`;` chain, an env prefix (`PORT=x cmd`), a `--` separator, a trailing `#` comment, or script delegation (`npm run dev:vite`) means portless leaves the command alone — move the logic into a `package.json` script that starts with the framework
- Non-serving scripts (tsup, tsc, esbuild, `vite build`, `astro check`) are detected and run without a route; force the choice with `"proxy": false`
- Frameworks that don't read `PORT`: Vite/VitePlus/Astro/React Router/Angular/Expo/React Native/Rsbuild get `--port` (and `--host`) injected — adding `--port` to your own script duplicates the flag
- `.local` vs `.localhost`: `.local` conflicts with mDNS (Bonjour); `.dev` hits HSTS preload — use `.localhost` or `--tld test`
- Windows: LAN mode is unsupported; `hosts sync` needs Admin but `.localhost` already resolves in Chrome/curl; `trust` needs the certificate dialog confirmed
- WSL: `trust` writes to both the Linux and Windows current-user Root stores — if a Windows browser still complains, re-run `portless trust`
- Route points at an old port: an alias doesn't follow the process — if the app changes port, `alias --remove` and re-create it
- A 502 is the app, not the proxy: check the JSON body when the client doesn't accept HTML (`{"error":"bad_gateway",...}`) and the app log in `~/.portless/proxy.log`; 404 means the host is unregistered, 508 means a routing loop (usually an app proxying back to the same name)
- Multiple TLDs: only the first is used for `PORTLESS_URL`, so don't rely on the second in scripts — call `portless get <name>` for the canonical URL
- Quick tunnels (`--cloudflare`, `--ngrok`) hand out a new URL each run, do not support SSE streaming, and cap concurrent requests; read `PORTLESS_CLOUDFLARE_URL`/`PORTLESS_NGROK_URL` from the app instead of caching the URL

## Sources

- https://portless.sh/ (accessed 2026-10-24)
- https://portless.sh/configuration (accessed 2026-10-24)
- https://portless.sh/commands (accessed 2026-10-24)
