# Rules

`check-agents-lint` ships 49 rules in six namespaces. Every finding carries `rule`, `severity`, `file`, `line`, `message`, and `fix` — the skill that owns the remediation.

## Severity Levels

| Severity | Meaning | Typical cause |
|----------|---------|---------------|
| `critical` | the package is broken, unsafe, or cannot be loaded | missing frontmatter, invalid JSON, secret, parse failure |
| `warning` | the convention contract is violated but the package still works | section order, orphan reference, placeholder, non-Title-Case heading |
| `info` | hygiene and portability | missing shebang, fence without language, dead external link, stale version pin |

## Namespace Scope

| Namespace | Rules | Checks |
|-----------|-------|--------|
| `struct` | 20 | SKILL.md frontmatter, required sections, table shape, line limits, Execute steps, headings, bold, fences |
| `meta` | 8 | `related` contract, `check-*` allowed-tools, workflow naming and dispatch |
| `graph` | 5 | package file references, relative links, slash references, orphan references, external links |
| `content` | 6 | placeholders, empty sections, machine-specific paths, version pins, workflow dispatch, shebangs |
| `sec` | 6 | credential literals, gitleaks secrets, curl piped to a shell, destructive rm, MCP config JSON, dynamic exec |
| `code` | 4 | Biome lint and format, shellcheck syntax and lint |

## Rule Table

