---
title: review-devin-global-skills
description: Review findings for devin global skills repo
status: pending
created: 2026-09-07T22:37:42.116Z
---

## Goal

รายงานผลการ review devin global skills repo ด้วย /review-devin-global-skills CLI

## Scope

รวม findings, observations, score, grade และสรุปจำนวน issues ตาม category

## Meta

| Metric | Value |
|---|---|
| Total skills | 759 |
| Skills with issues | 43 |
| Total findings | 90 |
| Observations | 45 |
| Score | 51 |
| Grade | F |

## Findings by Severity

| Critical | Medium | Low |
|---|---|---|
| 1 | 82 | 7 |

## Findings by Category

| frontmatter | style | references |
|---|---|---|
| 87 | 2 | 1 |

## Findings

| No. | Skill | Category | Severity | Finding | Evidence | File |
|---|---|---|---|---|---|---|
| 1 | review-architecture | frontmatter | Critical | unclosed frontmatter | opening --- found but no closing --- | review-architecture\SKILL.md |
| 2 | check-file-structure | frontmatter | Medium | orphan related reference | related: deep-analyze not mentioned in body | check-file-structure\SKILL.md |
| 3 | check-file-structure | style | Medium | uses bold markers ** | 1. **Deep nesting**: ไฟล์หรือโฟลเดอรอยู่ลึกเกิน 5 levels (นับจาก root) | check-file-structure\SKILL.md |
| 4 | check-my-global-cli | frontmatter | Medium | orphan related reference | related: download-program not mentioned in body | check-my-global-cli\SKILL.md |
| 5 | create-cloudflare-worker | frontmatter | Medium | orphan related reference | related: use-wrangler not mentioned in body | create-cloudflare-worker\SKILL.md |
| 6 | create-github-pr | frontmatter | Medium | orphan related reference | related: use-gh-cli not mentioned in body | create-github-pr\SKILL.md |
| 7 | deep-optimize | frontmatter | Medium | related exceeds 15 skills | count: 16 | deep-optimize\SKILL.md |
| 8 | deep-research | frontmatter | Medium | orphan related reference | related: follow-tool-crw not mentioned in body | deep-research\SKILL.md |
| 9 | deep-research | frontmatter | Medium | orphan related reference | related: use-mcp not mentioned in body | deep-research\SKILL.md |
| 10 | deep-validate | frontmatter | Medium | orphan related reference | related: check-file-encoding not mentioned in body | deep-validate\SKILL.md |
| 11 | deep-validate | frontmatter | Medium | orphan related reference | related: check-path-length not mentioned in body | deep-validate\SKILL.md |
| 12 | deep-validate | frontmatter | Medium | orphan related reference | related: check-broken-symlinks not mentioned in body | deep-validate\SKILL.md |
| 13 | deep-validate | frontmatter | Medium | orphan related reference | related: check-file-locks not mentioned in body | deep-validate\SKILL.md |
| 14 | deep-validate | frontmatter | Medium | orphan related reference | related: check-open-ports not mentioned in body | deep-validate\SKILL.md |
| 15 | deploy-to-cloudflare | frontmatter | Medium | orphan related reference | related: use-wrangler not mentioned in body | deploy-to-cloudflare\SKILL.md |
| 16 | follow-asynchronous | frontmatter | Medium | orphan related reference | related: run-test-unit not mentioned in body | follow-asynchronous\SKILL.md |
| 17 | follow-github | frontmatter | Medium | orphan related reference | related: use-mcp not mentioned in body | follow-github\SKILL.md |
| 18 | follow-github | frontmatter | Medium | orphan related reference | related: use-gh-cli not mentioned in body | follow-github\SKILL.md |
| 19 | follow-service-cloudflare | frontmatter | Medium | orphan related reference | related: use-wrangler not mentioned in body | follow-service-cloudflare\SKILL.md |
| 20 | follow-tasks | frontmatter | Medium | orphan related reference | related: run-test-unit not mentioned in body | follow-tasks\SKILL.md |
| 21 | from-chat-session | frontmatter | Medium | orphan related reference | related: report-in-table not mentioned in body | from-chat-session\SKILL.md |
| 22 | idea-convert-my-global-cli-to-skills | frontmatter | Medium | orphan related reference | related: download-program not mentioned in body | idea-convert-my-global-cli-to-skills\SKILL.md |
| 23 | improve | frontmatter | Medium | orphan related reference | related: prioritize not mentioned in body | improve\SKILL.md |
| 24 | learn-web | frontmatter | Medium | orphan related reference | related: use-mcp not mentioned in body | learn-web\SKILL.md |
| 25 | loop-continuous | frontmatter | Medium | orphan related reference | related: review-then-fix not mentioned in body | loop-continuous\SKILL.md |
| 26 | productionize-implementation | frontmatter | Medium | orphan related reference | related: run-test-unit not mentioned in body | productionize-implementation\SKILL.md |
| 27 | refactor | frontmatter | Medium | orphan related reference | related: review-quality not mentioned in body | refactor\SKILL.md |
| 28 | refactor | frontmatter | Medium | orphan related reference | related: check-code-structure not mentioned in body | refactor\SKILL.md |
| 29 | refactor | frontmatter | Medium | orphan related reference | related: check-long-files not mentioned in body | refactor\SKILL.md |
| 30 | report-bundle | frontmatter | Medium | orphan related reference | related: review-delivery not mentioned in body | report-bundle\SKILL.md |
| 31 | report-in-codeblock | frontmatter | Medium | orphan related reference | related: report not mentioned in body | report-in-codeblock\SKILL.md |
| 32 | report-in-codeblock | frontmatter | Medium | orphan related reference | related: report-in-table not mentioned in body | report-in-codeblock\SKILL.md |
| 33 | report-in-codeblock | frontmatter | Medium | orphan related reference | related: report-in-numbered not mentioned in body | report-in-codeblock\SKILL.md |
| 34 | report-in-codeblock | frontmatter | Medium | orphan related reference | related: report-todo not mentioned in body | report-in-codeblock\SKILL.md |
| 35 | report-in-codeblock | frontmatter | Medium | orphan related reference | related: review-writing not mentioned in body | report-in-codeblock\SKILL.md |
| 36 | report-in-numbered | frontmatter | Medium | orphan related reference | related: report-progress not mentioned in body | report-in-numbered\SKILL.md |
| 37 | report-in-table | frontmatter | Medium | orphan related reference | related: report not mentioned in body | report-in-table\SKILL.md |
| 38 | report-in-table | frontmatter | Medium | orphan related reference | related: report-in-numbered not mentioned in body | report-in-table\SKILL.md |
| 39 | report-in-table | frontmatter | Medium | orphan related reference | related: report-progress not mentioned in body | report-in-table\SKILL.md |
| 40 | report-todo | frontmatter | Medium | orphan related reference | related: from-chat-session not mentioned in body | report-todo\SKILL.md |
| 41 | report-todo | frontmatter | Medium | orphan related reference | related: report-in-table not mentioned in body | report-todo\SKILL.md |
| 42 | report-usage | frontmatter | Medium | orphan related reference | related: update-usage-md not mentioned in body | report-usage\SKILL.md |
| 43 | resolve-cicd | frontmatter | Medium | orphan related reference | related: use-gh-cli not mentioned in body | resolve-cicd\SKILL.md |
| 44 | resolve-cloudflare-worker-fails | frontmatter | Medium | orphan related reference | related: use-wrangler not mentioned in body | resolve-cloudflare-worker-fails\SKILL.md |
| 45 | review | frontmatter | Medium | orphan related reference | related: deep-review-codebase not mentioned in body | review\SKILL.md |
| 46 | review | frontmatter | Medium | orphan related reference | related: use-related-skills not mentioned in body | review\SKILL.md |
| 47 | review-gaps | frontmatter | Medium | orphan related reference | related: scan-codebase not mentioned in body | review-gaps\SKILL.md |
| 48 | review-gaps | frontmatter | Medium | orphan related reference | related: deep-review not mentioned in body | review-gaps\SKILL.md |
| 49 | review-gaps | frontmatter | Medium | orphan related reference | related: idea not mentioned in body | review-gaps\SKILL.md |
| 50 | review-gaps | frontmatter | Medium | orphan related reference | related: ask-me not mentioned in body | review-gaps\SKILL.md |
| 51 | review-uxui | frontmatter | Medium | orphan related reference | related: use-agent-browser not mentioned in body | review-uxui\SKILL.md |
| 52 | run-test-coverage | frontmatter | Medium | orphan related reference | related: run-test-unit not mentioned in body | run-test-coverage\SKILL.md |
| 53 | ship | frontmatter | Medium | related exceeds 15 skills | count: 16 | ship\SKILL.md |
| 54 | update-agents-md | references | Medium | slash reference to unknown skill | /update-devin-global | update-agents-md\SKILL.md |
| 55 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: update-project-skills not mentioned in body | update-devin-global-skills\SKILL.md |
| 56 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: learn-web not mentioned in body | update-devin-global-skills\SKILL.md |
| 57 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: follow-skills-map not mentioned in body | update-devin-global-skills\SKILL.md |
| 58 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: review-devin-global-skills not mentioned in body | update-devin-global-skills\SKILL.md |
| 59 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: update-devin-global-rules not mentioned in body | update-devin-global-skills\SKILL.md |
| 60 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: check-circular-dependencies not mentioned in body | update-devin-global-skills\SKILL.md |
| 61 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: check-reference not mentioned in body | update-devin-global-skills\SKILL.md |
| 62 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: update-references not mentioned in body | update-devin-global-skills\SKILL.md |
| 63 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: use-related-skills not mentioned in body | update-devin-global-skills\SKILL.md |
| 64 | update-devin-global-skills | frontmatter | Medium | orphan related reference | related: use-related-skills not mentioned in body | update-devin-global-skills\SKILL.md |
| 65 | use-agent-browser | frontmatter | Medium | orphan related reference | related: watch-browser-console not mentioned in body | use-agent-browser\SKILL.md |
| 66 | use-agent-browser | frontmatter | Medium | orphan related reference | related: run-test-website-by-agent-browser not mentioned in body | use-agent-browser\SKILL.md |
| 67 | use-agent-browser | frontmatter | Medium | orphan related reference | related: run-test-visual not mentioned in body | use-agent-browser\SKILL.md |
| 68 | use-agent-browser | frontmatter | Medium | orphan related reference | related: record-video-web not mentioned in body | use-agent-browser\SKILL.md |
| 69 | use-agent-browser | frontmatter | Medium | orphan related reference | related: review-uxui not mentioned in body | use-agent-browser\SKILL.md |
| 70 | use-agent-browser | frontmatter | Medium | orphan related reference | related: review-accessibility not mentioned in body | use-agent-browser\SKILL.md |
| 71 | use-gh-cli | frontmatter | Medium | orphan related reference | related: create-github-pr not mentioned in body | use-gh-cli\SKILL.md |
| 72 | use-gh-cli | frontmatter | Medium | orphan related reference | related: implement-github-issue-by-me not mentioned in body | use-gh-cli\SKILL.md |
| 73 | use-gh-cli | frontmatter | Medium | orphan related reference | related: resolve-github-actions-fails not mentioned in body | use-gh-cli\SKILL.md |
| 74 | use-gh-cli | frontmatter | Medium | orphan related reference | related: use-github-ship-bots not mentioned in body | use-gh-cli\SKILL.md |
| 75 | use-gh-cli | frontmatter | Medium | orphan related reference | related: resolve-errors not mentioned in body | use-gh-cli\SKILL.md |
| 76 | use-mcp | frontmatter | Medium | orphan related reference | related: follow-github not mentioned in body | use-mcp\SKILL.md |
| 77 | use-mcp | frontmatter | Medium | orphan related reference | related: follow-best-practice not mentioned in body | use-mcp\SKILL.md |
| 78 | use-mcp | style | Medium | uses bold markers ** | 2. เรียก `mcp_list_tools <server>` **เสมอก่อน** call tool — ห้ามเดาชื่อ tool หรือ arguments | use-mcp\SKILL.md |
| 79 | use-wrangler | frontmatter | Medium | orphan related reference | related: follow-service-cloudflare not mentioned in body | use-wrangler\SKILL.md |
| 80 | use-wrangler | frontmatter | Medium | orphan related reference | related: follow-deploy not mentioned in body | use-wrangler\SKILL.md |
| 81 | use-wrangler | frontmatter | Medium | orphan related reference | related: resolve-errors not mentioned in body | use-wrangler\SKILL.md |
| 82 | watch-browser-and-fix | frontmatter | Medium | orphan related reference | related: use-agent-browser not mentioned in body | watch-browser-and-fix\SKILL.md |
| 83 | watch-browser-console | frontmatter | Medium | orphan related reference | related: use-agent-browser not mentioned in body | watch-browser-console\SKILL.md |
| 84 | check-my-global-cli | frontmatter | Low | description over 100 chars | length: 104 | check-my-global-cli\SKILL.md |
| 85 | deep-optimize | frontmatter | Low | description over 100 chars | length: 145 | deep-optimize\SKILL.md |
| 86 | idea-merge | frontmatter | Low | description over 100 chars | length: 115 | idea-merge\SKILL.md |
| 87 | idea-new-devin-global-skills | frontmatter | Low | description over 100 chars | length: 112 | idea-new-devin-global-skills\SKILL.md |
| 88 | improve | frontmatter | Low | description over 100 chars | length: 111 | improve\SKILL.md |
| 89 | use-agent-browser | frontmatter | Low | description over 100 chars | length: 101 | use-agent-browser\SKILL.md |
| 90 | use-mcp | frontmatter | Low | description over 100 chars | length: 102 | use-mcp\SKILL.md |

## Observations

1. [object Object]
2. [object Object]
3. [object Object]
4. [object Object]
5. [object Object]
6. [object Object]
7. [object Object]
8. [object Object]
9. [object Object]
10. [object Object]
11. [object Object]
12. [object Object]
13. [object Object]
14. [object Object]
15. [object Object]
16. [object Object]
17. [object Object]
18. [object Object]
19. [object Object]
20. [object Object]
21. [object Object]
22. [object Object]
23. [object Object]
24. [object Object]
25. [object Object]
26. [object Object]
27. [object Object]
28. [object Object]
29. [object Object]
30. [object Object]
31. [object Object]
32. [object Object]
33. [object Object]
34. [object Object]
35. [object Object]
36. [object Object]
37. [object Object]
38. [object Object]
39. [object Object]
40. [object Object]
41. [object Object]
42. [object Object]
43. [object Object]
44. [object Object]
45. [object Object]

## Next Action

1. ตรวจสอบ findings ที Critical ก่อน
2. แก้ไข frontmatter orphan related references
3. รัน /review-devin-global-skills ซ้ำเพื่อ verify
