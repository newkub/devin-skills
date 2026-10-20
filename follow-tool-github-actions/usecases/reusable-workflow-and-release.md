# Use Case — Reusable Workflow plus Tag-Triggered Release

> Write the test pipeline once, call it from several workflows, and publish a GitHub Release from a tag with the minimum token scope. Source: https://docs.github.com/en/actions/sharing-automations/reusing-workflows (accessed 2026-10-20)

## 1. The reusable workflow

```yaml
# .github/workflows/test.yml
name: test
on:
  workflow_call:
    inputs:
      bun-version:
        type: string
        default: "1.3"
    secrets:
      TURBO_TOKEN:
        required: false
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: ${{ inputs.bun-version }}
          cache: true
      - run: bun install --frozen-lockfile
      - run: bun test
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
```

A `workflow_call` file has no `runs-on` of its own at the top level — only jobs.

## 2. Callers stay thin

```yaml
# .github/workflows/pr.yml
on: pull_request
jobs:
  test:
    uses: ./.github/workflows/test.yml
    with:
      bun-version: "1.3"
    secrets: inherit
```

`secrets: inherit` forwards the caller's secrets; list them explicitly if you want an auditable surface.

## 3. Release job

```yaml
# .github/workflows/release.yml
on:
  push:
    tags: ["v*"]

permissions:
  contents: write          # required to create a release

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0    # full history for generated notes
      - run: gh release create "$GITHUB_REF_NAME" --generate-notes --verify-tag
        env:
          GH_TOKEN: ${{ github.token }}
```

## Pitfalls

- Calling a reusable workflow with `uses: ./...` from a *different* repo → must be `owner/repo/.github/workflows/x.yml@ref`.
- Nesting more than four levels of `workflow_call` → silently rejected.
- `permissions` set in the caller but not in the reusable workflow → the callee only gets the intersection; document it.
- `--generate-notes` with `fetch-depth: 1` → empty changelog; the notes are built from commits since the previous tag.

## Related

- `references/apis.md`
- `best-practices/github-actions.md`
- `usecases/ci-pipeline-with-cache-and-matrix.md`
