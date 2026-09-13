# Report

รายงานผล review ในรูปแบบตาราง

## Goal

รายงาน findings พร้อม actionable recommendations

## Execute

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Tech Stack Metrics Summary: framework versions, library alignment, build tools, security vulnerabilities, unused packages, duplicate packages พร้อม status
3. สร้างตาราง Dependency Health: dependency, version, issue, severity, recommendation
4. สร้างตาราง Library Design: API surface, export strategy, bundle size, peer deps, semver, severity
5. สร้างตาราง Findings by Category: Category, Finding, Severity, Location, Recommendation
6. สร้างตาราง Recommended Actions: Priority, Action, Impact, Effort, Workflow
7. สร้างตาราง Cloud Selection: scenario, workload, latency, scale, state, best cloud, runtime, why, trade-offs, avoid if, alternatives
8. แสดง tech stack review score พร้อม progress bar และ grade — ดู `references/scoring.md`
9. ทำ `/suggest-next-action`

## Expected Outcome

- ตาราง Tech Stack Metrics Summary, Dependency Health, Library Design, Findings by Category, Recommended Actions, Cloud Selection
- Review score, grade, progress bar
- คำแนะนำ action ถัดไป
