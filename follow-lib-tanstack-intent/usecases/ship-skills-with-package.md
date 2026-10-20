# Use Case — Ship Agent Skills With an npm Package

> Publish a library whose consumers can install its agent skills alongside the code. Source: https://tanstack.com/intent/latest (accessed 2026-10-20)

## 1. Install as a dev dependency

```bash
bun add -D @tanstack/intent
```

The package helps with authoring and discovery; nothing about it belongs in a consumer's runtime install.

## 2. Lay out the skills inside the package

```
my-lib/
├── src/
├── skills/
│   └── my-lib/
│       └── SKILL.md
├── package.json
└── README.md
```

Each skill is a directory with a `SKILL.md` whose frontmatter carries `name`, `description`, and `related`. Check the layout the current Intent release expects before adding a second level of nesting — the discovery path is the part most likely to change in `0.x`.

## 3. Make `files` cover the skills

```json
{
  "files": ["dist", "skills"]
}
```

`files` is an allow-list. Omitting `skills` publishes a package whose repo has skills and whose tarball has none — and the install succeeds, so nothing reports the loss.

## 4. Write skills against this release

1. Name the exact API the release exposes; a skill copied from the previous minor teaches a removed function
2. Link the docs page rather than restating the whole API
3. Keep each skill focused on one task — a 400-line skill is one nobody loads

## 5. Verify from the tarball

```bash
npm pack --dry-run
npm pack
tar -tzf tanstack-my-lib-*.tgz | grep skills/
```

1. The file list must include `package/skills/my-lib/SKILL.md`
2. Install the tarball in a scratch project, then discover and install the skill through the Intent tooling
3. `/run-build` + `/run-test` stay green — the skill layout must not change the runtime build

## Pitfalls

- A `skills/` path excluded by `.npmignore`, which silently overrides `files`.
- Skills authored outside the package (in a docs site) and copied in by hand, so they drift from the release that ships them.
- Version-specific examples in a skill that is not regenerated on release — the consumer follows instructions for an API that no longer exists.
- Absolute local paths in skill examples, which break on every machine but the author's.

## Related

- `references/apis.md`
- `best-practices/tanstack-intent.md`
- `usecases/consume-skills-from-a-dependency.md`
