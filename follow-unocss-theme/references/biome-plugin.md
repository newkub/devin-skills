# Biome Plugin — Enforce Theme Tokens In UI

Biome ไม่มี official UnoCSS rules → เขียน GritQL plugin เอง (setup ตาม `/follow-create-biome-plugin`, config ตาม `/follow-tool-biome`)

## Rules ที่ควรมี

| Rule | Pattern | เหตุผล |
|------|---------|--------|
| `no-dark-variant` | class string มี `dark:` | tokens สลับผ่าน CSS vars — `dark:` redundant และทำให้สองระบบชนกัน |
| `no-palette-class` | `(bg\|text\|border\|ring\|…)-<palette>-\d+` | palette hardcode ข้าม theme — ไม่สลับ dark mode |
| `no-inline-color` | `style={{ color: '#…' }}` / `rgba(` | inline color ข้าม theme |

## Gotchas ที่เจอจริง (Biome 2.5.x)

1. **JSX attribute strings ≠ JS string literals** — `class="..."` เป็น node `JsxString()`, ส่วน `'...'` / `"..."` ใน JS (clsx, template parts) เป็น `JsStringLiteralExpression()` — ต้อง match ทั้งคู่ มิฉะนั้น pattern ไม่เห็น JSX classes เลย
2. **Metavar ใน string literal (`"$x"`) ไม่ทำงานเป็น plugin** — match ใน `biome search` ได้แต่ `register_diagnostic(span=$x)` ไม่ยิง; ใช้ node matching แทน
3. **Regex ห้ามมี capture groups** — `(bg|text)` ทำให้ error `regex pattern matched N variables`; ใช้ `(?:…)` non-capturing เสมอ
4. **Boundary ต้องรองรับ quote char** — node text มี `"`/`'` ครอบ → `^` ไม่ตรงตำแหน่งแรกของ content; ใช้ `(?:^|[^\w-])` แทน `(?:^|\s)`
5. **`includes` ใน plugin object ไม่ทำงาน (≤2.5.x)** — ใช้ `overrides` แทน และ **ต้อง duplicate `linter` config** เข้าไปใน override เพราะ override reset settings
6. **Debug pattern ด้วย `bunx biome search '<query>' <file>`** ก่อนเขียน plugin — เร็วกว่า lint loop
7. Plugin error ไม่แสดงเป็น diagnostic เด่น — ดู `plugin errored:` ใน info output

## Plugin File — `lint/theme-classes.grit`

```grit
engine biome(1.0)
language js(typescript, jsx)

// JsxString = JSX attribute strings (class="..."); JsStringLiteralExpression = JS strings (clsx, template parts)
or {
  // dark: variant — tokens สลับผ่าน CSS vars ใน theme.css อยู่แล้ว
  or { JsxString() as $s, JsStringLiteralExpression() as $s } where {
    $s <: r".*(?:^|[^\w-])dark:[\w-]+.*",
    register_diagnostic(span = $s, message = "dark: variant not allowed — theme tokens switch via CSS variables in theme.css")
  },
  // palette classes เช่น bg-blue-500 text-gray-600 — ใช้ semantic tokens แทน
  or { JsxString() as $p, JsStringLiteralExpression() as $p } where {
    $p <: r".*(?:^|[^\w-])(?:bg|text|border|ring|divide|outline|stroke|fill|from|via|to|decoration|placeholder|caret|accent)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]+.*",
    register_diagnostic(span = $p, message = "palette class not allowed — use a theme token from uno.config.ts")
  }
}
```

หมายเหตุ: `or{}` report diagnostic เดียวต่อ string (first matching branch) — พอเพียงเพราะ flag ทั้ง string; template literals ที่มี `${}` ตรวจด้วย `scripts/theme-lint.ts` (dynamic class check)

## Wiring — Restrict To UI Files (overrides)

`includes` ใน plugin object ยังไม่ reliable ใน ≤2.5.x → ใส่ plugin ใน `overrides` พร้อม duplicate `linter` config เดิม (override reset settings — ถ้าไม่ใส่ linter จะหลุด recommended rules):

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

- `includes` ต้องมี positive `**` pattern ก่อนเสมอ — negation `!pattern` เป็น exception เท่านั้น
- copy `linter`/settings เดิมทั้งก้อนเข้า override ไม่งั้น rules ที่เปิดไว้จะปิด
- suppress เฉพาะจุดด้วย `// biome-ignore lint/plugin: <reason>` — ต้องมีเหตุผล
- เมื่อ project อัปเกรด Biome ให้ลอง `includes` ใน plugin object อีกครั้ง (docs รองรับแล้วในเวอร์ชันใหม่กว่า)

## Verify

```bash
bunx biome lint                    # plugin diagnostics แสดงใน output
bunx biome search '<gritql>' file  # debug pattern ก่อน
```

- ทดสอบด้วยไฟล์ที่มี `dark:bg-x` / `bg-blue-500` → ต้องขึ้น `plugin` diagnostic
- ทดสอบไฟล์ที่ใช้ `bg-bg text-ink` → ผ่าน
- ทดสอบไฟล์นอก `includes` → plugin ไม่ทำงาน
- เทียบ error/warning count ก่อน-หลัง overrides → ต้องเท่าเดิม (ไม่นับ plugin diagnostics)

## ESLint Alternative

```ts
import unocss from '@unocss/eslint-plugin'
export default [unocss.configs.flat]
```

ได้ `unocss/order` (autofix), `unocss/order-attributify`, `unocss/blocklist` — แต่ไม่มี theme-token rule → รัน `scripts/theme-lint.ts` คู่กันเสมอ
