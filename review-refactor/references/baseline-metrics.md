# Baseline Metrics Format And Scoring

## Metrics Table Format

ตาราง Baseline Metrics มี columns: Metric, Count, Threshold, Status

| Metric | Count | Threshold | Status |
|--------|-------|-----------|--------|
| SRP violations | N | 0 | pass/warning/fail |
| Long files (>250 lines) | N | 0 | pass/warning/fail |
| Functions >50 lines | N | 0 | pass/warning/fail |
| Functions >4 params | N | 0 | pass/warning/fail |
| Functions nesting >3 | N | 0 | pass/warning/fail |
| Complex relative imports | N | 0 | pass/warning/fail |
| Circular dependencies | N | 0 | pass/warning/fail |
| Unused exports | N | 0 | pass/warning/fail |
| Cross-boundary imports | N | 0 | pass/warning/fail |
| Code duplication blocks | N | 0 | pass/warning/fail |
| Dead code items | N | 0 | pass/warning/fail |
| Anti-patterns | N | 0 | pass/warning/fail |

## Scoring

- แต่ละ metric มีน้ำหนักเท่ากัน
- คะแนนต่อ metric: pass = 1, warning = 0.5, fail = 0
- Refactor health score = (total score / total metrics) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Status Thresholds

- pass: count = 0 หรืออยู่ในเกณฑ์ที่ยอมรับได้
- warning: count > 0 แต่ < threshold ที่กำหนด (เช่น 1-3 items)
- fail: count ≥ threshold ที่กำหนด (เช่น >3 items หรือ critical issue)

## Refactor Targets Table Format

ตาราง Refactor Targets มี columns: Target, Issue Type, Effort, Impact, Priority, Recommended Workflow

| Target | Issue Type | Effort | Impact | Priority | Recommended Workflow |
|--------|-----------|--------|--------|----------|---------------------|
| `src/auth.ts` | SRP violation | low | high | 1 | `refactor-to-srp` |
| `src/utils.ts` | Long file (450 lines) | medium | medium | 2 | `refactor-to-srp` |

## Priority Formula

- Priority = impact × (1 / effort)
- High impact + low effort = priority 1 (quick win)
- High impact + high effort = priority 2 (major refactor)
- Low impact + any effort = priority 3+ (nice to have)
