# Configuration

## ภาพรวม

Node.js มีหลายวิธีในการตั้งค่า ตั้งแต่ environment variables ไปจนถึง configuration files

## Environment Variables

### ตัวแปรสำคัญ

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `NODE_PATH` | Paths สำหรับ module resolution | - |
| `NODE_OPTIONS` | CLI options สำหรับ Node.js | - |
| `TZ` | Timezone | System timezone |
| `UV_THREADPOOL_SIZE` | Thread pool size | 4 |

### ตัวอย่างการใช้งาน

```bash
# ตั้งค่า environment mode
export NODE_ENV=production

# ตั้งค่า module paths
export NODE_PATH=/custom/path

# ตั้งค่า CLI options
export NODE_OPTIONS="--max-old-space-size=4096"

# ตั้งค่า thread pool size
export UV_THREADPOOL_SIZE=8
```

## package.json

### ตัวอย่าง Configuration

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My application",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "node --test"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `type` | string | Module type (`"commonjs"` or `"module"`) |
| `main` | string | Entry point file |
| `engines` | object | Required Node.js version |
| `scripts` | object | bun scripts |

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Configuration Options

| Option | Description |
|--------|-------------|
| `target` | JavaScript version ที่จะ compile |
| `module` | Module system |
| `moduleResolution` | วิธี resolve modules |
| `strict` | เปิด strict mode |
| `outDir` | Output directory |
| `rootDir` | Source directory |

## .env Files

### ติดตั้ง dotenv

```bash
bun install dotenv
```

### การใช้งาน

```bash
# .env
PORT=3000
DATABASE_URL=postgres://localhost/mydb
API_KEY=secret
```

```javascript
// index.js
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
```

## Node.js Configuration File

### .noderc

```json
{
  "max-old-space-size": 4096,
  "inspect-port": 9229
}
```

## Environment-Specific Configuration

### Development

```bash
# .env.development
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### Production

```bash
# .env.production
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
```

## Best Practices

1. **ใช้ NODE_ENV** สำหรับ environment mode
2. **ใช้ .env files** สำหรับ environment variables
3. **ใช้ TypeScript** สำหรับ type safety
4. **ตั้งค่า engines** สำหรับ version requirements
5. **ใช้ dotenv** สำหรับ loading environment variables
