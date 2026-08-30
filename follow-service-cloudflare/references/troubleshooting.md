# Wrangler Troubleshooting

ปัญหาที่พบบ่อยและวิธีแก้

## Authentication Errors

### `wrangler login` ไม่ผ่าน

Error: `localhost refused to connect` หรือ `ERR_CONNECTION_REFUSED`

สาเหตุ: IPv6 disabled, VPN, WSL networking, port 8976 ไม่เปิด

แก้:
```bash
# ใช้ device flow (Wrangler 4.119.0+)
wrangler login --device

# หรือเปิด URL เอง
wrangler login --browser=false
```

### API Token ไม่ทำงาน

Error: `Failed to fetch auth token: 400 Bad Request`

แก้:
- ตรวจ token ยัง active ใน dashboard
- ตรวจ permissions: Workers Scripts Edit, KV Edit, D1 Edit, Tail Read
- ถ้าเปลี่ยนเป็น OAuth: `unset CLOUDFLARE_API_TOKEN && wrangler logout && wrangler login`

### Error 9106 (Bad Credentials)

```bash
wrangler logout && wrangler login
```

## Deploy Failures

### Worker Name Mismatch

Error: name ใน config ไม่ตรงกับ dashboard

แก้: อัปเดต `name` ใน `wrangler.jsonc` ให้ตรง

### Missing Configuration File

Error: `Missing entry-point`

แก้: เพิ่ม `wrangler.jsonc` หรือ `wrangler.toml` ใน root พร้อม `main` field

### Incorrect Account ID

Error: `Could not route to /client/v4/accounts/... [code: 7003]`

แก้: ลบ `account_id` ใน config หรือใส่ให้ถูกต้อง

### Error 10004 (Malformed Parameter)

แก้: ลบและสร้าง Worker ใหม่ หรือ retry

## Configuration Errors

### Invalid Route

Error: `Expected "route" to be either a string, or an object...`

แก้:
```toml
route = "https://example.com/*"
# หรือ
[route]
pattern = "example.com/*"
zone_id = "your-zone-id"
```

### Bindings ไม่ inherit

Bindings (`vars`, `kv_namespaces`, etc.) ไม่ inherit ระหว่าง environments ต้องประกาศใหม่ในแต่ละ env

## Version Conflicts

### Node.js Version

- ต้องการ >= 22.0.0 (Wrangler 4.87.0+)
- ใช้ nvm/mise/Volta สำหรับจัดการ version

```bash
nvm install --lts
nvm use --lts
```

### Compatibility Date Warning

Warning: requested date ใหม่กว่าที่ workerd รองรับ

แก้: `npm update wrangler` (ห้าม ignore warning)

### nodejs_compat

ใช้ `nodejs_compat` flag แทน `--node-compat` ที่ deprecated:

```jsonc
{
  "compatibility_date": "2024-09-23",
  "compatibility_flags": ["nodejs_compat"]
}
```

## Debug Mode

```bash
WRANGLER_LOG=debug npx wrangler deploy
WRANGLER_LOG_PATH=./logs/ npx wrangler deploy
WRANGLER_LOG_SANITIZE=false npx wrangler deploy
npx wrangler dev --log-level debug
```

## Network And Proxy Issues

### Proxy Errors

Error: `UND_ERR_SOCKET` หรือ `TypeError: fetch failed`

แก้:
```bash
unset http_proxy
unset HTTPS_PROXY
wrangler dev
```

### IPv6/IPv4

Error: `Could not proxy request: TypeError: fetch failed`

แก้: ปิด IPv6 ชั่วคราว หรือตั้งให้ OS prefer IPv4

### WSL

```bash
export http_proxy=""
export https_proxy=""
```

## Permission Errors

### API Token Permissions

ต้องมี:
- Account > Workers Scripts > Edit
- Account > Workers KV Storage > Edit
- Account > D1 > Edit
- Account > Workers Tail > Read
- Zone > DNS > Edit (ถ้าใช้ routes)
- Zone > Zone > Read (ถ้าใช้ routes)

### Multiple Accounts

Error: `More than one account available...`

แก้: ตั้ง `CLOUDFLARE_ACCOUNT_ID` env var หรือใส่ `account_id` ใน config

## Durable Objects Errors

### No Event Handlers

Error: `No event handlers were registered`

แก้: ตรวจ `dir` และ `main` ใน config, ใช้ `.mjs` ถ้า ES modules

### Durable Object Overloaded

Error: `Durable Object is overloaded`

แก้:
- Horizontal scaling (หลาย instances)
- ห้าม retry ถ้า `.overloaded === true`

## Common Error Codes

| Code | Meaning | Solution |
|---|---|---|
| 10002 | Internal server error | Retry, check debug logs |
| 10004 | Malformed parameter | ลบและสร้าง Worker ใหม่ |
| 10006 | Could not parse code | ตรวจ syntax |
| 10021 | Validation error | ตรวจ config |
| 10027 | Worker exceeded size | ลด bundle size |
| 10037 | Exceeded Workers limit | ลบ Workers ที่ไม่ใช้ |
| 7003 | Invalid account_id | ตรวจ account_id |
| 9106 | Auth failed | ตรวจ token/credentials |

## Getting Help

- Community: https://community.cloudflare.com/
- Discord: Cloudflare Developers Discord
- GitHub Issues: https://github.com/cloudflare/workers-sdk/issues
- เวลาแจ้ง issue แนบ: `wrangler --version`, `node --version`, OS, debug logs

## Source

- [Wrangler Troubleshooting](https://developers.cloudflare.com/workers/wrangler/troubleshooting/)
- [System Requirements](https://developers.cloudflare.com/workers/wrangler/system-requirements/)
