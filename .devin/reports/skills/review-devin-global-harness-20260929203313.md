---
title: review-devin-global-harness
description: Review findings for devin global skills repo
status: pending
created: 2026-09-29T20:33:13.074Z
---

## Goal

รายงานผลการ review devin global skills repo ด้วย /review-devin-global-harness CLI

## Scope

รวม findings, observations, score, grade และสรุปจำนวน issues ตาม category

## Meta

| Metric | Value |
|---|---|
| Total skills | 777 |
| Skills with issues | 92 |
| Total findings | 333 |
| Observations | 48 |
| Score | 34 |
| Grade | F |

## Findings by Severity

| Critical | High | Medium | Low | Info |
|---|---|---|---|---|
| 1 | 208 | 122 | 1 | 1 |

## Findings by Category

| frontmatter | line-count | references | style |
|---|---|---|---|
| 120 | 2 | 208 | 3 |

## Findings

| No. | Skill | Category | Severity | Finding | Evidence | File |
|---|---|---|---|---|---|---|
| 1 | refactor | line-count | Critical | file exceeds 250 lines | lines: 386 | refactor\SKILL.md |
| 2 | review-accessibility | references | High | broken markdown link | link: references/checklist.md | review-accessibility\SKILL.md |
| 3 | review-accessibility | references | High | broken markdown link | link: references/semantics.md | review-accessibility\SKILL.md |
| 4 | review-accessibility | references | High | broken markdown link | link: references/keyboard-focus.md | review-accessibility\SKILL.md |
| 5 | review-accessibility | references | High | broken markdown link | link: references/visual-aria.md | review-accessibility\SKILL.md |
| 6 | review-accessibility | references | High | broken markdown link | link: references/forms-errors.md | review-accessibility\SKILL.md |
| 7 | review-accessibility | references | High | broken markdown link | link: references/media.md | review-accessibility\SKILL.md |
| 8 | review-accessibility | references | High | broken markdown link | link: references/screenreader-cognitive.md | review-accessibility\SKILL.md |
| 9 | review-accessibility | references | High | broken markdown link | link: references/mobile.md | review-accessibility\SKILL.md |
| 10 | review-ai | references | High | broken markdown link | link: references/prompts.md | review-ai\SKILL.md |
| 11 | review-ai | references | High | broken markdown link | link: references/rag.md | review-ai\SKILL.md |
| 12 | review-ai | references | High | broken markdown link | link: references/agents.md | review-ai\SKILL.md |
| 13 | review-ai | references | High | broken markdown link | link: references/guardrails.md | review-ai\SKILL.md |
| 14 | review-ai | references | High | broken markdown link | link: references/cost.md | review-ai\SKILL.md |
| 15 | review-ai | references | High | broken markdown link | link: references/evals.md | review-ai\SKILL.md |
| 16 | review-api | references | High | broken markdown link | link: references/check-api-contract.md | review-api\SKILL.md |
| 17 | review-api | references | High | broken markdown link | link: references/check-api-versioning.md | review-api\SKILL.md |
| 18 | review-api | references | High | broken markdown link | link: references/check-rate-limiting.md | review-api\SKILL.md |
| 19 | review-api | references | High | broken markdown link | link: references/check-webhook.md | review-api\SKILL.md |
| 20 | review-api | references | High | broken markdown link | link: references/check-idempotency.md | review-api\SKILL.md |
| 21 | review-api | references | High | broken markdown link | link: references/check-backward-compatibility.md | review-api\SKILL.md |
| 22 | review-api | references | High | broken markdown link | link: references/checklist.md | review-api\SKILL.md |
| 23 | review-api | references | High | broken markdown link | link: references/contract.md | review-api\SKILL.md |
| 24 | review-api | references | High | broken markdown link | link: references/headers-caching.md | review-api\SKILL.md |
| 25 | review-api | references | High | broken markdown link | link: references/webhooks-realtime.md | review-api\SKILL.md |
| 26 | review-architecture | references | High | broken markdown link | link: references/pattern-clean.md | review-architecture\SKILL.md |
| 27 | review-architecture | references | High | broken markdown link | link: references/pattern-layered.md | review-architecture\SKILL.md |
| 28 | review-architecture | references | High | broken markdown link | link: references/pattern-microservices.md | review-architecture\SKILL.md |
| 29 | review-backend | references | High | broken markdown link | link: references/checklist.md | review-backend\SKILL.md |
| 30 | review-by-stakeholder | references | High | broken markdown link | link: references/checklist.md | review-by-stakeholder\SKILL.md |
| 31 | review-by-stakeholder | references | High | broken markdown link | link: references/select-stakeholders.md | review-by-stakeholder\SKILL.md |
| 32 | review-by-stakeholder | references | High | broken markdown link | link: references/run-stakeholder-reviews.md | review-by-stakeholder\SKILL.md |
| 33 | review-by-stakeholder | references | High | broken markdown link | link: references/aggregate-findings.md | review-by-stakeholder\SKILL.md |
| 34 | review-by-stakeholder | references | High | broken markdown link | link: references/generate-stakeholder-report.md | review-by-stakeholder\SKILL.md |
| 35 | review-cli | references | High | broken markdown link | link: references/checklist.md | review-cli\SKILL.md |
| 36 | review-coverage | references | High | broken markdown link | link: references/checklist.md | review-coverage\SKILL.md |
| 37 | review-desktop-app | references | High | broken markdown link | link: references/window-shell.md | review-desktop-app\SKILL.md |
| 38 | review-desktop-app | references | High | broken markdown link | link: references/ipc-security.md | review-desktop-app\SKILL.md |
| 39 | review-desktop-app | references | High | broken markdown link | link: references/packaging-updates.md | review-desktop-app\SKILL.md |
| 40 | review-desktop-app | references | High | broken markdown link | link: references/lifecycle.md | review-desktop-app\SKILL.md |
| 41 | review-desktop-app | references | High | broken markdown link | link: references/performance.md | review-desktop-app\SKILL.md |
| 42 | review-docs | references | High | broken markdown link | link: references/check-content-outdate.md | review-docs\SKILL.md |
| 43 | review-docs | references | High | broken markdown link | link: references/checklist.md | review-docs\SKILL.md |
| 44 | review-docs | references | High | broken markdown link | link: references/structure.md | review-docs\SKILL.md |
| 45 | review-docs | references | High | broken markdown link | link: references/vitepress-config.md | review-docs\SKILL.md |
| 46 | review-docs | references | High | broken markdown link | link: references/frontmatter.md | review-docs\SKILL.md |
| 47 | review-docs | references | High | broken markdown link | link: references/content-quality.md | review-docs\SKILL.md |
| 48 | review-docs | references | High | broken markdown link | link: references/workspace-links.md | review-docs\SKILL.md |
| 49 | review-docs | references | High | broken markdown link | link: references/readme-scoring.md | review-docs\SKILL.md |
| 50 | review-docs | references | High | broken markdown link | link: references/scoring.md | review-docs\SKILL.md |
| 51 | review-dot-devin | references | High | broken markdown link | link: references/checklist.md | review-dot-devin\SKILL.md |
| 52 | review-dot-devin | references | High | broken markdown link | link: references/rules-checklist.md | review-dot-devin\SKILL.md |
| 53 | review-dot-devin | references | High | broken markdown link | link: references/directories.md | review-dot-devin\SKILL.md |
| 54 | review-dot-devin | references | High | broken markdown link | link: references/hooks.md | review-dot-devin\SKILL.md |
| 55 | review-dot-devin | references | High | broken markdown link | link: references/devin-rules.md | review-dot-devin\SKILL.md |
| 56 | review-dot-devin | references | High | broken markdown link | link: references/ast-grep-rules.md | review-dot-devin\SKILL.md |
| 57 | review-dot-devin | references | High | broken markdown link | link: references/agents-md.md | review-dot-devin\SKILL.md |
| 58 | review-dot-devin | references | High | broken markdown link | link: references/sgconfig.md | review-dot-devin\SKILL.md |
| 59 | review-dot-devin | references | High | broken markdown link | link: references/scoring.md | review-dot-devin\SKILL.md |
| 60 | review-events | references | High | broken markdown link | link: references/patterns.md | review-events\SKILL.md |
| 61 | review-github-pr | references | High | broken markdown link | link: references/fetch-pr-context.md | review-github-pr\SKILL.md |
| 62 | review-github-pr | references | High | broken markdown link | link: references/pr-metadata.md | review-github-pr\SKILL.md |
| 63 | review-github-pr | references | High | broken markdown link | link: references/code-changes.md | review-github-pr\SKILL.md |
| 64 | review-github-pr | references | High | broken markdown link | link: references/validate-findings.md | review-github-pr\SKILL.md |
| 65 | review-github-pr | references | High | broken markdown link | link: references/scoring.md | review-github-pr\SKILL.md |
| 66 | review-github-pr | references | High | broken markdown link | link: references/report-and-recommend.md | review-github-pr\SKILL.md |
| 67 | review-github-pr | references | High | broken markdown link | link: references/checklist.md | review-github-pr\SKILL.md |
| 68 | review-github-pr | references | High | broken markdown link | link: references/fetch-pr-context.md | review-github-pr\SKILL.md |
| 69 | review-github-pr | references | High | broken markdown link | link: references/pr-metadata.md | review-github-pr\SKILL.md |
| 70 | review-github-pr | references | High | broken markdown link | link: references/code-changes.md | review-github-pr\SKILL.md |
| 71 | review-github-pr | references | High | broken markdown link | link: references/governance.md | review-github-pr\SKILL.md |
| 72 | review-github-pr | references | High | broken markdown link | link: references/deep-pr-review.md | review-github-pr\SKILL.md |
| 73 | review-github-pr | references | High | broken markdown link | link: references/scoring.md | review-github-pr\SKILL.md |
| 74 | review-iac | references | High | broken markdown link | link: references/check-infra.md | review-iac\SKILL.md |
| 75 | review-idea | references | High | broken markdown link | link: references/checklist.md | review-idea\SKILL.md |
| 76 | review-migration | references | High | broken markdown link | link: references/migration-checklist.md | review-migration\SKILL.md |
| 77 | review-migration | references | High | broken markdown link | link: references/backward-compat.md | review-migration\SKILL.md |
| 78 | review-migration | references | High | broken markdown link | link: references/data-integrity.md | review-migration\SKILL.md |
| 79 | review-migration | references | High | broken markdown link | link: references/rollback-cutover.md | review-migration\SKILL.md |
| 80 | review-migration | references | High | broken markdown link | link: references/verify-migration-data.md | review-migration\SKILL.md |
| 81 | review-migration | references | High | broken markdown link | link: references/scoring.md | review-migration\SKILL.md |
| 82 | review-observability | references | High | broken markdown link | link: references/checklist.md | review-observability\SKILL.md |
| 83 | review-observability | references | High | broken markdown link | link: references/metrics.md | review-observability\SKILL.md |
| 84 | review-observability | references | High | broken markdown link | link: references/tracing.md | review-observability\SKILL.md |
| 85 | review-observability | references | High | broken markdown link | link: references/logging.md | review-observability\SKILL.md |
| 86 | review-observability | references | High | broken markdown link | link: references/alerting.md | review-observability\SKILL.md |
| 87 | review-observability | references | High | broken markdown link | link: references/dashboards.md | review-observability\SKILL.md |
| 88 | review-observability | references | High | broken markdown link | link: references/slo-sli.md | review-observability\SKILL.md |
| 89 | review-observability | references | High | broken markdown link | link: references/apm.md | review-observability\SKILL.md |
| 90 | review-observability | references | High | broken markdown link | link: references/incident-response.md | review-observability\SKILL.md |
| 91 | review-observability | references | High | broken markdown link | link: references/scoring.md | review-observability\SKILL.md |
| 92 | review-optimize | references | High | broken markdown link | link: references/scope-and-baseline.md | review-optimize\SKILL.md |
| 93 | review-optimize | references | High | broken markdown link | link: references/scan-startup.md | review-optimize\SKILL.md |
| 94 | review-optimize | references | High | broken markdown link | link: references/scan-render.md | review-optimize\SKILL.md |
| 95 | review-optimize | references | High | broken markdown link | link: references/scan-css-layout.md | review-optimize\SKILL.md |
| 96 | review-optimize | references | High | broken markdown link | link: references/scan-memory.md | review-optimize\SKILL.md |
| 97 | review-optimize | references | High | broken markdown link | link: references/scan-streaming.md | review-optimize\SKILL.md |
| 98 | review-optimize | references | High | broken markdown link | link: references/scan-concurrency.md | review-optimize\SKILL.md |
| 99 | review-optimize | references | High | broken markdown link | link: references/scan-polling-ipc.md | review-optimize\SKILL.md |
| 100 | review-optimize | references | High | broken markdown link | link: references/scan-io-persistence.md | review-optimize\SKILL.md |
| 101 | review-optimize | references | High | broken markdown link | link: references/scan-bundle.md | review-optimize\SKILL.md |
| 102 | review-optimize | references | High | broken markdown link | link: references/scan-assets.md | review-optimize\SKILL.md |
| 103 | review-optimize | references | High | broken markdown link | link: references/scan-native-build.md | review-optimize\SKILL.md |
| 104 | review-optimize | references | High | broken markdown link | link: references/prioritize-and-report.md | review-optimize\SKILL.md |
| 105 | review-optimize | references | High | broken markdown link | link: references/verify-and-measure.md | review-optimize\SKILL.md |
| 106 | review-optimize | references | High | broken markdown link | link: references/patterns.md | review-optimize\SKILL.md |
| 107 | review-optimize | references | High | broken markdown link | link: references/checklist.md | review-optimize\SKILL.md |
| 108 | review-plan | references | High | broken markdown link | link: references/prepare-context.md | review-plan\SKILL.md |
| 109 | review-plan | references | High | broken markdown link | link: references/risk-assessment.md | review-plan\SKILL.md |
| 110 | review-plan | references | High | broken markdown link | link: references/dependency-mapping.md | review-plan\SKILL.md |
| 111 | review-plan | references | High | broken markdown link | link: references/alternatives.md | review-plan\SKILL.md |
| 112 | review-plan | references | High | broken markdown link | link: references/feasibility.md | review-plan\SKILL.md |
| 113 | review-plan | references | High | broken markdown link | link: references/scope-acceptance.md | review-plan\SKILL.md |
| 114 | review-plan | references | High | broken markdown link | link: references/scoring.md | review-plan\SKILL.md |
| 115 | review-plan | references | High | broken markdown link | link: references/plan-quality-score.md | review-plan\SKILL.md |
| 116 | review-plan | references | High | broken markdown link | link: references/checklist.md | review-plan\SKILL.md |
| 117 | review-plan | references | High | broken markdown link | link: references/risk-assessment.md | review-plan\SKILL.md |
| 118 | review-plan | references | High | broken markdown link | link: references/dependency-mapping.md | review-plan\SKILL.md |
| 119 | review-plan | references | High | broken markdown link | link: references/alternatives.md | review-plan\SKILL.md |
| 120 | review-plan | references | High | broken markdown link | link: references/feasibility.md | review-plan\SKILL.md |
| 121 | review-plan | references | High | broken markdown link | link: references/scope-acceptance.md | review-plan\SKILL.md |
| 122 | review-plan | references | High | broken markdown link | link: references/scoring.md | review-plan\SKILL.md |
| 123 | review-release | references | High | broken markdown link | link: references/check-release-drift.md | review-release\SKILL.md |
| 124 | review-release | references | High | broken markdown link | link: references/check-release-notes.md | review-release\SKILL.md |
| 125 | review-release | references | High | broken markdown link | link: references/checklist.md | review-release\SKILL.md |
| 126 | review-release | references | High | broken markdown link | link: references/version-semver.md | review-release\SKILL.md |
| 127 | review-release | references | High | broken markdown link | link: references/changelog.md | review-release\SKILL.md |
| 128 | review-release | references | High | broken markdown link | link: references/breaking-changes.md | review-release\SKILL.md |
| 129 | review-release | references | High | broken markdown link | link: references/platform-targets.md | review-release\SKILL.md |
| 130 | review-release | references | High | broken markdown link | link: references/deploy-env-secrets.md | review-release\SKILL.md |
| 131 | review-release | references | High | broken markdown link | link: references/deploy-build-artifacts.md | review-release\SKILL.md |
| 132 | review-release | references | High | broken markdown link | link: references/deploy-health-rollback.md | review-release\SKILL.md |
| 133 | review-release | references | High | broken markdown link | link: references/deploy-zero-downtime.md | review-release\SKILL.md |
| 134 | review-release | references | High | broken markdown link | link: references/deploy-verify.md | review-release\SKILL.md |
| 135 | review-release | references | High | broken markdown link | link: references/scoring.md | review-release\SKILL.md |
| 136 | review-sdk | references | High | broken markdown link | link: references/exports.md | review-sdk\SKILL.md |
| 137 | review-sdk | references | High | broken markdown link | link: references/packaging.md | review-sdk\SKILL.md |
| 138 | review-sdk | references | High | broken markdown link | link: references/semver.md | review-sdk\SKILL.md |
| 139 | review-sdk | references | High | broken markdown link | link: references/types-dx.md | review-sdk\SKILL.md |
| 140 | review-stability | references | High | broken markdown link | link: references/checklist.md | review-stability\SKILL.md |
| 141 | review-stability | references | High | broken markdown link | link: references/app-stability.md | review-stability\SKILL.md |
| 142 | review-stability | references | High | broken markdown link | link: references/error-handling.md | review-stability\SKILL.md |
| 143 | review-stability | references | High | broken markdown link | link: references/debuggability.md | review-stability\SKILL.md |
| 144 | review-stability | references | High | broken markdown link | link: references/recovery.md | review-stability\SKILL.md |
| 145 | review-stability | references | High | broken markdown link | link: references/error-patterns.md | review-stability\SKILL.md |
| 146 | review-stability | references | High | broken markdown link | link: references/degradation.md | review-stability\SKILL.md |
| 147 | review-stability | references | High | broken markdown link | link: references/scoring.md | review-stability\SKILL.md |
| 148 | review-techstack | references | High | broken markdown link | link: references/checklist.md | review-techstack\SKILL.md |
| 149 | review-techstack | references | High | broken markdown link | link: references/choosing.md | review-techstack\SKILL.md |
| 150 | review-techstack | references | High | broken markdown link | link: references/cloud-selection.md | review-techstack\SKILL.md |
| 151 | review-techstack | references | High | broken markdown link | link: references/techstack.md | review-techstack\SKILL.md |
| 152 | review-techstack | references | High | broken markdown link | link: references/dependencies.md | review-techstack\SKILL.md |
| 153 | review-techstack | references | High | broken markdown link | link: references/lib-design.md | review-techstack\SKILL.md |
| 154 | review-techstack | references | High | broken markdown link | link: references/type-declarations.md | review-techstack\SKILL.md |
| 155 | review-test | references | High | broken markdown link | link: references/check-flaky-tests.md | review-test\SKILL.md |
| 156 | review-test | references | High | broken markdown link | link: references/check-test-isolation.md | review-test\SKILL.md |
| 157 | review-test | references | High | broken markdown link | link: references/check-test-quality.md | review-test\SKILL.md |
| 158 | review-test | references | High | broken markdown link | link: references/check-coverage-config.md | review-test\SKILL.md |
| 159 | review-test | references | High | broken markdown link | link: references/check-types-coverage.md | review-test\SKILL.md |
| 160 | review-test | references | High | broken markdown link | link: references/check-error-coverage.md | review-test\SKILL.md |
| 161 | review-test | references | High | broken markdown link | link: references/checklist.md | review-test\SKILL.md |
| 162 | review-test | references | High | broken markdown link | link: references/coverage-gaps.md | review-test\SKILL.md |
| 163 | review-test | references | High | broken markdown link | link: references/edge-cases.md | review-test\SKILL.md |
| 164 | review-test | references | High | broken markdown link | link: references/test-isolation.md | review-test\SKILL.md |
| 165 | review-test | references | High | broken markdown link | link: references/test-pyramid.md | review-test\SKILL.md |
| 166 | review-test | references | High | broken markdown link | link: references/regression-coverage.md | review-test\SKILL.md |
| 167 | review-test | references | High | broken markdown link | link: references/analyze-coverage-flaky.md | review-test\SKILL.md |
| 168 | review-test | references | High | broken markdown link | link: references/test-quality-score.md | review-test\SKILL.md |
| 169 | review-uxui | references | High | broken markdown link | link: references/checklist.md | review-uxui\SKILL.md |
| 170 | review-uxui | references | High | broken markdown link | link: references/design-system.md | review-uxui\SKILL.md |
| 171 | review-uxui | references | High | broken markdown link | link: references/visual-design.md | review-uxui\SKILL.md |
| 172 | review-uxui | references | High | broken markdown link | link: references/interaction-design.md | review-uxui\SKILL.md |
| 173 | review-uxui | references | High | broken markdown link | link: references/accessibility.md | review-uxui\SKILL.md |
| 174 | review-uxui | references | High | broken markdown link | link: references/settings.md | review-uxui\SKILL.md |
| 175 | review-uxui | references | High | broken markdown link | link: references/motion.md | review-uxui\SKILL.md |
| 176 | review-uxui | references | High | broken markdown link | link: references/handoff.md | review-uxui\SKILL.md |
| 177 | review-uxui | references | High | broken markdown link | link: references/user-flow.md | review-uxui\SKILL.md |
| 178 | review-uxui | references | High | broken markdown link | link: references/scoring.md | review-uxui\SKILL.md |
| 179 | review-workflow | references | High | broken markdown link | link: references/read-flow.md | review-workflow\SKILL.md |
| 180 | review-workflow | references | High | broken markdown link | link: references/check-speed.md | review-workflow\SKILL.md |
| 181 | review-workflow | references | High | broken markdown link | link: references/check-safety.md | review-workflow\SKILL.md |
| 182 | review-workflow | references | High | broken markdown link | link: references/check-usability.md | review-workflow\SKILL.md |
| 183 | review-workflow | references | High | broken markdown link | link: references/check-efficiency.md | review-workflow\SKILL.md |
| 184 | review-workflow | references | High | broken markdown link | link: references/remove-redundancy.md | review-workflow\SKILL.md |
| 185 | review-workflow | references | High | broken markdown link | link: references/report.md | review-workflow\SKILL.md |
| 186 | review-workflow | references | High | broken markdown link | link: references/validate.md | review-workflow\SKILL.md |
| 187 | review-workflow | references | High | broken markdown link | link: references/scoring.md | review-workflow\SKILL.md |
| 188 | review-workflow | references | High | broken markdown link | link: references/checklist.md | review-workflow\SKILL.md |
| 189 | review-workflow | references | High | broken markdown link | link: references/read-flow.md | review-workflow\SKILL.md |
| 190 | review-workflow | references | High | broken markdown link | link: references/check-speed.md | review-workflow\SKILL.md |
| 191 | review-workflow | references | High | broken markdown link | link: references/check-safety.md | review-workflow\SKILL.md |
| 192 | review-workflow | references | High | broken markdown link | link: references/check-usability.md | review-workflow\SKILL.md |
| 193 | review-workflow | references | High | broken markdown link | link: references/check-efficiency.md | review-workflow\SKILL.md |
| 194 | review-workflow | references | High | broken markdown link | link: references/remove-redundancy.md | review-workflow\SKILL.md |
| 195 | review-workflow | references | High | broken markdown link | link: references/scoring.md | review-workflow\SKILL.md |
| 196 | review-workspace | references | High | broken markdown link | link: references/checklist.md | review-workspace\SKILL.md |
| 197 | review-workspace | references | High | broken markdown link | link: references/identify-workspace.md | review-workspace\SKILL.md |
| 198 | review-workspace | references | High | broken markdown link | link: references/analyze-manifest.md | review-workspace\SKILL.md |
| 199 | review-workspace | references | High | broken markdown link | link: references/review-structure.md | review-workspace\SKILL.md |
| 200 | review-workspace | references | High | broken markdown link | link: references/review-dependencies.md | review-workspace\SKILL.md |
| 201 | review-workspace | references | High | broken markdown link | link: references/review-config-consistency.md | review-workspace\SKILL.md |
| 202 | review-workspace | references | High | broken markdown link | link: references/run-checks.md | review-workspace\SKILL.md |
| 203 | review-workspace | references | High | broken markdown link | link: references/scoring.md | review-workspace\SKILL.md |
| 204 | review-writing | references | High | broken markdown link | link: references/checklist.md | review-writing\SKILL.md |
| 205 | review-writing | references | High | broken markdown link | link: references/writing-quality.md | review-writing\SKILL.md |
| 206 | review-writing | references | High | broken markdown link | link: references/content-quality.md | review-writing\SKILL.md |
| 207 | review-writing | references | High | broken markdown link | link: references/naming.md | review-writing\SKILL.md |
| 208 | review-writing | references | High | broken markdown link | link: references/discoverability.md | review-writing\SKILL.md |
| 209 | review-writing | references | High | broken markdown link | link: references/scoring.md | review-writing\SKILL.md |
| 210 | all-files | frontmatter | Medium | orphan related reference | related: refactor-all-files-in-workspace not mentioned in body | all-files\SKILL.md |
| 211 | all-workspace | frontmatter | Medium | orphan related reference | related: refactor-all-workspace not mentioned in body | all-workspace\SKILL.md |
| 212 | check-dts | frontmatter | Medium | orphan related reference | related: run-typecheck not mentioned in body | check-dts\SKILL.md |
| 213 | check-dts | frontmatter | Medium | orphan related reference | related: check-config-drift not mentioned in body | check-dts\SKILL.md |
| 214 | check-dts | frontmatter | Medium | orphan related reference | related: follow-lang-typescript not mentioned in body | check-dts\SKILL.md |
| 215 | check-dts | frontmatter | Medium | orphan related reference | related: review-config not mentioned in body | check-dts\SKILL.md |
| 216 | check-my-global-cli | frontmatter | Medium | orphan related reference | related: search-skills not mentioned in body | check-my-global-cli\SKILL.md |
| 217 | deep-validate | frontmatter | Medium | orphan related reference | related: run-verify not mentioned in body | deep-validate\SKILL.md |
| 218 | delete-project-temp | frontmatter | Medium | orphan related reference | related: cleanup not mentioned in body | delete-project-temp\SKILL.md |
| 219 | delete-project-temp | frontmatter | Medium | orphan related reference | related: cleanup-artifact not mentioned in body | delete-project-temp\SKILL.md |
| 220 | edit-video-by-remotion | frontmatter | Medium | orphan related reference | related: run-build not mentioned in body | edit-video-by-remotion\SKILL.md |
| 221 | follow-lib-unocss | frontmatter | Medium | orphan related reference | related: follow-design-system not mentioned in body | follow-lib-unocss\SKILL.md |
| 222 | follow-my-techstack | frontmatter | Medium | orphan related reference | related: review-dependencies not mentioned in body | follow-my-techstack\SKILL.md |
| 223 | follow-test | frontmatter | Medium | orphan related reference | related: review-test not mentioned in body | follow-test\SKILL.md |
| 224 | follow-tool-github-actions | frontmatter | Medium | orphan related reference | related: follow-tool-lighthouse not mentioned in body | follow-tool-github-actions\SKILL.md |
| 225 | follow-tool-lighthouse | frontmatter | Medium | orphan related reference | related: review-accessibility not mentioned in body | follow-tool-lighthouse\SKILL.md |
| 226 | follow-tool-lighthouse | frontmatter | Medium | orphan related reference | related: review-seo not mentioned in body | follow-tool-lighthouse\SKILL.md |
| 227 | follow-tool-lighthouse | frontmatter | Medium | orphan related reference | related: check-bottlenecks not mentioned in body | follow-tool-lighthouse\SKILL.md |
| 228 | follow-tool-stryker-mutator | frontmatter | Medium | orphan related reference | related: review-test not mentioned in body | follow-tool-stryker-mutator\SKILL.md |
| 229 | follow-tool-vitest | frontmatter | Medium | orphan related reference | related: review-test not mentioned in body | follow-tool-vitest\SKILL.md |
| 230 | git-amend | frontmatter | Medium | orphan related reference | related: git-commit not mentioned in body | git-amend\SKILL.md |
| 231 | git-amend | frontmatter | Medium | orphan related reference | related: git-push not mentioned in body | git-amend\SKILL.md |
| 232 | git-amend | frontmatter | Medium | orphan related reference | related: check-git-logs not mentioned in body | git-amend\SKILL.md |
| 233 | git-bisect | frontmatter | Medium | orphan related reference | related: check-git-logs not mentioned in body | git-bisect\SKILL.md |
| 234 | git-bisect | frontmatter | Medium | orphan related reference | related: git-file-history not mentioned in body | git-bisect\SKILL.md |
| 235 | git-bisect | frontmatter | Medium | orphan related reference | related: run-test not mentioned in body | git-bisect\SKILL.md |
| 236 | git-bisect | frontmatter | Medium | orphan related reference | related: resolve-errors not mentioned in body | git-bisect\SKILL.md |
| 237 | git-branch | frontmatter | Medium | orphan related reference | related: git-commit not mentioned in body | git-branch\SKILL.md |
| 238 | git-branch | frontmatter | Medium | orphan related reference | related: git-push not mentioned in body | git-branch\SKILL.md |
| 239 | git-cherry-pick | frontmatter | Medium | orphan related reference | related: git-commit not mentioned in body | git-cherry-pick\SKILL.md |
| 240 | git-cherry-pick | frontmatter | Medium | orphan related reference | related: check-merge-conflicts not mentioned in body | git-cherry-pick\SKILL.md |
| 241 | git-clean | frontmatter | Medium | orphan related reference | related: check-uncommit not mentioned in body | git-clean\SKILL.md |
| 242 | git-rebase | frontmatter | Medium | orphan related reference | related: git-commit not mentioned in body | git-rebase\SKILL.md |
| 243 | git-rebase | frontmatter | Medium | orphan related reference | related: git-push not mentioned in body | git-rebase\SKILL.md |
| 244 | git-rebase | frontmatter | Medium | orphan related reference | related: check-git-logs not mentioned in body | git-rebase\SKILL.md |
| 245 | git-reset | frontmatter | Medium | orphan related reference | related: check-git-logs not mentioned in body | git-reset\SKILL.md |
| 246 | git-reset | frontmatter | Medium | orphan related reference | related: resolve-errors not mentioned in body | git-reset\SKILL.md |
| 247 | git-reset | style | Medium | uses bold markers ** | \| `--hard` \| ย้าย \| reset \| reset \| ลบทุกอย่างกลับไป ref — **destructive** \| | git-reset\SKILL.md |
| 248 | git-restore | frontmatter | Medium | orphan related reference | related: check-git-logs not mentioned in body | git-restore\SKILL.md |
| 249 | git-restore | frontmatter | Medium | orphan related reference | related: git-file-history not mentioned in body | git-restore\SKILL.md |
| 250 | git-restore | frontmatter | Medium | orphan related reference | related: ask-me not mentioned in body | git-restore\SKILL.md |
| 251 | git-restore | frontmatter | Medium | orphan related reference | related: resolve-errors not mentioned in body | git-restore\SKILL.md |
| 252 | git-revert | frontmatter | Medium | orphan related reference | related: git-commit not mentioned in body | git-revert\SKILL.md |
| 253 | git-revert | frontmatter | Medium | orphan related reference | related: git-push not mentioned in body | git-revert\SKILL.md |
| 254 | git-revert | frontmatter | Medium | orphan related reference | related: git-file-history not mentioned in body | git-revert\SKILL.md |
| 255 | git-revert | frontmatter | Medium | orphan related reference | related: check-merge-conflicts not mentioned in body | git-revert\SKILL.md |
| 256 | git-stash | frontmatter | Medium | orphan related reference | related: git-commit not mentioned in body | git-stash\SKILL.md |
| 257 | git-stash | frontmatter | Medium | orphan related reference | related: check-uncommit not mentioned in body | git-stash\SKILL.md |
| 258 | git-submodule | frontmatter | Medium | orphan related reference | related: git-push not mentioned in body | git-submodule\SKILL.md |
| 259 | git-submodule | frontmatter | Medium | orphan related reference | related: git-commit not mentioned in body | git-submodule\SKILL.md |
| 260 | git-sync | frontmatter | Medium | orphan related reference | related: git-branch not mentioned in body | git-sync\SKILL.md |
| 261 | git-sync | frontmatter | Medium | orphan related reference | related: check-uncommit not mentioned in body | git-sync\SKILL.md |
| 262 | git-tag | frontmatter | Medium | orphan related reference | related: git-push not mentioned in body | git-tag\SKILL.md |
| 263 | git-tag | frontmatter | Medium | orphan related reference | related: git-commit not mentioned in body | git-tag\SKILL.md |
| 264 | git-tag | frontmatter | Medium | orphan related reference | related: report not mentioned in body | git-tag\SKILL.md |
| 265 | git-worktree | frontmatter | Medium | orphan related reference | related: git-branch not mentioned in body | git-worktree\SKILL.md |
| 266 | idea-convert-devin-skills-to-mcp | frontmatter | Medium | orphan related reference | related: idea-convert-my-global-cli-to-skills not mentioned in body | idea-convert-devin-skills-to-mcp\SKILL.md |
| 267 | idea-convert-devin-skills-to-mcp | frontmatter | Medium | orphan related reference | related: update-devin-global-skills not mentioned in body | idea-convert-devin-skills-to-mcp\SKILL.md |
| 268 | idea-new-devin-global-skills | frontmatter | Medium | orphan related reference | related: idea-use-skills-relations not mentioned in body | idea-new-devin-global-skills\SKILL.md |
| 269 | idea-use-skills-relations | frontmatter | Medium | orphan related reference | related: read-related not mentioned in body | idea-use-skills-relations\SKILL.md |
| 270 | implement-to-production | frontmatter | Medium | related exceeds 15 skills | count: 18 | implement-to-production\SKILL.md |
| 271 | improve | frontmatter | Medium | orphan related reference | related: simplify not mentioned in body | improve\SKILL.md |
| 272 | learn-from-dts | frontmatter | Medium | orphan related reference | related: use-lib-effective not mentioned in body | learn-from-dts\SKILL.md |
| 273 | loop-until-complete | frontmatter | Medium | orphan related reference | related: review-test not mentioned in body | loop-until-complete\SKILL.md |
| 274 | no-hard-code | frontmatter | Medium | orphan related reference | related: refactor-to-packages-shared not mentioned in body | no-hard-code\SKILL.md |
| 275 | no-use-ignore | frontmatter | Medium | orphan related reference | related: refactor not mentioned in body | no-use-ignore\SKILL.md |
| 276 | no-use-ignore | frontmatter | Medium | orphan related reference | related: no-hard-code not mentioned in body | no-use-ignore\SKILL.md |
| 277 | read-related | frontmatter | Medium | orphan related reference | related: idea-use-skills-relations not mentioned in body | read-related\SKILL.md |
| 278 | refactor | frontmatter | Medium | related exceeds 15 skills | count: 37 | refactor\SKILL.md |
| 279 | refactor | frontmatter | Medium | orphan related reference | related: refactor-skills not mentioned in body | refactor\SKILL.md |
| 280 | refactor | style | Medium | uses bold markers ** | Smell rules: เลือก technique ที่แก้ **cause** ของ smell ไม่ใช่ mask symptom; ทีละ technique เดียว → verify green → commit checkpoint; smell ที่เป็น emergent (architecture-level) → `/review-architecture` ไม่ใช่ file refactor | refactor\SKILL.md |
| 281 | refactor-all-files-in-workspace | frontmatter | Medium | orphan related reference | related: all-files not mentioned in body | refactor-all-files-in-workspace\SKILL.md |
| 282 | refactor-all-workspace | frontmatter | Medium | orphan related reference | related: all-workspace not mentioned in body | refactor-all-workspace\SKILL.md |
| 283 | refactor-all-workspace | frontmatter | Medium | orphan related reference | related: follow-monorepo not mentioned in body | refactor-all-workspace\SKILL.md |
| 284 | refactor-to-packages-shared | frontmatter | Medium | orphan related reference | related: follow-reusable not mentioned in body | refactor-to-packages-shared\SKILL.md |
| 285 | refactor-to-packages-shared | frontmatter | Medium | orphan related reference | related: report-before-after not mentioned in body | refactor-to-packages-shared\SKILL.md |
| 286 | refactor-to-srp | frontmatter | Medium | orphan related reference | related: follow-single-responsibility not mentioned in body | refactor-to-srp\SKILL.md |
| 287 | refactor-workspace | frontmatter | Medium | orphan related reference | related: refactor-all-workspace not mentioned in body | refactor-workspace\SKILL.md |
| 288 | refactor-workspace | frontmatter | Medium | orphan related reference | related: refactor-to-packages-shared not mentioned in body | refactor-workspace\SKILL.md |
| 289 | resolve-all-github-actions-fails | frontmatter | Medium | orphan related reference | related: resolve-errors not mentioned in body | resolve-all-github-actions-fails\SKILL.md |
| 290 | review-accessibility | frontmatter | Medium | orphan related reference | related: follow-tool-lighthouse not mentioned in body | review-accessibility\SKILL.md |
| 291 | review-architecture | frontmatter | Medium | orphan related reference | related: deep-analyze not mentioned in body | review-architecture\SKILL.md |
| 292 | review-auth | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-auth\SKILL.md |
| 293 | review-browser-ext | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-browser-ext\SKILL.md |
| 294 | review-bundle | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-bundle\SKILL.md |
| 295 | review-bundle | frontmatter | Medium | orphan related reference | related: report-bundle not mentioned in body | review-bundle\SKILL.md |
| 296 | review-bundle | frontmatter | Medium | orphan related reference | related: review-security not mentioned in body | review-bundle\SKILL.md |
| 297 | review-bundle | frontmatter | Medium | orphan related reference | related: use-pwsh-shell not mentioned in body | review-bundle\SKILL.md |
| 298 | review-bundle | frontmatter | Medium | orphan related reference | related: search not mentioned in body | review-bundle\SKILL.md |
| 299 | review-bundle | frontmatter | Medium | orphan related reference | related: run-profiler not mentioned in body | review-bundle\SKILL.md |
| 300 | review-config | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-config\SKILL.md |
| 301 | review-delivery | frontmatter | Medium | related exceeds 15 skills | count: 16 | review-delivery\SKILL.md |
| 302 | review-delivery | frontmatter | Medium | orphan related reference | related: check-repo-hygiene not mentioned in body | review-delivery\SKILL.md |
| 303 | review-delivery | frontmatter | Medium | orphan related reference | related: follow-tool-crw not mentioned in body | review-delivery\SKILL.md |
| 304 | review-devin-global-harness | frontmatter | Medium | orphan related reference | related: search-skills not mentioned in body | review-devin-global-harness\SKILL.md |
| 305 | review-frontend | frontmatter | Medium | orphan related reference | related: follow-tool-lighthouse not mentioned in body | review-frontend\SKILL.md |
| 306 | review-iac | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-iac\SKILL.md |
| 307 | review-migration | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-migration\SKILL.md |
| 308 | review-performance | frontmatter | Medium | orphan related reference | related: follow-tool-lighthouse not mentioned in body | review-performance\SKILL.md |
| 309 | review-performance | frontmatter | Medium | orphan related reference | related: review-code-quality not mentioned in body | review-performance\SKILL.md |
| 310 | review-performance | frontmatter | Medium | orphan related reference | related: deep-validate not mentioned in body | review-performance\SKILL.md |
| 311 | review-performance | frontmatter | Medium | orphan related reference | related: use-astgrep not mentioned in body | review-performance\SKILL.md |
| 312 | review-performance | frontmatter | Medium | orphan related reference | related: review-dependencies not mentioned in body | review-performance\SKILL.md |
| 313 | review-sdk | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-sdk\SKILL.md |
| 314 | review-security | frontmatter | Medium | orphan related reference | related: open-web-for-config-secret not mentioned in body | review-security\SKILL.md |
| 315 | review-security | frontmatter | Medium | orphan related reference | related: search not mentioned in body | review-security\SKILL.md |
| 316 | review-seo | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-seo\SKILL.md |
| 317 | review-test | frontmatter | Medium | related exceeds 15 skills | count: 16 | review-test\SKILL.md |
| 318 | review-uxui | frontmatter | Medium | related exceeds 15 skills | count: 16 | review-uxui\SKILL.md |
| 319 | review-uxui | frontmatter | Medium | orphan related reference | related: deep-review-then-fix not mentioned in body | review-uxui\SKILL.md |
| 320 | run-test-api | frontmatter | Medium | orphan related reference | related: follow-tool-hurl not mentioned in body | run-test-api\SKILL.md |
| 321 | run-test-api | frontmatter | Medium | orphan related reference | related: follow-tool-bruno not mentioned in body | run-test-api\SKILL.md |
| 322 | run-test-e2e | frontmatter | Medium | orphan related reference | related: follow-tool-playwright not mentioned in body | run-test-e2e\SKILL.md |
| 323 | run-test-visual | frontmatter | Medium | orphan related reference | related: follow-tool-playwright not mentioned in body | run-test-visual\SKILL.md |
| 324 | simplify | frontmatter | Medium | orphan related reference | related: improve not mentioned in body | simplify\SKILL.md |
| 325 | simplify | frontmatter | Medium | orphan related reference | related: deep-validate not mentioned in body | simplify\SKILL.md |
| 326 | update-config | frontmatter | Medium | orphan related reference | related: refactor-to-packages-shared not mentioned in body | update-config\SKILL.md |
| 327 | update-devin-global-skills | frontmatter | Medium | related exceeds 15 skills | count: 16 | update-devin-global-skills\SKILL.md |
| 328 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: idea-use-skills-relations not mentioned in body | update-devin-global-skills\SKILL.md |
| 329 | update-project | frontmatter | Medium | orphan related reference | related: keepup-source-code not mentioned in body | update-project\SKILL.md |
| 330 | update-version-to-latest | frontmatter | Medium | orphan related reference | related: keepup-source-code not mentioned in body | update-version-to-latest\SKILL.md |
| 331 | use-related-skills | frontmatter | Medium | orphan related reference | related: idea-use-skills-relations not mentioned in body | use-related-skills\SKILL.md |
| 332 | update-devin-global-skills | line-count | Low | file exceeds 250 lines | lines: 252 | update-devin-global-skills\SKILL.md |
| 333 | simplify | style | Info | global skill appears all-English (should be Thai) | thai chars: 0, latin words: 227 | simplify\SKILL.md |

