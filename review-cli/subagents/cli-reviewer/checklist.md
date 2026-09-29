# review-cli — Full Dimension Checklist

ใช้เป็น checklist ครบทุกมิติเมื่อ report — tick ตาม section ใน `SKILL.md`

## 1. Command Structure

- [ ] subcommand nesting, kebab-case, verb-first naming
- [ ] short/long flags, defaults, required args, mutually exclusive flags
- [ ] argument validation + error messages
- [ ] `--help` ทุก command ครบ มี examples
- [ ] shell completions (bash/zsh/fish)

## 2. Input And stdin

- [ ] อ่าน stdin เมื่อไม่มี args / pipe, `-` convention
- [ ] multi-file args, glob expansion, `--` separator
- [ ] EOF/Ctrl+D, ไม่ hang บน TTY
- [ ] input size limits, streaming vs buffering
- [ ] idempotency, `--dry-run` สำหรับ destructive

## 3. Output Contract

- [ ] results → stdout, diagnostics → stderr
- [ ] machine-readable เมื่อ pipe (`--json`, `--format`), ไม่มี ANSI เมื่อ non-TTY/`NO_COLOR`
- [ ] progress/spinner suppressed ใน `CI=true`
- [ ] `--quiet`/`--verbose`/`--debug` consistent
- [ ] ไม่ leak secrets/tokens/absolute paths

## 4. Exit Codes And Errors

- [ ] exit 0 on success, non-zero on fail — ทุก error path
- [ ] semantic exit codes ตาม docs
- [ ] ไม่มี unwrap/expect/panic/uncaught ใน production paths
- [ ] error messages actionable
- [ ] retry, timeout, graceful degradation
- [ ] cleanup on SIGINT/SIGTERM: temp files, locks, terminal state

## 5. Interactive And TUI

- [ ] prompts: confirm/select/input, cancellation, `--yes`/`--force` bypass
- [ ] prompts skipped เมื่อ non-interactive
- [ ] TUI layout, resize, focus, keyboard/mouse
- [ ] `TERM`/`COLORTERM`/`NO_COLOR`/`CI` detection

## 6. Security

- [ ] ไม่มี command injection ผ่าน args
- [ ] path traversal rejected/handled
- [ ] ไม่รับ secrets ผ่าน positional args
- [ ] file perms 0600 สำหรับ secrets
- [ ] ไม่ write นอก user scope โดยไม่เตือน
- [ ] secure temp files + cleanup

## 7. Config And Environment

- [ ] precedence: flags > env > config file > defaults
- [ ] env vars validated + documented
- [ ] config schema validation, `.example` มีให้
- [ ] XDG/platform conventions

## 8. Cross-Platform And Encoding

- [ ] path separators, `~` expansion, spaces, Windows long paths
- [ ] CRLF/LF, Windows signal limits
- [ ] Unicode width (emoji/CJK), non-UTF8, normalization
- [ ] symlinks/junctions, case-sensitivity

## 9. Versioning, Docs And Upgrade

- [ ] `--version` ตรง manifest/tag
- [ ] `--help` parity กับ docs/man pages
- [ ] deprecation warnings + migration guide
- [ ] update mechanism opt-in

## 10. Tests

- [ ] integration tests: invocation, options, exit codes, snapshots
- [ ] `CI=true`/`NO_COLOR=1` paths
- [ ] no over-mocking, isolated from global state

## 11. Build And Distribution

- [ ] binary name, exec permission, size, cross-compile
- [ ] channels: npm/bunx, crates.io, brew, scoop, winget, GitHub Releases
- [ ] checksums, signing, version sync
- [ ] install/upgrade docs

## Scoring

- pass = 1, warning = 0.5, fail = 0 ต่อ check
- dimension score = checks passed / checks applicable × 100
- overall = average ของ dimensions ที่ apply
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
