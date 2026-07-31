---
title: Network Issues
description: การแก้ปัญหา network issues ที่พบบ่อย
---

## Error: "CORS error"

**Cause**: Browser security blocking requests

**Solution**:
```json
// tauri.conf.json
{
  "tauri": {
    "allowlist": {
      "http": {
        "all": true,
        "request": true,
        "scope": ["https://api.example.com/*"]
      }
    }
  }
}
```

## Error: "SSL certificate error"

**Cause**: Self-signed certificates หรือ certificate issues

**Solution**:
```rust
// ใช้ reqwest ด้วย dangerous_accept_invalid_certs (dev only)
let client = reqwest::Client::builder()
    .danger_accept_invalid_certs(true)
    .build()?;
```
