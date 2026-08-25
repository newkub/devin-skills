# release-it Reference

## Overview

release-it is a generic CLI tool to automate versioning and package publishing. It bumps the version (in `package.json`), commits and tags in Git, executes commands using hooks, creates releases at GitHub/GitLab, generates a changelog, publishes to npm, manages pre-releases, and extends with plugins.

## Install

```bash
bun add -D release-it
```

Add the `release` script to `package.json`:

```json
{
  "scripts": { "release": "release-it" },
  "devDependencies": { "release-it": "^21.0.0" }
}
```

Run release-it from the root of the project:

```bash
bun run release
bunx release-it
```

## Version Info

- Latest stable: `21.0.2`
- License: MIT
- Node.js: `>=20`
- Source: https://github.com/release-it/release-it

## Peer Dependencies

No peer dependencies. release-it is a standalone CLI tool. Plugins (e.g. `@release-it/bumper`) declare `release-it` as a `peerDependency`.

## Configuration

release-it has sane defaults. Put only the options to override in a configuration file. release-it looks for configuration in the root of the project in this order:

- `.release-it.json` / `.release-it.ts` / `.release-it.js` (or `.cjs`) / `.release-it.yaml` (or `.yml`) / `.release-it.toml`
- `package.json` (in the `release-it` property)

Use `--config path/release-it.json` to use another configuration file location.

### Basic configuration

```json
{
  "$schema": "https://unpkg.com/release-it@21/schema/release-it.json",
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}",
    "requireCleanWorkingDir": false,
    "requireUpstream": false,
    "push": true, "commit": true, "tag": true
  },
  "npm": { "publish": true, "publishPath": "." },
  "github": { "release": false },
  "hooks": {
    "before:init": ["bun run pre-release"],
    "after:release": ["echo Released ${name}@${version}", "echo Install: bun add ${name}"]
  }
}
```

### TypeScript config

```ts
import type { Config } from 'release-it'
export default {
  git: { commit: true, tag: true, push: true },
  github: { release: true }, npm: { publish: true }
} satisfies Config
```


### Git options

| Option | Description |
|---|---|
| `git.changelog` | Changelog generation command |
| `git.requireCleanWorkingDir` / `git.requireBranch` / `git.requireUpstream` | Require clean working dir / branch name / upstream remote |
| `git.requireCommits` / `git.addUntrackedFiles` | Stop if no commits / Add untracked files to release commit |
| `git.commit` / `git.tag` / `git.push` | Set to `false` to skip the commit/tag/push step |
| `git.commitMessage` / `git.tagName` | The message to add to the commit step / The name of the tag |
| `git.pushRepo` | The remote repository to push to |

### npm options

| Option | Description |
|---|---|
| `npm.publish` | Set to `false` to skip the npm publish step |
| `npm.publishPath` / `npm.publishArgs` | Publish only a specific folder (e.g. `dist`) / Extra arguments for the publish operation |
| `npm.publishPackageManager` | Use `pnpm` or `bun` to publish (default: `npm`) |
| `npm.tag` / `npm.otp` | Tag the package in npm (e.g. `beta`) / One-time password from the command line |
| `npm.ignoreVersion` / `npm.skipChecks` | Ignore the `version` from `package.json` / Skip checks on registry and user permissions |

### Hooks

Use script hooks to run shell commands during the release process. Format is `[prefix]:[hook]` or `[prefix]:[plugin]:[hook]` where prefix is `before`/`after`, plugin is `version`/`git`/`npm`/`github`/`gitlab`, hook is `init`/`bump`/`release`.

```json
{
  "hooks": {
    "before:init": ["bun run lint", "bun test"],
    "after:bump": "bun run build",
    "after:release": "echo Released ${name} v${version}."
  }
}
```

Available hook variables: `version`, `latestVersion`, `changelog`, `name`, `repo.remote`, `repo.repository`, `branchName`, `releaseUrl`.

## CLI Commands

```bash
# Interactive release (prompts for confirmation)
release-it

# CI mode (fully automated, no prompts)
release-it --ci

# Only prompt for version, automate the rest
release-it --only-version

# Specific version increment
release-it major
release-it minor
release-it patch
release-it premajor --preReleaseId=beta

# Pre-releases
release-it major --preRelease=beta
release-it --preRelease
release-it --preRelease=rc

# Print next version / changelog without releasing
release-it --release-version
release-it --changelog

# Do not increment, update existing tag/version
release-it --no-increment

# Skip npm publish or all hooks
release-it --no-npm
release-it --no-hooks

# Set options via CLI (highest priority), negate with no- prefix
release-it minor --git.requireBranch=main --github.release
release-it --no-npm.publish

# Quiet / verbose / custom config
release-it --quiet
release-it --verbose
release-it --config path/release-it.json
```

## Plugins

release-it is a pluggable task runner. Core plugins: `git`, `github`, `gitlab`, `npm`, `version`. External plugins are configured in the `plugins` object.

### @release-it/bumper

Reads and/or writes version/manifest files in any format (JSON, YAML, TOML, INI, XML, plain text). Use `in` to read, `out` to write, or both.

```bash
bun add -D @release-it/bumper
```

```json
{
  "plugins": {
    "@release-it/bumper": { "in": "composer.json", "out": "composer.json" }
  }
}
```

### @release-it/conventional-changelog

Generates a conventional changelog and recommends a bump based on commit messages.

```bash
bun add -D @release-it/conventional-changelog
```

```json
{
  "plugins": {
    "@release-it/conventional-changelog": { "preset": "angular", "infile": "CHANGELOG.md" }
  }
}
```

### @release-it/keep-a-changelog

Maintains `CHANGELOG.md` according to Keep A Changelog standards. Replaces the `## [Unreleased]` header with the current version and release date.

```bash
bun add -D @release-it/keep-a-changelog
```

```json
{
  "plugins": {
    "@release-it/keep-a-changelog": { "filename": "CHANGELOG.md", "addUnreleased": false, "addVersionUrl": false }
  }
}
```

Options: `filename`, `addUnreleased`, `keepUnreleased`, `addVersionUrl`, `head` (default `HEAD`).

## CI Mode

In a CI environment, non-interactive mode is activated automatically. Use `--ci` to force it. Example GitHub Actions workflow:

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with: { fetch-depth: 0 }
      - run: bun install
      - run: bun run release
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

For npm publishing from CI, set `NPM_TOKEN` and configure `.npmrc`:

```bash
npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN
```

Use `--npm.skipChecks` to skip the `npm whoami` prerequisite check.

## Source

- https://github.com/release-it/release-it
- https://github.com/release-it/release-it/blob/main/docs/configuration.md
- https://github.com/release-it/release-it/blob/main/docs/plugins.md
- https://github.com/release-it/bumper
- https://github.com/release-it/conventional-changelog
- https://github.com/release-it/keep-a-changelog
- https://www.npmjs.com/package/release-it
