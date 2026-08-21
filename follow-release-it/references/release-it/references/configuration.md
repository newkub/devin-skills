# Configuration Reference

## Purpose

Configuration options reference สำหรับ Release It

## Scope

- Top-level Options
- Git Options
- bun Options
- GitHub Options
- GitLab Options
- Plugin Options

## Top-level Options

### Basic Config

```json
{
  "$schema": "https://unpkg.com/release-it@20/schema/release-it.json",
  "git": {},
  "bun": {},
  "github": {},
  "gitlab": {}
}
```

### Config Properties

| Property | Type | Description |
|----------|------|-------------|
| `git` | object | Git configuration |
| `bun` | object | bun configuration |
| `github` | object | GitHub configuration |
| `gitlab` | object | GitLab configuration |
| `plugins` | object | Plugin configuration |
| `hooks` | object | Hooks configuration |
| `verbose` | number | Verbosity level |

## Git Options

### Basic Git

```json
{
  "git": {
    "commitMessage": "Release v${version}",
    "tagName": "v${version}",
    "push": true
  }
}
```

### Git Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `commitMessage` | string | `Release v${version}` | Commit message |
| `tagName` | string | `v${version}` | Tag name |
| `push` | boolean | `true` | Push to remote |
| `pushArgs` | string | `--tags` | Push arguments |
| `requireCommits` | boolean | `false` | Require commits |
| `commitAll` | boolean | `true` | Stage all changes |
| `addFiles` | string[] | `[]` | Files to add |
| `changelog` | string | auto | Changelog command |
| `tagMatch` | string | - | Tag pattern |
| `requireTagMatching` | boolean | `false` | Require matching tag |

### Tag Format

```json
{
  "git": {
    "tagName": "v${version}",
    "tagMatch": "v*"
  }
}
```

## bun Options

### Basic bun

```json
{
  "bun": {
    "publish": true
  }
}
```

### bun Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `publish` | boolean | `true` | Publish to bun |
| `access` | string | `public` | public/restricted |
| `otp` | string | - | One-time password |
| `distTag` | string | `latest` | Distribution tag |
| `skipChecks` | boolean | `false` | Skip version check |
| `publishPath` | string | `.` | Package path |
| `allowSameVersion` | boolean | `false` | Allow same version |
| `dryRun` | boolean | `false` | Dry run |

### Scoped Packages

```json
{
  "bun": {
    "publish": true,
    "access": "public"
  }
}
```

## GitHub Options

### Basic GitHub

```json
{
  "github": {
    "release": true
  }
}
```

### GitHub Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `release` | boolean | `false` | Create release |
| `releaseName` | string | `v${version}` | Release name |
| `releaseNotes` | string | auto | Release notes |
| `draft` | boolean | `false` | Draft release |
| `prerelease` | boolean | `false` | Prerelease |
| `assets` | string[] | `[]` | Release assets |
| `token` | string | env | GitHub token |
| `releaseUrl` | string | auto | Custom release URL |

### GitHub Assets

```json
{
  "github": {
    "release": true,
    "assets": [
      "dist/*.js",
      "dist/*.css",
      "README.md"
    ]
  }
}
```

## GitLab Options

### Basic GitLab

```json
{
  "gitlab": {
    "release": true
  }
}
```

### GitLab Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `release` | boolean | `false` | Create release |
| `releaseName` | string | `v${version}` | Release name |
| `releaseNotes` | string | auto | Release notes |
| `milestones` | string[] | `[]` | Associated milestones |
| `assets` | object[] | `[]` | Release assets |
| `token` | string | env | GitLab token |

### GitLab Assets

```json
{
  "gitlab": {
    "release": true,
    "assets": [
      {
        "name": "release.zip",
        "file": "dist/release.zip"
      }
    ]
  }
}
```

## Plugin Options

### Conventional Changelog

```json
{
  "plugins": {
    "@release-it/conventional-changelog": {
      "infile": "CHANGELOG.md",
      "preset": {
        "name": "conventionalcommits"
      }
    }
  }
}
```

### Keep a Changelog

```json
{
  "plugins": {
    "@release-it/keep-a-changelog": {
      "infile": "CHANGELOG.md"
    }
  }
}
```

### Bumper

```json
{
  "plugins": {
    "@release-it/bumper": {
      "outfile": "VERSION"
    }
  }
}
```

## Hooks Options

### Hook Syntax

```json
{
  "hooks": {
    "before:init": ["bun run lint", "bun test"],
    "after:bump": "bun run build",
    "after:release": "echo Released v${version}"
  }
}
```

### Available Hooks

| Hook | Description |
|------|-------------|
| `before:init` | Before anything starts |
| `beforeBump` | Before version bump |
| `before:version:bump` | Before each file bump |
| `after:version:bump` | After each file bump |
| `after:bump` | After all bumps |
| `beforeRelease` | Before publishing |
| `before:git:commit` | Before git commit |
| `after:git:commit` | After git commit |
| `before:git:tag` | Before git tag |
| `after:git:tag` | After git tag |
| `before:git:push` | Before git push |
| `after:git:push` | After git push |
| `before:bun:publish` | Before bun publish |
| `after:bun:publish` | After bun publish |
| `before:github:release` | Before GitHub release |
| `after:github:release` | After GitHub release |
| `after:release` | After everything |

## Verbose Options

```json
{
  "verbose": 1
}
```

| Level | Description |
|-------|-------------|
| `0` | Normal |
| `1` | Show hook output (`-V`) |
| `2` | Show all output (`-VV`) |

## Summary

| Category | Options |
|----------|---------|
| **Git** | commitMessage, tagName, push, changelog |
| **bun** | publish, access, distTag, skipChecks |
| **GitHub** | release, releaseName, assets, draft |
| **GitLab** | release, releaseName, assets |
| **Plugins** | conventional-changelog, keep-a-changelog |
| **Hooks** | before/after each lifecycle step |
