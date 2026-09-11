# review-delivery — Full Dimension Checklist

## 1. Documentation And Presence

- [ ] README ครบ, docs current, getting-started works
- [ ] changelog, upgrade guides, API docs
- [ ] examples/demos รันได้จริง

## 2. Developer Experience

- [ ] setup ≤15 min, clear prerequisites, dev env reproducible
- [ ] error messages actionable, onboarding path smooth
- [ ] CONTRIBUTING, issue/PR templates

## 3. Quality Gates

- [ ] lint/typecheck/test wired ใน CI, coverage thresholds
- [ ] pre-commit hooks (hk/lefthook), commit conventions
- [ ] code review process, branch protection

## 4. Operations

- [ ] monitoring/alerting, runbooks, on-call readiness
- [ ] backup/restore, disaster recovery plan
- [ ] logging strategy, debuggability

## 5. Build And Config

- [ ] reproducible builds, lockfiles, pinned toolchains
- [ ] env config documented, secrets management
- [ ] build caching, incremental builds

## 6. Infrastructure And Pipeline

- [ ] CI/CD: fast, reliable, rollbacks
- [ ] IaC: terraform/pulumi reviewed, drift checked
- [ ] environments: dev/staging/prod parity

## 7. Performance And Security

- [ ] perf budgets enforced, load tested
- [ ] security headers, dependency audits, secrets scanning
- [ ] SLOs defined + measured

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
