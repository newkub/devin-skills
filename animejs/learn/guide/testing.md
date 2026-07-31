# Testing

## Testing Animations

### Unit Testing

```javascript
import anime from 'animejs';

test('animation completes', () => {
  const completed = anime({
    targets: '.element',
    opacity: 0,
    duration: 100,
  }).finished;

  return completed;
});
```

### Integration Testing

- Test animations ใน real DOM
- Test user interactions
- Test timeline sequencing

### Visual Testing

- ใช้ screenshot testing
- ใช้ video recording
- ใช้ visual regression testing
