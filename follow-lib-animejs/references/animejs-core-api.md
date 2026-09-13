# anime.js v4 Core API Reference

> API หลักของ Anime.js v4 (`animejs@4.5.0`, verified 2026-09-13) — ESM named exports เท่านั้น, ไม่มี global `anime()` แบบ v3
> Docs: https://animejs.com/documentation/animation

## Import

```javascript
import { animate, createTimeline, createTimer, stagger, utils, engine } from 'animejs';

// subpath imports สำหรับ tree-shaking
import { animate } from 'animejs/animation';
import { createTimer } from 'animejs/timer';
import { utils } from 'animejs/utils';
import { engine } from 'animejs/engine';
```

## animate(targets, parameters)

สร้างและคืน Animation instance (เริ่มเล่นทันทีตามค่า `autoplay` default = true)

```javascript
import { animate, stagger } from 'animejs';

animate('.box', {
  x: 250,                    // transform shorthand
  rotate: { from: -180 },    // tween parameters per-property
  backgroundColor: '#ff0000',
  duration: 1200,
  delay: stagger(80, { from: 'center' }),
  ease: 'inOutQuint',
});
```

## Targets

| Type | Example |
|------|---------|
| CSS selector | `'.box'`, `'#app > div'` |
| DOM element(s) | `el`, `document.querySelectorAll('.x')` |
| JavaScript object | `{ value: 0 }` — animate property ของ object |
| Array | `['.a', el, obj]` |

## Animatable Properties

- CSS properties (`opacity`, `backgroundColor`, `width` ฯลฯ)
- CSS transforms shorthand: `x`, `y`, `z`, `translateX`/`Y`/`Z`, `scale`, `scaleX`/`Y`, `rotate`, `rotateX`/`Y`/`Z`, `skew`, `skewX`/`Y`, `perspective`
- CSS variables (`'--my-var'`)
- JS object properties, HTML attributes, SVG attributes

## Tween Value Types

| Type | Example |
|------|---------|
| Numerical | `x: 250` |
| Unit conversion | `x: '10rem'` (แปลง unit อัตโนมัติ) |
| Relative | `x: '+=100'` |
| Color | `backgroundColor: '#fff'`, `rgb()`, `hsl()` |
| CSS variable | `'--size': '2rem'` |
| Function-based | `x: (el, i, targets) => i * 10` — arg ที่ 3 ใน v5 beta เปลี่ยนเป็น `targets` (Array) |

## Tween Parameters (per-property)

| Parameter | Description |
|-----------|-------------|
| `to` | ค่าปลายทาง |
| `from` | ค่าเริ่มต้น |
| `delay` | delay ต่อ property |
| `duration` | duration ต่อ property |
| `ease` | easing ต่อ property |
| `composition` | `'replace'` \| `'blend'` \| `'none'` — วิธีรวมกับ animation ที่ทับซ้อน |
| `modifier` | function แปลงค่าที่ render ทุกเฟรม |

## Keyframes

```javascript
animate('.box', {
  x: [
    { to: 100, duration: 500 },          // tween-parameter keyframes
    { to: 0, duration: 500 },
  ],
  // หรือ duration-based / percentage-based keyframes
});
```

## Playback Settings

| Setting | Type | Description |
|---------|------|-------------|
| `delay` | number | ms ก่อนเริ่ม (รับ `stagger()`) |
| `duration` | number | ms ต่อ iteration |
| `loop` | boolean/number | `true` = infinite |
| `loopDelay` | number | ms ระหว่าง loop |
| `alternate` | boolean | สลับทิศทุก loop |
| `reversed` | boolean | เล่นย้อน |
| `autoplay` | boolean/`onScroll` | เล่นอัตโนมัติ หรือ bind scroll |
| `frameRate` | number | จำกัด fps |
| `playbackRate` | number | ความเร็ว playback |
| `playbackEase` | ease | ease ทั้ง timeline |

## Callbacks

`onBegin`, `onBeforeUpdate`, `onUpdate`, `onRender`, `onLoop`, `onComplete`, `onPause`, และ `.then()` (Promise-like เมื่อ complete)

## Animation Methods

| Method | Description |
|--------|-------------|
| `play()` / `pause()` / `resume()` | playback control |
| `reverse()` / `alternate()` | กลับทิศ / สลับทิศ |
| `restart()` / `reset()` | เริ่มใหม่ / กลับ initial state |
| `complete()` | ข้ามไปจบ |
| `cancel()` | ยกเลิก (ล้าง inline styles ตาม composition) |
| `revert()` | ย้อนกลับค่าเดิมและถอด animation ออก |
| `seek(time)` | กระโดดไปเวลาที่กำหนด (ms) |
| `stretch(duration)` | scale duration ใหม่ |
| `refresh()` | re-calculate targets/values |

## utils

```javascript
import { utils } from 'animejs';

utils.set('.box', { opacity: 0.5 });   // set inline styles ทันที
utils.get('.box', 'x');                // อ่านค่าปัจจุบัน
utils.remove('.box');                  // เอา target ออกจาก animations
utils.$('.box');                       // querySelectorAll shorthand
utils.cleanInlineStyles(el);           // ล้าง inline styles ที่ anime สร้าง
utils.random(0, 100);                  // random number
utils.randomPick(['a', 'b']);          // random element
utils.shuffle([1, 2, 3]);
utils.round(1.234, 2);                 // round ตาม decimal places
utils.clamp(v, min, max);
utils.snap(v, step);                   // snap เป็น step
utils.wrap(v, min, max);
utils.mapRange(v, inMin, inMax, outMin, outMax);
utils.lerp(start, end, amt);           // linear interpolation
utils.damp(current, target, smoothing, dt); // frame-rate independent smoothing
utils.degToRad(deg); utils.radToDeg(rad);
utils.createSeededRandom(seed);
```

## engine

`engine` drive และ sync `Animation`, `Timer`, `Timeline` ทั้งหมด — ใช้ `priority` parameter คุม execution order (default `1`, ค่าต่ำทำก่อน)

```javascript
import { engine } from 'animejs';

// Parameters
engine.speed;                    // global playback speed multiplier
engine.fps;                      // global frame rate limit
engine.precision;                // rounding precision
engine.timeUnit;                 // 's' หรือ 'ms' ของค่าเวลาทั้งหมด
engine.pauseOnDocumentHidden;    // pause เมื่อ tab ถูกซ่อน

// Methods
engine.update();  // tick ด้วยมือเมื่อ drive main loop เอง
engine.pause();
engine.resume();

// Engine defaults — global default parameters
engine.defaults;
```

> หมายเหตุ: ถ้าเจอ v3 API (`anime()`, `anime.timeline()`, `anime.stagger()`, `easing`, `anime.setDashoffset`) ใน codebase → migrate ตาม https://github.com/juliangarnier/anime/wiki/Migrating-from-v3-to-v4
