# Use Case — Retrofitting Intent Onto an Already-Published Package

> Add agent skills to a package that shipped without them, without breaking the current release or promising support the package does not have. Source: https://tanstack.com/intent/latest (accessed 2026-10-20)

## 1. Pick the three tasks the package is actually used for

```md
# skills/my-lib/SKILL.md
---
name: my-lib
description: Use my-lib — client setup, query caching, and error recovery
related: []
---

## Goal
...
```

A skill written from the *feature list* covers nothing. Derive the tasks from support issues and docs usage pages: the three things people open the docs for are the three skills worth shipping.

## 2. Keep the first release additive

| Change | Safe in a patch? | Why |
|---|---|---|
| `skills/` directory + `files` entry | yes | no runtime code changes |
| New `x-version` frontmatter | yes | ignored by the build |
| Rewriting the README examples | no | it is a docs change users notice |
| Changing exports for "cleaner" skills | no | that is a breaking release |

Ship the skills alone first. Mixing a skills addition with an API rewrite makes it impossible to tell which one regressed.

## 3. Keep the skill additive within a major version

```ts
// scripts/check-removed-exports.ts
import { readFile } from "node:fs/promises"

const skill = await readFile("skills/my-lib/SKILL.md", "utf8")
const previous = JSON.parse(await readFile("previous-exports.json", "utf8")) as string[]

for (const symbol of previous) {
  if (!skill.includes(symbol)) {
    console.warn(`${symbol} is described in no skill — a consumer's agent will not know it exists`)
  }
}
```

Warnings, not errors, for coverage gaps; errors only for symbols that no longer exist (see `version-skills-with-releases.md`).

## 4. Test with a real consumer project

```bash
# scratch app, not a monorepo workspace
mkdir /tmp/skill-consumer && cd /tmp/skill-consumer
bun init -y
bun add my-lib
# then install the skills through the Intent tooling and ask the agent
# to add the feature the skill describes
```

The pass condition is concrete: the agent writes a working integration from the skill alone, with no access to your repository. If it needs a detail that lives only in your head, the skill is missing it.

## 5. Verify

1. `npm pack` on the patched version — `skills/` present, `src/` byte-identical to the previous release
2. A consumer installs the new patch — nothing in their build output changes except the added files
3. The consumer's agent completes the three tasks from the skill alone
4. Bump to the next major with a planned skill refresh — the guard warns about exports no skill mentions
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Rewriting an API so the skill reads nicely → the patch becomes a breaking change.
- Writing skills from the changelog rather than from real usage → covers internal refactors users never touch.
- Testing in the package's own monorepo → workspace resolution hides the missing `files` entry.
- Shipping all skills in the first patch → review never finishes; start with two and add on the next release.
- Forgetting that the published package may still be installed by consumers on the previous major → keep the skill's version note explicit.

## Related

- `references/apis.md`
- `best-practices/tanstack-intent.md`
- `usecases/ship-skills-with-package.md`
- `usecases/consume-skills-from-a-dependency.md`
