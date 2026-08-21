# Programmatic API

## Purpose

Programmatic API reference สำหรับการใช้งาน Playwright ใน code

## Scope

- Browser API
- Page API
- Locator API
- Request API

## Browser API

### Launch Browser

```typescript
import { chromium, firefox, webkit } from '@playwright/test'

const browser = await chromium.launch()
const browser = await firefox.launch()
const browser = await webkit.launch()
```

### Launch Options

```typescript
const browser = await chromium.launch({
  headless: true,
  args: ['--disable-dev-shm-usage'],
  executablePath: '/path/to/chrome',
})
```

### Close Browser

```typescript
await browser.close()
```

### Context

```typescript
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  locale: 'en-US',
})

const page = await context.newPage()
```

## Page API

### Navigate

```typescript
await page.goto('https://example.com')
await page.goto('https://example.com', { waitUntil: 'networkidle' })
```

### Wait Options

| Value | Description |
|-------|-------------|
| `load` | Wait for load event |
| `domcontentloaded` | DOMContentLoaded |
| `networkidle` | No network connections |
| `commit` | Navigation committed |

### Click

```typescript
await page.click('#submit')
await page.click('#submit', { button: 'right' })
await page.click('#submit', { clickCount: 2 })
```

### Fill

```typescript
await page.fill('#email', 'test@example.com')
await page.fill('#email', 'test@example.com', { timeout: 5000 })
```

### Select

```typescript
await page.selectOption('#country', 'Thailand')
await page.selectOption('#country', { label: 'Thailand' })
await page.selectOption('#country', ['TH', 'US'])
```

### Hover

```typescript
await page.hover('#menu')
```

### Type

```typescript
await page.type('#input', 'Hello')
await page.type('#input', 'Hello', { delay: 100 })
```

### Check

```typescript
await page.check('#agree')
await page.uncheck('#agree')
```

### Drag and Drop

```typescript
await page.dragAndDrop('#source', '#target')
```

### Screenshot

```typescript
await page.screenshot()
await page.screenshot({ path: 'screenshot.png', fullPage: true })
```

## Locator API

### Create Locator

```typescript
const button = page.locator('button')
const button = page.locator('#submit')
const button = page.locator('.btn-primary')
```

### Built-in Locators

```typescript
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByText('Hello')
page.getByPlaceholder('Enter name')
page.getByTestId('submit-btn')
```

### Locator Actions

```typescript
await button.click()
await button.fill('text')
await button.isVisible()
await button.isEnabled()
```

### Locator Filters

```typescript
page.locator('button').filter({ hasText: 'Submit' })
page.locator('li').filter({ has: page.locator('.active') })
page.locator('button').first
page.locator('button').last
page.locator('button').nth(0)
```

### Filter by

```typescript
page.locator('button').filter({ hasText: 'Submit' })
page.locator('li').filter({ hasNot: page.locator('.disabled') })
```

## Expect API

### Basic Assertions

```typescript
await expect(page.locator('.title')).toHaveText('Welcome')
await expect(page.locator('.count')).toHaveCount(5)
await expect(page.locator('.visible')).toBeVisible()
await expect(page.locator('.disabled')).toBeDisabled()
```

### Soft Assertions

```typescript
await expect(page.locator('.count')).toHaveText('10', {
  timeout: 5000,
  assertion: 'should',
})
```

### Navigation Assertions

```typescript
await expect(page).toHaveURL(/.*success/)
await expect(page).toHaveTitle('Welcome')
```

### Count Assertions

```typescript
await expect(page.locator('li')).toHaveCount(5)
await expect(page.locator('li')).toHaveCount({ min: 3 })
```

## Request API

### API Request

```typescript
const response = await page.request.get('https://api.example.com/users')
const response = await page.request.post('https://api.example.com/users', {
  data: { name: 'John' },
})
```

### Response

```typescript
expect(response.status()).toBe(200)
const body = await response.json()
```

## WebSocket API

### Listen

```typescript
page.on('websocket', ws => {
  ws.on('frames', frame => console.log(frame.text()))
  ws.on('close', () => console.log('closed'))
})
```

## Summary

| API | Methods |
|-----|---------|
| **Browser** | launch, newContext, close |
| **Context** | newPage, grantPermissions |
| **Page** | goto, click, fill, screenshot |
| **Locator** | click, fill, isVisible |
| **Expect** | toHaveText, toBeVisible |
