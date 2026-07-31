# Device Emulation Guide

## Description

วิธีใช้งาน device emulation ใน Playwright สำหรับ test mobile devices และ responsive design

## Getting Started

### Emulate Mobile Device

```typescript
// Emulate iPhone 13
const context = await browser.newContext({
  ...devices['iPhone 13'],
});
```

### Emulate Desktop

```typescript
// Emulate desktop viewport
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
});
```

## Common Patterns

### Available Devices

```typescript
// Popular devices
devices['iPhone 13']
devices['iPhone 13 Pro']
devices['iPad Pro 11']
devices['Pixel 5']
devices['Desktop Chrome']
devices['Desktop Firefox']
devices['Desktop Safari']
```

### Custom Viewport

```typescript
// Custom viewport size
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 2,
});
```

### User Agent

```typescript
// Custom user agent
const context = await browser.newContext({
  userAgent: 'Custom User Agent String',
});
```

### Locale and Timezone

```typescript
// Set locale and timezone
const context = await browser.newContext({
  locale: 'th-TH',
  timezoneId: 'Asia/Bangkok',
});
```

## Advanced Usage

### Geolocation

```typescript
// Set geolocation
const context = await browser.newContext({
  geolocation: { latitude: 13.7563, longitude: 100.5018 },
  permissions: ['geolocation'],
});
```

### Media Features

```typescript
// Emulate media features
const context = await browser.newContext({
  media: 'reduced-motion',
  colorScheme: 'dark',
});
```

### Permissions

```typescript
// Grant permissions
const context = await browser.newContext({
  permissions: ['geolocation', 'camera', 'microphone'],
});
```

## Best Practices

1. **Test Multiple Devices**: Test บน multiple devices และ viewports
2. **Use Device Presets**: ใช้ device presets ที่ built-in
3. **Test Responsive Design**: Test responsive design บนหลายขนาด
4. **Consider Performance**: Consider performance บน mobile devices
