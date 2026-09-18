# Pr Governance Checklist — review-github-pr

## Codeowners And Reviewers

- [ ] CODEOWNERS file — exists, covers critical paths (`src/`, `infra/`, `migrations/`, auth code)
- [ ] required reviewers — PRs touching owned paths have owner review
- [ ] reviewer assignment — actual humans requested, not just team label
- [ ] review completeness — approvals from required owners before merge
- [ ] self-merge — author can't approve own PR (unless solo-maintainer policy)
- [ ] stale reviews — new commits after approval dismiss stale approvals (per policy)

## Branch Protection

- [ ] required checks — CI/test/lint must pass before merge
- [ ] required reviews — minimum approval count enforced (1-2 typical)
- [ ] conversation resolution — unresolved review threads block merge
- [ ] up-to-date branch — PR must be current with target (rebase/merge)
- [ ] signed commits — required if policy (verify signatures)
- [ ] linear history — squash/rebase enforced per repo convention
- [ ] admin bypass — admins can bypass but it's logged/audited

## Pr Hygiene

- [ ] draft state — draft PRs not merged accidentally
- [ ] WIP markers — `WIP:`/`[WIP]`/`DO NOT MERGE` titles flagged
- [ ] linked issues — PR references issue (`Closes #123`, `Fixes #456`)
- [ ] labels — type (`feat`/`fix`/`docs`), area, priority labeled
- [ ] assignee — responsible person assigned
- [ ] milestone — release version associated if applicable
- [ ] template — PR template filled, not default boilerplate

## Pr Size And Scope

- [ ] size limits — >500 lines changed flagged as oversized (suggest split)
- [ ] file count — >20 files suggests splitting
- [ ] single concern — PR does one thing, not mixed refactor+feature+fix
- [ ] commit count — reasonable (1-20 typical), not 100+ fixup commits
- [ ] scope creep — changes beyond stated purpose flagged
- [ ] atomic commits — each commit buildable/testable (bisect-friendly)

## Merge Strategy

- [ ] strategy match — squash for feature PRs, merge commit for releases, rebase for linear
- [ ] commit message — merge commit follows convention (`type(scope): message`)
- [ ] branch cleanup — source branch deleted after merge
- [ ] protected target — no direct push to `main`/`master` bypassing PR
- [ ] merge queue — high-traffic repos use merge queue (GitHub merge queue)

## Automation And Bots

- [ ] auto-merge — `auto-merge` enabled only after checks pass
- [ ] bot reviews — automated reviewers (dependabot, codecov) configured
- [ ] required bots — security scan, license check, coverage bot run
- [ ] bot permissions — bots have least-privilege tokens, not admin
- [ ] automations don't bypass — bots can't skip human review for sensitive paths

## Compliance And Audit

- [ ] merge log — who merged, when, what checks passed recorded
- [ ] revert path — easy revert documented (`git revert -m 1`)
- [ ] rollback plan — large/risky PRs have rollback procedure
- [ ] approval trail — approvals linked to actual review (not rubber-stamp)
- [ ] post-merge verify — deployment smoke test or monitoring after merge

## Community And External PRs

- [ ] external contributors — CLA/DCO signed if required
- [ ] fork permissions — fork PRs can't access secrets in CI
- [ ] maintainer review — external PRs get maintainer review, not auto-approve
- [ ] spam/abuse — first-time contributor PRs held for review
- [ ] contribution guide — `CONTRIBUTING.md` exists, linked from PR template

## Detection

- `gh pr view --json` — reviewers, labels, mergeable state, checks
- `gh api repos/{owner}/{repo}/branches/{branch}/protection` — protection rules
- `CODEOWNERS` file — exists, covers critical paths
- `gh pr checks` — required checks passing
- `gh pr view --comments` — unresolved conversations

Severity: merging without required review = Critical, bypassing checks = Critical, no CODEOWNERS on sensitive paths = High, oversized PR = Medium, missing labels = Low
