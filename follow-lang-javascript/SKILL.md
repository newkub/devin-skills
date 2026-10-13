---
name: follow-lang-javascript
description: Write JavaScript following modern best practices and ES2025+
argument-hint: "[scope]"
related:
  - use-bun-native-api
  - follow-lang-kotlin
  - follow-lang-lua
  - follow-best-practice
  - setup-cicd
  - use-scripts

---

## Goal

Write JavaScript following modern best practices and ES2025+ features

## Scope

For writing JavaScript in both vanilla code and frameworks (ES2025 / 16th edition)

## Execute

### 1. Use Modern Syntax

> Goal: use modern JavaScript syntax and ES2025+ features for concise, safe code

1. Use `const`/`let`, arrow functions, template literals, destructuring, spread/rest
2. Use optional chaining (`?.`) and nullish coalescing (`??`)
3. Use `Promise.withResolvers()`, `Object.groupBy()`, `Map.groupBy()` (ES2024)
4. Use `toSorted()`, `toReversed()`, `toSpliced()`, `with()`, `findLast()` (ES2023)
5. Use `Iterator` helpers, `Set` methods, `Promise.try`, `RegExp.escape` (ES2025)
6. See details in [references/javascript-syntax.md](references/javascript-syntax.md)

### 2. Use Async Patterns

> Goal: use async patterns with correct, efficient error handling

1. Use `async/await` instead of callbacks and `.then()` chains
2. Use `try/catch/finally` for error handling
3. Use `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, `Promise.try()` per context
4. Use top-level await and dynamic `import()`
5. See details in [references/javascript-async.md](references/javascript-async.md)

### 3. Write Clean Code

> Goal: write clean, maintainable, testable code following best practices

1. Use named functions, early returns, pure functions, default parameters
2. Use ES Modules (`import`/`export`) instead of CommonJS
3. Use functional programming and composition over inheritance
4. Use SOLID principles and appropriate naming conventions
5. See details in [references/javascript-quality.md](references/javascript-quality.md)

### 4. Write Tests

> Goal: write tests covering business logic for quality assurance

1. Use `vitest` for unit testing
2. Use the `describe`/`it` pattern and `expect` for assertions
3. Use `vi.fn()` and `vi.spyOn()` for mocks
4. Use TDD principles when appropriate
5. See details in [references/javascript-testing.md](references/javascript-testing.md)

### 5. Ensure Security

> Goal: set up security practices for safe JavaScript

1. Use `textContent` instead of `innerHTML` for user input
2. Use CSP, HTTPS, and audit dependencies
3. Avoid `eval()` and the `Function()` constructor
4. Use `Object.freeze()` for immutable configurations
5. See details in [references/javascript-security.md](references/javascript-security.md)

## Rules

### 1. Modern Syntax

- Use ES2025+ features, never `var`
- Use `Iterator` helpers, `Set` methods, `Promise.try`, `RegExp.escape` (ES2025)
- See [references/javascript-syntax.md](references/javascript-syntax.md)

### 2. Async Patterns

- Use `async/await`, avoid callback hell
- Use `Promise.try()` for wrapping sync/async code (ES2025)
- See [references/javascript-async.md](references/javascript-async.md)

### 3. Code Quality

- Use meaningful names, DRY, SOLID, pure functions
- Use ES Modules (`import`/`export`) instead of CommonJS
- See [references/javascript-quality.md](references/javascript-quality.md)

### 4. Performance

- Use lazy loading, debouncing, Web Workers, `structuredClone()`
- Use `requestAnimationFrame` for animations
- See [references/javascript-quality.md](references/javascript-quality.md)

### 5. Testing

- Write tests covering business logic with `vitest`
- See [references/javascript-testing.md](references/javascript-testing.md)

### 6. Security

- Sanitize input, avoid `eval()`, use CSP/HTTPS
- See [references/javascript-security.md](references/javascript-security.md)

- Use /use-bun-native-api if needed
- Use /follow-lang-kotlin if needed
- Use /follow-lang-lua if needed
- Use /follow-best-practice if needed
- Use /setup-cicd if needed
- Use /use-scripts if needed

## Expected Outcome

- JavaScript written per modern best practices and ES2025+
- Clean, maintainable, testable code
- Correct, efficient async patterns
- Robust error handling
- Improved performance
- Improved security
- Tests covering business logic
