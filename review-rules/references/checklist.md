# review-rules — Full Dimension Checklist

## 1. Rules Inventory

- [ ] `.devin/rules`, ast-grep rules, `AGENTS.md` mapped
- [ ] rule types: always-on, manual, model-decision, glob-scoped

## 2. Alignment

- [ ] rules สอดคล้อง global_rules.md และ AGENTS.md
- [ ] no contradictions between rules
- [ ] rule triggers match intent (not too broad/narrow)

## 3. AGENTS.md Validity

- [ ] commands verified runnable, paths exist
- [ ] conventions match actual codebase state
- [ ] workflows referenced exist

## 4. Coverage And References

- [ ] coverage: no unruled critical workflows
- [ ] skill references in rules resolve
- [ ] no duplicate/overlapping rules

## 5. Maintenance

- [ ] stale rules flagged, deprecation path
- [ ] rule ownership/last-review noted

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
