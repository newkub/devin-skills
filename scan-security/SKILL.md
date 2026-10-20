---
name: scan-security
description: Scan security across dependencies, secrets, code, licenses, and supply chain, then fix and verify
argument-hint: "[scope]"
related:
  - scan-codebase
  - run-audit
  - check-secrets
  - follow-tool-gitleaks
  - follow-tool-semgrep
  - follow-tool-deepsec
  - analyze-attack-surface
  - deep-review-codebase
  - report-review
  - resolve-errors
  - download-program
---

## Goal

Scan a project for security issues across every domain — dependencies, secrets, code (SAST), attack surface, licenses, supply chain, containers/IaC — then triage, fix, and re-verify until clean

## Scope

- Use for a full security pass before release, after adding dependencies, or on demand (`/scan-security [scope]`)
- Scope can be the whole repo, one workspace, or one domain (e.g. `/scan-security deps`, `/scan-security secrets`)
- Report + fix loop; deeper per-domain detail stays in the owner skills listed in the Tools table
- Not a pentest — for an adversarial review use `/analyze-attack-surface` and `/follow-tool-deepsec` as the entry points

## Execute

### 1. Detect Stack And Scope

> Goal: Know what to scan with which tools

1. Run `/scan-codebase` to identify the stack (manifests: `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, lockfiles, `Dockerfile`, IaC files)
2. Build the scan matrix: which domains apply (deps always; containers/IaC only when present)
3. For each tool needed, check availability with `<tool> --version`; if missing → `/download-program` to install (or skip with a stated reason)
4. If the scope is a diff (pre-push/pre-PR) → limit scans to changed files/dependencies where the tool supports it

### 2. Scan Dependencies (SCA)

> Goal: Find known CVEs in direct and transitive dependencies

1. JS/TS: `bun pm audit` or `npm audit` in each workspace
2. Rust: `cargo audit` (advisory DB) and `cargo deny` (advisories + licenses + bans); install via `cargo install cargo-audit cargo-deny` if missing
3. Python: `pip-audit` (or `safety`) against the resolved environment
4. Go: `govulncheck ./...`
5. Language-agnostic sweep: `osv-scanner` (Google OSV DB) over lockfiles — catches ecosystems the above miss
6. Record each finding: package, version, advisory ID, severity, transitive or direct

### 3. Scan Secrets

> Goal: Find leaked credentials in code, history, and config

1. Run `/check-secrets` for the working tree (env vars, hardcoded values)
2. Run gitleaks over git history via `/follow-tool-gitleaks` (`gitleaks detect` — staged, working tree, and history)
3. Confirm `.env*` coverage in `.gitignore` and that secrets live in a secret manager per `/follow-secret-manager`

### 4. Scan Code (SAST)

> Goal: Find vulnerable code patterns, not just vulnerable packages

1. Run `/follow-tool-semgrep` for OWASP-class patterns (injection, XSS, SSRF, unsafe deserialization, path traversal)
2. Run `/follow-tool-deepsec` for the AI-assisted multi-phase security audit when the scope warrants a deep pass
3. Run `/deep-review-codebase` with the security dimension for issues tools cannot see (authz logic, race conditions, trust-boundary mistakes)
4. Grep for common anti-patterns: `eval(`, `child_process` with template strings, `dangerouslySetInnerHTML`, unsanitized user input reaching sinks

### 5. Scan Attack Surface

> Goal: Check what the system actually exposes

1. Run `/analyze-attack-surface` for endpoints, exposed ports, and entry points
2. Verify authn/authz on every external entry point; check error responses leak no internals
3. Check dependency websites/versions against `/follow-web-standard`-level defaults only where relevant (CSP, headers for web apps)

### 6. Scan Licenses And Supply Chain

> Goal: Confirm legal and provenance safety

1. Run `/run-audit` for the license pass (copyleft, incompatible licenses)
2. Verify lockfiles are committed and reproducible; audit scripts (`preinstall`/`postinstall`) and unusual install sources
3. Optionally run OSS Scorecard (`scorecard` CLI) on key dependencies' repos for maintainer-health signals

### 7. Scan Containers And IaC (when present)

> Goal: Cover image and infrastructure risks

1. If `Dockerfile`/compose exists: `trivy image`/`trivy fs` (install via `/download-program` if missing) for image CVEs and misconfig
2. If IaC exists (Terraform, CloudFormation, k8s manifests): checkov or `trivy config` for misconfiguration
3. Check CI/CD workflows (`/follow-tool-github-actions` review) for overly broad permissions and unpinned actions

### 8. Triage And Fix

> Goal: Turn findings into verified fixes, ordered by risk

1. Deduplicate and rank by severity: Critical/High → fix immediately; Medium → next sprint; Low/Info → record
2. Validate every finding is real (false-positive check) before touching code — evidence `file:line` or advisory ID
3. Fix via `/deep-review-codebase security then-fix` (or `/resolve-errors` for build/test breakage introduced by upgrades); never suppress with ignores/allowlists without a written reason

### 9. Re-Scan And Report

> Goal: Prove the fixes and deliver the summary

1. Re-run only the domains that had findings until they are clean
2. Run `/run-check` + `/run-test` to confirm no regression from upgrades/fixes
3. Report via `/report-review` — one chat table: `No.` / `Domain` / `Finding` / `Evidence` / `Severity` / `Fix` / `Status`

## Rules

### Tools Table (domain → tool → owner skill)

| Domain | Primary tools | Owner skill |
|--------|---------------|-------------|
| Dependencies (JS/TS) | `bun pm audit`, `npm audit`, `osv-scanner` | `/run-audit` |
| Dependencies (Rust) | `cargo audit`, `cargo deny`, `osv-scanner` | `/follow-lang-rust` |
| Dependencies (Python) | `pip-audit`, `osv-scanner` | `/follow-lang-python` |
| Dependencies (Go) | `govulncheck`, `osv-scanner` | — |
| Secrets | `gitleaks`, env scan | `/check-secrets`, `/follow-tool-gitleaks` |
| Code (SAST) | `semgrep`, deepsec, review pass | `/follow-tool-semgrep`, `/follow-tool-deepsec` |
| Attack surface | endpoint/port analysis | `/analyze-attack-surface` |
| Licenses | audit of dependency licenses | `/run-audit` |
| Containers/IaC | `trivy`, `checkov` | `/follow-create-docker` |
| CI/CD | workflow permission review | `/follow-tool-github-actions` |

- Run independent domain scans in parallel (subagents via `/use-subagents` for multi-workspace repos)
- A missing tool never blocks the scan — install via `/download-program`, or skip with the reason stated in the report
- Never fix by symptom: every fix maps to a confirmed finding with evidence
- Suppressing a finding (ignore, allowlist) requires a written justification inline — no silent suppression
- This skill orchestrates; per-tool depth lives in the owner skills, do not duplicate their content

## Expected Outcome

- Every applicable security domain scanned with the right tool, findings proven with evidence
- Critical/High findings fixed and re-scanned clean, no regressions (`/run-check`, `/run-test` pass)
- One summary table with severity, fix, and status via `/report-review`
- Missing tools and skipped domains explicitly reported, not silently omitted
