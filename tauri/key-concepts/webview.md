# WebView

## ภาพรวม

WebView คือ component ที่ใช้แสดง web content ภายใน native window โดยใช้ web browser engine ของแต่ละ platform

## วิธีการทำงาน

### Platform-Specific WebViews

Tauri ใช้ WebView ที่แตกต่างกันในแต่ละ platform:

- **Windows**: WebView2 (Edge/Chromium-based)
- **macOS**: WKWebView (WebKit-based)
- **Linux**: WebKitGTK (WebKit-based)

### WebView Lifecycle

```
┌─────────────┐
│  Initialize │
└──────┬──────┘
       │
       v
┌─────────────┐
│   Load URL  │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Render     │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Interact   │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Destroy    │
└─────────────┘
```

## Configuration

### Window Configuration

```json
// tauri.conf.json
{
  "tauri": {
    "windows": [
      {
        "label": "main",
        "url": "index.html",
        "width": 800,
        "height": 600,
        "resizable": true,
        "fullscreen": false,
        "decorations": true,
        "transparent": false,
        "alwaysOnTop": false,
        "skipTaskbar": false
      }
    ]
  }
}
```

### WebView Options

```rust
use tauri::{WindowBuilder, WebviewUrlBuilder};

WindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
    .webview_builder(|webview| {
        webview
            .enable_clipboard_access(true)
            .enable_drag_drop(true)
    })
    .build()?;
```

## Features

### 1. JavaScript Injection

```rust
use tauri::Manager;

window.eval("console.log('Hello from Rust!')")?;
```

### 2. Custom Protocols

```rust
use tauri::Manager;

window.register_uri_scheme_protocol("custom", |request, responder| {
    let path = request.uri().path();
    let content = fs::read_to_string(path).unwrap();
    responder.respond(
        tauri::http::Response::builder()
            .header("content-type", "text/html")
            .body(content.as_bytes().to_vec())
            .unwrap()
    );
})?;
```

### 3. DevTools

```rust
WindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
    .devtools(true) // Enable DevTools
    .build()?;
```

## Best Practices

### 1. Performance

- ใช้ hardware acceleration เมื่อ available
- จำกัด number of WebViews
- ใช้ lazy loading สำหรับ heavy content

### 2. Security

- Enable Content Security Policy (CSP)
- Validate all injected JavaScript
- Restrict custom protocols

### 3. Compatibility

- Test บนทุก target platforms
- Handle platform-specific behaviors
- Provide fallbacks สำหรับ unsupported features

## Common Issues

### 1. WebView Not Loading

**Cause**: URL ไม่ถูกต้องหรือ build path ผิด

**Solution**:
```json
{
  "build": {
    "frontendDist": "../dist"
  }
}
```

### 2. JavaScript Not Executing

**Cause**: CSP blocking หรือ syntax errors

**Solution**:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

### 3. Platform Differences

**Cause**: WebView engines มีความแตกต่าง

**Solution**: Test และ handle platform-specific cases
