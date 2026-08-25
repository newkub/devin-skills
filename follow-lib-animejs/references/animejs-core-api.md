# anime.js Core API Reference

## Core Function

### anime(params)

Creates and returns an animation instance.

```javascript
const animation = anime({
  targets: '.box',
  translateX: 250
});
```

## Animation Instance Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| play() | - | Animation | Start or resume animation |
| pause() | - | Animation | Pause animation |
| reverse() | - | Animation | Reverse animation direction |
| restart() | - | Animation | Restart animation from beginning |
| seek(time) | time: number | Animation | Jump to specific time (ms) |
| stretch(duration) | duration: number | Animation | Stretch animation duration |
| complete() | - | Animation | Complete animation immediately |
| reset() | - | Animation | Reset animation to initial state |
| cancel() | - | Animation | Cancel animation |
| revert() | - | Animation | Revert to initial values |

## Animation Instance Properties

| Property | Type | Description |
|----------|------|-------------|
| autoplay | boolean | Auto-play status |
| paused | boolean | Pause status |
| began | boolean | Animation began status |
| completed | boolean | Animation completed status |
| duration | number | Animation duration (ms) |
| delay | number | Animation delay (ms) |
| direction | string | Animation direction |
| loop | boolean/number | Loop count |
| progress | number | Progress (0-100) |
| currentTime | number | Current time (ms) |

## Configuration Options

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

## Callbacks

### begin(anim)

Called when animation starts.

```javascript
anime({
  targets: '.box',
  translateX: 250,
  begin: (anim) => {
    console.log('Animation started');
  }
});
```

### complete(anim)

Called when animation completes.

```javascript
anime({
  targets: '.box',
  translateX: 250,
  complete: (anim) => {
    console.log('Animation completed');
  }
});
```

### update(anim)

Called on every frame update.

```javascript
anime({
  targets: '.box',
  translateX: 250,
  update: (anim) => {
    console.log(`Progress: ${anim.progress}%`);
  }
});
```

### loopComplete(anim)

Called when each loop completes.

```javascript
anime({
  targets: '.box',
  translateX: 250,
  loop: true,
  loopComplete: (anim) => {
    console.log('Loop completed');
  }
});
```

## Promise Support

```javascript
const animation = anime({
  targets: '.box',
  translateX: 250
});

animation.finished.then(() => {
  console.log('Animation completed');
});
```
