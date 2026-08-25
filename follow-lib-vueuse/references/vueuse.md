# VueUse Reference

## Overview

VueUse is a collection of utility functions (composables) based on the Vue Composition API. It provides hundreds of ready-to-use composables for state management, DOM elements, browser APIs, sensors, network, animation, and more. VueUse is built for Vue 3 and ships with full TypeScript support and tree-shaking.

## Install

Install `@vueuse/core` for Vue 3 applications:

```bash
bun add @vueuse/core
```

For Nuxt projects, install the Nuxt module along with core:

```bash
bun add -D @vueuse/nuxt @vueuse/core
```

Or use the Nuxt CLI to add the module:

```bash
npx nuxt@latest module add vueuse
```

## Version Info

- Latest stable: `14.4.0`
- License: MIT
- Vue requirement: `3.5+` (from v14.0)
- Source: https://vueuse.org

## Peer Dependencies

VueUse v14 requires Vue `3.5+`:

- `vue`: `^3.5.0`

Internal packages (bundled, not direct peer deps):

- `@vueuse/shared`: `14.4.0`
- `@vueuse/metadata`: `14.4.0`
- `@types/web-bluetooth`: `^0.0.21`

Version compatibility history:

- From v14.0, VueUse requires Vue `3.5+`
- From v13.0, VueUse requires Vue `3.3+`
- From v12.0, VueUse no longer supports Vue 2 (use v11.x for Vue 2)

## Configuration

### Nuxt Module

Add `@vueuse/nuxt` to the `modules` array in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
  ],
})
```

This enables auto-imports for all VueUse composables across the Nuxt app. No manual imports needed.

Nuxt module options:

```ts
export interface VueUseNuxtOptions {
  // Enable auto-imports for VueUse composables (default: true)
  autoImports?: boolean
  // Register SSR handlers (experimental, default: false)
  ssrHandlers?: boolean
}
```

Usage with options:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt'],
  vueuse: {
    autoImports: true,
    ssrHandlers: false,
  },
})
```

### Tree-Shaking

VueUse is fully tree-shakeable. Only import the composables you use:

```ts
import { useMouse, useLocalStorage } from '@vueuse/core'
```

With Nuxt auto-imports, unused composables are not bundled.

### CDN

```html
<script src="https://unpkg.com/@vueuse/shared"></script>
<script src="https://unpkg.com/@vueuse/core"></script>
```

Exposed as `window.VueUse`.

## Key Composables Categories

VueUse organizes composables into core categories and add-on categories.

### State
Persistent and shared state management.
- `useLocalStorage` - reactive localStorage with type support
- `useSessionStorage` - reactive sessionStorage
- `useStorage` - generic reactive storage
- `useAsyncState` - async state with loading/error
- `createSharedComposable` - share a composable across instances
- `injectLocal` - extended `inject` with `provideLocal`

### Elements
DOM element observation and measurement.
- `useElementBounding` - reactive element bounding rect
- `useElementVisibility` - element visibility in viewport
- `useIntersectionObserver` - reactive IntersectionObserver
- `useWindowSize` - reactive window dimensions
- `useScroll` - reactive scroll position and state
- `useResizeObserver` - reactive ResizeObserver

### Browser
Browser environment and feature detection.
- `useMediaQuery` - reactive media query
- `useDark` - reactive dark mode with persistence
- `usePreferredDark` - user dark mode preference
- `useClipboard` - clipboard API with permissions
- `useCssSupports` - reactive CSS feature detection (new in v14)
- `useTitle` - reactive document title

### Sensors
Device and input sensors.
- `useMouse` - reactive mouse position
- `useDraggable` - draggable elements with auto-scroll (v14)
- `useDropZone` - drop zone with file validation (v14)
- `useGeolocation` - reactive geolocation API
- `useNetwork` - reactive network status
- `useDeviceMotion` - reactive device motion

### Network
Network and data fetching.
- `useFetch` - reactive fetch with abort and retry
- `useWebSocket` - reactive WebSocket with auto-reconnect
- `useEventSource` - reactive EventSource

### Animation
Animation and timing utilities.
- `useInterval` - reactive interval with controls
- `useTimeout` - reactive timeout with controls
- `useTransition` - transition between values
- `useRafFn` - requestAnimationFrame loop
- `useTimestamp` - reactive timestamp

### Watch
Enhanced watch utilities.
- `watchPausable` - pausable watch
- `watchDebounced` - debounced watch
- `watchThrottled` - throttled watch
- `watchOnce` - watch that triggers once
- `whenever` - watch that runs when condition is truthy

### Reactivity
Reactivity utilities.
- `toRef` - convert to ref
- `reactivePick` - pick reactive properties
- `syncRef` - sync two refs
- `computedWithControl` - computed with manual invalidation

### Array
Array reactive utilities.
- `useArrayFilter` - reactive array filter
- `useArrayMap` - reactive array map
- `useArraySort` - reactive array sort
- `useArrayEvery` - reactive array every
- `useArrayFind` - reactive array find

### Time
Time-based utilities.
- `useNow` - reactive current time
- `useCountdown` - reactive countdown
- `useTimeAgo` - reactive time-ago formatting
- `useDateFormat` - reactive date formatting

### Utilities
General utilities.
- `useSortable` - sortable lists with `watchElement` (v14)
- `useEventListener` - event listener with auto cleanup
- `onClickOutside` - click outside detection
- `useDebounce` - debounce function
- `useThrottle` - throttle function
- `tryOnScopeDispose` - safe scope disposal

## VueUse v14 New Features

- `useIntersectionObserver` supports reactive `rootMargin` (no observer recreate)
- `useDraggable` has auto-scroll in scrollable containers
- `useDropZone` has validation function for file type and size
- `useSortable` has `watchElement` for auto re-init on DOM changes
- `useCssSupports` for reactive CSS feature detection (new in v14)
- `useWebSocket` supports function for `autoConnect.delay`
- `useElementVisibility` has `initialValue` option
- Custom scheduler system from v14.1.0 for time-based composables

## Best Practices

- Destructure return values: `const { x, y } = useMouse()`
- Unwrap refs with `reactive()` for object property access: `const mouse = reactive(useMouse())`
- Pass reactive getters (since v9.0): `useTitle(() => isDark.value ? 'Dark' : 'Light')`
- Side-effects auto-clean on unmount; manual cleanup via returned stop handler or `effectScope`
- Use `effectScope` for grouped disposal of multiple composables
- Control event rate with filters: `useMouse({ eventFilter: debounceFilter(100) })`
- Custom scheduler (v14.1.0+): `useNow({ controls: true, scheduler: cb => useRafFn(cb) })`

## Authoring Guidelines

- Import Vue APIs from `"vue"`
- Use `ref` instead of `reactive` whenever possible
- Prefer `shallowRef` over `ref` for large data
- Use option object as arguments for flexibility
- Use `configurableWindow` for global variables like `window`
- Output `isSupported` flag for non-widely-supported Web APIs
- Make `immediate` and `flush` options configurable
- Use `tryOnScopeDispose` for cleanup
- Return PromiseLike for async composables (works with `<Suspense>`)

## Source

- https://vueuse.org/guide/
- https://vueuse.org/guide/best-practice
- https://vueuse.org/guide/config
- https://vueuse.org/guidelines
- https://vueuse.org/functions
- https://github.com/vueuse/vueuse
- https://www.npmjs.com/package/@vueuse/core
- https://www.npmjs.com/package/@vueuse/nuxt
