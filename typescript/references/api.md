# TypeScript API Reference

## Official Documentation

| Name | URL | Description |
|------|-----|-------------|
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/intro.html | Official TypeScript handbook and documentation |
| TypeScript API | https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html | Declaration file (.d.ts) API |
| Compiler API | https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API | TypeScript Compiler API for programmatic access |
| Language Specification | https://github.com/microsoft/TypeScript/blob/main/doc/spec.md | TypeScript language specification |

## Type System APIs

### Utility Types

| Type | Description |
|------|-------------|
| `Partial<T>` | Make all properties in T optional |
| `Required<T>` | Make all properties in T required |
| `Readonly<T>` | Make all properties in T readonly |
| `Record<K, T>` | Construct a type with set of properties K of type T |
| `Pick<T, K>` | From T, pick set of properties K |
| `Omit<T, K>` | From T, omit set of properties K |
| `Exclude<T, U>` | Exclude from T those assignable to U |
| `Extract<T, U>` | Extract from T those assignable to U |
| `NonNullable<T>` | Exclude null and undefined from T |
| `ReturnType<T>` | Obtain return type of function type T |
| `InstanceType<T>` | Obtain instance type of constructor function type T |

### Type Guards

| Function | Description |
|----------|-------------|
| `typeof` | Type guard for primitive types |
| `instanceof` | Type guard for class instances |
| `in` | Type guard for property existence |
| Custom type guards | User-defined type guard functions |

## Compiler Options

### Common tsconfig Options

| Option | Type | Description |
|--------|------|-------------|
| `target` | string | ECMAScript target version |
| `module` | string | Module code generation |
| `lib` | string[] | Library files to include |
| `strict` | boolean | Enable all strict type checking options |
| `esModuleInterop` | boolean | Enable import helpers for CommonJS |
| `skipLibCheck` | boolean | Skip type checking of declaration files |
| `forceConsistentCasingInFileNames` | boolean | Disallow inconsistently cased references |

## Related Resources

| Name | URL | Description |
|------|-----|-------------|
| DefinitelyTyped | https://github.com/DefinitelyTyped/DefinitelyTyped | Repository for high quality TypeScript type definitions |
| Type Challenges | https://github.com/type-challenges/type-challenges | Collection of TypeScript type challenges |
| Total TypeScript | https://totaltypescript.com/ | Advanced TypeScript tutorials and workshops |
