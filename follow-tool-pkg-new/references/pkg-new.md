# pkg.pr.new Reference

## Overview

pkg.pr.new (also called "Continuous Releases") is a GitHub app that triggers instant preview releases for every commit and pull request without publishing anything to NPM. It leverages its own npm-compatible URLs so users can access features and bug-fixes without waiting for release cycles.

Key features:
- Instant Builds
- No Need for NPM Access
- GitHub Workflows Friendly
- No Configuration
- Single Command
- Pull Request Comments
- Check Runs

Preview packages are installed via npm-compatible URLs:

```sh
bun add https://pkg.pr.new/tinylibs/tinybench/tinybench@a832a55

# bun add https://pkg.pr.new/${owner}/${repo}/${package}@{commit}
```

## Install

Install the GitHub Application first: https://github.com/apps/pkg-pr-new

Then install the CLI as a dev dependency:

```bash
bun add -D pkg-pr-new
```

Or with npm:

```bash
bun add -D pkg-pr-new
```

In CI environments, avoid `npx`, `pnpm dlx`, `yarn dlx`, and `bunx`. Install `pkg-pr-new` as a dependency and execute it from the lockfile (`npm exec`, `pnpm exec`, `yarn`, or `bun run`).

## Version Info

- Latest stable: `0.0.88`
- License: MIT
- Source: https://github.com/stackblitz-labs/pkg.pr.new
- npm: https://www.npmjs.com/package/pkg-pr-new
- Homepage: https://pkg.pr.new

## Peer Dependencies

No peer dependencies. The `pkg-pr-new` package is a standalone CLI tool.

## Configuration

pkg.pr.new requires no configuration file. It is configured entirely through GitHub Actions workflows and CLI flags. The GitHub Application must be installed on the repository before publishing.

### GitHub Actions Workflow (each commit and pull request)

```yml
name: Publish Any Commit
on: [push, pull_request]

permissions: {}

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - run: corepack enable
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - run: pnpm exec pkg-pr-new publish --commentWithSha
```

### Bun workflow

```yml
name: Publish
on:
  push:
    branches:
      - "**"
  pull_request:

permissions: {}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bunx pkg-pr-new publish
```

### Monorepo workflow

```yml
- run: pnpm exec pkg-pr-new publish './packages/A' './packages/B'
# or
- run: pnpm exec pkg-pr-new publish './packages/*'
```

### Approved pull requests only

Trigger on `pull_request_review` with `types: [submitted]`, check that `github.event.review.state == 'approved'`, and verify the approver has `write` permission using `actions-cool/check-user-permission@v2` before running `pkg-pr-new publish`.

### Avoid publishing on tags

```yml
on:
  pull_request:
  push:
    branches:
      - "**"
    tags:
      - "!**"
```

### E2E test using outputs

After `pkg-pr-new publish` runs, these step outputs are available:
- `sha`: The short SHA used (e.g. `a832a55`)
- `urls`: Space-separated URLs of published packages
- `packages`: Space-separated, Yarn-compatible package locators

Use `needs.publish.outputs.urls` in a downstream job to install the preview packages and run tests:

```yml
  e2e-test:
    needs: publish
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm add ${{ needs.publish.outputs.urls }}
      - run: pnpm test
```

## CLI Commands

```bash
# Publish single package
pnpm exec pkg-pr-new publish

# Publish multiple packages (monorepo)
pnpm exec pkg-pr-new publish './packages/A' './packages/B'
pnpm exec pkg-pr-new publish './packages/*'

# Publish prebuilt tarballs
pnpm exec pkg-pr-new publish './artifacts/*.tgz'

# Use bun instead of pnpm
bun run pkg-pr-new publish

# Write publish metadata to JSON (for custom comments)
pnpm exec pkg-pr-new publish --json output.json --comment=off
```

### CLI Options

| Flag | Description |
|---|---|
| `--comment=update\|create\|off` | How PR comments are posted (default: `update`) |
| `--commentWithSha` | Use commit SHA URLs instead of PR number URLs in comments |
| `--commentWithDev` | Add the `-D` flag to install commands in comments |
| `--packageManager=npm\|pnpm\|yarn\|bun` | Package manager(s) shown in comments; accepts comma-separated values |
| `--only-templates` | Show only templates in comments |
| `--template './examples/*'` | Generate StackBlitz templates for the given directories (experimental) |
| `--no-template` | Disable the default template |
| `--no-compact` | Force long-form URLs instead of compact URLs |
| `--bin` | Show `npx` instead of `npm i` in comments |
| `--previewVersion` | Rewrite package versions to `0.0.0-preview-<sha>` before packing |
| `--pnpm` / `--yarn` / `--bun` | Use `pnpm pack`, `yarn pack`, or `bun pm pack` instead of `npm pack` |
| `--json <file>` | Write publish metadata to a JSON file |

### Comment behavior

- `--comment=update` (default): generates one initial comment, then edits it on following commits
- `--comment=create`: each commit generates its own comment
- `--comment=off`: turns off comments entirely

### Package manager for packing

pkg.pr.new uses `npm pack --json` under the hood. Use `--pnpm`, `--yarn`, or `--bun` to switch to `pnpm pack`, `yarn pack`, or `bun pm pack`. Required when using pnpm catalogs (`catalog:` protocol).

### Badge

```markdown
[![pkg.pr.new](https://pkg.pr.new/badge/OWNER/REPO)](https://pkg.pr.new/~/OWNER/REPO)
```

## Source

- https://github.com/stackblitz-labs/pkg.pr.new
- https://github.com/stackblitz-labs/pkg.pr.new/blob/main/README.md
- https://www.npmjs.com/package/pkg-pr-new
- https://pkg.pr.new
- https://blog.stackblitz.com/posts/pkg-pr-new/
- https://github.com/apps/pkg-pr-new
