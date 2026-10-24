| key | value |
|---|---|
| package | `portless` (npm CLI, vercel-labs) |
| install | `mise use -g portless` · `npm install -g portless` · `npm install -D portless` |
| version | 0.15.10 (npm latest, verified 2026-10-24) |
| license | Apache-2.0 |
| engines | Node >= 24 |
| docs | https://portless.sh |
| repo | https://github.com/vercel-labs/portless |
| URL shape | `https://<name>.localhost` (or `https://<name>.<tld>`) |
| default port | app gets a free port from 4000-4999; proxy listens on 443 |

Live-check instead of trusting the pin: `portless --version` and `npm view portless version`. Pre-1.0 releases change state-dir formats, which can require re-running `portless trust`.

## Config Schema

`portless.json` at the project or repo root:

```json
{
  "name": "myapp",
  "script": "dev",
  "appPort": 3000,
  "apps": {
    "apps/web": { "name": "web" },
    "apps/api": { "name": "api", "script": "start" }
  }
}
```

Inline alternative in `package.json`:

```json
{ "portless": "myapp" }
{ "portless": { "name": "myapp", "appPort": 3000 } }
```

A string is shorthand for `name`; an object takes the same per-app fields.

| field | type | meaning |
|---|---|---|
| `name` | string | base hostname, overrides inference |
| `script` | string | package.json script to run instead of `dev` |
| `appPort` | number | fixed app port instead of a random 4000-4999 |
| `proxy` | boolean | `false` runs the command without a route |
| `turbo` | boolean | `false` spawns directly instead of delegating to Turbo |
| `apps` | object | per-path overrides keyed by workspace-relative path |

## Precedence

| value | order (first wins) |
|---|---|
| name | `--name` > `package.json` `"portless"` > `portless.json` app entry > inference |
| script | `--script` > `package.json` > `portless.json` > `"dev"` |
| app port | `--app-port` > `PORTLESS_APP_PORT` > `package.json` > `portless.json` > auto |
| proxy settings | explicit flags / `PORTLESS_*` > persisted proxy config > defaults |

Name inference order when nothing is configured: `portless.json` → `package.json` → git root → directory name. In a linked worktree the branch becomes a prefix (`<branch>.<app>.localhost`); a bare `--name` still gets the prefix, `portless <name> <cmd>` does not.

## State Directory

Default `~/.portless`, override with `PORTLESS_STATE_DIR`. Files: `routes.json`, `routes.lock`, `proxy.pid`, `proxy.port`, `proxy.log`, `proxy.lan`. The proxy is auto-started on first run and reused afterwards, including its port, TLS mode, TLDs, and LAN flag.

## Proxy Behavior

| aspect | behavior |
|---|---|
| binding | `127.0.0.1` + `::1`; LAN mode binds `0.0.0.0` + `::` |
| protocol | HTTPS with HTTP/2 by default; port 80 redirects to 443; `--no-tls` serves plain HTTP on 80 |
| routing | strict host match; `--wildcard` / `PORTLESS_WILDCARD=1` falls back to the most specific registered parent |
| TLDs | `--tld` repeatable and multi-segment (`test`, `dev.example.com`); `PORTLESS_URL` uses the first |
| custom cert | `--cert <pem> --key <pem>` keeps portless from installing its own CA |
| errors | 404 unknown host, 502 app unreachable, 508 routing loop |

Browsers get a branded error page; other clients get JSON when `Accept` is not `text/html`, e.g. `{"error":"bad_gateway","message":"...","hint":"..."}`. Read the body for the route hint before assuming the app crashed.

## Child-Process Env

| var | value |
|---|---|
| `PORT` | assigned port (or `appPort`) |
| `HOST` | bind address, set when the injected framework flag needs it |
| `PORTLESS_URL` | `https://<name>.<first-tld>` |
| `PORTLESS_TAILSCALE_URL` | Tailscale serve URL, when `--tailscale` |
| `PORTLESS_NGROK_URL` | public ngrok URL, when `--ngrok` |
| `PORTLESS_CLOUDFLARE_URL` | public quick-tunnel URL, when `--cloudflare` |
| `NODE_EXTRA_CA_CERTS` | portless CA, so child Node processes trust the proxy |

## Package Facts

| api | description | example |
|---|---|---|
| zero-arg run | runs the inferred script and registers a route | `portless` |
| explicit run | infer the name, run a command | `portless run next dev` |
| named run | explicit name, no inference or prefixing | `portless myapp next dev` |
| subdomain | dotted names create subdomains | `portless api.myapp pnpm start` |
| workspace fan-out | at a workspaces root, starts every package with the script | `portless` |
| URL lookup | script-safe URL read | `BACKEND_URL=$(portless get backend)` |
| aliases | route to a service not started by portless | `portless alias my-postgres 5432` |
| bypass | run without the proxy | `PORTLESS=0 pnpm dev` |

## Sources

- https://portless.sh/ (accessed 2026-10-24)
- https://portless.sh/commands (accessed 2026-10-24)
- https://portless.sh/configuration (accessed 2026-10-24)
- https://portless.sh/https (accessed 2026-10-24)
