# Programmatic API

## Purpose

Programmatic API reference สำหรับการใช้งาน Release It ใน code

## Scope

- Import
- Release Function
- Options
- Return Values

## Import

### ESM

```typescript
import releaseIt from 'release-it'
```

### CJS

```javascript
const releaseIt = require('release-it')
```

## Basic Usage

### Simple Release

```typescript
import releaseIt from 'release-it'

const result = await releaseIt()

console.log(result)
```

### With Options

```typescript
import releaseIt from 'release-it'

const result = await releaseIt({
  increment: 'patch',
  plugins: {},
  git: {
    commitMessage: 'chore: release v${version}',
    tagName: 'v${version}',
  },
  bun: {
    publish: true,
  },
})

console.log(result)
```

## Release Function

### Signature

```typescript
async function releaseIt(
  config?: ConfigOptions,
  context?: Context
): Promise<ReleaseResult>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `ConfigOptions` | Configuration options |
| `context` | `Context` | Context for plugins |

### Return Value

```typescript
interface ReleaseResult {
  version: string
  changelog: string
  nextVersion: string
  commits: string[]
  releases: Release[]
}
```

## Configuration Options

### All Options

```typescript
interface ConfigOptions {
  // Git
  git?: {
    commitMessage?: string
    tagName?: string
    push?: boolean
    pushArgs?: string
    requireCommits?: boolean
    commitAll?: boolean
    changelog?: string
  }

  // bun
  bun?: {
    publish?: boolean
    access?: string
    distTag?: string
    skipChecks?: boolean
  }

  // GitHub
  github?: {
    release?: boolean
    releaseName?: string
    releaseNotes?: string
    draft?: boolean
    prerelease?: boolean
    assets?: string[]
  }

  // GitLab
  gitlab?: {
    release?: boolean
    releaseName?: string
    releaseNotes?: string
  }

  // Plugins
  plugins?: Record<string, any>

  // Hooks
  hooks?: {
    [key: string]: string | string[] | function
  }

  // Other
  increment?: string
  preRelease?: string
  verbose?: number
}
```

## Plugins

### Custom Plugin

```typescript
import releaseIt from 'release-it'

const myPlugin = {
  name: 'my-plugin',

  async init(context) {
    console.log('Initializing...')
  },

  async bump(version, pluginContext) {
    console.log(`Bumping to ${version}`)
    return version
  },
}

const result = await releaseIt({
  plugins: {
    'my-plugin': myPlugin,
  },
})
```

### Plugin Lifecycle

```typescript
{
  name: 'my-plugin',

  // Lifecycle methods
  async init(context) {},
  async beforeBump(context) {},
  async bump(version, context) {},
  async afterBump(context) {},
  async beforeRelease(context) {},
  async release(context) {},
  async afterRelease(context) {},
}
```

## Context

### Context Object

```typescript
const context = {
  version: '1.0.0',
  latestVersion: '0.1.0',
  changelog: '...',
  name: 'my-package',
  repo: {
    remote: 'https://github.com/user/repo',
    owner: 'user',
    repository: 'repo',
  },
  branchName: 'main',
}

const result = await releaseIt(config, context)
```

## Examples

### CI Mode

```typescript
import releaseIt from 'release-it'

const result = await releaseIt({
  increment: 'patch',
  bun: {
    publish: true,
  },
  git: {
    push: true,
  },
}, {
  ci: true,
})
```

### Pre-release

```typescript
import releaseIt from 'release-it'

const result = await releaseIt({
  preRelease: 'beta',
  bun: {
    publish: true,
  },
})
```

### Dry Run

```typescript
import releaseIt from 'release-it'

const result = await releaseIt({
  dryRun: true,
})
```

### Skip Steps

```typescript
import releaseIt from 'release-it'

const result = await releaseIt({
  git: {
    push: false,
  },
  bun: {
    publish: false,
  },
  github: {
    release: false,
  },
})
```

## Summary

| Function | Usage |
|----------|-------|
| `releaseIt()` | Interactive release |
| `releaseIt(config)` | Release with config |
| `releaseIt(config, context)` | Release with config + context |

| Option | Purpose |
|--------|---------|
| `git` | Git operations |
| `bun` | bun publishing |
| `github` | GitHub releases |
| `plugins` | Custom plugins |
| `hooks` | Custom commands |
