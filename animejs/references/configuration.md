# Configuration Reference

## Global Defaults

```javascript
anime.defaults = {
  duration: 1000,
  easing: 'easeOutQuad',
  loop: false,
  autoplay: true,
  direction: 'normal'
};
```

## Animation Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| targets | string/Element/Array | - | Elements to animate |
| duration | number | 1000 | Duration in milliseconds |
| delay | number | 0 | Delay in milliseconds |
| easing | string | 'easeOutQuad' | Easing function |
| loop | boolean/number | false | Loop count |
| direction | string | 'normal' | Animation direction |
| autoplay | boolean | true | Auto-play |
| round | number | - | Round decimal places |
| begin | function | - | Begin callback |
| complete | function | - | Complete callback |
| update | function | - | Update callback |
| loopComplete | function | - | Loop complete callback |

## Easing Functions

### Linear

| Function | Description |
|----------|-------------|
| linear | Constant speed |

### Quad

| Function | Description |
|----------|-------------|
| easeInQuad | Slow start, fast end |
| easeOutQuad | Fast start, slow end |
| easeInOutQuad | Slow start and end |

### Cubic

| Function | Description |
|----------|-------------|
| easeInCubic | Cubic start |
| easeOutCubic | Cubic end |
| easeInOutCubic | Cubic start and end |

### Quart

| Function | Description |
|----------|-------------|
| easeInQuart | Quartic start |
| easeOutQuart | Quartic end |
| easeInOutQuart | Quartic start and end |

### Quint

| Function | Description |
|----------|-------------|
| easeInQuint | Quintic start |
| easeOutQuint | Quintic end |
| easeInOutQuint | Quintic start and end |

### Sine

| Function | Description |
|----------|-------------|
| easeInSine | Sine start |
| easeOutSine | Sine end |
| easeInOutSine | Sine start and end |

### Expo

| Function | Description |
|----------|-------------|
| easeInExpo | Exponential start |
| easeOutExpo | Exponential end |
| easeInOutExpo | Exponential start and end |

### Circ

| Function | Description |
|----------|-------------|
| easeInCirc | Circular start |
| easeOutCirc | Circular end |
| easeInOutCirc | Circular start and end |

### Back

| Function | Description |
|----------|-------------|
| easeInBack | Back start |
| easeOutBack | Back end |
| easeInOutBack | Back start and end |

### Elastic

| Function | Description |
|----------|-------------|
| easeInElastic | Elastic start |
| easeOutElastic | Elastic end |
| easeInOutElastic | Elastic start and end |

### Bounce

| Function | Description |
|----------|-------------|
| easeInBounce | Bounce start |
| easeOutBounce | Bounce end |
| easeInOutBounce | Bounce start and end |

## Custom Easing

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

## Direction Options

| Direction | Description |
|-----------|-------------|
| normal | Forward only |
| reverse | Backward only |
| alternate | Forward then backward |

## Loop Options

| Value | Description |
|-------|-------------|
| false | No loop |
| true | Infinite loop |
| number | Specific loop count |

## Stagger Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| value | number | - | Delay between elements |
| grid | [number, number] | - | Grid dimensions |
| from | string | 'first' | Start position |
| direction | string | 'normal' | Stagger direction |
| easing | string | - | Stagger easing |

## Timeline Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| easing | string | - | Default easing |
| duration | number | - | Default duration |
| autoplay | boolean | true | Auto-play |

## Callback Parameters

All callbacks receive an animation object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| progress | number | Progress (0-100) |
| currentTime | number | Current time (ms) |
| duration | number | Duration (ms) |
| paused | boolean | Pause status |
| began | boolean | Began status |
| completed | boolean | Completed status |