| Rule | Severity | Engine | Proves | Fix owner |
|------|----------|--------|--------|-----------|
| `struct/skill-md-exists` | critical | own | every skill package has SKILL.md | `/update-agents-skills-global` |
| `struct/frontmatter-parse` | critical | own | frontmatter block parses | `/update-agents-skills-global` |
| `struct/frontmatter-required` | critical | own | name and description are present | `/update-agents-skills-global` |
| `struct/name-matches-dir` | critical | own | frontmatter name equals directory | `/update-agents-skills-global` |
| `struct/name-format` | critical | own | name is lowercase kebab-case | `/update-agents-skills-global` |
| `struct/description-length` | warning | own | description is at most 100 characters | `/update-agents-skills-global` |
| `struct/frontmatter-unknown-key` | warning | own | frontmatter keys are known | `/update-agents-skills-global` |
| `struct/frontmatter-argument-hint` | info | own | argument-hint is declared | `/update-agents-skills-global` |
| `struct/frontmatter-related` | warning | own | related list is declared | `/update-references` |
| `struct/table-cells` | critical | own | markdown table rows match the header | `/update-agents-skills-global` |
| `struct/section-required` | critical | own | required H2 sections exist | `/update-agents-skills-global` |
| `struct/section-order` | warning | own | required H2 sections keep canonical order | `/update-agents-skills-global` |
| `struct/heading-unique` | warning | own | heading text is unique per level | `/update-agents-skills-global` |
| `struct/line-limit` | warning | own | SKILL.md is at most 250 lines | `/update-agents-skills-global` |
| `struct/file-line-limit` | warning | own | package files are at most 250 lines | `/update-agents-skills-global` |
| `struct/execute-steps` | warning | own | Execute has at most 10 steps | `/update-agents-skills-global` |
| `struct/execute-step-goal` | warning | own | each Execute step states a Goal line | `/update-agents-skills-global` |
| `struct/bold-outside-code` | warning | own | prose uses no double-asterisk bold | `/update-agents-skills-global` |
| `struct/fence-language` | info | own | code fences declare a language | `/update-agents-skills-global` |
| `struct/heading-title-case` | info | own | multi-word prose H2/H3 headings are Title Case (identifier headings excluded) | `/update-agents-skills-global` |
| `meta/related-exists` | critical | own | related targets are skill packages | `/update-references` |
| `meta/related-self` | warning | own | related does not list the skill itself | `/update-references` |
| `meta/related-duplicate` | warning | own | related has no duplicate targets | `/update-references` |
| `meta/related-max` | warning | own | related has at most 15 targets | `/update-references` |
| `meta/related-mentioned` | warning | own | each related target is mentioned in the body | `/update-references` |
| `meta/check-allowed-tools` | warning | own | check-* declares read-only tools | `/update-agents-skills-global` |
| `meta/workflow-skill-valid` | critical | own | every workflow directory has SKILL.md | `/update-agents-skills-global` |
| `meta/workflow-name-format` | warning | own | workflow name is parent-directory | `/update-agents-skills-global` |
| `graph/reference-file-exists` | critical | own | referenced package files exist | `/update-references` |
| `graph/relative-link-valid` | critical | own | relative markdown links resolve | `/update-references` |
| `graph/slash-ref-resolves` | warning | own | slash references resolve to a skill (URLs, foreign CLI commands, placeholders, historical notes, and wildcards are excluded) | `/update-references` |
| `graph/orphan-reference` | warning | own | reference files are linked from SKILL.md | `/update-references` |
| `graph/external-link-dead` | info | lychee | external links are reachable | `/update-references` |
| `content/no-placeholder` | warning | own | no annotation-style placeholder markers remain (`TODO:`, bare `TBD`/`XXX`, lorem ipsum filler) | `/deep-review` |
| `content/empty-section` | warning | own | no heading is followed by empty content | `/update-agents-skills-global` |
| `content/hardcoded-user-path` | warning | own | no machine-specific home paths | `/check-secrets` |
| `content/stale-version-pin` | info | own | tool versions are not pinned to a full patch version | `/follow-up-to-date` |
| `content/workflow-dispatch` | warning | own | packages with workflows expose a dispatch | `/update-agents-skills-global` |
| `content/script-shebang` | info | own | top-level scripts start with a shebang | `/use-scripts` |
| `sec/obvious-credential` | critical | own | no credential-shaped literals | `/check-secrets` |
| `sec/curl-pipe-bash` | warning | own | no curl pipe to a shell | `/deep-review` |
| `sec/dangerous-rm` | warning | own | no destructive rm on root or home | `/deep-review` |
| `sec/mcp-config-valid` | critical | own | packaged MCP config is valid JSON | `/update-devin-global-mcp` |
| `sec/no-secret` | critical | gitleaks | gitleaks finds no secrets | `/check-secrets` |
| `sec/dynamic-exec` | warning | ast-grep | no eval or new Function | `/deep-review` |
| `code/biome-lint` | critical | biome | biome reports no lint diagnostics | `/run-lint` |
| `code/biome-format` | warning | biome | biome reports no format diagnostics | `/run-format` |
| `code/sh-syntax` | critical | shellcheck | shellcheck reports no errors | `/run-lint` |
| `code/sh-lint` | warning | shellcheck | shellcheck reports no warnings | `/run-lint` |

## Filtering

`--rules` accepts a comma list of exact IDs, namespaces, `namespace/*`, or `*` for everything. A typo fails with exit 2 and up to three near matches, so a bad filter never silently narrows the run.

```bash
bun "check-agents-lint/scripts/check-agents-lint.ts" --rules sec,graph/external-link-dead
bun "check-agents-lint/scripts/check-agents-lint.ts" --rules struct/* --skill refactor
```

## Finding Shape

Text output prints one line per finding followed by a severity summary and an engine status line:

```text
warning  graph/orphan-reference  refactor/SKILL.md:1  references/checklist.md is not linked from SKILL.md  → /update-references
```

JSON output wraps findings in `{version, root, generatedAt, changed, summary, engines, findings}`. Each finding has `rule`, `severity`, `file`, `line`, `message`, and `fix`. SARIF 2.1.0 maps `critical` to `error`, `warning` to `warning`, `info` to `note`, and carries the fix owner in `properties.fixOwner`.

## Baseline Matching

A baseline is a previous JSON report. A finding is suppressed when its `rule`, `file`, and `message` all match a baselined finding; `line` is ignored so edits that shift code do not resurrect accepted debt. Suppressed counts appear in the summary as `baselined`.
