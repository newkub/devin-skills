# auto (auto-it) Reference

> Automated releases powered by pull request labels.

## Install

```sh
bun add -D auto
# or
npm install -D auto
yarn add -D auto
```

## Version

- License: MIT
- Default plugins: `npm` and `released` (bundled with CLI)

## Peer Dependencies

No required peer dependencies. Default plugins (`npm`, `released`) are bundled with the `auto` CLI.

## Configuration

`auto` uses `cosmiconfig` to find configuration. Supported formats:

- `auto` property in `package.json`
- `.autorc` file (JSON or YAML)
- `.autorc.json`, `.autorc.yaml`, `.autorc.yml`, `.autorc.ts`, `.autorc.js`
- `auto.config.js` (CommonJS)
- `auto.config.ts` (TypeScript)

### In `package.json`

```json
{
  "scripts": {
    "release": "auto shipit"
  },
  "author": "your-name <your-email>",
  "auto": {
    "plugins": [
      "released"
    ],
    "baseBranch": "main"
  }
}
```

### `.autorc` file

```json
{
  "plugins": [
    "released"
  ],
  "baseBranch": "main",
  "author": "your-name <your-email>"
}
```

### Interactive Init

```sh
auto init
```

## Configuration Options

| Option                      | Type      | Default       | Description                              |
| --------------------------- | --------- | ------------- | ---------------------------------------- |
| `plugins`                   | `array`   | `["npm"]`     | List of plugins to enable                |
| `baseBranch`                | `string`  | `main`/`master` | Base branch for comparisons            |
| `author`                    | `string \| object` | -   | Name and email for git commits           |
| `onlyPublishWithReleaseLabel` | `boolean` | `false`     | Only publish with `release` label        |
| `noVersionPrefix`           | `boolean` | `false`       | Do not use `v` prefix on tags            |
| `versionBranches`           | `boolean \| string` | `false` | Manage old major release branches |
| `prereleaseBranches`        | `array`   | `["next"]`    | Branches treated as prerelease           |
| `labels`                    | `array`   | (defaults)    | Custom label configuration               |
| `githubApi`                 | `string`  | -             | Custom GitHub API URL (enterprise)       |
| `githubGraphqlApi`          | `string`  | -             | Custom GitHub GraphQL API URL            |

### Author Format

```json
{
  "author": "Joe Schmo <joe@schmo.com>"
}
```

Or as object:

```json
{
  "author": {
    "name": "Joe Schmo",
    "email": "joe@schmo.com"
  }
}
```

## CLI Commands

### Setup

```sh
auto init             # Initialize .autorc interactively
auto create-labels    # Create labels on GitHub
auto info             # Show project info
```

### Publishing

```sh
auto shipit           # Full release workflow (recommended)
auto version          # Calculate version bump
auto changelog        # Generate changelog
auto release          # Create GitHub release
auto latest           # Mark release as latest
auto next             # Create next (prerelease) release
auto canary           # Publish canary release
```

### PR Interaction

```sh
auto label            # Label a PR
auto pr-status        # Set PR status
auto pr-check         # Check PR has semver label
auto pr-body          # Update PR body
auto comment          # Comment on a PR
```

## Released Plugin

Included with the `auto` CLI. Comments on merged PRs and closed issues with the new version.

### Usage

```json
{
  "plugins": ["released"]
}
```

### Options

```json
{
  "plugins": [
    [
      "released",
      {
        "label": ":shipit:",
        "prereleaseLabel": "🚧",
        "message": "%TYPE went out with version: %VERSION",
        "lockIssues": true,
        "includeBotPrs": false
      }
    ]
  ]
}
```

| Option            | Type      | Default     | Description                              |
| ----------------- | --------- | ----------- | ---------------------------------------- |
| `label`           | `string`  | `released`  | Label for merged PRs                     |
| `prereleaseLabel` | `string`  | `released`  | Label for prerelease PRs                 |
| `message`         | `string`  | -           | Custom message (`%TYPE`, `%VERSION`)     |
| `lockIssues`      | `boolean` | `false`     | Lock issues merged in PRs                |
| `includeBotPrs`   | `boolean` | `false`     | Comment on bot-created PRs               |

## Default Labels

| Label           | Changelog Title        | Release Type |
| --------------- | ---------------------- | ------------ |
| `major`         | 💥 Breaking Change     | `major`      |
| `minor`         | 🚀 Enhancement         | `minor`      |
| `patch`         | 🐛 Bug Fix             | `patch`      |
| `skip-release`  | -                      | `skip`       |
| `release`       | -                      | `release`    |
| `internal`      | 🏠 Internal            | `none`       |
| `documentation` | 📝 Documentation       | `none`       |
| `tests`         | 🧪 Tests               | `none`       |
| `dependencies`  | 🔩 Dependency Updates  | `none`       |
| `performance`   | 🏎 Performance         | `patch`      |

## Environment Variables

- `GH_TOKEN` — GitHub token (needs `repo` permission)
- `NPM_TOKEN` — npm publish token

Store in `.env` file at project root (add to `.gitignore`):

```
GH_TOKEN=YOUR_TOKEN
NPM_TOKEN=PUBLISH_TOKEN
```

## GitHub Actions Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - name: Release
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: bun run release
```

## Source

- Docs: https://intuit.github.io/auto
- GitHub: https://github.com/intuit/auto
