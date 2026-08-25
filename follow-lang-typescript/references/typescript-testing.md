# TypeScript Testing

## vitest

ใช้ `vitest` สำหรับ unit testing

```ts
import { describe, it, expect } from "vitest";
import { add } from "./math";

describe("add", () => {
  it("returns sum of two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

## vi.fn / vi.spyOn

สร้าง type-safe mocks ด้วย `vi.fn()` และ `vi.spyOn()`

```ts
import { vi } from "vitest";

const mockFetch = vi.fn<typeof fetch>();
vi.spyOn(console, "log").mockImplementation(() => undefined);
```

## expect-type

ใช้ `expect-type` สำหรับ runtime type assertions

```ts
import { expectTypeOf } from "expect-type";
import { add } from "./math";

expectTypeOf(add(1, 2)).toEqualTypeOf<number>();
```

## type-coverage

ตรวจสอบ type coverage ด้วย `type-coverage`

```sh
npx type-coverage --detail
```

เป้าหมาย: type coverage สูงสุด ไม่มี `any` ใน codebase
