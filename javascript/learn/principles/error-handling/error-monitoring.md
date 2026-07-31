# Error Monitoring

## 1. Console Logging

```javascript
console.error('Error occurred:', error);
console.warn('Warning:', warning);
console.info('Info:', info);
```

## 2. Error Tracking Services

```javascript
// Sentry
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'your-dsn'
});

try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}
```

## 3. Custom Error Logger

```javascript
class ErrorLogger {
  static log(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      timestamp: new Date().toISOString()
    };

    console.error(errorData);
    this.sendToService(errorData);
  }

  static sendToService(errorData) {
    // ส่งไปยัง error tracking service
  }
}
```
