# Portless Best Practices

Guidance for using `portless` so named `.localhost` URLs stay stable, never collide, and debug fast

## Recommended Patterns

### Naming And URLs

- Let the name infer from `package.json`/the directory — set it explicitly with `portless <name> <cmd>` only when the inferred name is unclear (e.g. a monorepo root)
- Use subdomains for clear roles: `api.myapp` → `https://api.myapp.localhost`, separate from the main app
- Reference URLs in scripts/env via `portless get <name>` — never hardcode `localhost:<port>`, and don't hardcode `.localhost` URLs into committed config (portless may pick a different TLD/port per machine)
- App docs/status pages should derive the host from the request (`getRequestHost`) instead of hardcoding the origin — one docs page then works for every alias

### Lifecycle

- Start a session with one `portless doctor` run — know immediately whether proxy/CA/hosts have problems before running apps
- After a crash or machine restart → always `portless prune` first to drop routes pointing at dead processes
- Use `portless service install` when you want the proxy from boot — less friction in daily dev
- When debugging a lingering stale route → check `portless list` before rerunning; don't `--force` over someone else's route

### Security And Sharing

- `--tailscale`/`--funnel`/`--ngrok` expose the dev server to the internet — use only when necessary and stop when done; never share a URL whose admin/debug routes lack auth
- Keep `portless trust` as one-time setup — don't call it in every script; on machines that can't trust the CA (CI, someone else's computer) use `--no-tls` + HTTP

## Common Pitfalls

- **Compound commands break injection**: `portless myapp sh -c "a && b"` or an env prefix (`PORT=x cmd`) means portless can't inject `--port` — if the command is complex, wrap it as a script in `package.json` and run that script
- **Frameworks that don't read `PORT`**: for Vite/Astro/Angular, portless injects `--port` automatically, but putting `--port` in your own script collides — don't duplicate it
- **`.local` vs `.localhost`**: the custom TLD `.local` conflicts with mDNS (Bonjour) — use `.test` or the default `.localhost` only; `.dev` hits HSTS preload
- **Windows**: LAN mode is not supported; `hosts sync` needs Admin (but `.localhost` already resolves in Chrome/curl — no sync needed); `portless trust` shows a dialog you must click "Yes" on in the Windows cert prompt
- **Route points at an old port**: an alias doesn't follow the process — if the app changes port, `alias --remove` and re-create it
