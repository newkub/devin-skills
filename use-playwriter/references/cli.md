# Playwriter CLI Reference

Source: https://playwriter.dev/docs/cli · https://playwriter.dev/docs/skill (verified via official docs)

## Install And Meta

| command | description | options |
|---------|-------------|---------|
| `npm i -g playwriter` | install CLI globally | use `bunx playwriter@latest` without install — always `@latest` for first session command |
| `playwriter logfile` | print relay server log path | `~/.playwriter/relay-server.log` + `cdp.jsonl` alongside |
| `playwriter skill` | print full agent instructions | run once before recorder work — never truncate output |
| `playwriter browser install` | download Chrome for Testing | required once for `--browser headless` if no Chrome |

## Sessions

| command | description | options |
|---------|-------------|---------|
| `playwriter session new` | create isolated session, outputs id | `--tab-group <word>` `--tab-group-color <color>` `--direct [url]` `--browser headless|cloud` `--remote <id>` `--proxy <region>` `--custom-proxy user:pass@host:port` `--disable-proxy-bandwidth-acceleration` |
| `playwriter session list` | list sessions + state keys | |
| `playwriter session reset <id>` | reset stale/broken session | |

| mode flag | use when |
|-----------|----------|
| (default) | extension mode — control tabs where user clicked extension icon (green) |
| `--direct` | CDP direct: `1`/auto-discover :9222, `ws(s)://` endpoint (cloud browsers), `host:port` — no recording |
| `--browser headless` | spawn headless Chrome, no extension — CI/autonomous, no recording |
| `--browser cloud` | managed cloud Chromium — stealth, CAPTCHA, proxies; auto-stops after 10min idle |
| `--remote <id>` | drive another user's browser via their Remote-control id — secret id, no recording |

## Execute

| command | description | options |
|---------|-------------|---------|
| `playwriter -s <id> -e '<code>'` | run JS in session sandbox | `--timeout <ms>` (default 10000; env `PLAYWRITER_EXEC_TIMEOUT`) |
| `playwriter -s <id> -f <file>` | run `.js` file in sandbox | mutually exclusive with `-e`; same context vars |

## Recorder (record user actions → skill generation)

| command | description | options |
|---------|-------------|---------|
| `playwriter recorder start` | record user browser actions as events + jpeg frames | `-s <id>` attach to session; auto-stops 20min; output → `~/.playwriter/recordings/<id>/frames` |
| `playwriter recorder status` | active recordings + page urls | |
| `playwriter recorder stop [id]` | stop recording | id required when multiple active |
| `playwriter recorder events [-r <id>] [n...]` | read recorded events | `events 4 7` = full detail of events 4 and 7 |

## Streaming And Remote Access

| command | description | options |
|---------|-------------|---------|
| `playwriter stream start|stop|status` | live stream tab to RTMP via ffmpeg | survives CLI exit — see docs/streaming |
| `playwriter serve --token <t>` | host relay for remote access | pair with `bunx traforo -p 19988` tunnel |
| `playwriter cloud login` | auth for cloud browsers | or env `PLAYWRITER_API_KEY` |

## Env Vars

| var | effect |
|-----|--------|
| `PLAYWRITER_EXEC_TIMEOUT` | default `-e`/`-f` timeout ms |
| `PLAYWRITER_DIRECT` | direct CDP mode for MCP/CLI — `1`, `ws(s)://`, or `host:port` |
| `PLAYWRITER_HOST` / `PLAYWRITER_TOKEN` | remote-access endpoint + auth |
| `PLAYWRITER_API_KEY` | cloud browser credentials |

## Quoting Rules

| style | use for | caveat |
|-------|---------|--------|
| `'<code>'` single quotes | one-liners | no literal `'` inside — use `"` for JS strings |
| `-f file.js` | multiline scripts | preferred for complex code |
| `$(cat <<'EOF' ... EOF)` | multiline inline | quoted `EOF` disables all expansion |

Bug reports: `gh issue create -R remorses/playwriter` (ask user first).
