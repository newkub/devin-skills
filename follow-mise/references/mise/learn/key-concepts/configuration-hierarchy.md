# Configuration Hierarchy

mise ใช้ configuration hierarchy สำหรับ determine tool versions

## ลำดับความสำคัญ

1. `.mise.toml` (project level) - สูงสุด
2. `~/.config/mise/config.toml` (global level)
3. Environment variables
4. Default versions

## ตัวอย่าง

```toml
# .mise.toml (project)
[tools]
node = "20.11.0"
```

```toml
# ~/.config/mise/config.toml (global)
[tools]
node = "lts"
```

ในกรณีนี้ project จะใช้ Node 20.11.0 เพราะ project config มี priority สูงกว่า
