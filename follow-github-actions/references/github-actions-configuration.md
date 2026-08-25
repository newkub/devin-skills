# Configuration

Configuration options สำหรับ GitHub Actions

## Workflow File Structure

```yaml
name: Workflow Name
on:
  push:
    branches: [main]
  pull_request:

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Hello"
```

## Common Configuration

| Option | Description |
|--------|-------------|
| `name` | Workflow name |
| `on` | Trigger events |
| `jobs` | Jobs to run |
| `runs-on` | Runner OS |
| `steps` | Steps to execute |
| `uses` | Action to use |
| `run` | Command to run |

## Environment Variables

```yaml
env:
  NODE_ENV: production
  API_URL: https://api.example.com
```

## Secrets

```yaml
steps:
  - name: Deploy
    env:
      SECRET_KEY: ${{ secrets.SECRET_NAME }}
```

## Matrix Strategy

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [14, 16, 18]
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

## Caching

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.bun
    key: ${{ runner.os }}-bun-${{ hashFiles('**/package-lock.json') }}
```
