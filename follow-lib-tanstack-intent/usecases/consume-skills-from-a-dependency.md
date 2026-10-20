# Use Case — Consume Skills Shipped by a Dependency

> Pull a package's agent skills into the right store, and keep them matching the installed version. Source: https://tanstack.com/intent/latest (accessed 2026-10-20)

## 1. Check the package actually ships skills

```bash
npm pack package-name --dry-run
```

Look for `package/skills/` in the file list. A library whose README mentions skills but whose tarball has no `skills/` directory has nothing to install — stop before writing config for it.

## 2. Install the package at the version the code uses

```bash
bun add package-name
```

The skill content is generated for one release. A skill discovered from a package pinned three minors back describes APIs the project does not have.

## 3. Choose the store deliberately

| Where | Use when |
|-------|----------|
| project `.devin/skills/` | the skill is tied to this repo's dependency version |
| global skills store | the skill is useful in every project at that version |

Project store wins for a versioned library: it travels with the lockfile, so the next developer gets the matching instructions. Global store is for cross-project conventions, not for "whatever version I happened to install here".

## 4. Discover and install

Run the Intent CLI or MCP server the package documents, point it at the installed dependency, and copy the skill into the chosen store. Keep the source package name in the skill's frontmatter `related` so the origin is traceable.

## 5. Verify the consumed skill

1. Read the installed `SKILL.md` and check its examples match the version in `package-lock.json`/`bun.lock`
2. Confirm the skill's file references resolve from its own directory — not from the author's machine paths
3. After an upgrade, re-run discovery instead of keeping the old copy

## 6. Re-sync on every upgrade

Add the re-sync to the upgrade pass: bump the dependency, re-discover the skill, diff it against the copy in the repo, and commit both together. A dependency bump without the skill bump leaves the agent following superseded instructions while the types disagree.

## Pitfalls

- Copying a dependency's skill into the global store, so every unrelated project on the machine inherits one library's version-specific advice.
- Keeping a hand-edited local copy with no record of its origin, which cannot be re-synced or confidently deleted.
- Trusting a skill in preference to the installed types — the compiler is the authority; the skill is a guide.
- Installing skills from a package that is a transitive dependency, whose version is controlled by someone else.

## Related

- `references/apis.md`
- `best-practices/tanstack-intent.md`
- `usecases/ship-skills-with-package.md`
