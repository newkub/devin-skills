# Event Handling Checks

## Listener Cleanup

- `addEventListener`/`removeEventListener` pairs: คู่กันเสมอ
- cleanup on unmount: ทุก listener ต้อง cleanup ตอน unmount
- cleanup on route change: cleanup ตอน route change ถ้าจำเป็น
- cleanup on component destroy: cleanup ตอน component destroy
- missing `removeEventListener` detection: หา listener ที่ไม่มี cleanup

## Memory Leak Prevention

- listener leak detection: หา listener ที่ไม่ cleanup
- closure reference leak: หลีกเลี่ยง closure ที่ reference detached DOM
- detached DOM element listeners: cleanup ก่อน detach
- global listener cleanup: `window`/`document` listener ต้อง cleanup
- interval/timeout cleanup: `clearInterval`/`clearTimeout` ตอน unmount

## Event Delegation

- event delegation patterns: delegate สำหรับ list of items
- delegation vs direct binding: เลือกตาม context
- delegation performance: ลด listener count
- delegation correctness: target matching ถูกต้อง
- delegation cleanup: cleanup single delegated listener

## Event Target Correctness

- correct event target: ใช้ `event.target` vs `event.currentTarget` ให้ถูก
- event bubbling: เข้าใจ bubble และ stop propagation
- event capturing: ใช้ capture เฉพาะจำเป็น
- event delegation target matching: `matches()` หรือ `closest()`

## Passive Listeners

- `passive: true` for touch/wheel events: ป้องกัน scroll jank
- passive listener on scroll: ใช้ passive สำหรับ scroll handler
- passive listener performance: ลด blocking
- missing passive flag detection: หา listener ที่ควรเป็น passive
- passive vs non-passive decision: non-passive เฉพาะต้อง `preventDefault`

## Debounce

- debounce on input/search/resize: ลด call frequency
- debounce time configuration: เวลาที่เหมาะสม
- debounce cleanup: cancel pending ตอน unmount
- debounce correctness: leading/trailing edge ตาม use case
- missing debounce detection: หา handler ที่ควร debounce

## Throttle

- throttle on scroll/resize/mousemove: ลด call frequency
- throttle time configuration: เวลาที่เหมาะสม
- throttle cleanup: cancel pending ตอน unmount
- throttle vs debounce selection: throttle สำหรับ continuous, debounce สำหรับ burst
- missing throttle detection: หา handler ที่ควร throttle

## Custom Events

- typed custom event payload: typed payload, no `any`
- custom event naming: consistent convention
- custom event documentation: document events
- `CustomEvent` usage: `new CustomEvent()` สำหรับ custom events
- event dispatching patterns: `dispatchEvent` บน correct element
- event listener for custom events: typed listener

## Global Event Listeners

- `window.addEventListener` cleanup: cleanup ตอน unmount
- `document.addEventListener` cleanup: cleanup ตอน unmount
- `visibilitychange` handler: handle tab visibility
- online/offline handler: handle connectivity change
- `beforeunload` handler: warn ก่อน leave ถ้ามี unsaved data
- `popstate` handler: handle browser back/forward

## Severity Reference

- Critical: listener ที่ไม่ cleanup ทำให้ memory leak, listener leak ใน critical path, detached DOM listener ที่ก่อให้เกิด error, `preventDefault` บน passive listener ที่ไม่ทำงาน, memory leak from missing cleanup ใน critical path
- High: missing cleanup on unmount, missing interval/timeout cleanup, missing global listener cleanup, no event delegation ที่ควรมี, incorrect event target, missing `passive: true`, missing debounce on search input, missing throttle on scroll, missing custom event typing, missing `visibilitychange` handler
- Medium: suboptimal debounce time, suboptimal throttle time, missing event delegation, minor custom event issue, missing `visibilitychange` handler
- Low: cosmetic, minor listener improvement, documentation gap
