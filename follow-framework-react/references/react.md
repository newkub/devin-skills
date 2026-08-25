# React 19 Reference

## Install

```bash
# With Vite (recommended for SPAs)
bun create vite@latest my-app --template react-ts

# With Next.js (full-stack, Server Components)
bun create next-app@latest

# Manual install
bun add react@latest react-dom@latest
```

## Version Info

- Latest stable: `19.2.x` (as of 2026)
- React 19.0 released December 2024
- React 19.2 released October 2025
- Peer dependency: `react-dom` (same version)
- RSC features (directives, server components, server functions) are stable

## CLI Commands (Vite-based)

```bash
bun dev        # Start dev server
bun run build  # Build for production
bun run preview # Preview production build
```

## Entry Point

`src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## React 19 Hooks

### useActionState

Form actions with pending state:

```tsx
import { useActionState } from 'react'

async function increment(prevState, formData) {
  return prevState + 1
}

function Counter() {
  const [state, formAction, isPending] = useActionState(increment, 0)
  return (
    <form action={formAction}>
      <span>{state}</span>
      <button disabled={isPending}>Increment</button>
    </form>
  )
}
```

### useFormStatus

```tsx
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>Submit</button>
}
```

### useOptimistic

```tsx
import { useOptimistic } from 'react'

function Thread({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  )

  const formAction = async (formData) => {
    addOptimisticMessage(formData.get('text'))
    await sendMessage(formData.get('text'))
  }

  return (
    <>
      {optimisticMessages.map((m, i) => <p key={i}>{m.text}</p>)}
      <form action={formAction}><input name="text" /><button type="submit">Send</button></form>
    </>
  )
}
```

### use() API

Unwrap promises and context:

```tsx
import { use } from 'react'

function Message({ messagePromise }) {
  const message = use(messagePromise)
  return <p>{message}</p>
}
```

### useTransition

```tsx
import { useTransition } from 'react'

function TabContainer() {
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('about')

  function selectTab(nextTab) {
    startTransition(() => setTab(nextTab))
  }

  return (
    <>
      <TabButton isActive={tab === 'about'} onClick={() => selectTab('about')}>About</TabButton>
      {isPending && <Spinner />}
    </>
  )
}
```

### useDeferredValue

```tsx
import { useDeferredValue } from 'react'

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query)
  return <ExpensiveList items={filterItems(deferredQuery)} />
}
```

## Server Components

Server Components are the default (async functions, no `useState`/`useEffect`):

```tsx
// Server Component
async function Talks({ confId }) {
  const talks = await db.Talks.findAll({ confId })
  const videos = talks.map(talk => talk.video)
  return <SearchableVideoList videos={videos} />
}
```

### Client Components

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Server Actions

```tsx
'use server'

export async function submitForm(formData: FormData) {
  const name = formData.get('name')
  // Handle mutation on server
}
```

## Suspense Boundaries

```tsx
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

## Code Splitting

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

## React Compiler

React Compiler (v1.0, October 2025) eliminates need for manual `memo`/`useMemo`/`useCallback`:

```bash
# Install with Next.js
bun create next-app@latest --react-compiler

# Install babel plugin for Vite
bun add -D babel-plugin-react-compiler
```

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
```

## Source

- https://react.dev/versions
- https://react.dev/learn/start-a-new-react-project
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
- https://react.dev/blog/2025/10/07/react-compiler-1
