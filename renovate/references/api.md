# Programmatic API

Renovate มี configuration สำหรับ automated dependency updates:

## Configuration (renovate.json)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "schedule": ["every weekend"],
  "labels": ["dependencies"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    }
  ]
}
```

## Configuration in package.json

```json
{
  "name": "my-project",
  "renovate": {
    "extends": ["config:base"],
    "schedule": ["every weekend"],
    "labels": ["dependencies"]
  }
}
```

## GitHub App Installation

1. Install Renovate GitHub App
2. Configure repository settings
3. Add `renovate.json` or `.renovaterc` file
4. Renovate will automatically create PRs

## Configuration Presets

```json
{
  "extends": [
    "config:base",
    "config:recommended",
    "group:monorepos",
    "group:recommended"
  ]
}
```

## Platform Support

- GitHub (.com and Enterprise Server)
- GitLab (.com and CE/EE)
- Bitbucket Cloud and Server
- Azure DevOps
- Gitea
- Forgejo

ดูรายละเอียดเพิ่มเติมที่: [Renovate Documentation](https://docs.renovatebot.com)
