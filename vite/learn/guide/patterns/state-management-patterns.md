# State Management Patterns

## 1. Composition API Pattern (Vue)

```typescript
// src/composables/useAuth.ts
import { ref, computed } from 'vue'

export function useAuth() {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials) => {
    const response = await api.login(credentials)
    user.value = response.data
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}
```

## 2. Custom Hooks Pattern (React)

```typescript
// src/hooks/useAuth.ts
import { useState, useCallback } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const isAuthenticated = !!user

  const login = useCallback(async (credentials) => {
    const response = await api.login(credentials)
    setUser(response.data)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}
```

## 3. Store Pattern (Pinia)

```typescript
// src/stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(credentials) {
      const response = await api.login(credentials)
      this.user = response.data
    },
    logout() {
      this.user = null
    },
  },
})
```
