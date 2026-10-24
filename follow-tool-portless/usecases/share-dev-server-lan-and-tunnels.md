# Use Case — Share A Dev Server With A Phone Or The Internet

Exposing a portless route beyond loopback for a short, deliberate window

## Pick the right exposure

| No. | Need | Flag | Reachable from | Prereq |
|---|---|---|---|---|
| 1 | phone/tablet on the same WiFi | `--lan` | LAN devices | macOS/Linux only |
| 2 | private tailnet | `--tailscale` | tailnet members | Tailscale installed |
| 3 | tailnet, public internet | `--funnel` | anyone with the URL | Tailscale Funnel enabled |
| 4 | quick public URL | `--ngrok` | anyone with the URL | ngrok authed |
| 5 | quick public URL | `--cloudflare` | anyone with the URL | `cloudflared` installed |

Flags go on the run command:

```bash
portless web pnpm dev --lan
portless web pnpm dev --tailscale
portless web pnpm dev --cloudflare
```

## LAN: phone on the same WiFi

1. `portless proxy start --lan` — binds `0.0.0.0` and `::` and serves `.local` mDNS names so `<name>.local` resolves from the phone.
2. Read the URL from the proxy output, or `portless list`.
3. If the app rejects the host header, allow it explicitly:
   - Next.js → `allowedDevOrigins`
   - Vite / React Router / SvelteKit / Astro → handled through `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`
   - Expo → `NSAllowsLocalNetworking`
4. Stop LAN mode when the test is done — `portless proxy stop`, then restart without `--lan`.

Windows does not support LAN mode.

## Tunnels: public URL

1. Start with one tunnel flag; portless exposes the route and prints the public URL.
2. Read the URL from the child env rather than scraping output: `PORTLESS_TAILSCALE_URL`, `PORTLESS_NGROK_URL`, `PORTLESS_CLOUDFLARE_URL`.
3. Hand the URL out, then stop the process to close the tunnel.

Quick tunnels (`--ngrok`, `--cloudflare`) issue a new URL per run, do not support SSE streaming, and cap concurrent requests. For a stable public hostname use a named ngrok domain, Tailscale, or a Cloudflare named tunnel.

## Safety checks before sharing

- Put auth on admin, debug, and metrics routes first — a shared URL is public to everyone who has it.
- Confirm what actually leaves the machine: `portless list` shows the tunnel URL next to each route.
- Prefer the narrowest option: `--lan` over a tunnel, `--tailscale` over `--funnel`.
- Stop the exposure when the test ends; do not leave a tunnel running overnight.

## Verify

| No. | Check | Command | Expect |
|---|---|---|---|
| 1 | route is live | `portless list` | tunnel URL shown for the app |
| 2 | public reachability | `curl -I <tunnel-url>` from another network | 200/30x, not 502 |
| 3 | host accepted | load the URL in the phone browser | app renders, no host-header error |
| 4 | exposure removed | stop the process, `portless list` | tunnel URL gone |

Source: https://portless.sh/ (accessed 2026-10-24)
