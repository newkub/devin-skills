# Patterns

## Common Patterns

## Staggered Animations

```javascript
anime({
  targets: '.item',
  translateX: 100,
  delay: anime.stagger(100),
});
```

## Sequenced Animations

```javascript
const timeline = anime.timeline()
  .add({
    targets: '.element1',
    opacity: 0,
  })
  .add({
    targets: '.element2',
    opacity: 0,
  });
```

## Looping Animations

```javascript
anime({
  targets: '.element',
  translateX: 100,
  direction: 'alternate',
  loop: true,
});
```

## Scroll-Triggered Animations

```javascript
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  anime({
    targets: '.element',
    translateY: scrollY * 0.5,
  });
});
```
