# Biome Plugin — Enforce Theme Tokens In UI

Biome has no official UnoCSS rules → write a GritQL plugin yourself (setup per `/follow-create-biome-plugin`, config per `/follow-tool-biome`)

## Rules to have

| Rule | Pattern | Reason |
|------|---------|--------|
| `no-dark-variant` | class string contains `dark:` | tokens switch via CSS vars — `dark:` is redundant and makes the two systems collide |
| `no-palette-class` | `(bg\|text\|border\|ring\|…)-<palette>-\d+` | palette hardcode bypasses the theme — does not switch in dark mode |
| `no-inline-color` | `style={{ color: '#…' }}` / `rgba(` | inline color bypasses the theme |

## Real gotchas encountered (Biome 2.5.x)

1. **JSX attribute strings ≠ JS string literals** — `class="..."` is a `JsxString()` node, while `'...'` / `"..."` in JS (clsx, template parts) are `JsStringLiteralExpression()` — must match both, otherwise the pattern never sees JSX classes
2. **Metavars inside string literals (`"$x"`) do not work as a plugin** — they match in `biome search` but `register_diagnostic(span=$x)` does not fire; use node matching instead
3. **Regex must not contain capture groups** — `(bg|text)` causes the error `regex pattern matched N variables`; always use `(?:…)` non-capturing
4. **Boundaries must account for quote chars** — node text is wrapped in `"`/`'` → `^` does not align with the first content char; use `(?:^|[^\w-])` instead of `(?:^|\s)`
5. **`includes` in the plugin object does not work (≤2.5.x)** — use `overrides` instead, and **duplicate the `linter` config** into the override because the override resets settings
6. **Debug patterns with `bunx biome search '<query>' <file>`** before writing the plugin — faster than the lint loop
7. Plugin errors are not shown as prominent diagnostics — look for `plugin errored:` in the info output

## Plugin File — `lint/theme-classes.grit`

```grit
engine biome(1.0)
language js(typescript, jsx)

// JsxString = JSX attribute strings (class="..."); JsStringLiteralExpression = JS strings (clsx, template parts)
or {
  // dark: variant — tokens already switch via CSS vars in theme.css
  or { JsxString() as $s, JsStringLiteralExpression() as $s } where {
    $s <: r".*(?:^|[^\w-])dark:[\w-]+.*",
    register_diagnostic(span = $s, message = "dark: variant not allowed — theme tokens switch via CSS variables in theme.css")
  },
  // palette classes such as bg-blue-500 text-gray-600 — use semantic tokens instead
  or { JsxString() as $p, JsStringLiteralExpression() as $p } where {
    $p <: r".*(?:^|[^\w-])(?:bg|text|border|ring|divide|outline|stroke|fill|from|via|to|decoration|placeholder|caret|accent)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+.*",
    register_diagnostic(span = $p, message = "palette class not allowed — use a theme token from uno.config.ts")
  }
}
```

Note: `or{}` reports one diagnostic per string (the first matching branch) — sufficient since the whole string is flagged; template literals containing `${}` are checked by `scripts/theme-lint.ts` (dynamic class check)

## Wiring — Restrict To UI Files (overrides)

`includes` in the plugin object is still unreliable in ≤2.5.x → put the plugin in `overrides` with the original `linter` config duplicated (the override resets settings — without the linter block, recommended rules are lost):

```jsonc
{
  "overrides": [
    {
      "includes": ["src/**", "!src/routeTree.gen.ts", "!src/**/*.gen.*"],
      "plugins": ["./lint/theme-classes.grit"],
      "linter": {
        "domains": {
          "project": "recommended",
          "solid": "recommended",
          "types": "recommended"
        }
      }
    }
  ]
}
```

- `includes` must always start with a positive `**` pattern — negation `!pattern` is an exception only
- copy the entire original `linter`/settings block into the override, otherwise enabled rules get switched off
- suppress locally with `// biome-ignore lint/plugin: <reason>` — a reason is required
- when the project upgrades Biome, retry `includes` in the plugin object (supported in newer versions per the docs)

## Verify

```bash
bunx biome lint                    # plugin diagnostics appear in the output
bunx biome search '<gritql>' file  # debug the pattern first
```

- test with a file containing `dark:bg-x` / `bg-blue-500` → must show a `plugin` diagnostic
- test a file using `bg-bg text-ink` → passes
- test a file outside `includes` → the plugin does not run
- compare error/warning counts before/after overrides → must stay the same (not counting plugin diagnostics)

## ESLint Alternative

```ts
import unocss from '@unocss/eslint-plugin'
export default [unocss.configs.flat]
```

Gives `unocss/order` (autofix), `unocss/order-attributify`, `unocss/blocklist` — but no theme-token rule → always run `scripts/theme-lint.ts` alongside it
