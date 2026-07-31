# Features

## คุณสมบัติหลักของ Anime.js

### Animation Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| targets | string/Element/Array | - | Elements ที่จะ animate |
| duration | number | 1000 | ระยะเวลา (ms) |
| delay | number | 0 | ความล่าช้า (ms) |
| easing | string | 'easeOutQuad' | Timing function |
| loop | boolean/number | false | จำนวน loop |
| direction | string | 'normal' | ทิศทาง animation |
| autoplay | boolean | true | เล่นอัตโนมัติ |

### CSS Properties Support

```javascript
anime({
  targets: '.box',
  // Transform
  translateX: 250,
  translateY: 100,
  translateZ: 50,
  rotate: '45deg',
  scale: 1.5,
  skewX: '20deg',
  // Opacity
  opacity: 0.5,
  // Color
  backgroundColor: '#f00',
  color: '#00f',
  // Size
  width: '100%',
  height: '200px'
});
```

### SVG Animation

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

### Keyframes

```javascript
anime({
  targets: '.box',
  keyframes: [
    { translateX: 0, scale: 1 },
    { translateX: 250, scale: 1.5 },
    { translateX: 500, scale: 1 }
  ],
  duration: 2000
});
```

### Timeline

```javascript
const tl = anime.timeline({
  easing: 'easeOutQuad',
  duration: 1000
});

tl.add({
  targets: '.box',
  translateX: 250
}).add({
  targets: '.circle',
  translateY: 200
}, '-=500'); // เริ่ม 500ms ก่อน animation ก่อนหน้าจบ
```

### Callbacks

| Callback | Description |
|----------|-------------|
| begin | เริ่ม animation |
| complete | จบ animation |
| update | อัปเดตทุก frame |
| loopComplete | จบแต่ละ loop |
| pause | pause animation |
| play | play animation |

```javascript
anime({
  targets: '.box',
  translateX: 250,
  begin: (anim) => console.log('Animation started'),
  update: (anim) => console.log(`Progress: ${anim.progress}%`),
  complete: (anim) => console.log('Animation completed')
});
```

### Methods

| Method | Description |
|--------|-------------|
| play() | เล่น animation |
| pause() | หยุด animation |
| reverse() | เล่นย้อนกลับ |
| restart() | เริ่มใหม่ |
| seek(time) | ไปยังเวลาที่กำหนด |
| stretch(duration) | ยืดระยะเวลา |
| complete() | จบ animation ทันที |
| reset() | รีเซ็ตค่าเริ่มต้น |
| cancel() | ยกเลิก animation |
| revert() | คืนค่าเดิม |

### Staggering

```javascript
// Animate elements ทีละตัว
anime({
  targets: '.item',
  translateX: 250,
  delay: anime.stagger(100) // 100ms ระหว่างแต่ละ element
});

// Grid staggering
anime({
  targets: '.grid-item',
  translateX: anime.stagger(100, {grid: [4, 4], from: 'center'})
});
```

### Easing Functions

| Category | Functions |
|----------|-----------|
| Linear | linear |
| Quad | easeInQuad, easeOutQuad, easeInOutQuad |
| Cubic | easeInCubic, easeOutCubic, easeInOutCubic |
| Quart | easeInQuart, easeOutQuart, easeInOutQuart |
| Quint | easeInQuint, easeOutQuint, easeInOutQuint |
| Sine | easeInSine, easeOutSine, easeInOutSine |
| Expo | easeInExpo, easeOutExpo, easeInOutExpo |
| Circ | easeInCirc, easeOutCirc, easeInOutCirc |
| Back | easeInBack, easeOutBack, easeInOutBack |
| Elastic | easeInElastic, easeOutElastic, easeInOutElastic |
| Bounce | easeInBounce, easeOutBounce, easeInOutBounce |

### Custom Easing

```javascript
anime.easings['myEase'] = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};
```

### Object Animation

```javascript
anime({
  targets: { value: 0 },
  value: 100,
  round: 1, // ปัดเศษ
  easing: 'linear',
  update: function() {
    console.log(this.targets[0].value);
  }
});
```

### Controls

```javascript
const animation = anime({
  targets: '.box',
  translateX: 250
});

// Playback controls
animation.play();
animation.pause();
animation.reverse();
animation.restart();

// Time controls
animation.seek(500); // ไปยัง 500ms
animation.stretch(2000); // ยืดเป็น 2000ms

// State controls
animation.complete();
animation.reset();
animation.cancel();
```
