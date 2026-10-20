# TanStack Highlight — Best Practices

Syntax highlighting — token output, CSS theming, SSR precompute

## Recommended Patterns

- Highlight to semantic token classes and style them with CSS/custom properties; no colors in the highlighter options
- Precompute or SSR-highlight static content so the client ships no grammar work
- Load only the grammars the project actually uses, lazily where possible
- Map token classes onto design tokens (including a dark variant) so light/dark switch with the app theme
- Escape-check the produced HTML before using `dangerouslySetInnerHTML`; treat highlighted output as untrusted
- Compose line numbers, diff markers and copy buttons as wrapper markup around the highlighted block
- Hook markdown fences through the doc-model `code` node instead of regex-replacing rendered HTML

## Common Pitfalls

- Copying a theme with hardcoded hex values breaks on the app's dark mode
- Bundling every language makes the client bundle balloon
- Highlighting on every keystroke without memoization turns typing into a CPU spike
- Injecting highlight HTML without verifying escaping is an XSS path
- Parsing rendered HTML with regex to add line numbers corrupts nested markup
- Assuming the v1 token/API shape is final — verify export names against the docs

## Perf Notes

- Precompute static docs at build time; reserve client highlighting for live editors
- Memoize by `(source, language)` so identical blocks highlight once
- Highlight only the visible portion for very large files, or degrade to plain text with a copy action

## Do / Don't

| Do | Don't |
|----|-------|
| CSS tokens and variables | inline color config |
| build-time highlight for static content | highlight everything in the browser |
| lazy-load used grammars | import all languages |
| verify escaping first | trust raw HTML output |
| wrapper markup for line numbers | regex over rendered HTML |
