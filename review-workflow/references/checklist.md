# review-workflow — Full Dimension Checklist

## 1. Flow Reading

- [ ] workflow steps mapped end-to-end
- [ ] entry/exit points, decision branches
- [ ] happy path + error/recovery paths

## 2. Speed

- [ ] unnecessary steps/waits, parallelization opportunities
- [ ] redundant approvals, batching opportunities
- [ ] tooling friction, manual steps that can automate

## 3. Safety

- [ ] destructive steps gated (confirm/dry-run)
- [ ] validation gates before irreversible actions
- [ ] rollback path defined, failure handling per step

## 4. Usability

- [ ] steps clear, unambiguous instructions
- [ ] required inputs discoverable, good errors
- [ ] handoffs smooth, context preserved

## 5. Efficiency And Redundancy

- [ ] duplicate work removed, single-source steps
- [ ] scope adherence, no gold-plating steps
- [ ] idempotent steps, safe re-run

## 6. Outcome

- [ ] measurable completion criteria
- [ ] metrics/feedback loop into workflow

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
