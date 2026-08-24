# changelogen Reference

> Generate beautiful changelogs using Conventional Commits.

## Install

```sh
bun add -D changelogen
# or use via npx without install:
npx changelogen@latest
```

## Version

- Latest stable: `0.6.2`
- License: MIT

## Peer Dependencies

No required peer dependencies. Uses `conventional-commits` format.

## CLI Usage

```sh
npx changelogen@latest [...args] [--dir <dir>]
```

### Arguments

| Argument         | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `--from`         | Start commit reference (default: latest git tag)                   |
| `--to`           | End commit reference (default: latest commit in HEAD)              |
| `--dir`          | Path to git repository (default: current working directory)        |
| `--clean`        | Exit if working directory is not clean                             |
| `--output`       | Changelog file name (default: `CHANGELOG.md`). Use `--no-output` for console only |
| `--noAuthors`    | Skip contributors section in changelog                             |
| `--bump`         | Determine semver change and update version in `package.json`       |
| `--release`      | Bump version, update `CHANGELOG.md`, create git commit and tag     |
| `--no-commit`    | Disable commit (use with `--release`)                              |
| `--no-tag`       | Disable tag (use with `--release`)                                 |
| `--push`         | Push new tag and release commit to git remote                      |
| `--publish`      | Publish package as new version on npm                              |
| `--publishTag`   | Custom npm tag for publishing (default: `latest`)                  |

### Quick Start Commands

Generate changelog and display in console:

```sh
npx changelogen@latest
```

Generate changelog, bump version, update `CHANGELOG.md` (no commit):

```sh
npx changelogen@latest --bump
```

Full release (bump + changelog + git commit + tag):

```sh
npx changelogen@latest --release
```

Release with auto-push:

```sh
npx changelogen@latest --release --push
```

### GitHub Release Sync

```sh
npx changelogen@latest gh release
```

Syncs changelog with GitHub releases. Requires `GITHUB_TOKEN` or `CHANGELOGEN_TOKENS_GITHUB` environment variable.

## Configuration

Create `changelogen.config.ts` in the project root:

```ts
import { defineConfig } from "changelogen";

export default defineConfig({
  types: {
    feat: { title: "🚀 Enhancements", semver: "minor" },
    perf: { title: "🔥 Performance", semver: "patch" },
    fix: { title: "🩹 Fixes", semver: "patch" },
    refactor: { title: "💅 Refactors", semver: "patch" },
    docs: { title: "📖 Documentation", semver: "patch" },
    build: { title: "📦 Build", semver: "patch" },
    types: { title: "🌊 Types", semver: "patch" },
    chore: { title: "🏡 Chore" },
    examples: { title: "🏀 Examples" },
    test: { title: "✅ Tests" },
    style: { title: "🎨 Styles" },
    ci: { title: "🤖 CI" },
  },
});
```

### Default Types and Semver

| Type       | Title                | Semver Bump |
| ---------- | -------------------- | ----------- |
| `feat`     | 🚀 Enhancements      | `minor`     |
| `perf`     | 🔥 Performance       | `patch`     |
| `fix`      | 🩹 Fixes             | `patch`     |
| `refactor` | 💅 Refactors         | `patch`     |
| `docs`     | 📖 Documentation     | `patch`     |
| `build`    | 📦 Build             | `patch`     |
| `types`    | 🌊 Types             | `patch`     |
| `chore`    | 🏡 Chore             | -           |
| `examples` | 🏀 Examples          | -           |
| `test`     | ✅ Tests             | -           |
| `style`    | 🎨 Styles            | -           |
| `ci`       | 🤖 CI                | -           |

### Custom Configuration

```ts
import { defineConfig } from "changelogen";

export default defineConfig({
  scopeMap: {
    "ui": "UI Components",
    "api": "API Layer",
  },
  output: "CHANGELOG.md",
  noAuthors: false,
  excludeAuthors: ["dependabot[bot]"],
  templates: {
    commitMessage: "chore(release): v{{newVersion}}",
    tagMessage: "v{{newVersion}}",
    tagBody: "v{{newVersion}}",
  },
  publish: {
    private: false,
    tag: "latest",
    args: [],
  },
});
```

### Configuration Options

| Option           | Type      | Default         | Description                            |
| ---------------- | --------- | --------------- | -------------------------------------- |
| `types`          | `object`  | (see above)     | Commit types with titles and semver    |
| `scopeMap`       | `object`  | `{}`            | Map commit scopes to display names     |
| `repo`           | `object`  | auto-detected   | Repository configuration               |
| `output`         | `string`  | `CHANGELOG.md`  | Changelog output file                  |
| `noAuthors`      | `boolean` | `false`         | Skip contributors section              |
| `excludeAuthors` | `array`   | `[]`            | Authors to exclude                     |
| `signTags`       | `boolean` | `false`         | GPG-sign git tags                      |
| `templates`      | `object`  | (defaults)      | Commit message, tag message templates  |
| `publish`        | `object`  | (defaults)      | npm publish settings                   |

## Conventional Commits Format

```
type(scope): description
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`
- Breaking change: `feat!:` or `BREAKING CHANGE:` in footer

## Package Scripts

```json
{
  "scripts": {
    "changelog": "bunx changelogen@latest --release",
    "changelog:version": "bunx changelogen@latest --bump",
    "changelog:generate": "bunx changelogen@latest"
  }
}
```

## Environment Variables

- `GITHUB_TOKEN` or `GH_TOKEN` — for GitHub release sync
- `CHANGELOGEN_TOKENS_GITHUB` — alternative GitHub token env var

## Source

- GitHub: https://github.com/unjs/changelogen
- npm: https://www.npmjs.com/package/changelogen
