# Integration

## With Build Tools

### Vite

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

### Webpack

```typescript
// webpack.config.ts
import * as path from "path";

export default {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
```

## With Frameworks

### React

```typescript
// src/App.tsx
import { useState } from "react";

interface Props {
  initialCount?: number;
}

export function App({ initialCount = 0 }: Props) {
  const [count, setCount] = useState<number>(initialCount);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Next.js (App Router)

```typescript
// src/app/page.tsx
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] };
}

export default async function Page({ params, searchParams }: PageProps) {
  return <div>User ID: {params.id}</div>;
}
```

### Node.js / Express

```typescript
// src/index.ts
import express, { Request, Response, NextFunction } from "express";

interface User {
  id: string;
  name: string;
}

const app = express();

app.get("/users/:id", (req: Request, res: Response) => {
  const userId: string = req.params.id;
  res.json({ id: userId, name: "Alice" } satisfies User);
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message });
});
```

## With Testing

### Vitest

```typescript
// src/utils.test.ts
import { describe, it, expect } from "vitest";

function add(a: number, b: number): number {
  return a + b;
}

describe("add", () => {
  it("should add two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### Jest

```typescript
// src/math.test.ts
function multiply(a: number, b: number): number {
  return a * b;
}

test("multiplies numbers", () => {
  expect(multiply(2, 3)).toBe(6);
});
```

## With Type Definitions

### Creating Type Definitions

```typescript
// types/my-package/index.d.ts
export interface Config {
  apiKey: string;
  timeout?: number;
}

export function initialize(config: Config): void;

export default class MyClass {
  constructor(config: Config);
  execute(): Promise<void>;
}
```

### Publishing Types

```json
// package.json
{
  "name": "my-package",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## With Linting

### ESLint + TypeScript

```bash
bun add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```json
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

## With Prettier

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```