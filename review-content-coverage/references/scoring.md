# Supplementary Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % content items (features, APIs, use cases, concepts) in scope that were reviewed | reviewed / total × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| 5 | Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| 6 | MTTR Estimate | estimated time to fix content gaps | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 7 | Before/After Trend | score improvement over time | (after - before) / before × 100 |
| 8 | Risk Exposure Index | high-severity missing content in critical features or APIs | count of Critical/High content gaps in critical scope |
| 9 | Scope Boundary Adherence | % content gaps inside declared scope | in-scope findings / total findings × 100 |
| 10 | Documentation/Report Quality | % findings with content location and source reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Content Completeness | % of required content topics covered | covered topics / required topics × 100 |
| 2 | Content Freshness | % of content updated within acceptable window | fresh items / total items × 100 |
| 3 | Content Accuracy | % of content facts verified correct | correct facts / checked facts × 100 |
| 4 | Example Coverage | % of documented items with examples | items with examples / total items × 100 |
