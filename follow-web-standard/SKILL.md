---
name: follow-web-standard
description: Write UI to web standards: semantic HTML, native APIs, Baseline policy, progressive enhancement
argument-hint: "[scope]"
related:
  - follow-lib-css
  - follow-create-web
  - follow-design-system
  - follow-best-practice
  - follow-lib-web-vitals
  - follow-tool-lighthouse
  - use-agent-browser
  - deep-research
  - follow-up-to-date
  - follow-lib-unocss
  - follow-lib-animejs
  - use-playwriter
  - deep-review
  - git-commit
  - ship

---

## Goal

Build web UIs on top of the web platform itself — semantic HTML, native form/interaction behavior, standard Web APIs, and Baseline-verified CSS/JS features — so less JavaScript, fewer dependencies, and better accessibility/performance come for free

## Scope

Applies when writing, reviewing, or refactoring any browser UI (HTML, forms, widgets, client behavior) in any framework or plain markup. It is a `follow-*` concept/practice skill (single `SKILL.md`, no installable dependency), so it deviates from the tool-oriented `follow-*` template: there is no manifest version to check, instead feature availability is live-checked against Baseline per step `### 2`

Boundaries:
- Raw CSS writing/review details (cascade layers, color spaces, container queries) → run `/follow-lib-css`
- Utility-first engines (UnoCSS/Tailwind) → run `/follow-lib-unocss`
- Choosing/creating a web project or framework → run `/follow-create-web`
- Visual/design principles → run `/follow-design-system`; perf metrics measurement → run `/follow-lib-web-vitals`
- This skill owns: standards-first decisions — which native element/API/feature to use instead of a library, and when a feature is safe to ship

## Execute

### 1. Analyze The Target

> Goal: know what markup and platform features the work touches

1. Identify the scope: pages/components/forms being written or reviewed
2. Find the browser-support target: `browserslist` in config, `package.json`, or project requirements; no target → default to Baseline widely available
3. List current library-based UI mechanisms in scope (modal, tooltip, dropdown, form validation, virtualized list, clipboard, routing state) — each is a candidate for a native standard
4. Never rewrite the whole file; minimal diff, don't force upgrades on untouched code

### 2. Live-Check The Standards

> Goal: no stale feature claims

1. Run `/deep-research` against `web.dev/baseline` and `caniuse.com` for every feature considered — Baseline status shifts monthly; never trust in-memory dates
2. Classify each feature: Baseline widely available (ship unconditionally) · Baseline newly available (ship with `@supports`/feature-check fallback) · not in Baseline (prototype-only, needs `/follow-lib-css` progressive-enhancement plan)
3. Prefer features defined by WHATWG/W3C living standards over de-facto single-vendor features
4. Follow `/follow-up-to-date` — this skill never pins versions or feature years in its own text

### 3. Semantic HTML First

> Goal: markup carries meaning, behavior, and accessibility by itself

1. One `<h1>`, non-skipping heading levels, correct sectioning (`<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`, `<footer>`)
2. Interactive elements must be native: `<button>` for actions, `<a>` for navigation, `<input>`/`<select>`/`<textarea>` with real `<label>` — never `<div onclick>` trees
3. Native widgets replace component libraries: `<dialog>` (modal + `showModal()` + inert backdrop), `<details>/<summary>` (disclosure), `popover` attribute (tooltips/menus), `<input type="date|color|email|file|checkbox|radio">`
4. Forms rely on native validation first: `required`, `type`, `pattern`, `minlength/maxlength`, `min/max`, `:invalid`/`:valid`, `novalidate` only to take over deliberately with the Constraint Validation API
5. Tables for tabular data (`<table>` + `<caption>` + `scope`); images with meaningful `alt`; `<picture>`/`srcset` for responsive media; lazy-load off-screen media with `loading="lazy"`
6. Give form controls `autocomplete` and `name`; buttons get `type`; link-like controls keep real `href` so context-click/middle-click work

### 4. Prefer Standard Web APIs Over Libraries

> Goal: delete dependencies that the platform already provides

