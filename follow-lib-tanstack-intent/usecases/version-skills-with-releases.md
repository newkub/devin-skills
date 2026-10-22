# Use Case — Keep Shipped Skills in Step With Each Release

> Make "skills match this version's API" a release step instead of an intention. Source: https://tanstack.com/intent/latest (accessed 2026-10-20)

## 1. Skills are generated from the same source as the docs

```
my-lib/
├── src/
├── docs/
│   └── usages/*.mdx        # the API examples users already trust
├── skills/
│   └── my-lib/SKILL.md     # generated from docs/usages at release time
└── scripts/sync-skills.ts
```

Writing the skill by hand in a second place guarantees drift. Generate it from the docs examples during the release, and commit the result so consumers see exactly what shipped.

## 2. Tag the skill with the version it describes

```md
---
name: my-lib
description: Use my-lib — client, queries, and cache rules
related:
  - follow-tool-vite
x-package: my-lib
x-version: 3.4.0
---
```

`x-version` (an extension field — verify the current Intent release still permits it) is what lets a consumer's tooling, and your own CI, answer "does this skill describe the installed version?".

## 3. Rewrite examples from the release's exports

```ts
// scripts/sync-skills.ts
import { readFile, writeFile } from "node:fs/promises"
import { glob } from "node:fs/promises"
import pkg from "../package.json" with { type: "json" }

const usage = await glob("docs/usages/**/*.mdx")
const body = (await Promise.all(usage.map((f) => readFile(f, "utf8")))).join("\n\n")

const removed = await readFile("scripts/removed-in-next.txt", "utf8")   // one symbol per line
for (const symbol of removed.split("\n").filter(Boolean)) {
  if (body.includes(symbol)) throw new Error(`${symbol} is gone in ${pkg.version} but still appears in a usage example`)
}

await writeFile("skills/my-lib/SKILL.md", renderSkill({ body, version: pkg.version }))
```

The guard is the useful half: it fails the release when a skill still teaches a removed symbol, before the tarball exists.

## 4. Publish inside the same release job

```yaml
- run: bun run scripts/sync-skills.ts
- run: git diff --exit-code skills/ || (echo "skills out of date — run sync-skills" && exit 1)
- run: bun run build
- run: npm pack --dry-run
- run: npm publish
```

Order matters: regenerate, fail on an uncommitted diff, then publish. A skills diff that appears only after publish means the shipped tarball is already stale.

## 5. Verify against the packed tarball

1. `npm pack` then `tar -tzf ./*.tgz | grep skills/` — the generated skill is in the tarball
2. Install the tarball in a scratch app and ask the agent to use the library — no example references a missing export
3. Bump the version without touching skills — the CI diff check fails
4. Remove an export that a skill mentions — `sync-skills` throws with the symbol name
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Hand-editing `skills/` after generation → the next release overwrites the fix; change the docs source instead.
- Generating after `npm publish` → the published tarball carries last release's skill.
- A version field nobody validates → the tag says 3.4.0 forever; assert it equals `package.json` in the sync script.
- Copying the whole README into the skill → a 900-line skill nobody loads; generate focused recipes.
- Deleting the guard when it first fails → it is failing because a skill example is genuinely wrong.

## Related

- `references/apis.md`
- `best-practices/tanstack-intent.md`
- `usecases/ship-skills-with-package.md`
- `usecases/validate-skills-in-ci.md`
