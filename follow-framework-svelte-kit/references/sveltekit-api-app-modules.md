# API — $app Modules (Stores, State, Environment)

## Purpose

Complete API reference for SvelteKit modules and types.

## $app/stores

### page

Current page information.

```typescript
import { page } from '$app/stores';

// Svelte 4
$: console.log($page.params.slug);
$: console.log($page.status);
$: console.log($page.error);

// Svelte 5
import { page } from '$app/state';
console.log(page.params.slug);
```

### navigating

Navigation state.

```typescript
import { navigating } from '$app/stores';

$: if ($navigating) {
  console.log('Navigating to:', $navigating.to.url.pathname);
}
```

### updated

Check for page updates.

```typescript
import { updated } from '$app/stores';

$: if ($updated) {
  console.log('Page has been updated');
}
```

## $app/state

### page

Reactive page object (Svelte 5).

```typescript
import { page } from '$app/state';

console.log(page.params);
console.log(page.url);
console.log(page.status);
console.log(page.error);
```

### navigating

Navigation state (Svelte 5).

```typescript
import { navigating } from '$app/state';

if (navigating) {
  console.log(navigating.to.url.pathname);
}
```

## $app/environment

### browser

Check if running in browser.

```typescript
import { browser } from '$app/environment';

if (browser) {
  // Client-side only code
}
```

### building

Check if building for prerender.

```typescript
import { building } from '$app/environment';

if (building) {
  // Build-time code
}
```
