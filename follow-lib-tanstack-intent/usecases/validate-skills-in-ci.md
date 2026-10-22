# Use Case — Validate Skill Packages Before Publishing

> Catch a broken frontmatter, an absolute path, or a missing entry in the tarball while the failure is still a CI red, not a consumer report. Source: https://tanstack.com/intent/latest (accessed 2026-10-20)

## 1. Validate the files on disk

```ts
// scripts/check-skills.ts
import { readFile } from "node:fs/promises"
import { glob } from "node:fs/promises"

const files = await glob("skills/**/SKILL.md")
const problems: string[] = []

for (const file of files) {
  const raw = await readFile(file, "utf8")
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) { problems.push(`${file}: no frontmatter`); continue }

  const meta = Object.fromEntries(
    match[1].split("\n").map((line) => {
      const [key, ...rest] = line.split(":")
      return [key.trim(), rest.join(":").trim()]
    }),
  )

  if (!meta.name) problems.push(`${file}: name missing`)
  if (!meta.description) problems.push(`${file}: description missing`)
  if (meta.name && !file.includes(`/${meta.name}/`)) {
    problems.push(`${file}: name "${meta.name}" does not match its directory`)
  }
  if (/([A-Za-z]:\\|\/Users\/|\.\.\/\.\.\/)/.test(raw)) {
    problems.push(`${file}: absolute or escaping path in an example`)
  }
}

if (problems.length) {
  console.error(problems.join("\n"))
  process.exit(1)
}
```

## 2. Prove examples use the public entry only

```ts
const imports = [...raw.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1])
for (const spec of imports) {
  const ok = spec === pkg.name || spec.startsWith(`${pkg.name}/`) || spec.startsWith("node:")
  if (!ok) problems.push(`${file}: imports "${spec}" — a skill may only show the published package`)
}
```

A skill that imports `../../src/index` teaches a path consumers do not have. Allowlist the package name plus its documented subpaths.

## 3. Assert the layout the tooling expects

```ts
test("skills follow the published layout", async () => {
  const files = await glob("skills/**/SKILL.md")
  expect(files.length).toBeGreaterThan(0)
  for (const f of files) {
    expect(f).toMatch(/^skills\/[a-z0-9-]+\/SKILL\.md$/)
  }
})
```

If the current Intent release expects a deeper path (a scope or category level), this test is the single place to change — it fails fast when a skill is dropped in the wrong place.

## 4. Assert the tarball, not the source tree

```yaml
- run: bun run scripts/check-skills.ts
- run: bun run build
- run: npm pack
- run: |
    tar -tzf ./*.tgz | grep -q "package/skills/my-lib/SKILL.md" \
      || (echo "skills missing from tarball — check files/.npmignore" && exit 1)
```

`files` in `package.json` is an allow-list and `.npmignore` can still subtract from it; only the tarball listing proves what consumers receive.

## 5. Verify

1. Run the check with a skill missing `description` — exit code 1 with the file path
2. Add a Windows absolute path to an example — the check flags it
3. Rename a skill directory without renaming `name` — the check flags the mismatch
4. Pack and inspect — the skills path is present
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Validating only the source tree → a `.npmignore` entry still strips skills from the tarball.
- Parsing frontmatter with `eval`/`yaml.load` on untrusted input → use a plain field check or a strict YAML parser.
- A validator with no allowlist → it passes anything with two `---` lines, including an empty skill.
- Flagging `../` anywhere in the file → relative links between sibling skills are legitimate; scope the rule to import specifiers and filesystem paths.
- Running the check only on release tags → the same broken skill sits on `main` for a week.

## Related

- `references/apis.md`
- `best-practices/tanstack-intent.md`
- `usecases/ship-skills-with-package.md`
- `usecases/version-skills-with-releases.md`
