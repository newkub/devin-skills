# Configuration Patterns

## 1. Environment-Specific Config

```typescript
// src/config/index.ts
const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export default config
```

## 2. Feature Flags

```typescript
// src/config/features.ts
const features = {
  newDashboard: import.meta.env.VITE_FEATURE_NEW_DASHBOARD === 'true',
  darkMode: import.meta.env.VITE_FEATURE_DARK_MODE === 'true',
}

export default features
```
