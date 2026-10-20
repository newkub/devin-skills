# Security Audit Practice — Best Practices

Patterns verified against the `cloudflare/security-audit-skill` README and its design principles (MIT).

## 1. Scope Before Hunting

- Start every run by confirming the coverage ledger matches the real deployable surface (entrypoints, bindings, workers, native targets) — hunters assigned to a wrong ledger produce confident blind spots
- Narrow first run (`./src`, one service) beats a shallow repo-wide pass; runs are additive via prior ledgers/findings

## 2. Adversarial Validation Discipline

- The verifier is always a fresh agent told to disprove — never let the finder's narrative be reused as evidence
- Keep blocked-but-plausible leads as `needs_validation` with the exact unresolved fact ("does X require auth in prod config?") instead of dropping them; that question is the cheapest follow-up
- `rejected` records stay in `findings.json` — they prevent the next run from re-hunting the same dead end

## 3. Severity Is Impact

- Rank by likelihood × impact with a demonstrated boundary failure; "not following a checklist" is a hardening note
- Defense-in-depth gaps (layer B missing while layer A blocks the attack) go to notes — inflating them burns reviewer trust in the report

## 4. Sandbox Boundaries

- Anything target-controlled (builds, tests, fixtures, fuzzers, browsers, emulators) runs only in an OS-enforced sandbox: no external network, sanitized allowlisted env, resource limits, writes confined to scratch
- No sandbox available → do not execute; record the lead as `needs_validation` and say so in the report

## 5. Report Hygiene

- Reports derive only from verified records + ledger — no prose claims the JSON can't back; target-neutral wording (no "obviously vulnerable" filler)
- Publish via `/report-review` (chat table) for action; full artifacts live in the run dir, git-ignored — never commit raw findings into the repo
- Route confirmed code fixes → `/deep-review security then-fix` / `/fix`; secrets-class findings → `/check-secrets`

## 6. Make Runs Compound

- Re-run after every fix round; the skill reuses prior ledgers to revalidate changed source and target gaps — track run numbers and diff `findings.json` between runs (`/diff-file-history` style)
- Promote recurring invariant violations into ast-grep rules (`/update-astgrep-rules`) so linters catch them before the next audit
