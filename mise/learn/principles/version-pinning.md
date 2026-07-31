# Version Pinning

ควร pin exact versions สำหรับ production projects

## หลักการ

- ใช้ exact versions สำหรับ production
- ใช้ version ranges สำหรับ development
- Document version choices

## ตัวอย่าง

```toml
# Production - pin exact
[tools]
node = "20.11.0"
python = "3.12.0"

# Development - use ranges
[tools]
node = "lts"
python = "3.12"
```
