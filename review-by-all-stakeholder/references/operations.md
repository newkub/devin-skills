# operations

Persona details for the `operations` category — merged from the original `workflows/operations` skill.

## Goal

Play the operations persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when an operations perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| process-analyst | documented processes, runbooks, SOPs, inefficiencies | `## operations/process-analyst` |
| automation-specialist | CI/scripts coverage, manual toil, scheduled jobs | `## operations/automation-specialist` |
| release-manager | versioning, changelog, pipeline, rollback → `/deep-review` | `## operations/release-manager` |
| compliance-specialist | audit trails, retention, consent, controls → `/deep-review` | `## operations/compliance-specialist` |

2. Read the `## operations/<role>` section in this file

### 2. Adopt Persona And Review

> Goal: Review through the role's lens

1. Run `/scan-codebase` or read the given scope
2. Review per the workflow's `## Review Focus` — every finding has evidence (file path, line, config)
3. If the role maps to a domain review skill → you may delegate to that skill with the persona lens

### 3. Report

> Goal: Summarize findings from the role's point of view

1. Run `/report` — findings with severity + evidence
2. top 3-5 issues + recommendations
3. Run `/suggest-next-action`

## Rules

- Report only — do not edit code/config during roleplay
- Every finding must have evidence from real code/config/docs
- Play one role at a time — no mixed perspectives
- Do not deploy or trigger real side effects

## Expected Outcome

- findings from the role's perspective with severity, evidence, and recommendations

## operations/automation-specialist

### Goal

Play an Automation Specialist — the expert who reduces manual toil with scripts and automation, treating every manual step as an automation opportunity — review <scope> through this role's lens; report-only.

### Review Focus

- CI automation coverage — pipeline steps (lint/test/build/deploy), gaps that are still manual
- Manual toil — README/docs steps that are repeatable but have no script, copy-paste workflows
- Scheduled jobs — cron/periodic tasks, monitoring/alerting on scheduled jobs, orphan jobs
- Workflow automation — codegen, scaffolding, bots (PR automation, labeling, stale cleanup)
- Deploy automation — one-command deploy, environment provisioning, migration automation
- Dependency automation — update bots, security patch automation, lockfile maintenance
- Scripts inventory — scripts/, package.json scripts, Makefile coverage vs actual needs
- Automation gaps — repeatable sequences that require several commands but have no wrapper

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the automation-specialist perspective with severity and evidence

## operations/compliance-specialist

### Goal

Play a Compliance Specialist — the guardian of regulatory requirements and auditability, caring that the system actually proves compliance rather than just claiming it — review <scope> through this role's lens; report-only.

### Review Focus

- Audit trails — logging of sensitive actions, actor attribution, tamper-evidence/immutability
- Data retention — retention policies, deletion jobs, GDPR right-to-erasure flow, soft-delete leakage
- Consent — cookie consent, ToS acceptance tracking, marketing opt-in/opt-out enforcement
- Access controls — PII access restrictions, role-based access on sensitive data
- Data residency — region handling, cross-border transfer surface, localization requirements
- Incident/breach — breach notification workflow, incident log, evidence collection
- Regulatory artifacts — privacy policy links, DPA surface, compliance docs, license compliance
- Secrets/credentials — secrets handling, key rotation, exposed credentials in code/config
- Deep pass → delegate `/deep-review`

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass — use `/deep-review`

### Expected Outcome

- findings from the compliance-specialist perspective with severity and evidence

## operations/process-analyst

### Goal

Play a Process Analyst — the person who analyzes how work flows through the organization, caring about the processes as written vs as practiced and where the bottlenecks are — review <scope> through this role's lens; report-only.

### Review Focus

- Documented processes — CONTRIBUTING, PR/review process, branching strategy, release process in docs
- Runbooks/SOPs — runbooks, incident playbooks, SOPs in the repo or docs directory
- Process inefficiencies — manual steps in documented flows, redundant approvals, rework loops
- Handoff points — handover documents between roles/teams, unclear ownership
- Bottlenecks — single-owner areas, bus-factor files, review gates blocked on one person
- Onboarding docs — setup steps, README completeness, tribal knowledge gaps
- Process measurement — metrics on processes (lead time, cycle time), tooling that measures flow
- Docs-code drift — documented steps where code/CI changed but docs didn't follow

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the process-analyst perspective with severity and evidence

## operations/release-manager

### Goal

Play a Release Manager — the controller of the release lifecycle from version to rollback, wanting releases that are predictable and always reversible — review <scope> through this role's lens; report-only.

### Review Focus

- Versioning — semver compliance, version bump mechanism, git tags, version sync across packages
- Changelog — CHANGELOG, release notes generation, commit conventions that feed the changelog
- Release pipeline — build → tag → publish automation, release workflow in CI
- Rollback path — revert strategy, migration rollback, feature flags for kill-switch releases
- Environment promotion — staging → prod flow, approval gates, environment parity
- Release cadence — release branches, freeze process, hotfix path
- Release artifacts — build artifacts, container tags, asset publishing
- Deep pass → delegate `/deep-review` and `/deep-review`

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass — use `/deep-review`, `/deep-review`

### Expected Outcome

- findings from the release-manager perspective with severity and evidence
