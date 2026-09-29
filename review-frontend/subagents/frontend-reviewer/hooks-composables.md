# Hooks And Composables Design Checks

## Function Design

- single responsibility: หนึ่ง composable ทำหนึ่ง thing
- pure function where possible: แยก pure logic จาก side effects
- side effect isolation: side effects แยกจาก return value
- composable naming: `use-*` prefix
- composable file organization: `composables/`, `hooks/` directory

## Parameter Validation

- parameter types: typed parameters, no `any`
- parameter defaults: sensible defaults
- parameter validation: runtime validation สำหรับ critical params
- options object pattern: สำหรับ >2 params
- required vs optional parameters: ระบุชัดเจน

## Return Value Structure

- consistent return type: stable type ระหว่าง renders
- reactive vs non-reactive return: ระบุชัดว่าอันไหน reactive
- return value documentation: document return shape
- tuple vs object return: object สำหรับ >2 values
- stable return reference: หลีกเลี่ยง new object ทุก render

## Composable Reusability

- reusability across components: ใช้ซ้มได้หลาย component
- configurability: params ครอบคลุม use cases
- composable composition: composable ใช้ composable อื่นได้
- composable coupling: low coupling กับ component internals

## Reactivity

- signal/memo patterns: ใช้สำหรับ derived state
- computed/watch patterns: watch source stability, deep watch เฉพาะจำเป็น
- reactivity dependencies tracking: tracking ถูกต้อง
- reactivity leak prevention: หลีกเลี่ยง leak ไปนอก scope
- stale closure prevention: ใช้ ref หรือ dependency array ที่ถูกต้อง

## Lifecycle Management

- `onMount`/`onCleanup`: setup และ teardown คู่กัน
- `onUnmounted`/`onBeforeUnmount`: cleanup ก่อน destroy
- lifecycle ordering: setup ก่อนใช้, cleanup หลังใช้
- lifecycle error handling: catch errors ใน lifecycle hooks

## Effect Cleanup

- effect disposal: dispose effect ตอน unmount
- timer cleanup: `clearTimeout`/`clearInterval` ตอน unmount
- event listener cleanup: `removeEventListener` ตอน unmount
- subscription cleanup: unsubscribe ตอน unmount
- `AbortController` usage: abort ongoing requests ตอน unmount
- missing cleanup detection: หา effect ที่ไม่มี cleanup

## Resource Disposal

- WebSocket cleanup: close connection ตอน unmount
- IntersectionObserver cleanup: disconnect ตอน unmount
- ResizeObserver cleanup: disconnect ตอน unmount
- `AbortController` cleanup: abort และ release
- database connection cleanup: close connection

## Vue/Nuxt Specifics

- `ref`/`reactive` usage: ใช้ให้ถูก context
- `computed`/`watch` patterns: watch source, immediate, deep
- `provide`/`inject` patterns: typed injection, default values
- Vue lifecycle integration: `onMounted`, `onUnmounted`, `onBeforeUnmount`
- reactivity correctness: no reactivity leak, proper unwrap
- effect scope management: `effectScope` สำหรับ isolated effects
- SSR compatibility: ไม่ access `window`/`document` ตอน SSR
- `useFetch`/`useAsyncData` patterns: proper key, dedupe, SSR-friendly

## Severity Reference

- Critical: broken composable, memory leak from missing cleanup, reactivity leak, SSR incompatibility, effect that runs after unmount
- High: missing effect disposal, inconsistent return type, untestable composable, incorrect watch usage, missing ref unwrap, missing cleanup on unmount, stale closure
- Medium: suboptimal reactivity, minor naming inconsistency, missing composable documentation, missing parameter validation
- Low: cosmetic, minor naming, documentation gap
