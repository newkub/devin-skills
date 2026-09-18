# Forms And Errors Checklist — review-accessibility

## Labels And Instructions

- [ ] every input — `<label for>`/`aria-label`/`aria-labelledby`, visible or programmatic
- [ ] placeholder not label — `placeholder` is hint, not replacement for `<label>`
- [ ] instructions — format hints, constraints, examples near input or `aria-describedby`
- [ ] required fields — `required` attribute + `aria-required`, visual indicator not color-only
- [ ] optional fields — marked if most are required ("optional" label)

## Input Types And Semantics

- [ ] correct `type` — `email`, `tel`, `number`, `date`, `url` trigger right keyboard/validation
- [ ] `autocomplete` — `name`, `email`, `address-line1`, `tel`, `bday` per purpose
- [ ] `inputmode` — numeric keyboards on mobile (`numeric`, `decimal`, `tel`)
- [ ] `pattern`/`min`/`max`/`maxlength` — constraints declared, validated client+server
- [ ] `readonly`/`disabled` — correct state, `aria-disabled` if custom disabled

## Grouping And Relationships

- [ ] `<fieldset>`/`<legend>` — radio groups, checkbox groups, related fields
- [ ] `aria-describedby` — links inputs to help text, errors, format hints
- [ ] `aria-labelledby` — group labels for composite widgets (date picker = 3 inputs)
- [ ] error summary — `role="alert"` or `aria-live` region for form-level errors
- [ ] error per field — `aria-describedby` links specific error to input

## Validation And Errors

- [ ] client-side validation — immediate feedback, not just on submit
- [ ] error messages — specific ("Email is required" not "Invalid input")
- [ ] error identification — field + reason, not just red border
- [ ] error suggestion — correction guidance ("Did you mean...")
- [ ] error prevention — confirm before destructive/irreversible submit
- [ ] focus management — submit error → focus to first error or summary

## Dynamic Behavior

- [ ] dependent fields — shown/hidden conditionally, state announced
- [ ] async validation — "checking..." state, then result, announced
- [ ] character counters — `aria-live` or `aria-describedby` for limits
- [ ] autocomplete suggestions — `role="listbox"`, `aria-activedescendant`, keyboard nav
- [ ] disabled submit — not just disabled button, explanation why disabled

## Mobile And Touch Forms

- [ ] touch targets — inputs ≥44px height, checkboxes/radios large enough
- [ ] zoom — no `user-scalable=no`, inputs don't zoom iOS (16px+ font)
- [ ] keyboard avoidance — inputs visible above keyboard
- [ ] input accessories — prev/next/done for long forms
- [ ] autofill — works with `autocomplete`, not blocked by `autocomplete="off"`

## Date/Time And Complex Inputs

- [ ] date pickers — keyboard navigable, manual entry alternative, `aria-label` on grid
- [ ] time inputs — hours/minutes labeled, AM/PM clear
- [ ] color pickers — hex input alternative, not just visual picker
- [ ] sliders — `role="slider"`, `aria-valuemin/max/now`, keyboard adjustable
- [ ] file inputs — drag-drop + browse button, file type/size announced

## Error Recovery

- [ ] preserve input — errors don't clear valid fields
- [ ] undo — accidental changes recoverable
- [ ] session persistence — form survives navigation/refresh where expected
- [ ] confirmation — success announced, next steps clear

## Detection

- axe rules — `label`, `label-title-only`, `form-field-multiple-labels`, `duplicate-id-aria`
- grep `<input>` without `id`/`name`, missing `<label`, `placeholder` as only label
- manual test — submit empty form, check error announcement + focus
- screen reader test — navigate form with `Tab`, `H` (headings), `F` (forms)

Severity: unlabeled inputs = Critical, errors not announced = High, placeholder-as-label = High, no autocomplete = Medium
