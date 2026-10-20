| key | value |
|---|---|
| scope | umbrella skill — no package of its own; install per library |
| packages | `@tanstack/*` (one package per framework + library) |
| package registry | https://www.npmjs.com/org/tanstack |
| repo | https://github.com/TanStack |
| docs | https://tanstack.com/libraries |
| versions | per-library tables live in each `/follow-lib-tanstack-*` skill's `references/apis.md` |
| `{framework}` token | react, solid, vue, svelte, angular where the library supports it — Angular Query is still `angular-query-experimental`; Router/Start are React + Solid only |

| library | install | role | skill |
|---|---|---|---|
| Start | `@tanstack/{framework}-start` | full-stack SSR/streaming framework | `/follow-lib-tanstack-start` |
| Router | `@tanstack/{framework}-router` | type-safe routing | `/follow-lib-tanstack-router` |
| Query | `@tanstack/{framework}-query` | async server state | `/follow-lib-tanstack-query` |
| DB | `@tanstack/db` (+ framework adapters) | reactive client store, live queries, sync | `/follow-lib-tanstack-db` |
| Store | `@tanstack/{framework}-store` | client state, selectors | `/follow-lib-tanstack-store` |
| AI | `@tanstack/ai` | provider-agnostic AI SDK | `/follow-lib-tanstack-ai` |
| Table | `@tanstack/{framework}-table` | headless datagrid | `/follow-lib-tanstack-table` |
| Form | `@tanstack/{framework}-form` | headless forms + Standard Schema | `/follow-lib-tanstack-form` |
| Charts | `@tanstack/{framework}-charts` | grammar-of-graphics charts | `/follow-lib-tanstack-charts` |
| Markdown | `@tanstack/markdown` | serializable doc model, streaming | `/follow-lib-tanstack-markdown` |
| Highlight | `@tanstack/highlight` | themeable syntax highlighting | `/follow-lib-tanstack-highlight` |
| Virtual | `@tanstack/{framework}-virtual` | virtualized lists/grids | `/follow-lib-tanstack-virtual` |
| Pacer | `@tanstack/{framework}-pacer` | debounce/throttle/rate-limit/queue/batch | `/follow-lib-tanstack-pacer` |
| Hotkeys | `@tanstack/{framework}-hotkeys` | shortcuts, sequences, scopes | `/follow-lib-tanstack-hotkeys` |
| Devtools | `@tanstack/devtools` | unified devtools panel | `/follow-lib-tanstack-devtools` |
| CLI | `@tanstack/cli` | scaffolding + add-ons | `/follow-lib-tanstack-cli` |
| Intent | `@tanstack/intent` | ship agent skills inside npm packages | `/follow-lib-tanstack-intent` |
| Config | `@tanstack/config` | build/publish toolchain for packages | `/follow-lib-tanstack-config` |
