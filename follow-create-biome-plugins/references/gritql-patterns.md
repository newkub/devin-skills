# GritQL Pattern Syntax Reference

GritQL pattern syntax สำหรับเขียน Biome linter plugins — metavariables, regex, conditions, pattern modifiers, rewrites และ `or` blocks

## Code Snippets

Code snippets คือ pattern พื้นฐาน ใช้ backticks ครอบ code ทำ structural matching (ละเว้น whitespace และ quote style)

```grit
`console.log('Hello, world!')`
```

จะ match ทั้ง `console.log("Hello, world!")` และ multi-line variants

## Metavariables

ใช้ `$` prefix สำหรับ match any node

### Named Metavariables

```grit
`console.log($message)`       // match any argument
`console.$method($message)`   // match any method on console
`$fn && $fn()`                // same var twice — match foo && foo()
```

### Anonymous Metavariable

`$_` match any node โดยไม่สร้าง named binding

```grit
`import $_ from $source`
```

### Spread Metavariable

`$...` match zero หรือ more arguments/elements

```grit
`$collection.forEach($...)`       // zero or more args
`new Date($first, $...)`          // at least one arg
```

## Regex Patterns

ใช้ `r"..."` สำหรับ match text content ของ node

```grit
$value <: r"#[0-9a-fA-F]+"           // hex colors
$params <: r".*,.*,.*,.*"            // 4+ parameters
```

### Regex With `or`

```grit
$value <: or {
    r"#[0-9a-fA-F]+",
    r"rgba?\(.*\)",
    r"hsla?\(.*\)"
}
```

## Conditions

### `where` Clause

เพิ่ม conditions คั่นด้วย comma ทุก condition ต้องเป็น true

```grit
`$left == $right` where {
    $right <: not `null`,
    $left <: not `null`,
    register_diagnostic(
        span = $left,
        message = "Use `===` instead of `==`.",
        severity = "warn"
    )
}
```

### Match Operator `<:`

```grit
`console.$method($message)` where {
    $method <: `log`
}
```

### `not` Keyword

```grit
$right <: not `null`
```

### `or` Operator (Inside Conditions)

match ถ้า อย่างน้อย หนึ่ง child pattern match

```grit
$method <: or { `log`, `info`, `warn`, `error` }
```

## Pattern Modifiers

### `as` — Bind Matched Node

bind ทั้ง matched node ไปยัง variable เพื่อใช้ใน `span` หรือ rewrite

```grit
`$collection.forEach($...)` as $call where {
    register_diagnostic(
        span = $call,
        message = "Prefer `for...of` over `.forEach()`."
    )
}
```

### `contains` — Deep Subtree Search

ค้นหา pattern ใน subtree ทุกระดับ

```grit
JsConditionalExpression() as $outer where {
    $outer <: contains JsConditionalExpression() as $inner,
    register_diagnostic(span = $inner, message = "Nested ternary not allowed.")
}
```

```grit
$decl <: contains `color: $color` as $rule
```

## CST Node Matching

match Biome's concrete syntax tree nodes โดยตรง ใช้ PascalCase names

### Basic Node Match

```grit
engine biome(1.0)
language js(typescript, jsx)

JsIfStatement() as $stmt where {
    register_diagnostic(span = $stmt, message = "Found an if statement")
}
```

### Node With Fields

```grit
JsConditionalExpression(consequent = $cons) where {
    register_diagnostic(span = $cons, message = "Found consequent branch")
}
```

### Nested Node Patterns

```grit
JsCatchClause(body = JsBlockStatement(statements = [])) as $catch where {
    register_diagnostic(span = $catch, message = "Empty catch not allowed.")
}
```

## Rewrites

ใช้ `=>` operator สำหรับ suggest code rewrites

```grit
`console.log($msg)` as $call where {
    register_diagnostic(
        span = $call,
        message = "Use console.info instead of console.log.",
        severity = "warn",
        fix_kind = "safe"
    ),
    $call => `console.info($msg)`
}
```

### Rewrite Behavior

- ไม่มี `--write`: rewrites แสดงเป็น suggestions แต่ไม่ apply
- `--write`: apply rewrites ที่ `fix_kind = "safe"`
- `--write --unsafe`: apply ทั้ง safe และ unsafe rewrites
- ถ้าไม่ระบุ `fix_kind`: rewrite ถือว่าเป็น `unsafe` โดย default

## `or` Blocks

### Top-Level `or` — Combine Patterns

```grit
or {
    `eval($code)` as $match,
    `new Function($...)` as $match
} where {
    register_diagnostic(span = $match, message = "Dynamic code eval not allowed.")
}
```

### Multiple Rules In One File

แต่ละ arm มี `where` clause ของตัวเอง

```grit
or {
    `debugger` as $match where {
        register_diagnostic(span = $match, message = "Remove `debugger`.")
    },
    `alert($...)` as $match where {
        register_diagnostic(span = $match, message = "Remove `alert()`.")
    },
    `console.$method($...)` as $match where {
        $method <: or { `log`, `debug`, `trace` },
        register_diagnostic(span = $match, message = "Remove debug logging.", severity = "warn")
    }
}
```

## Header Directives

```grit
engine biome(1.0)                  // use Biome syntax tree
language js                        // JavaScript (default)
language js(typescript)            // TypeScript
language js(typescript, jsx)       // TypeScript + JSX
language css                       // CSS
language json                      // JSON
```

## Built-In Variables

### `$filename`

match ชื่อไฟล์ปัจจุบัน ใช้กับ regex

```grit
`console.log($message)` where {
    $filename <: r".*\.ts$"
}
```

## Sources

- https://biomejs.dev/reference/gritql/
- https://biomejs.dev/linter/plugins/
- https://biomejs.dev/recipes/gritql-plugins/
- https://docs.grit.io/language/overview
