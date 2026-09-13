# anime.js v4 Advanced API Reference

> Timeline, stagger, scope, draggable, scroll, SVG, text และ spring APIs ของ Anime.js v4 (`animejs@4.5.0`, verified 2026-09-13)
> Docs: https://animejs.com/documentation

## createTimeline(parameters)

```javascript
import { createTimeline } from 'animejs';
// หรือ 'animejs/timeline'

const tl = createTimeline({
  defaults: { duration: 800, ease: 'outQuad' }, // default tween params
  loop: true,
  autoplay: false,
});

tl.add('.a', { x: 100 })              // add animation
  .add(createTimer({ duration: 200 })) // add timer
  .set('.b', { opacity: 0 })          // set values ทันที
  .call(() => console.log('mid'))     // call function ที่ตำแหน่ง
  .label('checkpoint')                // ตั้ง label
  .add('.c', { y: -50 }, '-=400')     // time position
  .sync(otherAnimation, 'checkpoint') // sync WAAPI anim / timeline
  .init();                            // บังคับ init (ถ้า autoplay: false)
```

### Time Position

| Syntax | Description |
|--------|-------------|
| `'-=500'` | เริ่มก่อน animation ก่อนหน้าจบ 500ms |
| `'+=500'` | เริ่มหลัง animation ก่อนหน้าจบ 500ms |
| `'500'` | เวลา absolute (ms) |
| `'<'` | เริ่มพร้อม animation ก่อนหน้า |
| `'label'` / `'label-=100'` | อ้าง label position |

### Timeline Methods

`add()`, `set()`, `sync()`, `label()`, `remove()`, `call()`, `init()` + timer methods ทั้งหมด (`play`, `pause`, `resume`, `reverse`, `alternate`, `restart`, `reset`, `complete`, `cancel`, `revert`, `seek`, `stretch`, `refresh`)

## stagger(value, options)

```javascript
import { animate, stagger } from 'animejs';

animate('.grid-item', {
  x: 250,
  delay: stagger(100, {
    grid: [4, 4],
    from: 'center',
    axis: 'x',
    ease: 'inOutQuad',
    jitter: 20,   // random spread ต่อ target
  }),
});
```

| Parameter | Description |
|-----------|-------------|
| `start` | ค่าเริ่มต้นของ stagger |
| `from` | `'first'` \| `'last'` \| `'center'` \| index \| element — จุดเริ่ม spread |
| `reversed` | กลับลำดับ |
| `ease` | easing กระจายค่า |
| `grid` | `[rows, cols]` สำหรับ grid-based stagger |
| `axis` | `'x'` \| `'y'` จำกัดทิศ spread บน grid |
| `modifier` | function แปลงค่าสุดท้าย |
| `use` | ใช้ easing/utility function เป็น stagger source |
| `total` | จำกัดจำนวน targets ที่ stagger |
| `jitter` | random offset ต่อ target |

ใช้ได้ทั้งกับ `delay` (time staggering), property values (values staggering เช่น `x: stagger([0, 100])`), และ time position ใน timeline (timeline staggering)

## createScope(parameters) — `animejs/scope`

จัดกลุ่ม animations ใต้ root element — official pattern สำหรับ framework integration

```javascript
import { createScope, animate } from 'animejs';

const scope = createScope({
  root: '.component',          // scope root
  defaults: { ease: 'outQuad' },
  mediaQueries: { isMobile: '(max-width: 768px)' }, // ใช้ใน scope function
}).add((self) => {
  // self.matches.isMobile — reactive
  self.add('fadeIn', (el) => animate(el, { opacity: [0, 1] })); // register method
  animate('.box', { x: 100 });
});

scope.methods.fadeIn('.other'); // เรียก registered method ภายนอก
scope.revert();                 // cleanup ทั้งหมด
```

Methods: `add()`, `addOnce()`, `keepTime()`, `revert()`, `refresh()`

