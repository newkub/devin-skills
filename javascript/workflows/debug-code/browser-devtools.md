# Browser DevTools

## 1. Breakpoints

```javascript
// Set breakpoint in code
debugger;

const result = calculate();
console.log(result);
```

## 2. Conditional Breakpoints

```javascript
// Right-click on breakpoint > Edit breakpoint
// Add condition: value > 100
```

## 3. Watch Expressions

```javascript
// Add expressions to watch panel
// variableName
// object.property
// functionCall()
```

## 4. Call Stack

```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  debugger; // Check call stack here
}

a();
```
