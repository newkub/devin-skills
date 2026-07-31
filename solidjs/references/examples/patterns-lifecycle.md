---
title: Lifecycle Patterns
description: Lifecycle patterns สำหรับ SolidJS
---

# Lifecycle Patterns

Lifecycle patterns สำหรับ SolidJS

## createRoot for Manual Disposal

```tsx
import { createRoot, createSignal } from 'solid-js';

function createCounter() {
  const [count, setCount] = createSignal(0);
  
  const dispose = createRoot((dispose) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    const interval = setInterval(() => {
      setCount(c => c + 1);
      element.textContent = `Count: ${count()}`;
    }, 1000);
    
    onCleanup(() => {
      clearInterval(interval);
      document.body.removeChild(element);
    });
  });
  
  return dispose;
}

// Usage
const disposeCounter = createCounter();
// Later: disposeCounter();
```
