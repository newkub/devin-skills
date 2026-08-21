# CLI Commands

CLI commands สำหรับ GitHub Actions (via GitHub CLI)

## Installation

```bash
# Install GitHub CLI
bun install -g gh

# Login
gh auth login
```

## Workflow Commands

```bash
# List workflows
gh workflow list

# View workflow runs
gh run list

# Watch workflow run
gh run watch

# Download workflow logs
gh run download
```

## Run Commands

```bash
# Trigger workflow
gh workflow run <workflow-name>

# Cancel run
gh run cancel <run-id>

# View run details
gh run view <run-id>
```

## Secret Commands

```bash
# List secrets
gh secret list

# Set secret
gh secret set <name> --body <value>

# Delete secret
gh secret delete <name>
```

## Action Commands

```bash
# View action usage
gh action list
```

## Common Options

| Option | Description |
|--------|-------------|
| `-R` | Repository |
| `--help` | แสดง help |
| `--json` | JSON output |

