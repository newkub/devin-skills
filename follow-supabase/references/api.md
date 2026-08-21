# Programmatic API

## Purpose

Programmatic API reference สำหรับ Supabase client libraries

## Scope

- Client Setup
- Database API
- Auth API
- Storage API

## Client Setup

### TypeScript/JavaScript

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'http://127.0.0.1:54321',
  'your-anon-key'
)

// With custom options
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
```

### Environment Variables

```typescript
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
)
```

## Database API

### Select

```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'test@example.com')
  .single()
```

### Insert

```typescript
const { data, error } = await supabase
  .from('users')
  .insert({
    email: 'test@example.com',
    name: 'John Doe',
  })
  .select()
```

### Update

```typescript
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane Doe' })
  .eq('id', '123')
  .select()
```

### Delete

```typescript
const { data, error } = await supabase
  .from('users')
  .delete()
  .eq('id', '123')
```

### Upsert

```typescript
const { data, error } = await supabase
  .from('users')
  .upsert({ id: '123', name: 'Jane' })
```

### Query Builder

```typescript
// Filters
.supabase.from('users').select('*').eq('id', 1)
.supabase.from('users').select('*').neq('id', 1)
.supabase.from('users').select('*').gt('age', 18)
.supabase.from('users').select('*').like('name', '%john%')
.supabase.from('users').select('*').in('id', [1, 2, 3])

// Pagination
.supabase.from('users').select('*').range(0, 9)
.supabase.from('users').select('*').limit(10).order('name')
```

## Auth API

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
})
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
})
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

### Get Session

```typescript
const { data: { session } } = await supabase.auth.getSession()
```

### Get User

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### On Auth State Change

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
})
```

## Storage API

### Upload File

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-123/avatar.png', file)
```

### Download File

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .download('user-123/avatar.png')
```

### Public URL

```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-123/avatar.png')
```

### Delete File

```typescript
const { error } = await supabase.storage
  .from('avatars')
  .remove(['user-123/avatar.png'])
```

### List Files

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .list('user-123', { limit: 10 })
```

## Realtime API

### Subscribe

```typescript
const channel = supabase
  .channel('schema-db-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    console.log(payload)
  })
  .subscribe()
```

### Unsubscribe

```typescript
supabase.removeChannel(channel)
```

## Edge Functions

### Invoke Function

```typescript
const { data, error } = await supabase.functions
  .invoke('hello-world', {
    body: { name: 'John' }
  })
```

## Summary

| API | Methods |
|-----|---------|
| **Client** | createClient |
| **Database** | select, insert, update, delete |
| **Auth** | signUp, signIn, signOut |
| **Storage** | upload, download, remove |
| **Realtime** | channel, subscribe |