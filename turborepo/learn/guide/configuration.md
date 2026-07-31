# Configuration

## การตั้งค่า turbo.json

### โครงสร้างพื้นฐาน

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "globalDependencies": [],
  "globalEnv": [],
  "cacheDir": ".turbo/cache",
  "concurrency": "10",
  "ui": "stream",
  "tasks": {}
}
```

### Global Options

#### globalDependencies

Files ที่ส่งผลต่อ cache keys ของทุก tasks:

```json
{
  "globalDependencies": [
    "tsconfig.json",
    ".env",
    "next.config.js"
  ]
}
```

#### globalEnv

Environment variables ที่ส่งผลต่อ cache keys ของทุก tasks:

```json
{
  "globalEnv": [
    "NODE_ENV",
    "DATABASE_URL",
    "API_KEY"
  ]
}
```

#### cacheDir

Directory สำหรับ local cache:

```json
{
  "cacheDir": ".turbo/cache"
}
```

#### concurrency

จำกัดจำนวน tasks ที่ run พร้อมกัน:

```json
{
  "concurrency": "10"  // หรือ "50%" สำหรับ percentage
}
```

#### ui

UI mode สำหรับ output:

```json
{
  "ui": "stream"  // "stream" หรือ "tui"
}
```

### Task Options

#### dependsOn

Task dependencies:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]  // ^ = dependencies
    },
    "test": {
      "dependsOn": ["build"]  // build ของ workspace เดียวกัน
    }
  }
}
```

#### inputs

Files ที่ส่งผลต่อ task hash:

```json
{
  "tasks": {
    "build": {
      "inputs": ["src/**/*.ts", "test/**/*.ts"]
    }
  }
}
```

ใช้ `$TURBO_DEFAULT$` สำหรับ default inputs:

```json
{
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "src/**"]
    }
  }
}
```

#### outputs

Files ที่จะ cache:

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", ".next/**"]
    }
  }
}
```

#### env

Environment variables ที่ส่งผลต่อ task hash:

```json
{
  "tasks": {
    "build": {
      "env": ["DATABASE_URL", "API_KEY"]
    }
  }
}
```

#### cache

เปิด/ปิด caching:

```json
{
  "tasks": {
    "dev": {
      "cache": false  // dev tasks ไม่ควร cache
    }
  }
}
```

#### persistent

Mark เป็น long-running task:

```json
{
  "tasks": {
    "dev": {
      "persistent": true
    }
  }
}
```

#### interactive

Accept stdin input:

```json
{
  "tasks": {
    "test:watch": {
      "interactive": true,
      "persistent": true
    }
  }
}
```

#### outputLogs

Control log output mode:

```json
{
  "tasks": {
    "build": {
      "outputLogs": "new-only"  // "full", "hash-only", "new-only", "errors-only", "none"
    }
  }
}
```

### Remote Cache

```json
{
  "remoteCache": {
    "enabled": true,
    "signature": false,
    "timeout": 30,
    "apiUrl": "https://vercel.com"
  }
}
```

### Complete Example

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "globalDependencies": [".env"],
  "globalEnv": ["NODE_ENV"],
  "cacheDir": ".turbo/cache",
  "concurrency": "10",
  "ui": "stream",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "src/**"],
      "env": ["DATABASE_URL"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  },
  "remoteCache": {
    "enabled": true
  }
}
```
