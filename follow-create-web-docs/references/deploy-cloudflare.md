# Deploy To Cloudflare Workers

## wrangler.toml

```toml
name = "<repo>-docs"
compatibility_date = "<today>"
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

## Local

```bash
bun add -D wrangler
bun run build
bunx wrangler deploy --dry-run    # verify ก่อน
bunx wrangler deploy              # deploy จริง (ต้อง login)
```

## GitHub Actions

`.github/workflows/deploy-docs.yml`:

```yaml
name: deploy-docs
on:
  push:
    branches: [main]
    paths: ['site/**', 'README.md', 'docs/**', '.github/workflows/deploy-docs.yml']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install && bun run build
        working-directory: site
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: site
```

## Secrets

- `CLOUDFLARE_API_TOKEN` — Workers edit permission
- `CLOUDFLARE_ACCOUNT_ID`

เพิ่มผ่าน `gh secret set` หรือ repo settings — ห้าม commit ค่าจริง
