# semantic-release Reference

## Overview

semantic-release automates the whole package release workflow including determining the next version number, generating the release notes, and publishing the package. It enforces Semantic Versioning specification and uses formalized commit message conventions to determine the type of release.

## Install

The official recommendation is to run semantic-release in CI with `npx` rather than installing it locally. For local installation (used by this skill):

```bash
bun add -D semantic-release
```

Run in CI (recommended), pinning the major version for deterministic releases:

```bash
npx semantic-release@25
```

## Version Info

- Latest stable: `25.0.9`
- License: MIT
- Node.js: `>=20.17.0`
- Source: https://github.com/semantic-release/semantic-release

## Peer Dependencies

No peer dependencies. semantic-release bundles four core plugins internally and should not be installed separately:
- `@semantic-release/commit-analyzer`
- `@semantic-release/release-notes-generator`
- `@semantic-release/npm`
- `@semantic-release/github`

Additional official plugins require separate installation:
- `@semantic-release/changelog`
- `@semantic-release/git`
- `@semantic-release/exec`
- `@semantic-release/gitlab`
- `@semantic-release/apm`

## Configuration

semantic-release options can be set via:
- A `.releaserc` file, written in YAML or JSON, with optional extensions: `.yaml`/`.yml`/`.json`/`.js`/`.ts`/`.cjs`/`.mjs`
- A `release.config.(js|ts|cjs|mjs)` file that exports an object
- A `release` key in the project's `package.json` file

### Basic configuration via `release.config.cjs`

```js
/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ["main", "next"],
};
```

### Basic configuration via `.releaserc`

```json
{
  "branches": ["main", "next"]
}
```

### Basic configuration via `package.json`

```json
{
  "release": {
    "branches": ["main", "next"]
  }
}
```

### Options

- `extends`: `Array` or `String`. List of shareable configurations. CLI: `-e`, `--extends`
- `branches`: `Array`, `String`, or `Object`. Default releases from `main`/`master`, maintenance `N.N.x`, `next`, `next-major`, pre-releases from `beta`/`alpha`. CLI: `--branches`
- `repositoryUrl`: `String`. Default is `repository` in `package.json` or git origin url. CLI: `-r`, `--repository-url`
- `tagFormat`: `String`. Default `v${version}`. CLI: `-t`, `--tag-format`
- `plugins`: `Array`. Default `['@semantic-release/commit-analyzer', '@semantic-release/release-notes-generator', '@semantic-release/npm', '@semantic-release/github']`. CLI: `-p`, `--plugins`
- `dryRun`: `Boolean`. Default `false` in CI, `true` otherwise. CLI: `-d`, `--dry-run`
- `ci`: `Boolean`. Default `true`. CLI: `--ci` / `--no-ci`
- `debug`: `Boolean`. Default `false`. CLI: `--debug`

Note: CLI arguments take precedence over configuration file options. Plugin options cannot be configured through CLI arguments.

### Plugin configuration with options

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { "changelogFile": "docs/CHANGELOG.md" }],
    "@semantic-release/npm",
    ["@semantic-release/git", {
      "assets": ["docs/CHANGELOG.md", "package.json"],
      "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }],
    "@semantic-release/github"
  ]
}
```

## CLI Commands

```bash
# Run semantic-release (recommended in CI)
npx semantic-release

# Run with bun (local install)
bunx semantic-release

# Dry run (preview pending release)
npx semantic-release --dry-run

# Debug mode
DEBUG=semantic-release:* npx semantic-release

# Run from a specific branch
npx semantic-release --branches next

# Run without CI environment checks (local releases)
npx semantic-release --no-ci

# Specify plugins
npx semantic-release -p @semantic-release/commit-analyzer -p @semantic-release/release-notes-generator

# Include additional plugins via npx
npx --package semantic-release --package @semantic-release/exec semantic-release
```

### Package.json Scripts

```json
{
  "scripts": {
    "release": "semantic-release",
    "release:dry": "semantic-release --dry-run"
  }
}
```

## Plugins

### Core plugins (bundled, do not install separately)

- `@semantic-release/commit-analyzer`: Determines the type of release by analyzing commits with conventional commit conventions
- `@semantic-release/release-notes-generator`: Generates release notes for each release
- `@semantic-release/npm`: Publishes the package to the npm registry, updates `package.json` version
- `@semantic-release/github`: Publishes a GitHub release, comments on issues and pull requests

### Additional official plugins (require separate install)

- `@semantic-release/changelog`: Creates or updates a changelog file in the project directory. Install: `bun add -D @semantic-release/changelog`
- `@semantic-release/git`: Commits release assets to the git repository. Install: `bun add -D @semantic-release/git`
- `@semantic-release/exec`: Executes shell commands at various release steps. Install: `bun add -D @semantic-release/exec`
- `@semantic-release/gitlab`: Publishes a GitLab release. Install: `bun add -D @semantic-release/gitlab`
- `@semantic-release/apm`: Publishes an Atom package. Install: `bun add -D @semantic-release/apm`

### Plugin execution order

Plugins run in series, in the order defined, for each release step they implement. Release steps: `verifyConditions`, `analyzeCommits`, `verifyRelease`, `generateNotes`, `prepare`, `publish`, `addChannel`, `success`, `fail`.

## CI Setup

### GitHub Actions (verify and release)

```yaml
name: Verify and Release
on:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  verify:
    name: Verify
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
      - run: npm clean-install
      - run: npm test

  release:
    name: Release
    runs-on: ubuntu-latest
    needs: verify
    permissions:
      contents: write
      issues: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
      - run: npm clean-install
      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
```

### Authentication

- `GITHUB_TOKEN`: Automatically populated by GitHub Actions, used for GitHub releases and comments
- `NPM_TOKEN`: Required for npm publishing when not using trusted publishing. Add as a GitHub Actions secret
- Trusted publishing (OIDC): Recommended path, requires `id-token: write` permission and npm Trusted Publisher configuration. npm provenance is generated automatically

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Source

- https://github.com/semantic-release/semantic-release
- https://www.npmjs.com/package/semantic-release
- https://semantic-release.org/usage/getting-started/
- https://semantic-release.org/usage/configuration/
- https://semantic-release.org/usage/running/
- https://semantic-release.org/foundation/plugins/
- https://semantic-release.org/extending/plugins-list/
- https://semantic-release.org/recipes/ci-configurations/github-actions/
- https://github.com/semantic-release/changelog
- https://github.com/semantic-release/git
