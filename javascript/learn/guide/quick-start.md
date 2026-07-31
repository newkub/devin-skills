# Quick Start

## Create Your First Project

### 1. Initialize Project

```bash
# Create directory
mkdir my-project
cd my-project

# Initialize bun
bun init -y
```

### 2. Create File Structure

```
my-project/
├── src/
│   ├── index.js
│   ├── utils.js
│   └── data/
│       └── config.json
├── package.json
└── .gitignore
```

### 3. Write Your First Code

```javascript
// src/index.js
import { greet, farewell } from './utils.js';

const name = process.argv[2] || 'World';

console.log(greet(name));
console.log(farewell(name));
```

```javascript
// src/utils.js
export function greet(name) {
  return `Hello, ${name}!`;
}

export function farewell(name) {
  return `Goodbye, ${name}!`;
}
```

### 4. Add Scripts

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  }
}
```

### 5. Run

```bash
bun start
# Hello, World!

bun start Alice
# Hello, Alice!
```

## Common Patterns

### Async Data Fetching

```javascript
// src/api.js
export async function fetchUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}
```

```javascript
// src/main.js
import { fetchUser } from './api.js';

async function main() {
  try {
    const user = await fetchUser(1);
    console.log(`User: ${user.name}`);
  } catch (err) {
    console.error(err.message);
  }
}

main();
```

### File System Operations

```javascript
// src/files.js
import { readFile, writeFile } from 'fs/promises';

export async function readJSON(path) {
  const data = await readFile(path, 'utf-8');
  return JSON.parse(data);
}

export async function writeJSON(path, data) {
  await writeFile(path, JSON.stringify(data, null, 2));
}
```

### Module Pattern

```javascript
// src/config/index.js
const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
};

export default config;
```

## Development Workflow

### With --watch flag (Node.js 18+)

```bash
node --watch src/index.js
```

### With nodemon

```bash
# Install
bun install -D nodemon

# Add script
bun run dev
```

package.json scripts:

```json
{
  "scripts": {
    "dev": "nodemon src/index.js"
  }
}
```

## Project Templates

### Express API

```bash
bun init -y
bun install express cors helmet

# src/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### ES Modules Project

package.json:

```json
{
  "type": "module"
}
```

## Next Steps

- Add ESLint and Prettier for code quality
- Set up testing with Jest or Vitest
- Configure TypeScript for type safety
- Explore popular frameworks (React, Vue, Express)