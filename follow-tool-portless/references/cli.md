| command | description | options |
|---|---|---|
| `portless` | run the `"dev"` script through the proxy; at a monorepo root, start every package that has the script | `--script <name>`, `--app-port <n>`, `--force`, `--tailscale`, `--funnel`, `--ngrok`, `--cloudflare` |
| `portless run [cmd] [args...]` | infer the name, then run a command (or the configured script when no command is given) | `--name <name>`, plus the run flags above |
| `portless <name> <cmd...>` | explicit route name — no inference, no worktree prefix | `<name>.<parent>` creates a subdomain |
| `portless get <name>` | print the URL for scripts/env vars | `--no-worktree` (skip the branch prefix) |
| `portless list` | active routes, assigned ports, uptime, tunnel URLs | |
| `portless alias <name> <port>` | static route for a service portless does not manage (Docker, external) | `--force`, `--remove <name>` |
| `portless doctor` | read-only health check: Node, state dir, proxy, routes, CA trust, hosts, LAN prerequisites | |
| `portless trust` | add the portless CA to the OS trust store | required once for HTTPS |
| `portless prune` | kill orphaned dev servers left by a crashed session and drop their stale routes | `--force` (SIGKILL instead of SIGTERM) |
| `portless clean` | stop proxy, remove portless CA + allowlisted state + `/etc/hosts` block + installed service | custom `--cert`/`--key` files are kept |
| `portless proxy start` | start the proxy daemon | see proxy flags below |
| `portless proxy stop` | stop the proxy | |
| `portless service install` | install the proxy as an OS startup service (launchd / systemd / Task Scheduler) | proxy flags + `--state-dir <path>` + `--wildcard` |
| `portless service status` | report installed port, HTTPS, TLDs, LAN, wildcard, state dir | |
| `portless service uninstall` | remove the startup service | |
| `portless hosts sync` | reconcile portless route hostnames with the hosts file | |
| `portless hosts clean` | remove portless entries from the hosts file | |
| `portless --help` / `--version` | usage / installed version | |
| `PORTLESS=0 <cmd>` | run the command directly, bypassing the proxy | |

## Proxy Start Flags

| flag | description |
|---|---|
| `-p, --port <number>` | proxy port (default `443`, or `80` with `--no-tls`); auto-elevates with sudo |
| `--no-tls` | plain HTTP on port 80 |
| `--https` | HTTPS on (default; accepted for compatibility) |
| `--lan` | LAN mode — mDNS `.local` names, binds `0.0.0.0` and `::` (macOS/Linux only) |
| `--ip <address>` | pin the advertised LAN IP (use with `--lan`) |
| `--tld <tld>` | replace `.localhost`; repeatable; accepts multi-segment names like `dev.example.com` |
| `--wildcard` | let unregistered subdomains fall back to the most specific registered parent route |
| `--cert <path>` / `--key <path>` | custom TLS cert/key (e.g. from mkcert) |
| `--foreground` | run in the foreground instead of daemon mode |

## Config Env Vars

| variable | description | default |
|---|---|---|
| `PORTLESS_PORT` | proxy port | `443` HTTPS / `80` HTTP |
| `PORTLESS_HTTPS` | `0` disables HTTPS (same as `--no-tls`) | on |
| `PORTLESS_LAN` | `1` always enables LAN mode | off |
| `PORTLESS_LAN_IP` | pin the LAN IP | auto-detected |
| `PORTLESS_TLD` | comma-separated TLD list, e.g. `localhost,test` | `localhost` |
| `PORTLESS_APP_PORT` | fixed child port instead of auto-assignment | random 4000–4999 |
| `PORTLESS_WILDCARD` | `1` enables wildcard subdomain fallback | off |
| `PORTLESS_SYNC_HOSTS` | `0` disables hosts auto-sync | on |
| `PORTLESS_STATE_DIR` | state directory | `~/.portless` |
| `PORTLESS_TAILSCALE` / `PORTLESS_FUNNEL` / `PORTLESS_NGROK` / `PORTLESS_CLOUDFLARE` | `1` shares every app over that transport | off |
| `PORTLESS` | `0` bypasses the proxy for this command | enabled |

Explicit flags and `PORTLESS_*` vars override the settings persisted from the previous proxy run.

## Child-Process Env Vars

| variable | meaning |
|---|---|
| `PORT` | port assigned by portless (only env var the app must honor) |
| `HOST` | bind host, set when the framework needs it |
| `PORTLESS_URL` | primary public URL (`https://<name>.<first-tld>`) |
| `PORTLESS_TAILSCALE_URL` / `PORTLESS_NGROK_URL` / `PORTLESS_CLOUDFLARE_URL` | tunnel URL, present only while that sharing flag is active |
| `NODE_EXTRA_CA_CERTS` | path to the portless CA so Node trusts it |
