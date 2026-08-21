# Configuration

## vercel.json

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/$1" }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["iad1", "sfo1"]
}
```

## vercel.json Environment

```json
{
  "build": {
    "env": {
      "BUILD_TOKEN": "@build-token"
    }
  }
}
```

## Configuration Commands

### vercel project add

Add project setting.

```bash
vercel project add [setting] [value]
```

### vercel project rm

Remove project setting.

```bash
vercel project rm [setting]
```
