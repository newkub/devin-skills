# Capture Component


Capture specific UI components for docs/review/testing via `capture component` (merged from `capture-component`)

#### Component — Execute

##### 1. Identify Component

1. If the user names a component file → read it to see its props and variants
2. If the user names a URL + selector → use them directly
3. If nothing is given → search for components in `src/components`, `src/ui`, `packages/*/src/components`

##### 2. Prepare Component View

> Goal: have a view that shows the component on its own

1. If Storybook exists → open that component's story
2. If a dev server exists → create or find a URL that renders just the bare component
3. For static HTML → create a temp page at `public/screenshots/components/<name>.html`
4. For TUI/CLI → use `capture terminal --cmd ...` instead

##### 3. Capture

```bash
bun D:/newkub/agents-capture/src/presentation/cli.ts component <url> --selector "<css>" --out public/screenshots/components/<name>.png
```

- The CLI `scrollintoview`s the selector then screenshots the viewport
- Multiple variants → separate files, e.g. `<name>-primary.png`, `<name>-disabled.png`
- Multiple selectors on the same routes → use `capture all --components "nav=header@/,form=form@/request"` instead

##### 4. Verify And Report

1. Open the image with `read` — the component must be clearly visible
2. If unclear → adjust the viewport (`capture all --devices "name=WxH"`) or theme, then capture again
3. Delete the temporary HTML once the capture is done if you don't need it

#### Component — Rules

- The component must appear alone on screen — don't capture navbar/sidebar/layout
- If the component needs a provider → set up the provider before capturing
- Name it after the component (PascalCase or filename) + variant suffix
- Save into `public/screenshots/components/`
- If the component requires authentication → ask the user first

#### Component — Expected Outcome

- Get a separate image per component/variant, ready for use with `/deep-review-codebase`, `/update-readme-md`

