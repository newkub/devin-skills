# Configuration

## package.json

Core configuration file for JavaScript/Node.js projects.

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Project description",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "node --test",
    "lint": "eslint src/"
  },
  "keywords": ["javascript", "nodejs"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "eslint": "^8.50.0"
  }
}
```

## TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## ESLint Configuration (.eslintrc.json)

```json
{
  "env": {
    "es2022": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

## Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

## Node.js Configuration

### .bunrc (bun configuration)

```
registry=https://registry.bunjs.org/
save-exact=true
engine-strict=true
```

### .nvmrc (Node version)

```
20.10.0
```

### .node-version

```
20.10.0
```

## Environment Variables (.env)

```bash
# Development
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://localhost:5432/dev

# Production
NODE_ENV=production
PORT=8080
```

## Import Aliases (package.json scripts)

```json
{
  "scripts": {
    "start": "node --import ./register.js src/index.js"
  }
}
```

Or with ESM:

```json
{
  "imports": {
    "#utils": "./src/utils/index.js",
    "#config": "./src/config/index.js"
  }
}
```

## Common Configurations

| Config File | Purpose | Location |
|-------------|---------|----------|
| package.json | Project metadata, dependencies, scripts | Root |
| tsconfig.json | TypeScript compiler options | Root |
| .eslintrc.json | Linting rules | Root |
| .prettierrc | Code formatting | Root |
| .env | Environment variables | Root |
| .gitignore | Git ignore patterns | Root |