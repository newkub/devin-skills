# Architecture - SolidStart

## สถาปัตยกรรมโดยรวม

SolidStart ถูกออกแบบมาเพื่อเป็น meta-framework ที่เบาเบาแต่มีพลัง สร้างขึ้นบน SolidJS และใช้ Vinxi เป็น bundler

## Component Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (User Components, Business Logic, State Management)         │
├─────────────────────────────────────────────────────────────┤
│                    Framework Layer                           │
│  (SolidStart, Routing, Server Functions, Data Fetching)      │
├─────────────────────────────────────────────────────────────┤
│                    Core Layer                                │
│  (SolidJS Reactivity System, Signals, Stores)               │
├─────────────────────────────────────────────────────────────┤
│                    Build Layer                               │
│  (Vinxi, Vite, Nitro, Optimization, Bundling)               │
└─────────────────────────────────────────────────────────────┘
```

## Core Architecture

### 1. SolidJS Reactivity System

```
┌──────────────┐
│   Signal     │ ◀─── Reactive State
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Component   │ ◀─── Auto-renders on signal change
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     DOM      │ ◀─── Fine-grained DOM updates
└──────────────┘
```

**Key Concepts:**
- **Signals**: Reactive state primitives
- **Fine-grained reactivity**: เฉพาะส่วนที่เปลี่ยนเท่านั้นที่ re-render
- **No Virtual DOM**: Direct DOM manipulation

### 2. Routing Architecture

```
File System                    Route Registry
───────────                    ┌─────────────────┐
routes/                        │                 │
├── index.tsx       ──────────▶│  Route Config   │
├── about.tsx       ──────────▶│                 │
├── blog/                       │  <FileRoutes/>  │
│   ├── index.tsx  ──────────▶│  Component     │
│   └── [slug].tsx ──────────▶│                 │
└── api/                        └────────┬────────┘
    └── hello.ts    ──────────▶         │
                                        ▼
                               ┌─────────────────┐
                               │   Router        │
                               │ (@solidjs/router)│
                               └─────────────────┘
```

**Route Types:**
- **UI Routes**: Pages และ layouts
- **API Routes**: Server functions
- **Nested Routes**: Layouts และ hierarchies
- **Dynamic Routes**: Parameterized paths

### 3. Rendering Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Rendering Pipeline                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Request ──▶ Route Matching ──▶ Component Render             │
│                           │          │                       │
│                           ▼          ▼                       │
│                      Data Fetch  Component Execution          │
│                           │          │                       │
│                           ▼          ▼                       │
│                      HTML Generation  State Update           │
│                           │          │                       │
│                           ▼          ▼                       │
│                      Response Send  DOM Update               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Rendering Modes:**
- **CSR**: Client-side rendering
- **SSR**: Server-side rendering + hydration
- **SSG**: Static site generation

### 4. Server Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Nitro Server                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Request    │───▶│   Middleware │───▶│   Route      │  │
│  │   Handler    │    │   Layer      │    │   Matcher    │  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘  │
│                                                   │         │
│                                                   ▼         │
│                                          ┌──────────────┐  │
│                                          │   Handler    │  │
│                                          │   Execution  │  │
│                                          └──────┬───────┘  │
│                                                   │         │
│                                                   ▼         │
│                                          ┌──────────────┐  │
│                                          │   Response   │  │
│                                          │   Builder    │  │
│                                          └──────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Server Features:**
- **Middleware**: Request/response interception
- **Route Handlers**: API routes และ server functions
- **Edge Support**: Deploy to edge networks
- **Caching**: Built-in caching strategies

### 5. Build Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vinxi Bundler                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Source Code ──▶ Vite Dev Server ──▶ HMR Updates             │
│       │                                                    │
│       ▼                                                    │
│  Build Process ──▶ Nitro Build ──▶ Production Assets        │
│       │               │                                    │
│       ▼               ▼                                    │
│  Code Splitting  Static Generation  Server Functions        │
│       │               │               │                    │
│       ▼               ▼               ▼                    │
│  Optimized Bundle  HTML Files  Serverless Functions         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Build Components:**
- **Vinxi**: Framework bundler ที่รวม Vite + Nitro
- **Seroval**: High-performance serializer สำหรับ client/server communication
- **Vite**: Development environment และ bundler
- **Nitro**: Server APIs และ deployment presets

**Build Features:**
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Remove unused code
- **Asset Optimization**: Images, fonts, CSS
- **Minification**: Production builds
- **Serialization**: Seroval สำหรับ efficient data transfer

## Data Flow Architecture

### Request Lifecycle (SSR)

```
Client Request
     │
     ▼
