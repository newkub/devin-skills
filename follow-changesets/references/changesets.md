# Changesets Reference

> A tool to manage versioning and changelogs with a focus on monorepos.

## Install

```sh
bun add -D @changesets/cli
# or
npm install -D @changesets/cli
pnpm add -D @changesets/cli
yarn add -D @changesets/cli
```

Initialize:

```sh
bunx changeset init
```

## Version

- Latest stable: `3.0.1` (`@changesets/cli`)
- License: MIT
- Requires: Node.js `^22.11 || ^24 || >=26`
- Supports: pnpm, yarn, npm workspaces

## CLI Commands

```sh
changeset init                    # Initialize changesets setup
changeset add                     # Add a new changeset (default command)
changeset version                 # Version packages and create changelogs
changeset publish                 # Publish packages to npm and create git tags
changeset publish-plan            # Show packages ready to publish or tag
changeset pack                    # Pack publishable packages into tarballs
changeset status                  # Show existing changesets
changeset git-tag                 # Create git tags for current versions
changeset pre <enter|exit> [tag]  # Enter or exit prerelease mode
```

### `changeset` (add)

```sh
changeset                         # Interactive: select packages, bump type, summary
changeset --empty                 # Add an empty changeset
changeset --open                  # Open changeset in editor after creating
changeset --since main            # Detect changed packages since branch
changeset -m "Description"        # Provide message directly
changeset --major pkg-a           # Major bump specific package
changeset --minor pkg-a           # Minor bump specific package
changeset --patch pkg-a           # Patch bump specific package
```

### `changeset version`

```sh
changeset version                 # Apply changesets, update versions and changelogs
changeset version --ignore pkg-a  # Skip specific packages
changeset version --snapshot 'pr#123'  # Create snapshot prerelease
```

### `changeset publish`

```sh
changeset publish                 # Publish to npm and create git tags
changeset publish --otp 123456    # With one-time password
changeset publish --tag beta      # With custom dist-tag
changeset publish --no-git-tag    # Skip git tag creation
```

### `changeset status`

```sh
changeset status                  # Show existing changesets
changeset status --output status.json  # Write status as JSON
changeset status --since main     # Status since specific branch
```

## Configuration File

Changesets keeps configuration in `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "changedFilePatterns": ["**"],
  "format": "auto",
  "privatePackages": { "version": false, "tag": false },
  "updateInternalDependencies": "patch",
  "ignore": [],
  "bumpVersionsWithWorkspaceProtocolOnly": false
}
```

### Configuration Options

| Option                               | Type      | Default                    | Description                              |
| ------------------------------------ | --------- | -------------------------- | ---------------------------------------- |
| `changelog`                          | `string \| false \| tuple` | `"@changesets/cli/changelog"` | Changelog generator            |
| `commit`                             | `boolean \| string \| tuple` | `false`                | Auto-commit on add/version              |
| `fixed`                              | `array`   | `[]`                       | Packages versioned together              |
| `linked`                             | `array`   | `[]`                       | Packages sharing a version               |
| `access`                             | `string`  | `"restricted"`             | `restricted` or `public`                 |
| `baseBranch`                         | `string`  | `"main"`                   | Base branch for comparisons              |
| `changedFilePatterns`                | `array`   | `["**"]`                   | Picomatch patterns for changed files     |
| `format`                             | `string`  | `"auto"`                   | Code formatter: `auto`, `prettier`, `oxfmt`, `deno`, `dprint`, `false` |
| `privatePackages`                    | `object \| boolean` | `{ version: false, tag: false }` | Private package handling     |
| `updateInternalDependencies`         | `string`  | `"patch"`                  | `patch` or `minor`                       |
| `ignore`                             | `array`   | `[]`                       | Packages to skip publishing              |
| `bumpVersionsWithWorkspaceProtocolOnly` | `boolean` | `false`                 | Only bump workspace protocol deps        |

### GitHub Changelog Generator

```json
{
  "changelog": ["@changesets/changelog-github", { "repo": "owner/repo" }]
}
```

### Fixed Packages

```json
{
  "fixed": [["pkg-a", "pkg-b"], ["@scope/*"]]
}
```

### Linked Packages

```json
{
  "linked": [["pkg-a", "pkg-b"], ["@scope/*"]]
}
```

## Changeset File Format

A changeset is a Markdown file with YAML frontmatter in `.changeset/`:

```markdown
---
"pkg-a": minor
"pkg-b": patch
---

Added a new feature to pkg-a and fixed a bug in pkg-b.
```

## GitHub Actions Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          version: bun changeset version
          publish: bun changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Environment Variables

- `GITHUB_TOKEN` — for GitHub operations (release PRs, releases)
- `NPM_TOKEN` — for npm publishing

## Source

- Docs: https://changesets.dev
- GitHub: https://github.com/changesets/changesets
- npm: https://www.npmjs.com/package/@changesets/cli
