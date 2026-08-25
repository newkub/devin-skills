# TypeScript Modern Features

## as const

ใช้ `as const` สำหรับ literal type inference

```ts
const status = ["idle", "loading", "success"] as const;
type Status = (typeof status)[number];
```

## Branded Types

ใช้ branded types สำหรับ domain-specific values (e.g. `UserId`, `Email`)

```ts
type UserId = string & { readonly __brand: unique symbol };
type Email = string & { readonly __brand: unique symbol };
```

## Template Literal Types

ใช้ template literal types สำหรับ string patterns

```ts
type EventName = `on${Capitalize<string>}`;
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint = `/api/${string}`;
```

## Conditional Types

ใช้ conditional types สำหรับ type logic

```ts
type IsString<T> = T extends string ? true : false;
type NonNullable<T> = T extends null | undefined ? never : T;
```

## infer Keyword

ใช้ `infer` keyword สำหรับ type inference ใน conditional types

```ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ElementOf<T> = T extends (infer E)[] ? E : never;
```

## Mapped Types

ใช้ mapped types สำหรับ type transformations

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
type Optional<T> = {
  [K in keyof T]?: T[K];
};
```

## keyof / typeof

ใช้ `keyof` และ `typeof` operators สำหรับ type queries

```ts
const config = { port: 8080, host: "localhost" };
type ConfigKey = keyof typeof config;
type ConfigValue = (typeof config)[ConfigKey];
```
