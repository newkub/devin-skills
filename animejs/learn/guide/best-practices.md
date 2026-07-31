# Best Practices

## Best Practices สำหรับการพัฒนาด้วย Anime.js

## Performance

### ใช้ CSS Transforms

```javascript
// ✅ ดี - ใช้ transforms
anime({
  targets: '.box',
  translateX: 250,
  translateY: 100
});

// ❌ ไม่ดี - ใช้ position properties
anime({
  targets: '.box',
  left: 250,
  top: 100
});
```

### จำกัดจำนวน animations พร้อมกัน

```javascript
// ✅ ดี - ใช้ stagger
anime({
  targets: '.item',
  translateX: 250,
  delay: anime.stagger(100)
});

// ❌ ไม่ดี - สร้าง animation หลายตัว
document.querySelectorAll('.item').forEach((item, i) => {
  anime({
    targets: item,
    translateX: 250,
    delay: i * 100
  });
});
```

### ใช้ GPU Acceleration

```javascript
// ✅ ดี - ใช้ will-change
.box {
  will-change: transform;
}

anime({
  targets: '.box',
  translateX: 250
});
```

### หลีกเลี่ยง layout thrashing

```javascript
// ✅ ดี - อ่านและเขียน DOM แยกกัน
const elements = document.querySelectorAll('.item');
anime({
  targets: elements,
  translateX: 250
});

// ❌ ไม่ดี - อ่านและเขียน DOM ผสมกัน
document.querySelectorAll('.item').forEach(item => {
  item.style.left = item.offsetLeft + 250 + 'px';
});
```

## Code Organization

### สร้าง reusable functions

```javascript
// ✅ ดี - reusable functions
const fadeIn = (targets, duration = 500) => {
  return anime({
    targets,
    opacity: [0, 1],
    duration,
    easing: 'easeOutQuad'
  });
};

const slideUp = (targets, duration = 500) => {
  return anime({
    targets,
    translateY: [30, 0],
    opacity: [0, 1],
    duration,
    easing: 'easeOutQuad'
  });
};
```

### จัดระเบียบไฟล์

```
src/
├── animations/
│   ├── fade-in.js
│   ├── slide-up.js
│   └── bounce.js
├── timelines/
│   └── hero-timeline.js
└── main.js
```

### ใช้ constants

```javascript
// ✅ ดี - constants
const ANIMATION_DURATION = 500;
const EASING_DEFAULT = 'easeOutQuad';

anime({
  targets: '.box',
  translateX: 250,
  duration: ANIMATION_DURATION,
  easing: EASING_DEFAULT
});
```

## Memory Management

### Cleanup animations

```javascript
// ✅ ดี - cleanup เมื่อ component unmount
let animation;

const animate = () => {
  animation = anime({
    targets: '.box',
    translateX: 250
  });
};

const cleanup = () => {
  if (animation) {
    animation.pause();
    animation.reset();
  }
};
```

### ใช้ instance reference

```javascript
// ✅ ดี - เก็บ reference
const animation = anime({
  targets: '.box',
  translateX: 250
});

// สามารถควบคุมได้
animation.pause();
animation.play();
```

## Accessibility

### ให้ผู้ใช้ปิด animation ได้

```javascript
// ✅ ดี - ตรวจสอบ prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  anime({
    targets: '.box',
    translateX: 250
  });
}
```

### ใช้ ARIA attributes

```html
<!-- ✅ ดี - ใช้ ARIA -->
<div class="box" role="img" aria-label="Animated box"></div>
```

## Testing

### Test animation completion

```javascript
// ✅ ดี - test completion
test('animation completes', () => {
  const animation = anime({
    targets: '.box',
    opacity: [0, 1],
    duration: 100
  });

  return animation.finished.then(() => {
    expect(document.querySelector('.box').style.opacity).toBe('1');
  });
});
```

### Test animation values

```javascript
// ✅ ดี - test values
test('animation values', () => {
  const animation = anime({
    targets: '.box',
    translateX: 250
  });

  animation.seek(500); // ไปยังเวลาที่กำหนด
  expect(animation.animations[0].currentValues.translateX).toBeDefined();
});
```

## Error Handling

### ตรวจสอบ targets

```javascript
// ✅ ดี - ตรวจสอบ targets
const targets = document.querySelectorAll('.box');
if (targets.length > 0) {
  anime({
    targets,
    translateX: 250
  });
}
```

### Handle errors

```javascript
// ✅ ดี - handle errors
try {
  anime({
    targets: '.box',
    translateX: 250
  });
} catch (error) {
  console.error('Animation failed:', error);
}
```

## Responsive Design

### ใช้ relative values

```javascript
// ✅ ดี - relative values
anime({
  targets: '.box',
  translateX: '50vw', // viewport width
  translateY: '50vh' // viewport height
});
```

### ใช้ media queries

```javascript
// ✅ ดี - ตอบสนองต่อขนาดหน้าจอ
const isMobile = window.innerWidth < 768;

anime({
  targets: '.box',
  translateX: isMobile ? 100 : 250,
  duration: isMobile ? 500 : 1000
});
```

## Debugging

### ใช้ console.log ใน callbacks

```javascript
// ✅ ดี - debugging
anime({
  targets: '.box',
  translateX: 250,
  begin: (anim) => console.log('Started'),
  update: (anim) => console.log(`Progress: ${anim.progress}%`),
  complete: (anim) => console.log('Completed')
});
```

### ใช้ DevTools

```javascript
// ✅ ดี - inspect animation
const animation = anime({
  targets: '.box',
  translateX: 250
});

console.log(animation);
```

## การใช้ Timeline อย่างมีประสิทธิภาพ

### ใช้ timeline สำหรับ complex animations

```javascript
// ✅ ดี - timeline
const tl = anime.timeline();

tl.add({
  targets: '.box',
  translateX: 250
}).add({
  targets: '.circle',
  translateY: 200
}, '-=500'); // เริ่มก่อน animation ก่อนหน้าจบ
```

### ใช้ relative timing

```javascript
// ✅ ดี - relative timing
tl.add({
  targets: '.box',
  translateX: 250
}).add({
  targets: '.circle',
  translateY: 200
}, '-=500'); // เริ่ม 500ms ก่อน animation ก่อนหน้าจบ
```
