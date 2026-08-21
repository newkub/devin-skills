# Installation

## วิธีการติดตั้ง Anime.js

### การติดตั้งผ่าน Package Manager

#### Bun

```bash
bun add animejs
```

#### bun

```bash
bun install animejs
```

#### yarn

```bash
yarn add animejs
```

#### bun

```bash
bun add animejs
```

### การใช้งานผ่าน CDN

#### ESM Module

```html
<script type="module">
  import anime from 'https://cdn.jsdelivr.net/bun/animejs@3.2.1/lib/anime.es.js';

  anime({
    targets: '.box',
    translateX: 250
  });
</script>
```

#### UMD (Global)

```html
<script src="https://cdn.jsdelivr.net/bun/animejs@3.2.1/lib/anime.min.js"></script>

<script>
  anime({
    targets: '.box',
    translateX: 250
  });
</script>
```

### การติดตั้งสำหรับ TypeScript

```bash
bun add animejs
bun add -D @types/animejs
```

### การติดตั้งสำหรับ Frameworks

#### React

```bash
bun add animejs
```

```javascript
import anime from 'animejs';

useEffect(() => {
  anime({
    targets: '.box',
    translateX: 250
  });
}, []);
```

#### Vue

```bash
bun add animejs
```

```javascript
import anime from 'animejs';

onMounted(() => {
  anime({
    targets: '.box',
    translateX: 250
  });
});
```

### การติดตั้งสำหรับ Build Tools

#### Vite

```bash
bun add animejs
```

```javascript
import anime from 'animejs';

anime({
  targets: '.box',
  translateX: 250
});
```

#### Webpack

```bash
bun add animejs
```

```javascript
import anime from 'animejs';

anime({
  targets: '.box',
  translateX: 250
});
```

### การติดตั้งสำหรับ Node.js

Anime.js ออกแบบมาสำหรับ browser แต่สามารถใช้ใน Node.js กับ jsdom ได้:

```bash
bun add animejs jsdom
```

```javascript
import anime from 'animejs';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

anime({
  targets: '.box',
  translateX: 250
});
```

### การติดตั้ง Development Tools

#### Type Definitions

```bash
bun add -D @types/animejs
```

#### ESLint Plugin

ไม่มี ESLint plugin เฉพาะสำหรับ Anime.js แต่สามารถใช้ eslint-plugin-import สำหรับ validation:

```bash
bun add -D eslint-plugin-import
```

### การตรวจสอบการติดตั้ง

```javascript
import anime from 'animejs';

console.log(anime.version); // ตรวจสอบ version
console.log(typeof anime); // 'function'
```

### การอัปเกรด

```bash
bun update animejs
```

### การถอนการติดตั้ง

```bash
bun remove animejs
```

### เวอร์ชันที่รองรับ

| Version | Status | Notes |
|---------|--------|-------|
| 4.0.0 | Latest | เวอร์ชันปัจจุบัน |
| 3.2.1 | Stable | เวอร์ชันที่ใช้งานมากที่สุด |
| 2.1.0 | Legacy | รองรับแต่ไม่แนะนำ |
