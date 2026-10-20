
# Wrangler Troubleshooting

Common problems and their fixes

## Authentication Errors

### `wrangler login` does not complete

Error: `localhost refused to connect` or `ERR_CONNECTION_REFUSED`

Cause: IPv6 disabled, VPN, WSL networking, port 8976 not open

Fix:
```bash
# Use device flow (Wrangler 4.119.0+)
wrangler login --device

# Or open the URL yourself
wrangler login --browser=false
```

### API Token does not work

Error: `Failed to fetch auth token: 400 Bad Request`

Fix:
- Check the token is still active in the dashboard
- Check permissions: Workers Scripts Edit, KV Edit, D1 Edit, Tail Read
- To switch to OAuth: `unset CLOUDFLARE_API_TOKEN && wrangler logout && wrangler login`

### Error 9106 (Bad Credentials)

```bash
wrangler logout && wrangler login
```

## Deploy Failures

### Worker Name Mismatch

Error: the name in the config does not match the dashboard

Fix: update `name` in `wrangler.jsonc` to match

### Missing Configuration File

Error: `Missing entry-point`

Fix: add `wrangler.jsonc` or `wrangler.toml` in the root with a `main` field

### Incorrect Account ID

Error: `Could not route to /client/v4/accounts/... [code: 7003]`

Fix: remove `account_id` from the config or set it correctly

### Error 10004 (Malformed Parameter)

Fix: delete and recreate the Worker, or retry

## Configuration Errors

### Invalid Route

Error: `Expected "route" to be either a string, or an object...`

Fix:
```toml
route = "https://example.com/*"
# or
[route]
pattern = "example.com/*"
zone_id = "your-zone-id"
```

### Bindings are not inherited

Bindings (`vars`, `kv_namespaces`, etc.) are not inherited between environments — re-declare them in each env

## Version Conflicts

### Node.js Version

- Requires >= 22.0.0 (Wrangler 4.87.0+)
- Use nvm/mise/Volta to manage versions

```bash
nvm install --lts
nvm use --lts
```

### Compatibility Date Warning

Warning: the requested date is newer than what workerd supports

Fix: `npm update wrangler` (never ignore the warning)

### nodejs_compat

Use the `nodejs_compat` flag instead of the deprecated `--node-compat`:

```jsonc
{
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"]
}
```

## Debug Mode

```bash
WRANGLER_LOG=debug bunx wrangler deploy
WRANGLER_LOG_PATH=./logs/ bunx wrangler deploy
WRANGLER_LOG_SANITIZE=false bunx wrangler deploy
bunx wrangler dev --log-level debug
```

## Network And Proxy Issues

### Proxy Errors

Error: `UND_ERR_SOCKET` or `TypeError: fetch failed`

Fix:
```bash
unset http_proxy
unset HTTPS_PROXY
wrangler dev
```

### IPv6/IPv4

Error: `Could not proxy request: TypeError: fetch failed`

Fix: disable IPv6 temporarily, or configure the OS to prefer IPv4

### WSL

```bash
export http_proxy=""
export https_proxy=""
```

## Permission Errors

### API Token Permissions

Required permissions:
- Account > Workers Scripts > Edit
- Account > Workers KV Storage > Edit
- Account > D1 > Edit
- Account > Workers Tail > Read
- Zone > DNS > Edit (when using routes)
- Zone > Zone > Read (when using routes)

### Multiple Accounts

Error: `More than one account available...`

Fix: set the `CLOUDFLARE_ACCOUNT_ID` env var or add `account_id` to the config

## Durable Objects Errors

### No Event Handlers

Error: `No event handlers were registered`

Fix: check `dir` and `main` in the config; use `.mjs` for ES modules

### Durable Object Overloaded

Error: `Durable Object is overloaded`

Fix:
- Horizontal scaling (multiple instances)
- Never retry when `.overloaded === true`

## Common Error Codes

| Code | Meaning | Solution |
|---|---|---|
| 10002 | Internal server error | Retry, check debug logs |
| 10004 | Malformed parameter | Delete and recreate the Worker |
| 10006 | Could not parse code | Check syntax |
| 10021 | Validation error | Check the config |
| 10027 | Worker exceeded size | Reduce the bundle size |
| 10037 | Exceeded Workers limit | Delete unused Workers |
| 7003 | Invalid account_id | Check account_id |
| 9106 | Auth failed | Check token/credentials |

## Getting Help

- Community: https://community.cloudflare.com/
- Discord: Cloudflare Developers Discord
- GitHub Issues: https://github.com/cloudflare/workers-sdk/issues
- When filing an issue, attach: `wrangler --version`, `node --version`, OS, debug logs

## Source

- [Wrangler Troubleshooting](https://developers.cloudflare.com/workers/wrangler/)
- [System Requirements](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

