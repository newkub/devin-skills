# JavaScript Security

security practices for secure JavaScript

## Input Handling

- Use `textContent` instead of `innerHTML` for user input
- Sanitize user input before use

## Network Security

- Use CSP (Content Security Policy)
- Use HTTPS for production
- Check dependencies for vulnerabilities

## Code Safety

- Avoid `eval()` and the `Function()` constructor
- Use `Object.freeze()` for immutable configurations
