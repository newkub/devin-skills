# Programmatic API

GitHub Actions ใช้ YAML workflow files สำหรับ CI/CD automation:

## Workflow Example (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: bun ci

      - name: Run tests
        run: bun test

      - name: Build
        run: bun run build
```

## Key Events

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    types: [ opened, synchronize, reopened ]
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:
```

## Using Secrets

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: bun run deploy
```

## Using Artifacts

```yaml
steps:
  - name: Upload artifact
    uses: actions/upload-artifact@v4
    with:
      name: dist
      path: dist/
```

## Using Caching

```yaml
steps:
  - name: Cache node modules
    uses: actions/cache@v4
    with:
      path: ~/.bun
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## See Also

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions GitHub](https://github.com/features/actions)
