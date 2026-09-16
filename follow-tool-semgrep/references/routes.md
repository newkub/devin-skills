# Tool Semgrep Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs | https://docs.semgrep.dev/ |
| Rule syntax | https://docs.semgrep.dev/writing-rules/rule-syntax |
| Registry | https://semgrep.dev/explore |
| Pattern playground | https://semgrep.dev/playground |
| Rule writing | https://docs.semgrep.dev/writing-rules/overview |
| CI setup | https://docs.semgrep.dev/deployment/add-semgrep-to-ci |

## Key Concepts

- Pattern syntax: `$X` metavariables, `...` ellipsis, `pattern-either`, `pattern-not`, `metavariable-regex`
- `--config p/<ruleset>` จาก registry หรือ local `.yaml` rules
- `--autofix` ใช้ `fix:` field ใน rule
- เปรียบเทียบ ast-grep (`/use-astgrep` programmatic subskill): semgrep = multi-language security-focused, ast-grep = เบากว่า per-language
