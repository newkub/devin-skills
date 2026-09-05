---
name: follow-lib-animejs
description: ใช้ Anime.js v4 สร้าง DOM/CSS animations, timelines, staggers และ utilities บน web apps
related:
  - follow-lib-css
  - follow-lib-react
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
  - follow-lang-javascript
  - follow-lang-typescript
---

## Goal

ใช้ Anime.js v4 (latest v4.5.0) ในโปรเจกต์ด้วย ESM-first API สำหรับสร้าง animation ที่รวดเร็ว มีประสิทธิภาพ และ maintainable

## Scope

ใช้สำหรับ:
- DOM/CSS animations ด้วย `animate()`
- ควบคุม sequence ด้วย `createTimeline()`
- staggered animations ด้วย `stagger()`
- utilities (`utils.set`, `utils.get`, `lerp`, `damp`, `engine`)
- scroll, layout, SVG, text, WAAPI integrations
- ใช้ร่วมกับ React, Vue, Svelte, และ plain JS

## Execute

### 1. Install And Setup

> Goal: Install And Setup

1. `bun add animejs` หรือ `npm install animejs`
2. import สำหรับ v4:

```javascript
import { animate, createTimeline, stagger } from 'animejs';

// หรือ import แบบ subpath เพื่อ tree-shaking
import { animate } from 'animejs/animation';
import { createTimeline } from 'animejs/timeline';
```

3. ตรวจสอบ version: `npm ls animejs` หรือดู `package.json`

### 2. Learn Core API

> Goal: Learn Core API

```javascript
// สร้าง animation
animate('.box', {
  x: 250,
  rotate: { from: -180 },
  duration: 1200,
  delay: stagger(80, { from: 'center' }),
  ease: 'inOutQuint',
});

// Timeline
const tl = createTimeline({
  defaults: { duration: 800, ease: 'outQuad' },
});
tl.add('.a', { x: 100 })
  .add('.b', { y: -50 }, '-=400');

// Utilities
import { utils } from 'animejs';
utils.set('.box', { opacity: 0.5 });
```

### 3. Key Concepts

> Goal: Key Concepts

- `targets`: CSS selector, DOM elements, JS objects, array
- Animatable properties: CSS, transforms, CSS variables, SVG attributes, HTML attributes, JS object properties
- Tween parameters: `from`, `to`, `delay`, `duration`, `ease`, `composition` (`replace` | `blend` | `none`), `modifier`
- Playback: `loop`, `alternate`, `reversed`, `autoplay`, `frameRate`, `playbackRate`, `playbackEase`
- Keyframes: tween-value, tween-parameter, duration-based, percentage-based
- Callbacks: `onBegin`, `onBeforeUpdate`, `onUpdate`, `onRender`, `onLoop`, `onComplete`, `onPause`, `then()`
- Timeline: `add()`, `set()`, `call()`, `sync()`, `label()`, `remove()`, `seek()`, `stretch()`
- `stagger` options: `from`, `grid`, `axis`, `reversed`, `ease`, `jitter`, `seed`

### 4. Apply Patterns And Best Practices

> Goal: Apply Patterns And Best Practices

- ใช้ `transform` (translate/scale/rotate) และ `opacity` เป็นหลัก
- หลีกเลี่ยง animate properties ที่ trigger layout (width, height, top, left)
- ใช้ `will-change` บน elements ที่จะ animate แล้ว remove หลังเสร็จ
- ใช้ `stagger()` สำหรับ group animations
- กำหนด `composition: 'blend'` เมื่อต้องการรวม animation
- ใช้ `revert()` หรือ `cancel()` เพื่อ cleanup
- รองรับ `prefers-reduced-motion` เพื่อปิด/ลด animation
- ใช้ subpath imports (`animejs/easings`, `animejs/svg`, `animejs/text`) เมื่อต้องการเฉพาะ module

### 5. Integrate With Frameworks

> Goal: Integrate With Frameworks

React:

```jsx
import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

function Box() {
  const ref = useRef(null);
  useEffect(() => {
    const a = animate(ref.current, { x: 100 });
    return () => a.revert();
  }, []);
  return <div ref={ref} />;
}
```

Vue/Svelte: เรียก `animate()` ใน lifecycle hook และ cleanup ใน `onUnmounted`/`onDestroy`

### 6. Reference And Troubleshoot

> Goal: Reference And Troubleshoot

- official docs: https://animejs.com/documentation
- releases/changelog: https://github.com/juliangarnier/anime/releases
- v3 to v4 migration: https://github.com/juliangarnier/anime/wiki/Migrating-from-v3-to-v4

## Rules

- ใช้ `bun add animejs` สำหรับ installation
- import ESM: `import { animate, createTimeline, stagger } from 'animejs'`
- ไม่ใช้ global `anime()` จาก v3
- ใช้ `ease` แทน `easing`
- ใช้ `createTimeline()` แทน `anime.timeline()`
- ใช้ `stagger()` แทน v3 `stagger` syntax เก่า
- ใช้ `transform` และ `opacity` เมื่อได้
- ใช้ `will-change` อย่างระมัดระวัง
- รองรับ `prefers-reduced-motion`
- cleanup animation ด้วย `revert()` หรือ `cancel()`
- ใช้ animations เพื่อเสริม UX ไม่ใช่ distraction
- ใช้ `follow-lib-css` ถ้าจำเป็น
- ใช้ `follow-lib-react` ถ้า integrate กับ React

## Expected Outcome

- Animation ที่รวดเร็วและมีประสิทธิภาพ
- Code ที่ maintainable และ consistent
- UX ที่ดีและ accessible
- Performance ที่ optimized
