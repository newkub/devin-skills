# review-then-fix — Full Dimension Checklist

## 1. Scope Identification

- [ ] findings scoped precisely, root cause vs symptom
- [ ] blast radius estimated per finding
- [ ] related code paths searched

## 2. Fix Planning

- [ ] minimal fix strategy, no scope creep
- [ ] fix order: critical → high → medium → low
- [ ] dependencies between fixes mapped

## 3. Confirmation

- [ ] user confirm before changes (per global rules)
- [ ] risks of fix surfaced, alternatives noted

## 4. Application

- [ ] fixes minimal + surgical, style consistent
- [ ] behavior preserved except intended change
- [ ] atomic, reviewable changes

## 5. Verification

- [ ] each fix verified immediately (test/build/run)
- [ ] regression check, `/run-check` pass
- [ ] before/after evidence (`/report-before-after`)

## Scoring

- fixes verified / fixes attempted × 100; grade A (90+), B (80+), C (70+), D (60+), F (<60)