| Need | Often installed | Standard to use instead |
|---|---|---|
| HTTP client | axios | `fetch` + `AbortController` |
| Date/time formatting & timezone | moment/dayjs | `Intl.DateTimeFormat`, `Temporal` (check Baseline) |
| Number/currency/plural formatting | numeral libs | `Intl.NumberFormat`, `Intl.PluralRules`, `Intl.ListFormat` |
| Deep clone | lodash.cloneDeep | `structuredClone` |
| URL parse/build | url libs | `URL`, `URLSearchParams`, `URLPattern` |
| Intersection/size observation | scroll/resize libs | `IntersectionObserver`, `ResizeObserver` |
| Clipboard read/write | clipboard libs | Async Clipboard API |
| Drag and drop | dnd libs | HTML Drag and Drop API |
| Client routing state | extra history libs | `history.pushState` + `popstate` (framework routers already wrap this — keep the framework) |
| DOM ready/idle scheduling | hacky timeouts | `DOMContentLoaded`, `requestIdleCallback`/`requestAnimationFrame` |
| Animation of DOM/state | JS animation libs | CSS transitions + View Transitions; JS only for timelines → run `/follow-lib-animejs` |
| Web components / reusable elements | extra frameworks | Custom Elements + Shadow DOM when a framework isn't in play |

1. A library still wins when it adds real value (framework reactivity, virtualized long lists, cross-browser gaps) — record the reason in code or PR
2. Before installing anything for UI behavior → search the standards table above and current Baseline first

### 5. Meet The Accessibility Standards

> Goal: platform defaults satisfy most WCAG requirements

1. Apply the first rule of ARIA: a native element already does it → use it, don't re-create it with `role` + `aria-*`; ARIA only for what has no native equivalent
2. Second rule: don't use ARIA to change native semantics (no `role="button"` on an `<a>` without href behavior)
3. Verify keyboard paths: tab order, visible focus (`:focus-visible` styling per `/follow-lib-css`), Escape closes `<dialog>`/popovers natively
4. Respect user preferences: `prefers-reduced-motion`, `prefers-color-scheme`, forced-colors — behavior belongs to `/follow-lib-css`, this skill requires they exist
5. Landmarks, labels, and live regions come from semantics; check name/role/value against the accessibility tree before adding `aria-label`

### 6. Progressive Enhancement And Verify

> Goal: the page degrades gracefully and the result is proven

1. Gate non-widely-available features: JS `if ('showPopover' in HTMLElement.prototype)`, CSS `@supports` — fallbacks must stay functional (a `<dialog>` fallback: plain form submission still works)
2. Core content and navigation must work with JS disabled where feasible (real `<a>`/`<form>` actions, server-rendered content)
3. Verify in a browser: run `/use-agent-browser` (or `/use-playwriter` when login state is needed) to click through forms, dialogs, and keyboard flows
4. Run `/follow-tool-lighthouse` for an a11y/best-practices audit of the changed routes; fix findings via `/deep-review` accessibility dimension
5. Commit per project convention → run `/git-commit`; docs/UX scopes ship via `/ship`

## Rules

### 1. Standards-First Order

- Choose in this order: native element → native API → CSS feature → framework primitive → dependency → hand-rolled
- Every dependency replacing a platform feature must state why the standard was insufficient
- Never ship a polyfill for a Baseline widely available feature; remove stale polyfills when targets allow

### 2. Baseline Policy

- Target = Baseline widely available unless `browserslist` says otherwise
- Newly-available features: ship only with a feature check + fallback; not-in-Baseline: prototypes only
- Feature status is never hardcoded in this skill — live-check per `### 2` every time it is used

### 3. Boundaries

- CSS authoring rules → run `/follow-lib-css` to write CSS per Baseline
- Utility engine config → run `/follow-lib-unocss` if needed
- Project/framework scaffolding → run `/follow-create-web` to choose the stack
- Design tokens/visual system → run `/follow-design-system` if needed

### 4. Content Discipline

- Don't rewrite whole files; minimal diff, preserve existing structure and framework idioms
- Don't force a standards migration in unrelated PRs; convert the code you touch
- No `**` bold in output docs; backticks for elements, APIs, and skill names

- Use /deep-research to live-check feature availability
- Use /follow-best-practice if needed
- Use /follow-lib-web-vitals if measuring performance impact
- Use /use-agent-browser if needed
- Use /follow-tool-lighthouse if needed
- Use /follow-up-to-date to keep feature claims fresh

## Expected Outcome

- Markup is semantic and native widgets replace custom JS components
- UI dependencies shrink as standard Web APIs take over their jobs
- Accessibility achieved through semantics, verified in the accessibility tree
- All shipped features are Baseline-checked with working fallbacks
- Lighthouse/agent-browser verification passes with evidence