## Observations

1. [Info/content] contains TODO/MOCK/placeholder mention — - Todo ต้องเป็นตาราง `Action | Files | Dependencies | Workspace` (update-github-issue)
2. [Info/content] contains TODO/MOCK/placeholder mention — - TODO: สิ่งที่ต้องทำในอนาคต (report-scan-todo)
3. [Info/content] contains TODO/MOCK/placeholder mention — - Todo list อัปเดตและชัดเจน (manage)
4. [Info/content] contains TODO/MOCK/placeholder mention — - Mock server ทำงานได้ (follow-tool-scalar)
5. [Info/content] contains TODO/MOCK/placeholder mention — - Mock External Dependencies: Mock services, databases, APIs (follow-test)
6. [Info/content] contains TODO/MOCK/placeholder mention — - Mock event bus dependencies (follow-event-driven)
7. [Info/content] contains TODO/MOCK/placeholder mention — - Mock `external state` (follow-deterministic)
8. [Info/content] contains TODO/MOCK/placeholder mention — - Mock Octokit API calls ทังหมด (follow-create-bot-github)
9. [Info/content] contains TODO/MOCK/placeholder mention — - mock drift ต้องเทียบ signature จริงของ dependency ไม่ใช่เดา (check-test-correctness)
10. [Info/cross-skill-consistency] duplicated content line across skills — "1 ถ้า argument เป็น อ่าน แล้วทำตาม flow ใช้ session data ที่มีอยู่" in 5 skills: watch-terminal, watch-browser-test, watch-browser-fix, watch-browser-console, watch-browser-and-improve-uxui (_repo)
11. [Info/cross-skill-consistency] duplicated content line across skills — "2 ถ้าไม่ระบุ ทำ steps 1 5 ตามปกติ โดย step 5 อ่าน subskill มา execute" in 5 skills: watch-release, watch-browser-console, watch-browser, watch-all-task, check-config-drift (_repo)
12. [Info/cross-skill-consistency] duplicated content line across skills — "ใช้เมื่อ user เรียก skill นี้เป็น alias stub เท่านั้น workflow จริงอยู" in 15 skills: watch-browser-and-test, watch-browser-and-fix, use-nushell, update-astgrep-rules, run-review, review-then-fix (_repo)
13. [Info/cross-skill-consistency] duplicated content line across skills — "ใช้ update devin global subagents ถ้าจำเป็น" in 6 skills: update-devin-harness, update-devin-global-rules, update-devin, list-devin-global-subagents, follow-tool-devin, follow-create-devin-plugin (_repo)
14. [Info/cross-skill-consistency] duplicated content line across skills — "argument คือ domain ถ้าไม่ระบุ เลือก domain" in 15 skills: update-devin, search, restore-files, open, list-github, list-git (_repo)
15. [Info/cross-skill-consistency] duplicated content line across skills — "3 ถ้าไม่ระบุหรือไม่รู้จัก domain เลือก domain" in 14 skills: update-devin, search, open, list-github, list-git, list-devin (_repo)
16. [Info/cross-skill-consistency] duplicated content line across skills — "parent ทำ dispatch เท่านั้น ห้าม duplicate workflow ของ skill ปลายทาง" in 7 skills: update-devin, restore-files, open, list-github, list-git, list-devin (_repo)
17. [Info/cross-skill-consistency] duplicated content line across skills — "2 ถ้า domain รองรับ เรียก skill ตามตารางแล้วทำตาม flow ของ skill นั้น" in 6 skills: search, gen-media, follow-create-mobile, create-github, create-cloudflare, convert (_repo)
18. [Info/cross-skill-consistency] duplicated content line across skills — "parent ทำ dispatch เท่านั้น ห้าม duplicate workflow ของ target skill" in 6 skills: search, gen-media, follow-create-mobile, create-github, create-cloudflare, convert (_repo)
19. [Info/cross-skill-consistency] duplicated content line across skills — "goal เลือก runner ตาม artifacts ที่พบจริง" in 5 skills: run-test-visual, run-test-e2e, run-test-contract, run-test-cli, run-test-api (_repo)
20. [Info/cross-skill-consistency] duplicated content line across skills — "ใช้ run test all ถ้าจำเป็น ใช้ run check ถ้าจำเป็น ใช้ suggest next ac" in 7 skills: run-test-visual, run-test-mutation, run-test-integration, run-test-e2e, run-test-contract, run-test-cli (_repo)
21. [Info/cross-skill-consistency] duplicated content line across skills — "ทำตาม เมื่อ user confirm ให้แก้ findings" in 55 skills: review-writing, review-workspace, review-workflow, review-uxui, review-test, review-techstack (_repo)
22. [Info/cross-skill-consistency] duplicated content line across skills — "1 จัดลำดับ findings ตาม severity canonical steps ที่" in 12 skills: review-writing, review-workspace, review-frontend, review-data-validation, review-compliance, review-business (_repo)
23. [Info/cross-skill-consistency] duplicated content line across skills — "3 preserve behavior verify report canonical ที่" in 11 skills: review-writing, review-workspace, review-frontend, review-data-validation, review-compliance, review-business (_repo)
24. [Info/cross-skill-consistency] duplicated content line across skills — "full dimension checklist references checklist md" in 21 skills: review-writing, review-workspace, review-workflow, review-uxui, review-test, review-techstack (_repo)
25. [Info/cross-skill-consistency] duplicated content line across skills — "goal dispatch งานเฉพาะมิติ รูปแบบไปยัง subskill check read only focuse" in 23 skills: review-workspace, review-stability, review-sdk, review-release, review-mobile, review-migration (_repo)
26. [Info/cross-skill-consistency] duplicated content line across skills — "goal เลือกทำเฉพาะ dimension ที่ตรง scope arg" in 12 skills: review-test, review-security, review-release, review-iac, review-docs, review-diff (_repo)
27. [Info/cross-skill-consistency] duplicated content line across skills — "goal domain review ทำโดย subagent ที่มี checklist เต็ม" in 19 skills: review-seo, review-security, review-risk, review-performance, review-mobile, review-mcp (_repo)
28. [Info/cross-skill-consistency] duplicated content line across skills — "3 scope ใหญ่ หลาย workspace spawn หลาย instance ทีละ scope ขนานกัน dim" in 6 skills: review-seo, review-security, review-performance, review-i18n, review-config, review-code-quality (_repo)
29. [Info/cross-skill-consistency] duplicated content line across skills — "1 รวม findings จากทุก instance dedup ตาม file line issue type" in 9 skills: review-seo, review-security, review-performance, review-mobile, review-frontend, review-delivery (_repo)
30. [Info/cross-skill-consistency] duplicated content line across skills — "1 ทำ ตาราง no dimension severity file finding suggestion score ต่อ dim" in 6 skills: review-seo, review-performance, review-mobile, review-delivery, review-compliance, review-code-quality (_repo)
31. [Info/cross-skill-consistency] duplicated content line across skills — "ห้าม duplicate checklist detail ใน skill md canonical อยู่ที่ เท่านั้น" in 18 skills: review-seo, review-security, review-risk, review-performance, review-mobile, review-mcp (_repo)
32. [Info/cross-skill-consistency] duplicated content line across skills — "goal findings รวมกันพร้อม severity score ต่อ dimension" in 7 skills: review-security, review-performance, review-mobile, review-delivery, review-database, review-data-validation (_repo)
33. [Info/cross-skill-consistency] duplicated content line across skills — "goal domain reviewer ที่ถือ checklist ทั้งหมด spawn ผ่าน" in 5 skills: review-security, review-risk, review-mobile, review-database, review-data-validation (_repo)
34. [Info/cross-skill-consistency] duplicated content line across skills — "1 เลือก dimensions จาก scope argument ไม่ระบุ ทุก dimension ที่ apply" in 7 skills: review-mobile, review-mcp, review-i18n, review-cost, review-config, review-compliance (_repo)
35. [Info/cross-skill-consistency] duplicated content line across skills — "goal dispatch ไปยัง subskill ที่ตรง topic" in 6 skills: follow-tool-vitest, follow-tool-stryker-mutator, follow-tool-semgrep, follow-tool-playwright, follow-tool-mutants-rs, follow-tool-msw (_repo)
36. [Info/cross-skill-consistency] duplicated content line across skills — "1 ถ้า argument ตรง topic อ่านและทำตาม แทน steps ด้านล่าง" in 6 skills: follow-tool-vitest, follow-tool-stryker-mutator, follow-tool-semgrep, follow-tool-playwright, follow-tool-mutants-rs, follow-tool-msw (_repo)
37. [Info/cross-skill-consistency] duplicated content line across skills — "goal dispatch งานเฉพาะทางไป subskill ที่เหมาะสม" in 7 skills: follow-tool-vite, follow-tool-tsdown, follow-tool-rolldown, follow-tool-github-actions, follow-tool-eslint, follow-tool-drizzle-kit (_repo)
38. [Info/cross-skill-consistency] duplicated content line across skills — "references cli references cli md apis references apis md routes refere" in 6 skills: follow-tool-loc, follow-tool-linter, follow-tool-knip, follow-tool-github-project, follow-tool-git, follow-tool-formatter (_repo)
39. [Info/cross-skill-consistency] duplicated content line across skills — "references apis references apis md cli references cli md package manif" in 5 skills: follow-tool-devin, follow-tool-capgo, follow-tool-act, follow-lib-mcp-sdk, follow-lib-markdown-it (_repo)
40. [Info/cross-skill-consistency] duplicated content line across skills — "goal dispatch ไปยัง subskill ที่ตรงกับ topic" in 6 skills: follow-service-workos, follow-service-supabase, follow-service-stripe, follow-service-signoz, follow-service-resend, follow-service-instantdb (_repo)
41. [Info/cross-skill-consistency] duplicated content line across skills — "อ่าน ตาม topic แล้วทำตาม flow ในนั้น ไม่ execute จากตารางนี้โดยตรง" in 6 skills: follow-service-vercel, follow-service-twilio, follow-service-run-on, follow-service-firebase-admin, follow-service-claude-agent-sdk, follow-service-aws-sdk (_repo)
42. [Info/cross-skill-consistency] duplicated content line across skills — "references apis references apis md routes references routes md website" in 9 skills: follow-lib-web-vitals, follow-lib-testing-library, follow-lib-simplewebauthn, follow-lib-postgres, follow-lib-pdfkit, follow-lib-oxc-parser (_repo)
43. [Info/cross-skill-consistency] duplicated content line across skills — "references apis references apis md package manifest references package" in 6 skills: follow-lib-openai, follow-lib-line-liff, follow-lib-license-md, follow-lib-jose, follow-lib-ioredis, follow-lib-iconify (_repo)
44. [Info/cross-skill-consistency] duplicated content line across skills — "2 ทำ เพื่อ review tech stack dependencies และ library design" in 5 skills: follow-create-bot-telegram, follow-create-bot-slack, follow-create-bot-line, follow-create-bot-github, follow-create-bot-discord (_repo)
45. [Info/cross-skill-consistency] duplicated content line across skills — "3 บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป" in 5 skills: follow-create-bot-telegram, follow-create-bot-slack, follow-create-bot-line, follow-create-bot-github, follow-create-bot-discord (_repo)
46. [Info/cross-skill-consistency] duplicated content line across skills — "ใช้ open web for config secret ถ้าจำเป็น" in 5 skills: follow-create-bot-telegram, follow-create-bot-slack, follow-create-bot-line, follow-create-bot-github-app, follow-create-bot-discord (_repo)
47. [Info/cross-skill-consistency] skill prefix distribution — follow-*:233, review-*:59, update-*:40, run-*:37, list-*:37, report-*:27, check-*:21, use-*:20, git-*:19, create-*:19, deep-*:18, open-*:15 (_repo)
48. [Info/cross-skill-consistency] 344 mutual related pairs — write-explicit <-> write-how-to; watch-browser-and-test <-> watch-browser-test; watch-browser-and-improve-uxui <-> watch-browser-test; watch-browser-and-fix <-> watch-browser-fix; watch-browser <-> watch-browser-console; watch-browser <-> watch-browser-and-improve-uxui; visualize-in-web <-> visualize-project; use-pwsh-shell <-> use-scripts; use-nu-shell <-> use-pwsh-shell; use-nu-shell <-> use-scripts (_repo)

## Next Action

1. ตรวจสอบ findings ที Critical ก่อน
2. แก้ไข frontmatter orphan related references
3. รัน /review-devin-global-harness ซ้ำเพื่อ verify
