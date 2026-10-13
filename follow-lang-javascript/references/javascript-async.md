# JavaScript Async Patterns

Async patterns and error handling for correct, efficient JavaScript

## Async/Await

- Use `async/await` instead of callback hell and `.then()` chains
- Use top-level await in ES modules
- Avoid callback functions in modern code

## Error Handling

- Use `try/catch/finally` for error handling
- Use `throw` for custom errors with `Error` objects
- Use `Error` objects with stack traces and context
- Log errors with sufficient context
- Use error boundaries in frameworks
- Don't use `catch` without an error parameter (optional catch binding)

## Promise Combinators

- Use `Promise.all()` for parallel async where every task must succeed
- Use `Promise.allSettled()` for parallel async when you need every result
- Use `Promise.race()` for timeout patterns

## Module Loading

- Use dynamic `import()` for lazy loading modules and code splitting
