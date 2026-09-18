# Schema Lifecycle Checklist — review-data-validation

## Schema Evolution

- [ ] additive vs breaking — new optional fields OK, removed/renamed fields = breaking
- [ ] version strategy — schema versions (`v1`, `v2`), URL versioning, header negotiation
- [ ] backward compat — old clients still work with new schema
- [ ] forward compat — new fields ignored by old validators (not rejected)
- [ ] migration path — deprecated fields documented, sunset timeline
- [ ] contract tests — schema changes tested against consumer expectations

## Pii Tagging

- [ ] PII fields marked — `email`, `phone`, `ssn`, `address`, `dob` tagged in schema
- [ ] sensitivity levels — public/internal/confidential/restricted classification
- [ ] masking rules — how PII renders in logs/responses (`***@example.com`)
- [ ] encryption fields — which fields encrypted at rest/transit
- [ ] retention policy — how long PII kept, deletion path
- [ ] access control — who can read PII fields, audit trail

## Validation Library Patterns

- [ ] consistent library — `zod`/`valibot`/`arktype`/`joi`/`class-validator` not mixed
- [ ] schema reuse — common patterns extracted (email, UUID, pagination)
- [ ] strict vs strip — unknown fields rejected (`strict()`) or stripped (`strip()`)
- [ ] passthrough — `passthrough()` only where intentional
- [ ] error customization — user-friendly messages, not raw library errors
- [ ] async validation — uniqueness, existence checks (DB lookups)

## Type Safety

- [ ] inferred types — `z.infer<typeof Schema>` not manual duplicate
- [ ] branded types — `UserId`, `Email`, `Url` not raw `string`
- [ ] strict mode — no `any`/`unknown` without narrowing
- [ ] transforms — `z.coerce.number()` vs `z.number()` explicit
- [ ] refinement chains — `.refine()` for complex rules, `.superRefine()` for cross-field

## Defaults And Coercion

- [ ] explicit defaults — `default()` documented, not hidden
- [ ] coercion warnings — `"42"` → `42` flagged or rejected where strict
- [ ] unsafe coercion — `"true"`→`true`, `"1"`→`true` consistent policy
- [ ] date parsing — `z.date()` vs `z.coerce.date()` vs `z.string().datetime()` intentional
- [ ] empty vs missing — `""` vs `undefined` vs `null` distinct handling

## Performance And Safety

- [ ] schema compilation — schemas compiled once, not per-request
- [ ] recursion depth — nested schemas bounded, no unbounded recursion
- [ ] regex complexity — `z.string().regex()` no catastrophic backtracking
- [ ] array limits — `z.array()` has `min`/`max` bounds
- [ ] async validation limits — DB lookups bounded, timeout set

## Error Messages

- [ ] field paths — `user.email` not just "invalid"
- [ ] human readable — "must be a valid email" not "invalid_string"
- [ ] i18n ready — error keys, not hardcoded strings
- [ ] no internal leak — doesn't expose schema structure, DB field names
- [ ] error codes — machine-readable for client handling

## Schema Documentation

- [ ] field descriptions — `.describe()` or comments on non-obvious fields
- [ ] examples — `.example()` or docstrings for complex fields
- [ ] constraints documented — why `min=3`, `max=50`, not arbitrary numbers
- [ ] breaking changes — changelog for schema evolution
- [ ] OpenAPI/JSON Schema — generated from validation schemas where possible

## Testing

- [ ] schema tests — valid inputs pass, invalid inputs reject correctly
- [ ] edge case tests — boundary values, unicode, empty, malformed
- [ ] snapshot tests — schema structure locked, changes detected
- [ ] contract tests — consumer expectations validated
- [ ] fuzz testing — random inputs don't crash validator

## Detection

- grep `z.object`, `z.string`, `joi.object`, `class-validator` decorators
- grep `strict()`, `strip()`, `passthrough()`, `catchall()`
- grep `describe()`, `example()`, `default()` usage
- schema diff — compare current vs previous version for breaking changes

Severity: breaking change without version bump = Critical, PII unmasked/unlogged = High, mixed validation libraries = Medium, no schema docs = Low
