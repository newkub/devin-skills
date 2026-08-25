# Update Priority Ordering Formula

## Priority Formula

Priority = drift severity × update urgency × dependency order

### Drift Severity

- Critical: 4 points — security vulnerability, docs ผิดพื้นฐาน, rules ขาด critical coverage
- High: 3 points — major version drift, docs ล้าหลังมาก, rules ไม่ครอบคลุม
- Medium: 2 points — minor drift, minor inconsistency
- Low: 1 point — cosmetic drift

### Update Urgency

- Immediate: 3 points — blocking production, security risk
- Soon: 2 points — core functionality at risk
- When time permits: 1 point — code quality improvement

### Dependency Order

บาง updates ต้องทำก่อนเพื่อให้ update อื่นทำได้:

1. `update-dependencies-latest` — dependency update ก่อน เพราะกระทบ rules, docs, config
2. `update-dot-devin` — `.devin` structure ก่อน rules เพราะ rules อยู่ใน `.devin`
3. `update-devin-project-rules` — devin rules ก่อน ast-grep rules
4. `update-ast-grep-rules` — ast-grep rules หลัง devin rules
5. `update-rules` — รวมทั้ง devin และ ast-grep rules
6. `update-agents-md` — AGENTS.md หลัง rules เพราะอ้างอิง rules
7. `update-readme` — README หลัง architecture ชัด
8. `update-contributing-md` — CONTRIBUTING หลัง workflows ชัด
9. `update-changelog-md` — CHANGELOG หลัง code changes
10. `update-release-md` — RELEASE หลัง changelog
11. `update-test` — tests หลัง source code changes
12. `update-spec-md` — spec หลัง tests
13. `update-features` — features doc หลัง source code stable
14. `update-gitignore` — gitignore หลัง stack changes
15. `update-devin-subagents` — subagents หลัง skills stable
16. `update-skills` — skills repo หลังทุกอย่าง stable

## Priority Tiers

- Tier 1 (Priority 1-5): Critical drift, security, blocking production
- Tier 2 (Priority 6-15): High drift, core functionality at risk
- Tier 3 (Priority 16-30): Medium drift, code quality
- Tier 4 (Priority 31+): Low drift, cosmetic

## Update Priority Table Format

ตาราง Update Priority มี columns: Priority, Update Skill, Drift Area, Effort, Impact

| Priority | Update Skill | Drift Area | Effort | Impact |
|----------|-------------|-----------|--------|--------|
| 1 | `update-dependencies-latest` | Security vulnerability | medium | critical |
| 2 | `update-rules` | Rules missing coverage | high | high |

## Update Health Score

- ครอบคลุม drift areas: dependencies, docs, config, rules, tests, features, subagents
- คะแนนต่อ area: no drift = 1, minor drift = 0.5, major drift = 0
- Update health score = (total score / total areas) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
