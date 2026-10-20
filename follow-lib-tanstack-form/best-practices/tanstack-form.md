# TanStack Form — Best Practices

Headless, type-safe forms — schema validation, field state, granular subscriptions

## Recommended Patterns

- `defaultValues` is the type source of truth — declare every field, including arrays, so field names type-check end to end
- Validate with a Standard Schema at form level (`validators.onSubmit`) and per-field slices for instant feedback
- Async validators always carry a debounce (`onChangeAsyncDebounceMs`) and belong on `onChangeAsync`/`onBlurAsync`, not on every trigger
- Read derived UI through `form.Subscribe` with a selector (`canSubmit`, `isDirty`, `values.email`) — never subscribe to the whole state
- Array fields use `mode="array"` with `pushValue`/`removeValue`/`swapValues`, and render by `field.id` as the key
- Wrap `form.Field` into shared input components with `createFormHook` + `fieldComponents` so every form gets the same labels, errors and aria attributes
- Linked fields use `listeners` to recompute dependents when a source field changes
- Reset through `formApi.reset()` after a successful submit; map server errors into field errors or a form-level slot

## Common Pitfalls

- Defining validators inline in render creates a new identity each render and can loop validation
- No debounce on async validators fires a request per keystroke
- Subscribing to the entire form state re-renders every field on every change
- `meta.errors` entries may be objects (Standard Schema) — rendering them raw prints `[object Object]`; format explicitly
- Mixing controlled `field.state.value` + `handleChange` with an uncontrolled `defaultValue` causes state drift
- Treating form state as a data cache — server data still belongs to Query/DB, the form only edits a draft
- Headless means a11y is yours: missing `label htmlFor`, `aria-invalid`, `aria-describedby` on errors

## Perf Notes

- Field-level subscriptions are the cheap default; keep form-level subscriptions to primitives
- Validate cheap rules on change, expensive/remote rules on blur or submit with debounce
- Split large forms into sections with their own `Subscribe` selectors so one keystroke touches one section

## Do / Don't

| Do | Don't |
|----|-------|
| complete `defaultValues` | optional/partial defaults with `as` casts |
| Standard Schema validators | hand-rolled regex when the schema already has it |
| debounced async validators | remote validation per keystroke |
| `form.Subscribe` with a selector | subscribing the whole form object |
| reset after successful submit | leaving stale dirty state |
