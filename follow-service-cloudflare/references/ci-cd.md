# Wrangler CI/CD Integration

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npx wrangler deploy --env production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

Key environment variables for CI/CD:
- `CLOUDFLARE_API_TOKEN` — API token for authentication
- `CLOUDFLARE_ACCOUNT_ID` — Account ID (optional, can be in config)