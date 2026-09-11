# Tool Semgrep Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs | https://semgrep.dev/docs |
| Rule syntax | https://semgrep.dev/docs/writing-rules/rule-syntax |
| Registry | https://semgrep.dev/explore |
| Pattern playground | https://semgrep.dev/playground |
| Rule writing | https://semgrep.dev/docs/writing-rules/overview |
| CI setup | https://semgrep.dev/docs/semgrep-ci/overview |

## Key Concepts

- Pattern syntax: `$X` metavariables, `...` ellipsis, `pattern-either`, `pattern-not`, `metavariable-regex`
- `--config p/<ruleset>` จาก registry หรือ local `.yaml` rules
- `--autofix` ใช้ `fix:` field ใน rule
- เปรียบเทียบ ast-grep (`/use-astgrep-programmatic`): semgrep = multi-language security-focused, ast-grep = เบากว่า per-language
