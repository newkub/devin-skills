# Semgrep Rules Authoring Best Practices

## Recommended Patterns

- Keep custom rules in `.semgrep/` or `semgrep/rules/` in the same repo as the code — versioned with the code, reviewed through PRs
- Every rule needs a test file (`tests/` or `*.test.*` next to the rule) and `semgrep --test` must pass — a pattern without a test is a guessed pattern
- Namespace rule ids, e.g. `org.project.no-direct-fetch` — avoid colliding with registry rules
- Include full metadata: `message`, `severity` (`ERROR`/`WARNING`/`INFO`), `confidence`, `category`, `references` — findings without context are hard to triage
- Use metavariables (`$X`, `$REQ`) instead of literal matching — catch broader patterns without adding false positives
- Use `pattern-either` for variants and `pattern-not`/`pattern-not-inside` to exclude correct cases
- Use `patterns` with `focus-metavariable` when you need to match only a part of a large expression
- Use taint mode (`pattern-sources`/`pattern-sinks`/`pattern-sanitizers`) for injection/dataflow rules — don't write dataflow with pure pattern matching
- Add a `fix:` key only when the rewrite is safe and deterministic — test the autofix on real codebase code before committing

## Common Pitfalls

- Patterns too wide, e.g. `foo(...)` matches every call — use `pattern-not`/`paths.exclude` to limit scope
- Writing a rule without testing it — a wrongly matching rule is discovered later in a production scan
- `severity: ERROR` on every rule — alert fatigue; set severity by real impact
- An autofix that changes semantics (e.g. removing code with a side effect) — autofix must be behavior-preserving
- A single-language rule without a clear `languages:` — matches other files with similar syntax
- A message that doesn't say how to fix — the developer sees the finding and doesn't know what to do; always write a remediation hint in `message`

## Do / Don't

| Do | Don't |
|----|-------|
| Write both positive (must match) and negative (must not match) tests | commit a rule that doesn't pass `semgrep --test` |
| Use taint mode for user-input → dangerous-sink | Stack pattern/regex layers to imitate dataflow |
| Scope the rule with `paths.include`/`paths.exclude` | Run the rule against generated/vendor code |
| Write a `message` that gives the reason and the fix | A short message that only describes the pattern |
| Use `severity` that reflects real risk | Mark everything ERROR |

## Config Guidance

- Basic rule YAML structure:
  ```yaml
  rules:
    - id: org.project.no-eval
      languages: [typescript]
      severity: ERROR
      message: "Never use eval — use JSON.parse or a safer alternative"
      metadata:
        category: security
        confidence: HIGH
      pattern: eval(...)
  ```
- Use one `rules:` array per file, split files by domain (security, style, framework) so they can be selected as rulesets
- Registry rulesets (`p/security-audit`, etc.) are the baseline — custom rules fill what the registry doesn't cover, e.g. internal API misuse
- Commit `.semgrepignore` (or `paths.exclude` in the config) to skip `dist/`, `node_modules/`, snapshots, generated code

## Performance & CI

- Run `semgrep --test` in CI whenever a rule changes — a rule regression must fail the build
- Limit the rule count per scan — many rules + many files = slow scan; split rulesets by CI stage when needed
- Autofix (`--autofix`) should run locally/manually only — never autofix in CI and auto-commit without review
- Taint rules are slower than pattern rules — run them only on relevant paths
