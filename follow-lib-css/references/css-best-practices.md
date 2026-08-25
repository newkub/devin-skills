# CSS Best Practices and Modern Features

## Source

- MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/CSS
- MDN CSS Code Style Guide: https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide/CSS
- Baseline: https://developer.mozilla.org/en-US/blog/baseline-evolution-on-mdn/

## Overview

CSS is a web standard built into all browsers — no package installation needed. Modern features are tracked via **Baseline**: a feature is "Widely available" when supported in the last two versions of Chrome, Edge, Firefox, and Safari (including mobile).

Optional PostCSS toolchain for vendor prefix fallbacks:

```bash
bun add -D postcss autoprefixer
```

## Modern CSS Features

### Cascade Layers (`@layer`) — Widely available since March 2022

```css
@layer theme, layout, utilities;

@layer theme {
  :root { --color-primary: #007bff; }
}

@layer utilities {
  .text-center { text-align: center; }
}
```

Later layers win over earlier layers regardless of specificity. Unlayered styles always override layered styles.

### CSS Nesting — Widely available since December 2023

```css
.card {
  padding: 1rem;
  & .title { font-size: 1.25rem; }
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
}
```

### CSS Custom Properties

```css
:root {
  --color-bg: #ffffff;
  --spacing-unit: 0.5rem;
}
body {
  background-color: var(--color-bg);
  padding: calc(var(--spacing-unit) * 2);
}
```

Register properties for type checking and animation:

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
```

### `:has()` and `:is()` Selectors — `:has()` widely available since December 2023

```css
.card:has(img) { padding: 0; }
.form-group:has(.error) { border-color: red; }
:is(h1, h2, h3):focus-visible { outline: 2px solid blue; }
```

### Container Queries — Widely available since February 2024

```css
.card-container { container-type: inline-size; container-name: card; }
@container card (min-width: 400px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
```

### Fluid Typography and Layout

```css
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
.sidebar { width: min(300px, 25vw); }
.video-thumbnail { aspect-ratio: 16 / 9; width: 100%; object-fit: cover; }
```

### `gap` with Flexbox and Grid

```css
.flex-row { display: flex; gap: 1rem; }
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

### `backdrop-filter` for Glassmorphism

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}
```

## Performance

```css
/* Lazy rendering for below-the-fold content */
.below-fold { content-visibility: auto; contain-intrinsic-size: 0 500px; }

/* Isolation for independent components */
.widget { contain: layout style paint; }

/* Compositor-friendly animations (no layout thrash) */
.fade-in { transition: opacity 0.3s ease, transform 0.3s ease; }

/* Web font loading */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
}
```

Use `will-change` sparingly — only on elements about to animate.

## Accessibility

```css
/* Keyboard-only focus styles */
button:focus-visible { outline: 2px solid #007bff; outline-offset: 2px; }
button:focus:not(:focus-visible) { outline: none; }

/* Respect motion sensitivity */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Use relative units: `rem`, `em`, `%`, `vw`, `vh` instead of fixed `px`.

## Browser Compatibility

### `@supports` for Feature Detection

```css
@supports (display: grid) {
  .layout { display: grid; }
}
@supports not (display: grid) {
  .layout { display: flex; flex-wrap: wrap; }
}
```

### Progressive Enhancement

```css
.card { background-color: #f0f0f0; }
@supports (backdrop-filter: blur(10px)) {
  .card { background-color: rgba(255,255,255,0.7); backdrop-filter: blur(10px); }
}
```

## CSS Architecture

### BEM Naming

```css
.card { }
.card__title { }
.card--featured { }
```

### Cascade Layer Organization

```css
@layer reset, base, components, utilities;

@layer reset { * { margin: 0; padding: 0; box-sizing: border-box; } }
@layer base { body { font-family: system-ui, sans-serif; } }
@layer components { .button { padding: 0.5rem 1rem; border-radius: 0.25rem; } }
@layer utilities { .text-center { text-align: center; } }
```

## MDN Code Style Guidelines

- Use modern CSS features once all major browsers support them (Baseline "Widely available")
- Do not use non-standard, deprecated, or prefixed features
- Do not write redundant or non-functional code
- Always add a fallback font family after custom fonts
- Use `@supports` for feature detection instead of browser sniffing
