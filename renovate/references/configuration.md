# Configuration Reference

Configuration options for Renovate

## Config File

Create `renovate.json` at project root:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"]
}
```

Or add to `package.json`:

```json
{
  "name": "my-project",
  "renovate": {
    "extends": ["config:recommended"]
  }
}
```

## Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extends` | `array` | - | Use preset configs |
| `labels` | `array` | [] | Labels for PRs |
| `assignees` | `array` | [] | PR assignees |
| `reviewers` | `array` | [] | PR reviewers |
| `schedule` | `array` | [] | When to create PRs |
| `timezone` | `string` | UTC | Timezone for schedules |

## Update Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rangeStrategy` | `string` | auto | auto, pin, bump, replace |
| `separateMajorMinor` | `boolean` | true | Separate major/minor PRs |
| `separateMinorPatch` | `boolean` | true | Separate minor/patch PRs |
| `automerge` | `boolean` | false | Auto-merge PRs |
| `automergeType` | `string` | pr | pr, branch |

## Package Rules

```json
{
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    }
  ]
}
```

| Pattern | Description |
|---------|-------------|
| `matchUpdateTypes` | minor, patch, major, pin, digest |
| `matchPackagePatterns` | regex pattern for package names |
| `matchPackages` | exact package names |
| `matchPaths` | file path patterns |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RENOVATE_TOKEN` | Platform access token |
| `RENOVATE_PLATFORM` | github, gitlab, bitbucket |
| `RENOVATE_AUTODISCOVER` | Auto-discover repositories |
| `RENOVATE_GIT_AUTHOR` | Git author for commits |

---

For full configuration options, see [Renovate Configuration Documentation](https://docs.renovatebot.com/configuration-options).
