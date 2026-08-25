# Wrangler Bindings

Bindings เชื่อม Worker กับ Cloudflare resources (Secrets, D1, KV, R2)

## Secrets

Secrets เป็น encrypted environment variables สำหรับ sensitive data

| Command | Description |
|---|---|
| `wrangler secret put KEY_NAME` | Set a secret (prompts for value) |
| `wrangler secret list` | List all secrets |
| `wrangler secret delete KEY_NAME` | Delete a secret |
| `wrangler secret bulk [FILE]` | Bulk upload secrets from JSON or .env file |
| `wrangler secret bulk [FILE] --env production` | Bulk upload for specific environment |

### Local Development Secrets

ใช้ `.dev.vars` หรือ `.env` (เลือกอย่างเดียว) ใน project root:

```bash
# .dev.vars
API_KEY=your_api_key_here
DB_CONNECTION_STRING=your_connection_string
```

### Declare Required Secrets

```jsonc
{
  "secrets": {
    "required": ["API_KEY", "DB_CONNECTION_STRING"]
  }
}
```

## D1 Databases

D1 เป็น serverless SQLite database

| Command | Description |
|---|---|
| `wrangler d1 create my-db` | Create a D1 database |
| `wrangler d1 list` | List D1 databases |
| `wrangler d1 execute my-db --command "SELECT 1"` | Run SQL command |
| `wrangler d1 execute my-db --file schema.sql` | Run SQL file |
| `wrangler d1 execute my-db --local` | Run against local DB |
| `wrangler d1 execute my-db --remote` | Run against remote DB |
| `wrangler d1 delete my-db` | Delete a D1 database |
| `wrangler d1 backup create my-db` | Create a backup |
| `wrangler d1 backup list my-db` | List backups |
| `wrangler d1 time-travel info my-db` | View time travel info |
| `wrangler d1 time-travel restore my-db --bookmark=<ID>` | Restore to bookmark |

ดู `d1-migrations.md` สำหรับ migration workflow

## KV Namespaces

KV เป็น globally distributed key-value store

| Command | Description |
|---|---|
| `wrangler kv namespace create CACHE` | Create KV namespace |
| `wrangler kv namespace list` | List KV namespaces |
| `wrangler kv namespace delete --binding CACHE` | Delete KV namespace |
| `wrangler kv key put KEY VALUE --binding CACHE` | Put a key-value pair |
| `wrangler kv key list --binding CACHE` | List keys |
| `wrangler kv key get KEY --binding CACHE` | Get a value |
| `wrangler kv key delete KEY --binding CACHE` | Delete a key |

## R2 Buckets

R2 เป็น object storage เหมือน S3 แต่ไม่มี egress fees

| Command | Description |
|---|---|
| `wrangler r2 bucket create my-bucket` | Create R2 bucket |
| `wrangler r2 bucket list` | List R2 buckets |
| `wrangler r2 bucket delete my-bucket` | Delete R2 bucket |
| `wrangler r2 bucket info my-bucket` | View bucket info |
| `wrangler r2 object put my-bucket/KEY --file ./path` | Upload object |
| `wrangler r2 object get my-bucket/KEY --file ./path` | Download object |
| `wrangler r2 object delete my-bucket/KEY` | Delete object |
| `wrangler r2 object list my-bucket` | List objects in bucket |

## Configuration

Bindings ประกาศใน `wrangler.jsonc` หรือ `wrangler.toml`:

```jsonc
{
  "vars": {
    "API_HOST": "api.example.com"
  },
  "kv_namespaces": [
    { "binding": "CACHE", "id": "<KV_ID>" }
  ],
  "d1_databases": [
    { "binding": "DB", "database_name": "my-db", "database_id": "<D1_ID>" }
  ],
  "r2_buckets": [
    { "binding": "STORAGE", "bucket_name": "my-bucket" }
  ]
}
```

Bindings ไม่ inherit ระหว่าง environments ต้องประกาศใหม่ในแต่ละ env
