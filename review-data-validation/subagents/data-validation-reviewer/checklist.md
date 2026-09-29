# review-data-validation — Full Dimension Checklist

## 1. Coverage

- [ ] ทุก boundary validated: API inputs, env vars, config files, user input, external data
- [ ] schema definitions สำหรับทุก data shape ที่รับเข้า
- [ ] server-side validation เสมอ (client-side เป็น UX เท่านั้น)

## 2. Validation Quality

- [ ] allowlist > denylist, strict types, bounded ranges
- [ ] string: length, format, encoding, trimming/normalization
- [ ] numbers: range, precision, integer vs float
- [ ] collections: min/max items, unique constraints
- [ ] dates: valid, timezone-aware, range sane

## 3. Security

- [ ] injection prevention: SQL, XSS, path traversal, prototype pollution
- [ ] file upload: type sniffing, size limits, malware scan hooks
- [ ] deserialization safe, no arbitrary object construction
- [ ] mass assignment protection

## 4. Error UX And Contracts

- [ ] error messages: field-level, actionable, localized
- [ ] validation errors consistent shape (code + field + message)
- [ ] fail-fast vs collect-all strategy consistent

## 5. Type Safety Integration

- [ ] validation → typed output (parse, don't validate)
- [ ] single source of truth: schema ↔ types sync

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
