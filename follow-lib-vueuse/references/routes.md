# Follow Lib Vueuse Route Map

- Website: <https://vueuse.org>
- Functions index: <https://vueuse.org/functions.html>
- Guide: <https://vueuse.org/guide/>
- Repository: <https://github.com/vueuse/vueuse>

## Top Routes By Section

| Route / Topic | URL |
|---|---|
| Functions index (search all composables) | https://vueuse.org/functions.html |
| Guide / getting started | https://vueuse.org/guide/ |
| Best practices | https://vueuse.org/guide/best-practice.html |
| Add-ons (`@vueuse/*` integrations) | https://vueuse.org/integrations.html |
| Per-function docs pattern | `https://vueuse.org/core/<fnName>/` e.g. https://vueuse.org/core/useLocalStorage/ |
| Repository / releases | https://github.com/vueuse/vueuse |

## Composable Categories (vueuse.org/functions.html)

| Category | Examples |
|---|---|
| State | `useLocalStorage`, `useSessionStorage`, `useAsyncState`, `useStorage`, `createSharedComposable` |
| Elements | `useElementBounding`, `useWindowSize`, `useScroll`, `useIntersectionObserver`, `useResizeObserver`, `useElementVisibility`, `useElementOverflow` |
| Browser | `useMediaQuery`, `useClipboard`, `useDark`, `useCssSupports`, `useTitle` |
| Sensors | `useMouse`, `useGeolocation`, `useNetwork`, `useDraggable`, `useDropZone` |
| Animation | `useInterval`, `useTimeout`, `useTransition`, `useRafFn` |
| Network | `useFetch`, `useWebSocket`, `useEventSource` |
| Utilities | `useSortable`, `useEventListener`, `onClickOutside`, `tryOnScopeDispose` |

## Key Concepts

- VueUse v14 ต้องการ Vue 3.5+; v14.4 เพิ่ม `useElementOverflow`, confidence ใน `useSpeechRecognition`, `useVirtualList` scrollTo options
- Deprecated ใน v14: `watchPausable` (ใช้ Vue 3.5 native `watch` controls), `computedEager` (ใช้ `computed`), alias exports
- ดู API details ใน [references/vueuse.md](vueuse.md) และ [references/apis.md](apis.md)
