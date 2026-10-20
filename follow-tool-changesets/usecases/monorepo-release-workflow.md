# Use Case — Changesets in a Monorepo Release

> Record intent per PR, version packages together, and publish only what changed. Source: https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md (accessed 2026-10-20)

## 1. Config

```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@3/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@acme/docs"],
  "linked": [["@acme/ui", "@acme/tokens"]]
}
```

`linked` keeps a design-system pair on the same version; `updateInternalDependencies` bumps internal ranges automatically.

## 2. One changeset per change

```bash
bunx changeset add            # interactively pick packages + bump type + summary
```

```md
---
"@acme/ui": minor
"@acme/tokens": patch
---

Add a `size` prop to Button and sync the spacing token
```

The file lands in `.changeset/` and is committed with the PR — the summary becomes the changelog entry verbatim.

## 3. Version and publish

```bash
bunx changeset version        # applies bumps, rewrites CHANGELOG.md, deletes the changesets
bun install                   # refresh the lockfile after version bumps
bunx changeset publish        # publishes only versions not yet on the registry
```

`changeset publish` also creates git tags — run it only after the version commit is on `main`.

## 4. Pre-release channel

```bash
bunx changeset pre enter next
bunx changeset version        # 1.4.0-next.0
bunx changeset publish --tag next
bunx changeset pre exit
```

Consumers must install with the dist-tag (`@acme/ui@next`); `latest` stays untouched.

## Pitfalls

- Running `changeset publish` before merging the version commit → tags point at commits `main` does not contain.
- Hand-editing versions in `package.json` → changesets sees no pending changeset and publishes nothing.
- One giant changeset per release → the changelog becomes one line ("various fixes") and users cannot tell what changed.
- Forgetting `bun install` after `changeset version` → the lockfile still pins the old workspace versions and CI fails on `--frozen-lockfile`.

## Related

- `references/cli.md`
- `best-practices/changesets.md`
- `usecases/pr-check-for-changeset.md`
