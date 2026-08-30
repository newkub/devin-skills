# Deploy Readiness Score And Metrics

## Goal

คำนวณ score และ metrics สำหรับ deploy review

## Scope

ใช้หลังจบ `review-deploy`

## Score Formula

ดูรายละเอียดสูตรคะแนนใน [deploy-readiness-score.md](deploy-readiness-score.md)

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % deploy readiness items in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical areas (env, build, health, or zero-downtime) | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % findings inside declared scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Deployment Frequency | number of deployments per time window | total deployments / time period |
| 2 | Lead Time | time from commit to production | average (deploy time - commit time) |
| 3 | Failure Rate | % of deployments that fail | failed deployments / total deployments × 100 |
| 4 | Rollback Success Rate | % of rollbacks completed successfully | successful rollbacks / total rollbacks × 100 |
