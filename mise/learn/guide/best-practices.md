# แนวทางปฏิบัติที่ดี

## Project Configuration

### ใช้ .mise.toml

```toml
[tools]
node = "20.11.0"
python = "3.12.0"
bun = "1.1.0"
```

### ใช้ Version Ranges

```toml
[tools]
node = "lts"          # ใช้ LTS version
python = "3.12"        # ใช้ latest 3.12.x
bun = "latest"         # ใช้ latest version
```

### Pin Specific Versions

```toml
[tools]
node = "20.11.0"       # Pin exact version
```

## Team Consistency

### Commit .mise.toml

- Commit `.mise.toml` ใน repository
- ทุกคนใน team จะได้ versions เดียวกัน
- ลดปัญหา environment differences

### Use mise in CI

```yaml
- uses: jdx/mise-action@v2
```

## Performance

### Cache Downloads

mise auto-cache downloads ใน `~/.local/share/mise/cache`

### Parallel Installation

```bash
mise install  # ติดตั้งทุก tools แบบ parallel
```

### Lazy Loading

mise lazy-load tools เมื่อต้องการใช้เท่านั้น

## Troubleshooting

### Check Current Versions

```bash
mise current
```

### Debug Mode

```bash
MISE_DEBUG=1 mise install
```

### Clear Cache

```bash
rm -rf ~/.local/share/mise/cache
```
