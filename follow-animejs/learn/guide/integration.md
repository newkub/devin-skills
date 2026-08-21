# Integration

## การเชื่อมต่อ Anime.js กับ Frameworks และ Libraries

## React Integration

### Installation

```bash
bun add animejs
```

### Basic Usage

```javascript
import { useEffect, useRef } from 'react';
import anime from 'animejs';

function AnimatedBox() {
  const boxRef = useRef(null);

  useEffect(() => {
    anime({
      targets: boxRef.current,
      translateX: 250
    });
  }, []);

  return <div ref={boxRef} className="box" />;
}
```

### Cleanup

```javascript
import { useEffect, useRef } from 'react';
import anime from 'animejs';

function AnimatedBox() {
  const boxRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = anime({
      targets: boxRef.current,
      translateX: 250
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
        animationRef.current.reset();
      }
    };
  }, []);

  return <div ref={boxRef} className="box" />;
}
```

### Custom Hook

```javascript
import { useEffect, useRef } from 'react';
import anime from 'animejs';

function useAnime(config, deps = []) {
  const targetRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (targetRef.current) {
      animationRef.current = anime({
        targets: targetRef.current,
        ...config
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
        animationRef.current.reset();
      }
    };
  }, deps);

  return targetRef;
}

function AnimatedBox() {
  const boxRef = useAnime({
    translateX: 250
  });

  return <div ref={boxRef} className="box" />;
}
```

## Vue Integration

### Installation

```bash
bun add animejs
```

### Basic Usage

```javascript
<template>
  <div ref="box" class="box" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import anime from 'animejs';

const box = ref(null);

onMounted(() => {
  anime({
    targets: box.value,
    translateX: 250
  });
});
</script>
```

### Cleanup

```javascript
<template>
  <div ref="box" class="box" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import anime from 'animejs';

const box = ref(null);
let animation;

onMounted(() => {
  animation = anime({
    targets: box.value,
    translateX: 250
  });
});

onUnmounted(() => {
  if (animation) {
    animation.pause();
    animation.reset();
  }
});
</script>
```

## Svelte Integration

### Installation

```bash
bun add animejs
```

### Basic Usage

```svelte
<script>
  import { onMount } from 'svelte';
  import anime from 'animejs';

  let box;
  let animation;

  onMount(() => {
    animation = anime({
      targets: box,
      translateX: 250
    });
  });
</script>

<div bind:this={box} class="box" />
```

### Cleanup

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import anime from 'animejs';

  let box;
  let animation;

  onMount(() => {
    animation = anime({
      targets: box,
      translateX: 250
    });
  });

  onDestroy(() => {
    if (animation) {
      animation.pause();
      animation.reset();
    }
  });
</script>

<div bind:this={box} class="box" />
```

## Next.js Integration

### Installation

```bash
bun add animejs
```

### Client Component

```javascript
'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function AnimatedBox() {
  const boxRef = useRef(null);

  useEffect(() => {
    anime({
      targets: boxRef.current,
      translateX: 250
    });
  }, []);

  return <div ref={boxRef} className="box" />;
}
```

## Nuxt Integration

### Installation

```bash
bun add animejs
```

### Basic Usage

```vue
<template>
  <div ref="box" class="box" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import anime from 'animejs';

const box = ref(null);

onMounted(() => {
  anime({
    targets: box.value,
    translateX: 250
  });
});
</script>
```

## TypeScript Integration

### Installation

```bash
bun add animejs
bun add -D @types/animejs
```

### Type Safety

```typescript
import anime from 'animejs';

const animation = anime({
  targets: '.box',
  translateX: 250,
  duration: 1000,
  easing: 'easeOutQuad' as const
});

animation.play();
animation.pause();
```

## Web Components Integration

```javascript
class AnimatedBox extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    anime({
      targets: this,
      translateX: 250
    });
  }

  disconnectedCallback() {
    // Cleanup if needed
  }
}

customElements.define('animated-box', AnimatedBox);
```

## GSAP Migration

### การแปลงจาก GSAP

```javascript
// GSAP
gsap.to('.box', {
  x: 250,
  duration: 1
});

// Anime.js
anime({
  targets: '.box',
  translateX: 250,
  duration: 1000
});
```

## CSS Animation Integration

### ใช้ร่วมกับ CSS animations

```javascript
// CSS
.box {
  transition: background 0.5s;
}

// JavaScript
anime({
  targets: '.box',
  translateX: 250,
  complete: () => {
    document.querySelector('.box').style.background = 'blue';
  }
});
```

## Canvas Integration

```javascript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

anime({
  targets: { x: 0, y: 0 },
  x: 100,
  y: 100,
  easing: 'linear',
  duration: 1000,
  update: (anim) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(anim.animations[0].currentValues.x, anim.animations[0].currentValues.y, 50, 50);
  }
});
```

## SVG Integration

```javascript
// Stroke animation
anime({
  targets: 'path',
  strokeDashoffset: [anime.setDashoffset, 0],
  duration: 2000,
  easing: 'easeInOutSine'
});

// Fill animation
anime({
  targets: 'circle',
  fill: ['#ff0000', '#0000ff'],
  duration: 1000
});
```

## Three.js Integration

```javascript
import * as THREE from 'three';
import anime from 'animejs';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
scene.add(cube);

anime({
  targets: cube.rotation,
  x: Math.PI * 2,
  duration: 1000,
  easing: 'linear',
  update: () => {
    renderer.render(scene, camera);
  }
});
```

## Testing Integration

### Vitest

```javascript
import { describe, it, expect } from 'vitest';
import anime from 'animejs';

describe('Anime.js', () => {
  it('should create animation', () => {
    const animation = anime({
      targets: '.box',
      translateX: 250
    });

    expect(animation).toBeDefined();
  });
});
```

## Build Tool Integration

### Vite

```javascript
import anime from 'animejs';

anime({
  targets: '.box',
  translateX: 250
});
```

### Webpack

```javascript
import anime from 'animejs';

anime({
  targets: '.box',
  translateX: 250
});
```

### Rollup

```javascript
import anime from 'animejs';

anime({
  targets: '.box',
  translateX: 250
});
```
