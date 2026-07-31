---
title: Error Boundaries
description: เรียนรู้เรื่อง error boundaries ใน SolidJS
---

## สิ่งที่คือ Error Boundaries

Error Boundaries ใช้สำหรับ handle errors:

```jsx
<ErrorBoundary fallback={(err) => <p>Error: {err}</p>}>
  <Component />
</ErrorBoundary>
```

## Basic Usage

### Simple Error Boundary

```jsx
import { ErrorBoundary } from "solid-js";

function App() {
  return (
    <ErrorBoundary fallback={(err) => <p>Error: {err.message}</p>}>
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

## Custom Fallback

### Component Fallback

```jsx
function ErrorFallback(props) {
  return (
    <div class="error">
      <h2>Something went wrong</h2>
      <p>{props.error.message}</p>
      <button onClick={props.reset}>Try again</button>
    </div>
  );
}

<ErrorBoundary fallback={ErrorFallback}>
  <Component />
</ErrorBoundary>
```

## Error Types

### Catching Specific Errors

```jsx
<ErrorBoundary
  fallback={(err) => {
    if (err instanceof NetworkError) {
      return <NetworkErrorFallback />;
    }
    return <GenericErrorFallback />;
  }}
>
  <Component />
</ErrorBoundary>
```

## กับ Suspense

### Error Boundaries กับ Suspense

```jsx
<ErrorBoundary fallback={(err) => <p>Error: {err}</p>}>
  <Suspense fallback={<p>Loading...</p>}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

## Best Practices

### ใช้ Error Boundaries รอบ Risky Components

```jsx
<ErrorBoundary fallback={ErrorFallback}>
  <ExternalAPI />
</ErrorBoundary>
```

### ให้ Recovery Options

```jsx
function ErrorFallback(props) {
  return (
    <div>
      <p>Error occurred</p>
      <button onClick={props.reset}>Retry</button>
    </div>
  );
}
```

## สรุป

Error Boundaries ช่วย:
- Catch errors ใน component tree
- แสดง fallback UI
- ให้ recovery options
- ป้องกัน app crash
