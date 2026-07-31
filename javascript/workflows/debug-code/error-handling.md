# Error Handling

## 1. Try-Catch with Logging

```javascript
try {
  const result = riskyOperation();
  console.log('Success:', result);
} catch (error) {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
}
```

## 2. Global Error Handler

```javascript
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

## 3. Custom Error Logging

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

    console.error('Error:', errorData);
    this.sendToMonitoring(errorData);
  }

  static sendToMonitoring(errorData) {
    // Send to error tracking service
  }
}
```
