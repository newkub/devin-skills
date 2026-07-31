# How It Works

## หลักการทำงานของ Flutter

## Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  1. Build Phase                                              │
│  └─ Widget.build() → Widget Tree                            │
├─────────────────────────────────────────────────────────────┤
│  2. Layout Phase                                             │
│  └─ Pass constraints down → Size up → Pass position up      │
├─────────────────────────────────────────────────────────────┤
│  3. Paint Phase                                              │
│  └─ RenderObject → Skia → GPU                                │
└─────────────────────────────────────────────────────────────┘
```

## Widget Lifecycle

```
StatelessWidget Lifecycle:
  createElement() → build() → dispose()

StatefulWidget Lifecycle:
  createElement() → createState() → initState()
  → didChangeDependencies() → build() → didUpdateWidget()
  → setState() → build() → deactivate() → dispose()
```

## Build Process

```
Source Code (Dart)
     ↓
   dart2js / dart2aot
     ↓
  Native Code
     ↓
Flutter Engine
     ↓
  Platform (iOS/Android/Web/Desktop)
```

## Hot Reload

```
┌─────────────────────────────────────────────────────────────┐
│  1. Detect code changes                                      │
│  2. Inject updated source into Dart VM                       │
│  3. Trigger widget rebuild                                   │
│  4. Preserve app state                                      │
└─────────────────────────────────────────────────────────────┘
```

## Platform Channels

```
Dart Code
   ↓
Platform Channel (MethodChannel, EventChannel, MessageChannel)
   ↓
Platform-specific Code (Kotlin/Swift/JS)
```
