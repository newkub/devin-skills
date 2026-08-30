# Wrangler Versions And Rollback

`wrangler versions` สำหรับ separate upload จาก deploy รองรับ gradual rollouts

## Key Concepts

- Version: snapshot ของ Worker ณ เวลาหนึ่ง (code, assets, bindings, compat settings)
- Deployment: version ที่กำลัง serve traffic (100% หรือ split)
- `wrangler deploy` = upload + deploy 100% ในขั้นเดียว
- `wrangler versions` = แยก upload และ deploy เพื่อควบคุมมากขึ้น

## Commands

### `wrangler versions upload`

Upload version ใหม่โดยไม่ deploy ทันที

```bash
npx wrangler versions upload [PATH]
npx wrangler versions upload --tag "v1.2.3" --message "Feature release"
npx wrangler versions upload --dry-run
```

| Flag | Description |
|---|---|
| `--tag` | Tag สำหรับ version |
| `--message` | คำอธิบาย version |
| `--dry-run` | Validate โดยไม่ upload |
| `--minify` | Minify Worker |
| `--upload-source-maps` | Upload source maps |

### `wrangler versions deploy`

Deploy version ที่ upload แล้ว รองรับ traffic splitting

```bash
# Interactive
npx wrangler versions deploy

# Deploy 100%
npx wrangler versions deploy --version-id <ID>

# Traffic split (shorthand @)
npx wrangler versions deploy <v1>@80 <v2>@20

# By tag
npx wrangler versions deploy --version-tag v1.0.0@100

# Non-interactive
npx wrangler versions deploy <ID>@100 -y
```

| Flag | Description |
|---|---|
| `--version-id` | Version ID(s) to deploy |
| `--percentage` | Traffic percentage (0-100) |
| `--version-tag` | Tag(s) รองรับ `TAG@PERCENTAGE` |
| `--message` | Description ของ deployment |
| `--yes` / `-y` | ไม่ถาม confirm |
| `--dry-run` | ไม่ deploy จริง |

### `wrangler versions list`

```bash
npx wrangler versions list
npx wrangler versions list --json
```

### `wrangler versions view`

```bash
npx wrangler versions view <VERSION-ID>
npx wrangler versions view <VERSION-ID> --json
```

### `wrangler versions secret`

| Command | Description |
|---|---|
| `wrangler versions secret put KEY` | Add secret (สร้าง version ใหม่ ไม่ deploy) |
| `wrangler versions secret bulk [FILE]` | Bulk add secrets |
| `wrangler versions secret list` | List secrets ของ deployed versions |
| `wrangler versions secret delete KEY` | Delete secret (สร้าง version ใหม่) |

### `wrangler rollback`

Rollback ไป version ก่อนหน้า ทันที 100% traffic

```bash
# Auto rollback to latest stable
npx wrangler rollback

# Rollback to specific version
npx wrangler rollback <VERSION-ID>

# With message
npx wrangler rollback --message "Rolling back due to errors"

# Non-interactive
npx wrangler rollback <VERSION-ID> -y
```

### `wrangler deployments`

```bash
npx wrangler deployments list
npx wrangler deployments status
```

## Gradual Deployment Workflow

```bash
# 1. Upload new version
npx wrangler versions upload --tag "v2.0.0" --message "New feature"

# 2. Canary: 10% new, 90% old
npx wrangler versions deploy --version-tag v2.0.0@10 --version-tag v1.0.0@90

# 3. Monitor with tail
npx wrangler tail --status error --version-id <v2-id>

# 4. Increase to 50%
npx wrangler versions deploy --version-tag v2.0.0@50 --version-tag v1.0.0@50

# 5. Complete 100%
npx wrangler versions deploy --version-tag v2.0.0@100

# Emergency rollback
npx wrangler rollback --message "Revert breaking change"
```

## deploy vs versions deploy

| Aspect | `wrangler deploy` | `wrangler versions deploy` |
|---|---|---|
| Version creation | สร้างอัตโนมัติ | ต้อง upload ก่อน |
| Traffic | 100% ทันที | รองรับ split |
| First deployment | ใช้ได้ | ใช้ไม่ได้ (ต้องใช้ deploy ครั้งแรก) |
| Durable Objects | รองรับ lifecycle changes | ไม่รองรับ |
| Secrets | Deploy ทันที | ใช้ `versions secret` แยก |

## Limitations

- Deploy ได้แค่ 100 versions ล่าสุด
- Traffic split สูงสุด 2 versions
- ต้องใช้ `wrangler deploy` ครั้งแรก
- ต้องใช้ ES modules format
- Durable Object lifecycle changes ต้องใช้ `wrangler deploy`

## Source

- [wrangler versions](https://developers.cloudflare.com/workers/wrangler/commands/versions/)
- [Versions and Rollbacks](https://developers.cloudflare.com/workers/configuration/versions-and-rollbacks/)
- [Gradual Deployments](https://developers.cloudflare.com/workers/versions-and-deployments/gradual-deployments/)
