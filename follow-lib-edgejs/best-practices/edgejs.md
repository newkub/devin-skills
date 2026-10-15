# Edge.js — Best Practices

Template engine for Node.js — patterns, escaping and component discipline

## Recommended Patterns

- Escape by default — Edge escapes `{{ }}` automatically; use `{{{ }}}` (unescaped) only for sanitized content (e.g. via DOMPurify)
- Layouts + components: `@layout`/`@component`/`@slot` instead of long include chains — components get scoped props + slots
- Business logic stays outside the template — prepare the view model in the controller; the template only presents (`@if`, `@each`, helpers)
- Register helpers/globals once at boot — `edge.global()` for shared data (csrf token, current user)
- Cache templates in production (`edge.mount` + cache flag) — dev = no cache, prod = cached

## Common Pitfalls

- `@each` on an empty array → always use an `@else` branch for the empty state
- Never render user input via `{{{ }}}` — the same mutation-XSS surface as innerHTML
- Async logic in templates — Edge supports some `@async`/`await` forms but you should fetch before render
- Template paths: use `edge.mount()` namespaces (`'components'`) — relative includes are fragile when files move
- CSRF: Edge doesn't inject the token itself — pass `csrfToken` via global/locals then a hidden input in every form

## Perf Notes

- Compiled templates cache in memory — restart the worker when deploying; no disk thrash
- Small inline partials beat file-per-partial for tiny fragments — I/O per render

## Do / Don't

| Do | Don't |
|----|-------|
| `{{ }}` escaped output | `{{{ }}}` on user content |
| components + slots | include spaghetti |
| view model prepared outside the template | query/logic in the template |
| `edge.global()` for shared | passing duplicated locals every render |
