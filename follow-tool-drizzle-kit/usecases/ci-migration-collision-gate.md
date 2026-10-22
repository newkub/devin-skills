# Use Case — Catch Two Branches That Generate Colliding Migrations

> Two branches cut from the same snapshot each create a `0003_*` migration. Git merges both files cleanly, the journal ends up with two entries at one index, and the breakage surfaces on deploy. `drizzle-kit check` sees it with no database and no credentials. Source: https://orm.drizzle.team/docs/kit-overview (accessed 2026-10-21)

## 1. Add the check to the lint job

```yaml
      - name: Migration collisions
        run: bunx drizzle-kit check
```

No service container, no secrets — it reads the `out` directory only, so it belongs with lint and typecheck rather than in the deploy job.

## 2. Read what it reports

A collision means two migrations claim the same journal position. The message names the files; the fix is never to renumber one of them by hand.

## 3. Rebuild the branch's migration on top of main

```bash
rm drizzle/0003_add_shop_rooms.sql
git checkout -- drizzle/meta
git rebase main
bunx drizzle-kit generate --name add_shop_rooms
```

Deleting the local file and restoring `meta/` puts the branch back on main's snapshot; regenerating then produces the next free index. If the branch carried a data change as well, re-add it as a custom migration (step 4).

## 4. Keep data migrations out of the schema diff

```bash
bunx drizzle-kit generate --custom --name backfill_shop_slugs
```

`generate` only sees schema diffs, so a backfill written as a normal migration leaves the snapshot untouched and the next `generate` repeats the same diff. `--custom` creates the empty file the journal tracks correctly.

## 5. Publish the DDL for review without a database

```bash
bunx drizzle-kit export > schema.sql
```

Attach the output to the pull request when the reviewer cannot run the database: `export` converts the schema to DDL with no connection.

## 6. Verify

1. The gate fails on a branch that deliberately duplicates an index (prove it once, then revert)
2. `bunx drizzle-kit check` green on the rebased branch
3. Journal order matches file order — new entries appended, none renumbered
4. `bunx drizzle-kit migrate` against a throwaway database consumes exactly the new entries
5. CI job ordering: the check runs before any step that needs a database

## Pitfalls

- Renumbering files or editing `_journal.json` to make `check` pass — the snapshots still disagree, so the next `generate` produces a wrong diff.
- Regenerating a schema change with `--custom` to dodge the collision: the snapshot never moves and the diff comes back.
- Running `check` only on `main` — the collision is announced on the branch, before merge.
- Deleting a migration someone already applied on a shared environment.
- Putting the check in the deploy job, where a failed run has already touched a real database.

## Related

- `references/cli.md`
- `best-practices/migrations.md`
- `workflows/migrate-schema/SKILL.md`
- `usecases/safe-column-rename.md`
