# Screen Reader And Cognitive Checklist — review-accessibility

## Screen Reader Navigation

- [ ] landmark navigation — `header`/`nav`/`main`/`footer`/`aside`/`form` regions announced
- [ ] heading navigation — `h1`-`h6` logical outline, skim-able structure
- [ ] link lists — meaningful link text ("Download report" not "Click here")
- [ ] form navigation — inputs labeled, grouped, errors announced
- [ ] tables — headers announced, `th`/`scope`/`headers` associations work
- [ ] lists — `<ul>`/`<ol>` announce count and position ("3 of 5")

## Live Regions And Announcements

- [ ] `aria-live="polite"` — non-critical updates announced (status, counts)
- [ ] `aria-live="assertive"` — critical updates (errors, alerts)
- [ ] `role="status"`/`role="alert"` — appropriate announcement type
- [ ] `aria-atomic` — region read as whole vs incremental changes
- [ ] `aria-relevant` — what changes trigger announcements (`additions`, `removals`, `text`)
- [ ] no announcement spam — rapid updates debounced/throttled

## Dynamic Content

- [ ] route changes — page title announced, focus managed to main content
- [ ] infinite scroll — new items announced, position maintained
- [ ] modals — `aria-modal="true"`, focus trapped, labelled
- [ ] toasts/notifications — `role="status"`/`aria-live`, dismissible, timeout accessible
- [ ] expandable sections — `aria-expanded`, `aria-controls` state announced
- [ ] loading states — `aria-busy`, progress announced

## Language And Readability

- [ ] `<html lang>` — primary language declared
- [ ] `lang` attributes — foreign phrases marked
- [ ] reading level — plain language, ~8th grade where possible
- [ ] jargon/idioms — avoided or explained
- [ ] abbreviations — `<abbr title>` expansion provided
- [ ] pronunciation — phonetic or audio guides for unusual names

## Cognitive Support

- [ ] consistent navigation — same order/position across pages
- [ ] predictable behavior — actions have expected outcomes
- [ ] clear instructions — steps numbered, expectations stated
- [ ] error prevention — confirm destructive actions, undo available
- [ ] memory aids — breadcrumbs, history, "recently viewed"
- [ ] help/documentation — accessible, findable, contextual

## Timeouts And Timing

- [ ] session timeout — warning before expire, extend option
- [ ] inactivity logout — sufficient time, activity detection
- [ ] timed responses — extend/disable for accessibility
- [ ] auto-refresh — pausable, not constant updates
- [ ] animation duration — readable, not too fast

## Focus And Attention

- [ ] focus visible — always clear where focus is
- [ ] attention management — important content emphasized appropriately
- [ ] distraction-free — reading mode, minimal clutter option
- [ ] cognitive load — chunked content, progressive disclosure
- [ ] executive function — clear next steps, defaults provided

## Input Assistance

- [ ] autocomplete — form fields use `autocomplete` attributes
- [ ] input hints — format examples, constraints shown
- [ ] error recovery — clear path to correct mistakes
- [ ] undo/redo — available for complex operations
- [ ] smart defaults — reduce required decisions

## Assistive Technology Compatibility

- [ ] screen readers tested — NVDA (Windows), JAWS, VoiceOver (macOS/iOS), TalkBack (Android)
- [ ] speech recognition — Dragon NaturallySpeaking commands work
- [ ] switch devices — single/dual switch navigation
- [ ] screen magnifiers — content readable at 400%+ zoom
- [ ] braille displays — output coherent, no visual-only cues

## Cognitive Disabilities Considerations

- [ ] attention deficit — minimal distractions, clear hierarchy
- [ ] memory impairment — context preserved, reminders, breadcrumbs
- [ ] executive dysfunction — clear steps, defaults, reduced choices
- [ ] language disorders — simple sentences, active voice
- [ ] math anxiety — calculations shown, not required
- [ ] visual processing — clear contrast, not overwhelming

## Detection

- screen reader test — NVDA/VoiceOver/TalkBack complete core task
- keyboard-only — complete task without mouse
- axe rules — `aria-allowed-attr`, `aria-required-attr`, `landmark-*`, `region`
- cognitive walkthrough — first-time user completes task unaided
- automated readability — Flesch-Kincaid or similar score

Severity: screen reader cannot complete core task = Critical, missing announcements for critical changes = High, timeout without warning = High, complex jargon = Medium
