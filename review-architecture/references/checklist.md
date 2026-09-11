# review-architecture — Full Dimension Checklist

## 1. Structure And Boundaries

- [ ] module/package boundaries ชัดเจน, dependency direction ถูกต้อง
- [ ] circular dependencies (madge), cross-layer imports
- [ ] coupling >7 deps / cohesion <0.3 flagged
- [ ] layered/hexagonal/clean architecture consistency
- [ ] import/export + barrel export strategy

## 2. Patterns And Paradigms

- [ ] design patterns fit ปัญหา — ไม่ over/under-engineer
- [ ] anti-patterns, premature abstraction
- [ ] paradigm consistency ต่อ module (declarative/functional/imperative/OOP/reactive)
- [ ] mixed-paradigm boundaries ชัดเจน

## 3. Data Flow

- [ ] data flow tracing ผ่าน layers (references/data-flow.md)
- [ ] shared mutable state scope
- [ ] side effects isolation (functional core/imperative shell)

## 4. Scalability And Resilience

- [ ] horizontal/vertical scaling paths, statelessness
- [ ] queue architecture, backpressure, retry semantics
- [ ] failure modes: timeouts, circuit breakers, bulkheads
- [ ] multi-tenancy isolation, noisy neighbor

## 5. Governance And Operations

- [ ] environment separation, config management
- [ ] ADRs หรือ decision records สำหรับ significant choices
- [ ] test strategy ต่อ layer
- [ ] cost impact analysis (references/cost-impact.md)
- [ ] migration/evolution path

## 6. Quality Attributes

- [ ] modularity, testability, observability hooks
- [ ] security boundaries, trust zones
- [ ] deployment units vs module boundaries alignment

## Scoring

- ตาม references/scoring.md; grade A (90+), B (80+), C (70+), D (60+), F (<60)
