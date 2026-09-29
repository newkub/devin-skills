# Hardcoded-String Extraction Checklist — review-i18n

## Detection Patterns

- [ ] JSX text nodes — `>English text<` in components not through `t()`/`formatMessage`
- [ ] string literals in UI props — `placeholder=`, `title=`, `label=`, `aria-label`, `alt=`
- [ ] template literals with English — `` `Hello ${name}` `` vs `t('greeting', {name})`
- [ ] error/validation messages — `throw new Error('...')`, `toast('...')`, `alert('...')`
- [ ] confirmation/dialog text — `confirm('...')`, modal titles, button labels
- [ ] status/empty states — "Loading...", "No results", "Error occurred"
- [ ] meta content — `document.title`, meta descriptions, OG tags

## Common Hiding Spots

- [ ] constants files — `const LABELS = { save: 'Save' }` shadow i18n
- [ ] enums/unions — `type Status = 'pending' | 'active'` rendered directly
- [ ] config objects — menu items, table columns, form field defs
- [ ] server responses — API error strings shown raw to users
- [ ] default props — `placeholder = 'Search...'` in component signature
- [ ] comments→strings — `// TODO` notes accidentally visible (edge case)

## False Positives To Exclude

- [ ] internal keys — `data-testid`, `key` props, DOM ids, CSS classes
- [ ] technical strings — URLs, MIME types, protocol strings, units
- [ ] brand/product names — intentionally untranslated
- [ ] code samples — `<code>` content, syntax highlighting
- [ ] dev-only strings — console.log, debug panels behind flag
- [ ] test files — spec strings, fixtures, mocks

## Extraction Strategy

- [ ] i18n extraction tool — `i18next-parser`, `formatjs extract`, custom script
- [ ] AST-based scan — JSXText nodes, string literal args to UI props
- [ ] lint rules — `eslint-plugin-i18next`/`no-literal-string` catching misses
- [ ] runtime detection — missing-key warnings in dev mode logged

## Message Quality

- [ ] complete sentences — translatable units not word fragments concatenated
- [ ] context included — "Post" ambiguous (verb? noun? mail?) → `post.verb`/`post.noun`
- [ ] no string surgery — `"You have " + count + " items"` → ICU plural
- [ ] no conditionals in strings — `isAdmin ? 'Admin Panel' : 'Panel'` → two keys
- [ ] gender/person handled — not just English assumptions

## Coverage Metrics

- [ ] extraction coverage — % of UI text through i18n vs hardcoded
- [ ] per-file/module breakdown — which areas have most leaks
- [ ] severity — user-facing vs admin-only vs dev tools
- [ ] false positive rate — scan quality signal

## Automated Prevention

- [ ] CI check — extraction diff fails build on new hardcoded strings
- [ ] lint rule — `no-literal-string` in user-facing code paths
- [ ] code review checklist — PRs with new UI text require i18n keys
- [ ] pre-commit hook — quick scan for obvious patterns

## Detection Commands

- grep JSX text: `>([A-Z][a-z]+ )` in .tsx/.jsx
- grep UI props: `placeholder="`, `title="`, `aria-label="`, `label="` in components
- grep error strings: `new Error(`, `throw`, `toast(`, `alert(`
- AST scan: babel/eslint plugin finding JSXText + literal props
- grep English-only patterns — `^[A-Z][a-z]+ [a-z]+$` in string literals

Severity: user-facing hardcoded strings = High (missing locale coverage), dev/internal = Low, technical strings = not a finding
