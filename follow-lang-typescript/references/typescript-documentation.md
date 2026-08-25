# TypeScript Documentation

## JSDoc / TSDoc

ใช้ `JSDoc`/`TSDoc` สำหรับ function documentation ด้วย `/** */`

## Tags

- `@param` — อธิบาย parameter
- `@returns` — อธิบาย return value
- `@example` — แสดง usage example
- `@remarks` — additional notes
- `@deprecated` — ระบุ deprecated APIs

## Example

```ts
/**
 * Calculates the sum of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 * @example
 *
 * add(1, 2); // returns 3
 *
 * @remarks
 * Returns 0 when both inputs are 0
 */
function add(a: number, b: number): number {
  return a + b;
}
```
