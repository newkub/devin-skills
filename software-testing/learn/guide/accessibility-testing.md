# Accessibility Testing

## Overview

Accessibility testing คือการทดสอบว่า application สามารถใช้งานได้โดยผู้ที่มี disabilities ตามมาตรฐาน WCAG

## WCAG Guidelines

### Principles (POUR)

| Principle | Description |
|-----------|-------------|
| **Perceivable** | Information ต้อง present ได้ในรูปแบบที่ users รับรู้ได้ |
| **Operable** | Interface components ต้อง operable ได้ |
| **Understandable** | Information และ operation ต้องเข้าใจได้ |
| **Robust** | Content ต้อง robust พอที่จะ interpret ได้โดย assistive technologies |

## Automated Testing

### axe-core

```javascript
// Installation
bun install --save-dev @axe-core/react

// Test with React
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('button is accessible', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Pa11y

```bash
# Install
bun install -g pa11y

# Run accessibility test
pa11y https://example.com

# Test specific page
pa11y https://example.com/about
```

### Lighthouse

```javascript
// Using Playwright
const { chromium } = require('playwright');
const lighthouse = require('lighthouse');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  
  const result = await lighthouse('https://example.com', {
    port: (new URL(browser.wsEndpoint())).port,
    onlyCategories: ['accessibility']
  });
  
  console.log(result.score);
  await browser.close();
})();
```

## Manual Testing Checklist

### Keyboard Navigation

- [ ] Tab ผ่าน interactive elements ตามลำดับที่ถูกต้อง
- [ ] Focus indicator ชัดเจน
- [ ] Enter/Space ทำงานกับ buttons และ links
- [ ] Escape ปิด modals และ dropdowns
- [ ] Arrow keys ใช้งานกับ menus และ lists

### Screen Reader Testing

- [ ] Test ด้วย NVDA (Windows) หรือ VoiceOver (macOS)
- [ ] Images มี alt text
- [ ] Form fields มี labels
- [ ] Errors ประกาศออกมา
- [ ] Dynamic content ประกาศออกมา

### Color Contrast

- [ ] Text มี contrast ratio อย่างน้อย 4.5:1
- [ ] Large text มี contrast ratio อย่างน้อย 3:1
- [ ] Interactive elements มี contrast ที่เพียงพอ
- [ ] Color ไม่ใช่วิธีเดียวในการสื่อความหมาย

## Testing in Code

### ARIA Attributes

```javascript
describe('ARIA Attributes', () => {
  it('should have proper ARIA labels', () => {
    render(<button aria-label="Close dialog">✕</button>);
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('should announce live regions', () => {
    render(<div role="status" aria-live="polite">Loading...</div>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('should have proper roles', () => {
    render(<nav aria-label="Main navigation">...</nav>);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
  });
});
```

### Form Accessibility

```javascript
describe('Form Accessibility', () => {
  it('should have labels for inputs', () => {
    render(
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should have error messages associated with inputs', () => {
    render(
      <>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />
        <span id="email-error" role="alert">Invalid email</span>
      </>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });
});
```

### Keyboard Accessibility

```javascript
describe('Keyboard Accessibility', () => {
  it('should be focusable', () => {
    render(<button>Click me</button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });

  it('should handle Enter key', () => {
    const handleClick = jest.fn();
    render(<button onClick={handleClick}>Click me</button>);
    
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Best Practices

### 1. Semantic HTML

```html
<!-- GOOD - Semantic -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<!-- BAD - Non-semantic -->
<div class="nav">
  <div class="item"><a href="/">Home</a></div>
  <div class="item"><a href="/about">About</a></div>
</div>
```

### 2. Alt Text for Images

```html
<!-- GOOD - Descriptive alt text -->
<img src="logo.png" alt="Company Logo">

<!-- GOOD - Decorative image -->
<img src="decoration.png" alt="" role="presentation">

<!-- BAD - Missing alt text -->
<img src="logo.png">

<!-- BAD - Non-descriptive -->
<img src="logo.png" alt="image">
```

### 3. Focus Management

```javascript
// Trap focus in modal
function useFocusTrap(isOpen) {
  useEffect(() => {
    if (isOpen) {
      const firstFocusable = document.querySelector('[tabindex="0"]');
      firstFocusable?.focus();
    }
  }, [isOpen]);
}
```

### 4. Skip Links

```html
<!-- Skip to main content -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<main id="main-content">
  <!-- Main content -->
</main>
```

## Tools

### Browser Extensions

- **axe DevTools** - Chrome/Firefox extension
- **WAVE** - Web Accessibility Evaluation Tool
- **Lighthouse** - Built into Chrome DevTools

### Command Line Tools

```bash
# Pa11y CI
bun install -g pa11y-ci
pa11y-ci ./pa11y.json

# axe-core CLI
bun install -g @axe-core/cli
axe http://localhost:3000
```

## CI Integration

```yaml
# GitHub Actions
name: Accessibility Test
on: [push, pull_request]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Pa11y
        run: |
          bun install -g pa11y-ci
          pa11y-ci ./pa11y.json
```