## createDraggable(targets, parameters) — `animejs/draggable`

```javascript
import { createDraggable } from 'animejs';

createDraggable('.handle', {
  x: true, y: false,            // axes
  snap: 20,
  container: '.board',
  containerPadding: 10,
  containerFriction: 0.8,
  releaseStiffness: 40,
  releaseDamping: 6,
  velocityMultiplier: 1,
  minVelocity: 0.1,
  dragSpeed: 1,
  cursor: { onHover: 'grab', onGrab: 'grabbing' },
  onGrab: (self) => {},
  onDrag: (self) => {},
  onRelease: (self) => {},
  onSnap: (self) => {},
  onSettle: (self) => {},
});
```

Methods: `disable()`, `enable()`, `setX()`, `setY()`, `animateInView()`, `scrollInView()`, `stop()`, `reset()`, `revert()`, `refresh()`

## onScroll — `animejs/events`

```javascript
import { animate, onScroll } from 'animejs';

animate('.box', {
  x: 200,
  autoplay: onScroll({
    container: '.scroll-area',
    target: '.box',
    axis: 'y',
    repeat: true,
    enter: 'bottom-=50 top',     // thresholds: ตัวเลข, position shorthands, relative
    leave: 'top bottom',
    sync: 'onUpdate',            // sync mode: method name, playback progress, smooth/eased
    onEnter: (self) => {},
    onEnterForward: (self) => {},
    onLeave: (self) => {},
    onUpdate: (self) => {},
    debug: false,
  }),
});
```

Methods: `link()`, `refresh()`, `revert()`

## SVG — `animejs/svg`

```javascript
import { animate, svg } from 'animejs';

animate(svg.createDrawable('.path'), { draw: '0 1' });   // stroke draw animation

// createMotionPath(path, offset?) คืน { translateX, translateY, rotate } tween parameters
animate('.car', {
  ease: 'linear',
  ...svg.createMotionPath('path'),
});

// morphTo คืนค่าสำหรับ animate `d` attribute (morph ไป shape อื่น)
animate('.shape-1', { d: svg.morphTo('.shape-2') });
```

## Text — `animejs/text`

```javascript
import { splitText, scrambleText } from 'animejs';
// หรือ 'animejs/text'

const { chars, words, lines } = splitText('p', {
  chars: true, words: true, lines: true,
  includeSpaces: false,
  accessible: true,   // aria attributes
  // split parameters: class, wrap, clone
});

scrambleText('.title', {
  text: 'New title',
  chars: 'upperAndLowerCase',
  revealRate: 0.5,
  settleDuration: 400,
});
```

splitText methods: `addEffect()`, `revert()`, `refresh()`; scrambleText callback: `onChange`

## spring — `animejs/spring`

```javascript
import { animate, spring } from 'animejs';

animate('.box', { x: 100, ease: spring({ mass: 1, stiffness: 80, damping: 10, velocity: 0 }) });
```

> v4.2+: ใช้ `spring()` แทน `createSpring()` (deprecated)

## Animatable — `animejs/animatable`

Object ที่ re-usable สำหรับ get/set ค่า animatable บนหลาย targets

```javascript
import { createAnimatable } from 'animejs';

const animatable = createAnimatable('.box', { x: 500, y: 500, ease: 'outQuad' });
animatable.x(100);       // setter — animate ไป 100
animatable.x();          // getter
animatable.revert();
```

Settings: `unit`, `duration`, `ease`, `modifier`

## WAAPI — `animejs/waapi`

```javascript
import { waapi } from 'animejs';

waapi.animate('.box', { x: 100 });          // native Web Animations API path
waapi.convertEase('outQuad');               // แปลง anime ease → WAAPI easing
```

ใช้เมื่อต้องการ hardware-accelerated animations ที่รันบน compositor — รองรับ transform/opacity เท่านั้น, parameter `persist` เก็บค่าสุดท้าย
