# Data Validation — Best Practices

Validator usage discipline — schemas, boundaries, and error surfacing

## Recommended Patterns

- Validate only at system boundaries: API inputs, env vars, form submits, external payloads, untrusted DB results — inside, trust the types
- Schema = source of truth — derive types from the schema (`z.infer`, `type.infer`); never write a separate interface
- Fail-fast with structured errors: collect all `issues` then format — never throw the first raw error at the user
- Validate env at boot — a startup crash beats a silent runtime misconfiguration
- Reuse schemas across layers: the API contract = the form validation = the DB input, all one schema

## Common Pitfalls

- Re-validating at every layer = slow + duplicated error paths — validate once at entry, then stay typed
- Parse vs validate: transformations in the schema (`.transform`, morphs) change the output — check the output type
- Error messages must be mappable to users — a path + code + message structure, not one flat string
- Do not validate inside loops/hot paths — hoist the validator and validate once per batch
- Sensitive fields: never log raw validated data containing secrets/PII — sanitize the error payloads

## Security Notes

- Validation ≠ sanitization — HTML/JS sanitizing is a separate job (DOMPurify); a schema only checks shape/type
- Strict unknown-key handling — passthrough/loose objects open mass-assignment; always declare fields explicitly
- Size limits: `max` on strings/arrays prevents large-payload DoS

## Do / Don't

| Do | Don't |
|----|-------|
| validate at one boundary set | re-validate at every function call |
| structured issues → UI errors | raw error strings to users |
| env validation at boot | lazy env checks at runtime |
| strict schemas + explicit fields | passthrough objects by default |
