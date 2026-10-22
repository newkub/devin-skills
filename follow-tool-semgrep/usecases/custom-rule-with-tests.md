# Use Case — Ship A Project Rule With Its Own Test

> A registry ruleset describes code in general; the rule that stops this project's recurring bug is written here. A rule without a fixture is untested code in YAML, so it either fires on the safe path or on nothing at all. Source: https://semgrep.dev/docs/ (accessed 2026-10-21)

## 1. Write the rule next to the code it governs

```yaml
# .semgrep/rules/no-raw-sql.yml
rules:
  - id: no-raw-sql
    languages: [typescript]
    severity: ERROR
    message: Build the query with the query builder — a template string is injectable.
    pattern: $DB.exec(`...`)
```

`id` is the name the fixture and the report use; `pattern` is the single-expression form (a rule uses either `pattern` or `patterns`, never both).

## 2. Add the fixture with the same basename

```ts
// .semgrep/rules/no-raw-sql.ts

// ruleid: no-raw-sql
db.exec(`SELECT * FROM shops WHERE id = '${id}'`);

// ok: no-raw-sql
db.exec("SELECT * FROM shops WHERE id = ?", id);
```

The `ruleid:`/`ok:` markers are what `--test` reads — one fixture must contain both the failing and the passing shape, or the rule is only half proven.

## 3. Validate and test the rule

```bash
semgrep --validate --config=.semgrep/rules/no-raw-sql.yml
semgrep --test --config=.semgrep/rules/
```

`--validate` catches schema mistakes; `--test` runs every fixture and fails when a `ruleid:` line goes unmatched or an `ok:` line matches.

## 4. Keep the fixture out of ordinary scans

The fixture contains code that must fail the rule, so exclude its path in `.semgrepignore`:

```
.semgrep/rules/*.ts
```

`--test` reads the fixture by name; the scan does not need it in scope.

## 5. Combine with the registry ruleset

```bash
semgrep scan --config=p/security-audit --config=.semgrep src/
```

Local rules and registry rules run in one pass, so the project rule lands in the same report and the same CI gate.

## 6. Verify

1. `semgrep --validate` clean — a malformed rule is a silent no-op otherwise
2. `semgrep --test` reports both the `ruleid` and `ok` lines resolved
3. Deliberately break the fixture (remove the interpolated value) — `--test` must fail, proving the fixture is real
4. The scan flags the true positive in a real file and not the parameterized call beside it
5. The rule is committed with the fixture and wired into the same CI job as the registry rules

## Pitfalls

- Writing `pattern` and `patterns` in one rule — only one of them is honoured.
- A pattern broad enough to match the safe call: the `ok:` fixture is what catches it, so always write both halves.
- The message referencing a metavariable the pattern never binds — the report then shows a literal `$X`.
- Testing only `.ts` while the same code lives in `.tsx`: add the extension to `languages` and to the fixture set.
- Leaving the fixture in scan scope, so every run reports its own test data.
- No `--validate` in CI: a rule change that breaks the schema silently stops matching.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/rules-authoring.md`
- `workflows/config-rules/SKILL.md`
- `usecases/ci-diff-aware-gate.md`
