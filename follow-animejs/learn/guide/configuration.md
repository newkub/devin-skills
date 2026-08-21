# Configuration

## การตั้งค่า Animation

### Global Configuration

ตั้งค่า default values สำหรับทุก animation:

```javascript
anime.defaults = {
  duration: 800,
  easing: 'easeOutQuad',
  loop: false,
  autoplay: true,
  direction: 'normal'
};
```

### Instance Configuration

ตั้งค่าสำหรับ animation instance เฉพาะ:

```javascript
anime({
  targets: '.box',
  duration: 1000,
  easing: 'easeInOutQuad',
  delay: 500,
  loop: true,
  direction: 'alternate'
});
```

## ตาราง Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| targets | string/Element/Array | - | Elements ที่จะ animate |
| duration | number | 1000 | ระยะเวลา (ms) |
| delay | number | 0 | ความล่าช้า (ms) |
| easing | string | 'easeOutQuad' | Timing function |
| loop | boolean/number | false | จำนวน loop |
| direction | string | 'normal' | ทิศทาง animation |
| autoplay | boolean | true | เล่นอัตโนมัติ |
| round | number | - | ปัดเศษทศนิยม |
| begin | function | - | Callback เมื่อเริ่ม |
| complete | function | - | Callback เมื่อจบ |
| update | function | - | Callback เมื่ออัปเดต |
| loopComplete | function | - | Callback เมื่อจบแต่ละ loop |

## Easing Options

### Linear Easing

```javascript
easing: 'linear'
```

### Quad Easing

```javascript
easing: 'easeInQuad'    // ช้า → เร็ว
easing: 'easeOutQuad'   // เร็ว → ช้า
easing: 'easeInOutQuad' // ช้า → เร็ว → ช้า
```

### Cubic Easing

```javascript
easing: 'easeInCubic'
easing: 'easeOutCubic'
easing: 'easeInOutCubic'
```

### Custom Easing

```javascript
anime.easings['myEase'] = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

anime({
  targets: '.box',
  translateX: 250,
  easing: 'myEase'
});
```

## Loop Configuration

### Infinite Loop

```javascript
anime({
  targets: '.box',
  translateX: 250,
  loop: true
});
```

### Specific Number of Loops

```javascript
anime({
  targets: '.box',
  translateX: 250,
  loop: 3 // loop 3 ครั้ง
});
```

### Loop with Delay

```javascript
anime({
  targets: '.box',
  translateX: 250,
  loop: true,
  loopDelay: 500 // รอ 500ms ระหว่าง loop
});
```

## Direction Configuration

```javascript
anime({
  targets: '.box',
  translateX: 250,
  direction: 'normal'      // เดินหน้าเท่านั้น
});

anime({
  targets: '.box',
  translateX: 250,
  direction: 'reverse'     // ถอยหลังเท่านั้น
});

anime({
  targets: '.box',
  translateX: 250,
  direction: 'alternate'   // เดินหน้าแล้วถอยหลัง
});
```

## Callback Configuration

```javascript
anime({
  targets: '.box',
  translateX: 250,
  begin: (anim) => {
    console.log('Animation started');
  },
  update: (anim) => {
    console.log(`Progress: ${anim.progress}%`);
  },
  complete: (anim) => {
    console.log('Animation completed');
  },
  loopComplete: (anim) => {
    console.log('Loop completed');
  }
});
```

## Playback Configuration

```javascript
anime({
  targets: '.box',
  translateX: 250,
  autoplay: false, // ไม่เล่นอัตโนมัติ
  frameRate: 60,  // 60 FPS
  playbackRate: 1  // ความเร็ว 1x
});
```

## Timeline Configuration

```javascript
const tl = anime.timeline({
  easing: 'easeOutQuad',
  duration: 1000,
  autoplay: true
});

tl.add({
  targets: '.box',
  translateX: 250
});
```

## Stagger Configuration

```javascript
anime({
  targets: '.item',
  translateX: 250,
  delay: anime.stagger(100) // 100ms ระหว่างแต่ละ element
});

anime({
  targets: '.grid-item',
  translateX: 250,
  delay: anime.stagger(100, {
    grid: [4, 4],      // 4x4 grid
    from: 'center',    // เริ่มจากกลาง
    direction: 'reverse' // ทิศทางถอยหลัง
  })
});
```

## Keyframe Configuration

```javascript
anime({
  targets: '.box',
  keyframes: [
    { translateX: 0, scale: 1, duration: 500 },
    { translateX: 250, scale: 1.5, duration: 1000 },
    { translateX: 500, scale: 1, duration: 500 }
  ],
  easing: 'easeInOutQuad'
});
```

## Property Configuration

```javascript
anime({
  targets: '.box',
  // Single value
  translateX: 250,
  
  // Array value [from, to]
  opacity: [0, 1],
  
  // Array value [from, to, easing]
  backgroundColor: ['#fff', '#000', 'linear'],
  
  // Relative value
  width: '+=100px', // เพิ่ม 100px
  height: '-=50px'  // ลด 50px
});
```
