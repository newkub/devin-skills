# API Patterns

## 1. API Client Pattern

```typescript
// src/api/client.ts
import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
```

## 2. Repository Pattern

```typescript
// src/api/repositories/user.ts
import client from './client'

export const userRepository = {
  async getAll() {
    const response = await client.get('/users')
    return response.data
  },

  async getById(id) {
    const response = await client.get(`/users/${id}`)
    return response.data
  },

  async create(data) {
    const response = await client.post('/users', data)
    return response.data
  },

  async update(id, data) {
    const response = await client.put(`/users/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await client.delete(`/users/${id}`)
    return response.data
  },
}
```

## 3. Service Pattern

```typescript
// src/services/auth.ts
import { userRepository } from '../api/repositories/user'

export const authService = {
  async login(credentials) {
    const user = await userRepository.getByEmail(credentials.email)
    if (user && user.password === credentials.password) {
      return user
    }
    throw new Error('Invalid credentials')
  },

  async register(data) {
    return await userRepository.create(data)
  },
}
```
