# anime.js v4 Configuration Reference

> Defaults, playback settings และ easing options ของ Anime.js v4 (`animejs@4.5.0`, verified 2026-09-13)
> Docs: https://animejs.com/documentation

## Global Defaults — `engine.defaults`

```javascript
import { engine } from 'animejs';

engine.defaults.duration = 500;   // global default duration (ms)
engine.defaults.ease = 'outQuad'; // global default ease
engine.defaults.delay = 0;
engine.defaults.loop = false;
engine.defaults.autoplay = true;
// tween/playback parameter ใดๆ ตั้งเป็น default ได้
```

## Engine Parameters

| Parameter | Description |
|-----------|-------------|
| `engine.speed` | global playback speed multiplier |
| `engine.fps` | global frame rate limit |
| `engine.precision` | rounding precision ของค่าที่ render |
| `engine.timeUnit` | `'s'` หรือ `'ms'` สำหรับค่าเวลาทั้งหมด |
| `engine.pauseOnDocumentHidden` | pause อัตโนมัติเมื่อ tab ถูกซ่อน |

Methods: `engine.update()`, `engine.pause()`, `engine.resume()`

## Execution Order — `priority`

instances ทำงานตามลำดับที่ add เข้า engine; คุมด้วย `priority` (default `1`, ต่ำกว่าทำก่อน):

```javascript
animate(targets, { x: 100, priority: 0 }); // ทำก่อน
animate(targets, { z: 100 });              // default priority: 1
animate(targets, { y: 100, priority: 2 }); // ทำทีหลัง
```

## Playback Settings (timer/animation/timeline)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `delay` | number/`stagger()` | `0` | ms ก่อนเริ่ม |
| `duration` | number | engine default | ms ต่อ iteration |
| `loop` | boolean/number | `false` | `true` = infinite |
| `loopDelay` | number | `0` | ms ระหว่าง loop |
| `alternate` | boolean | `false` | สลับทิศทุก loop |
| `reversed` | boolean | `false` | เล่นย้อนตั้งแต่แรก |
| `autoplay` | boolean/`onScroll` | `true` | auto-play หรือ bind scroll |
| `frameRate` | number | - | จำกัด fps ต่อ instance |
| `playbackRate` | number | `1` | ความเร็ว playback |
| `playbackEase` | ease | - | ease ที่ apply บน progress ทั้งหมด |
| `priority` | number | `1` | execution order ใน engine tick |
| `persist` | boolean | - | (WAAPI) เก็บค่าสุดท้ายหลังจบ |

## Callbacks

| Callback | เมื่อ |
|----------|-------|
| `onBegin(self)` | animation เริ่มจริง (หลัง delay) |
| `onBeforeUpdate(self)` | ก่อน render ทุกเฟรม |
| `onUpdate(self)` | ทุกเฟรมหลังค่าถูก update |
| `onRender(self)` | หลัง styles ถูกเขียนลง DOM |
| `onLoop(self)` | จบแต่ละ iteration |
| `onComplete(self)` | จบทั้งหมด |
| `onPause(self)` | เมื่อ pause |
| `.then(cb)` | Promise-like เมื่อ complete |

## Easing

Built-in ease names (string): `linear`, `inQuad`/`outQuad`/`inOutQuad`, `...Cubic`, `...Quart`, `...Quint`, `...Sine`, `...Expo`, `...Circ`, `...Back`, `...Elastic`, `...Bounce`, `out` variants ฯลฯ

Custom/easing factories (v4.2+ ต้อง import แยกจาก core — `animejs/easings`):

```javascript
import { eases } from 'animejs';

animate('.box', { x: 100, ease: eases.outElastic(1, .5) });
eases.cubicBezier(.25, .1, .25, 1); // custom cubic bézier
eases.linear(...stops);             // multi-stop linear()
eases.steps(5);                     // stepped ease
eases.irregular();                  // irregular/randomized segments
```

Spring physics — `animejs/spring`:

```javascript
import { spring } from 'animejs';

animate('.box', { x: 100, ease: spring({ mass: 1, stiffness: 80, damping: 10, velocity: 0 }) });
```

## Timeline Defaults

```javascript
const tl = createTimeline({
  defaults: { duration: 800, ease: 'outQuad' }, // กระจายไปทุก .add()
});
```

## Scope Parameters

| Parameter | Description |
|-----------|-------------|
| `root` | root element/selector ของ scope |
| `defaults` | default tween params ภายใน scope |
| `mediaQueries` | `{ name: '(query)' }` — reactive ผ่าน `self.matches.<name>` |

## หมายเหตุ v3 → v4

| v3 | v4 |
|----|----|
| `anime({...})` | `animate(targets, {...})` |
| `anime.timeline()` | `createTimeline()` |
| `anime.stagger()` | `stagger()` |
| `easing` | `ease` |
| `anime.setDashoffset` | `svg.createDrawable()` + `draw` |
| `anime.random` | `utils.random()` |
| `direction: 'alternate'` | `alternate: true` |
| `direction: 'reverse'` | `reversed: true` |
| `begin/complete/update` | `onBegin/onComplete/onUpdate` |
