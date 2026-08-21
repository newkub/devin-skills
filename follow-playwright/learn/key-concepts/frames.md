# Frames

## Definition

Frames คือการจัดการ iframe และ frame elements:
- Access iframe content
- Navigate between frames
- Handle nested frames
- Frame locators

## Core Concepts

### Frame Locator

```typescript
// Get frame by locator
const frame = page.frameLocator('iframe[name="myframe"]');

// Interact with frame content
await frame.getByRole('button', { name: 'Submit' }).click();
```

### Frame by Name

```typescript
// Get frame by name attribute
const frame = page.frame('myframe');
```

### Frame by URL

```typescript
// Get frame by URL
const frame = page.frame({ url: /example\.com/ });
```

### Main Frame

```typescript
// Access main frame
const mainFrame = page.mainFrame();
```

## Use Cases

### Iframe Testing

```typescript
// Test content inside iframe
const frame = page.frameLocator('iframe');
await frame.getByText('Content inside iframe').isVisible();
```

### Nested Frames

```typescript
// Handle nested iframes
const outerFrame = page.frameLocator('iframe[name="outer"]');
const innerFrame = outerFrame.frameLocator('iframe[name="inner"]');
await innerFrame.getByRole('button').click();
```

### Cross-Origin Frames

```typescript
// Playwright handles cross-origin frames automatically
const frame = page.frameLocator('iframe[src*="other-domain"]');
await frame.getByText('Cross-origin content').isVisible();
```

## Best Practices

1. **Use Frame Locators**: ใช้ frame locators สำหรับ robust frame handling
2. **Wait for Frames**: Wait ให้ frames load ก่อน interact
3. **Handle Dynamic Frames**: ใช้ dynamic locators สำหรับ frames ที่ dynamic
4. **Avoid Nested Selectors**: หลีกเลี่ยง nested selectors ข้าม frames
