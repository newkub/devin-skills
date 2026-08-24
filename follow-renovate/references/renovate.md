# Renovate - Automated Dependency Update Tool

## Install

Renovate is available as:
- GitHub App (hosted at `https://github.com/apps/renovate`)
- Self-hosted via npm: `npm install -g renovate`
- GitHub Action: `renovatebot/github-action`

```bash
# Self-hosted via npm
npm install -g renovate

# Verify
renovate --version
```

## Configuration File Locations

Renovate searches for config files in this order:

1. `renovate.json`
2. `renovate.jsonc`
3. `renovate.json5`
4. `.github/renovate.json`
5. `.github/renovate.jsonc`
6. `.github/renovate.json5`
7. `.gitlab/renovate.json`
8. `.renovaterc`
9. `.renovaterc.json`
10. `package.json` (within a `"renovate"` section)

Renovate stops the search after it finds the first match.

## Repository Config

### Basic Configuration

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "schedule": ["every day"],
  "packageRules": [
    {
      "matchDepTypes": ["dependencies", "devDependencies"],
      "automerge": true
    }
  ]
}
```

### With Platform and Repositories

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "schedule": ["every day"],
  "docker": false,
  "platform": "github",
  "repositories": ["owner/repo"],
  "packageRules": [
    {
      "matchDepTypes": ["dependencies", "devDependencies"],
      "automerge": true
    }
  ]
}
```

### Grouping Updates

```json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "groupName": "all minor and patch updates",
      "automerge": true
    },
    {
      "matchDepNames": ["eslint", "prettier"],
      "groupName": "linting tools"
    }
  ]
}
```

### Schedule Configuration

```json
{
  "schedule": ["every weekend"],
  "schedule": ["after 10pm every weekday"],
  "schedule": ["before 5am every weekday"],
  "schedule": ["every day"]
}
```

## GitHub Actions Workflow

```yaml
name: Renovate

on:
  schedule:
    - cron: "0 2 * * *"
  workflow_dispatch:
  push:
    branches: [main, master]
    paths:
      - ".github/renovate.json"
      - ".github/renovate.json5"

jobs:
  renovate:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    permissions:
      contents: write
      pull-requests: write
      issues: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --ignore-scripts

      - name: Run Renovate
        uses: renovatebot/github-action@v39.2.4
        with:
          configurationFile: .github/renovate.json
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          LOG_LEVEL: info
          RENOVATE_PLATFORM: github
          RENOVATE_TOKEN: ${{ secrets.RENOVATE_TOKEN }}
```

## Token Setup

```bash
# Create GitHub Personal Access Token with `repo` scope
# Set as repository secret via GitHub CLI
gh secret set RENOVATE_TOKEN -b "ghp_your_token_here"

# Verify secret exists
gh secret list
```

## Self-Hosted Global Config

Global config (bot/admin level) can be set via:
- Config file (default: `config.js`)
- Environment variables (`RENOVATE_*` prefixed)
- CLI parameters

```bash
# Environment variable examples
RENOVATE_TOKEN=abc123
RENOVATE_GIT_AUTHOR="bot@example.com"
RENOVATE_CONFIG_FILE=/path/to/config.js
RENOVATE_PLATFORM=github
```

```bash
# Full JSON config via env
RENOVATE_CONFIG='{"token":"abc123","gitAuthor":"bot@example.com"}'
```

## Key Configuration Options

| Option | Description |
|---|---|
| `extends` | Inherit from shareable config presets |
| `schedule` | When to run updates |
| `automerge` | Auto-merge PRs after checks pass |
| `packageRules` | Per-package override rules |
| `docker` | Enable/disable Docker updates |
| `platform` | `github`, `gitlab`, `azure`, etc. |
| `repositories` | List of repos to process |
| `enabledManagers` | Limit which managers run |
| `ignoreDeps` | Skip specific dependencies |
| `labels` | Add labels to PRs |
| `prHourlyLimit` | Max PRs per hour |
| `prConcurrentLimit` | Max concurrent open PRs |
| `lockFileMaintenance` | Refresh lockfiles periodically |

## Source URLs

- Renovate docs: `https://docs.renovatebot.com/`
- Configuration options: `https://docs.renovatebot.com/configuration-options/`
- Config overview: `https://docs.renovatebot.com/config-overview/`
- Self-hosted config: `https://docs.renovatebot.com/self-hosted-configuration/`
- Running Renovate: `https://docs.renovatebot.com/getting-started/running/`
- GitHub Action: `https://github.com/renovatebot/github-action`
- JSON schema: `https://docs.renovatebot.com/renovate-schema.json`
