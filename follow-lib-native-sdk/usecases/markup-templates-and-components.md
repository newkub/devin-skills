# Use Case — Markup Templates and Components

> Build the view from `.native` elements once, then extract repeated structures into templates with arguments and slots. Source: https://native-sdk.dev (accessed 2026-10-20)

## 1. Lay out the screen with flex primitives

```xml
<!-- src/app.native -->
<column gap="12" padding="16">
  <row gap="8" cross="center">
    <text grow="1">Inbox</text>
    <badge>{plural(unread, "item", "items")}</badge>
  </row>

  <if test="{loading}">
    <progress />
  <else>
    <scroll>
      <for each="{items}" key="{it.id}" as="it">
        <text>{it.title}</text>
      </for>
    </scroll>
  </if>
</column>
```

`row` and `column` are the only layout primitives you need for most screens: `gap` spaces children, `grow` distributes leftover space, `padding` insets the container, `cross` aligns on the cross axis. An element that does not grow and has no fixed size collapses to its content.

## 2. Extract a template with arguments

```xml
<!-- src/components/row-item.native -->
<template name="row-item" args="title subtitle">
  <row gap="8" cross="center" padding="8">
    <column gap="2" grow="1">
      <text>{title}</text>
      <text>{subtitle}</text>
    </column>
    <slot />
  </row>
</template>
```

`args` declares the names the caller must pass; `<slot />` marks where the caller's children land. A template is markup only — it cannot read the model directly, so everything it needs arrives as an argument.

## 3. Import and use it

```xml
<import src="src/components/row-item.native" />

<column gap="12" padding="16">
  <for each="{items}" key="{it.id}" as="it">
    <use template="row-item" title="{it.title}" subtitle="{upper(it.owner)}">
      <badge>{it.unread}</badge>
    </use>
  </for>
</column>
```

The `import` is a path under `src/`, the same relative-path rule the core follows. A `<use>` without the import fails at `native markup check`; a missing argument fails the same check rather than rendering an empty label.

## 4. Send messages, never call functions

```xml
<button size="sm" variant="ghost" on-press="mark-all-read">Mark all read</button>
<button on-press="toggle:{it.id}">Toggle</button>
```

An event carries a message name, optionally with an argument after the colon. There is no expression evaluation in an event — `on-press="toggle(it.id)"` is not markup, it is a call that will not compile. Dispatch, then let `update` decide.

## 5. Keep expressions inside the closed library

```xml
<text>{fixed(total / 100, 2)}</text>
<text>{percent(done, total)}</text>
<text>{datetime(updatedAt)}</text>
```

The expression language allows `+ - * / == != < <= > >= and or not ++` and 17 functions (`upper lower trim min max abs round floor ceil plural pad fixed thousands percent date time datetime`). There are no method calls and no ternary, and an expression is capped at 256 bytes, 64 terms, and 16 levels. When a binding needs more, compute the field in `update` and bind that.

## 6. Debug the parse before guessing

```sh
native markup check
native markup dump
native markup lsp
```

`check` reports unknown elements, bad attribute names, and unresolved templates. `dump` prints the parsed tree — the fastest way to see that `<if>` swallowed a sibling because a closing tag was missing. `lsp` wires editor completion for element and attribute names.

## 7. Verify

1. `native check --strict` — the core still compiles after the markup change
2. `native markup check` — no unknown element, attribute, or template
3. `native dev` — editing the `.native` file hot-reloads while the model keeps its state
4. Click the row with `on-press="toggle:{it.id}"` — exactly one item flips
5. Rename `args="title"` to `heading` and run the checks — the call sites fail loudly
6. `native automate snapshot` — widget labels match what the markup renders

## Pitfalls

- Duplicating a row of markup instead of extracting a template, so every style change becomes a search across files.
- Passing the whole model into a template through one argument — pass the fields the template uses.
- Two sibling elements with the same structure and no `key` in the `<for>`, which breaks state and automation identity.
- Writing a ternary or a method call in a binding; the expression language has neither.
- Hardcoding colours instead of token names (`text`, `surface`, `accent`, `destructive`), which breaks the theme pack switch.
- A `<for>` inside a `<stack>` for a long list — use `<scroll>` with `<list>` so the runtime can virtualize.
- Editing the rendered output by hand in a screenshot instead of fixing the markup and re-checking.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/native-ui-markup.md`
- `best-practices/ts-core-subset.md`
- `usecases/scaffold-app.md`
- `usecases/cmd-and-services.md`