Nitro Server
     │
     ├─▶ Route Matching
     │
     ├─▶ Middleware Execution
     │
     ├─▶ Data Fetching (Server)
     │
     ├─▶ Component Rendering (Server)
     │
     ├─▶ HTML Generation
     │
     ├─▶ Send HTML to Client
     │
     ▼
Client Hydration
     │
     ├─▶ Load JavaScript
     │
     ├─▶ Hydrate Components
     │
     ├─▶ Activate SolidJS Reactivity
     │
     └─▶ Enable Interactivity
```

### Request Lifecycle (CSR)

```
Client Request
     │
     ▼
Serve Static HTML Shell
     │
     ▼
Client Loads JavaScript
     │
     ├─▶ Route Matching
     │
     ├─▶ Data Fetching (Client)
     │
     ├─▶ Component Rendering (Client)
     │
     └─▶ DOM Updates
```

## Component Architecture

### Component Hierarchy

```
App (Root)
 │
 ├─▶ Layout (Root Layout)
 │    │
 │    ├─▶ Navigation
 │    ├─▶ Footer
 │    └─▶ Outlet (Child Routes)
 │
 ├─▶ Route: /
 │    └─▶ HomePage
 │
 ├─▶ Route: /about
 │    └─▶ AboutPage
 │
 └─▶ Route: /blog
      ├─▶ BlogLayout
      │    ├─▶ BlogSidebar
      │    └─▶ Outlet
      │
      ├─▶ Route: /blog
      │    └─▶ BlogList
      │
      └─▶ Route: /blog/[slug]
           └─▶ BlogPost
```

### Component Patterns

| Pattern | คำอธิบาย | ใช้เมื่อ |
|---------|-----------|---------|
| **Presentational** | UI components ล้วนๆ | Reusable UI elements |
| **Container** | Logic + state | Page-level components |
| **Layout** | Shared UI structure | Navigation, footers |
| **Higher-Order** | Component wrapping | Cross-cutting concerns |

## State Architecture

### State Management Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    Global State                              │
│  (Context, URL State, Server State)                         │
├─────────────────────────────────────────────────────────────┤
│                    Component State                           │
│  (Signals, Stores, Local State)                             │
├─────────────────────────────────────────────────────────────┤
│                    Derived State                             │
│  (Computed values, Memos)                                   │
└─────────────────────────────────────────────────────────────┘
```

### State Types

| Type | Implementation | Scope |
|------|----------------|-------|
| **Local State** | `createSignal()` | Component only |
| **Shared state** | `createStore()` | Multiple components |
| **Global state** | Context | App-wide |
| **Server state** | `routeData()` | Server-side data |

## Performance Architecture

### Optimization Strategies

```
┌─────────────────────────────────────────────────────────────┐
│                    Performance Layers                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Code Splitting ──▶ Lazy Load Routes ──▶ Reduce Bundle Size  │
│       │                                                    │
│       ▼                                                    │
│  Tree Shaking ──▶ Remove Dead Code ──▶ Smaller Assets       │
│       │                                                    │
│       ▼                                                    │
│  Caching ──▶ Edge Caching ──▶ Faster Responses              │
│       │                                                    │
│       ▼                                                    │
│  Streaming ──▶ Progressive Rendering ──▶ Better TTFB         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Input Validation ──▶ Sanitize User Input ──▶ Prevent XSS    │
│       │                                                    │
│       ▼                                                    │
│  Authentication ──▶ Verify Identity ──▶ Protected Routes     │
│       │                                                    │
│       ▼                                                    │
│  Authorization ──▶ Check Permissions ──▶ Access Control      │
│       │                                                    │
│       ▼                                                    │
│  CSRF Protection ──▶ Token Validation ──▶ Prevent CSRF      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Architecture

### Scaling Strategies

| Strategy | คำอธิบาย | Use Case |
|----------|-----------|---------|
| **Horizontal Scaling** | Multiple server instances | High traffic |
| **Edge Deployment** | Deploy to edge networks | Global reach |
| **Static Generation** | Pre-render static content | Content sites |
| **CDN Caching** | Cache assets at edge | Static assets |
