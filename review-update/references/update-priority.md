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

1. `update-version-latest` — runtime update ก่อน เพราะ dependencies อาจต้องใช้ runtime ใหม่
2. `update-dependencies-latest` — dependency update ต่อ กระทบ rules, docs, config
3. `update-dot-devin` — `.devin` structure ก่อน rules เพราะ rules อยู่ใน `.devin`
4. `update-project-rules` — รวมทั้ง devin rules (libs/code-quality/architecture grouping) และ ast-grep rules (พร้อมแปลงเป็น ast-grep YAML)
5. `update-agents-md` — AGENTS.md หลัง rules เพราะอ้างอิง rules
6. `update-readme-md` — README หลัง architecture ชัด
7. `update-contributing-md` — CONTRIBUTING หลัง workflows ชัด
8. `run-release` — CHANGELOG.md gen อัตโนมัติหลัง release สำเร็จ
9. `update-test-and-fix` — tests และ spec หลัง source code changes
10. `update-features-md` — features doc หลัง source code stable
11. `update-gitignore` — gitignore หลัง stack changes
12. `update-devin-global-subagents` — global subagents หลัง skills stable
13. `update-all-devin-global-skills` — skills repo หลังทุกอย่าง stable

## Priority Tiers

- Tier 1 (Priority 1-5): Critical drift, security, blocking production
- Tier 2 (Priority 6-15): High drift, core functionality at risk
- Tier 3 (Priority 16-30): Medium drift, code quality
- Tier 4 (Priority 31+): Low drift, cosmetic

## Update Priority Table Format

ตาราง Update Priority มี columns: Priority, Update Skill, Drift Area, Effort, Impact

| Priority | Update Skill | Drift Area | Effort | Impact |
|----------|-------------|-----------|--------|--------|
| 1 | `update-version-latest` | Runtime/dependency security vulnerability | medium | critical |
| 2 | `update-dependencies-latest` | Dependency security vulnerability | medium | critical |
| 3 | `update-project-rules` | Rules missing coverage | high | high |

## Update Health Score

- ครอบคลุม drift areas: runtimes, dependencies, docs, config, rules, tests, features, subagents
- คะแนนต่อ area: no drift = 1, minor drift = 0.5, major drift = 0
- Update health score = (total score / total areas) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
