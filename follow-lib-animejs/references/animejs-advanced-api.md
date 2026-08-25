# anime.js Advanced API Reference

## Timeline API

### anime.timeline(params)

Creates a timeline instance.

```javascript
const tl = anime.timeline({
  easing: 'easeOutQuad',
  duration: 1000
});
```

### Timeline Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| add(params, offset) | params, offset | Timeline | Add animation to timeline |
| play() | - | Timeline | Play timeline |
| pause() | - | Timeline | Pause timeline |
| seek(time) | time: number | Timeline | Jump to specific time |

### Timeline Offset Syntax

| Syntax | Description |
|--------|-------------|
| '-=500' | Start 500ms before previous animation ends |
| '+=500' | Start 500ms after previous animation ends |
| '500' | Start at 500ms |

```javascript
tl.add({
  targets: '.box',
  translateX: 250
}).add({
  targets: '.circle',
  translateY: 200
}, '-=500'); // Start 500ms before previous ends
```

## Stagger API

### anime.stagger(value, options)

Creates stagger delays.

```javascript
anime({
  targets: '.item',
  translateX: 250,
  delay: anime.stagger(100)
});
```

### Stagger Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| grid | [number, number] | - | Grid dimensions |
| from | string | 'first' | Start position ('first', 'last', 'center', index) |
| direction | string | 'normal' | Direction ('normal', 'reverse') |
| easing | string | - | Easing function |

```javascript
anime({
  targets: '.grid-item',
  translateX: 250,
  delay: anime.stagger(100, {
    grid: [4, 4],
    from: 'center',
    direction: 'reverse'
  })
});
```

## Easing Functions

### Built-in Easings

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

## Utility Functions

### anime.setDashoffset

Calculates SVG stroke dashoffset.

```javascript
anime({
  targets: 'path',
  strokeDashoffset: [anime.setDashoffset, 0]
});
```

### anime.random

Returns random number between min and max.

```javascript
anime.random(0, 100); // Random number between 0 and 100
```

## Global Properties

### anime.defaults

Global default configuration.

```javascript
anime.defaults = {
  duration: 800,
  easing: 'easeOutQuad',
  loop: false
};
```

### anime.version

Current version string.

```javascript
console.log(anime.version);
```
