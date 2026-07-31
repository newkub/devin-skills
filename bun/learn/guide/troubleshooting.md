# Troubleshooting

## Common Issues

### Installation Failed

```bash
# Windows (Admin PowerShell)
irm bun.sh/install.ps1 | iex

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

### TypeScript Errors

```json
{
  "compilerOptions": {
    "types": ["bun-types"]
  }
}
```

### Dependencies Not Found

```bash
rm bun.lockb
bun install
```

### Build Failed

```bash
bun build src/index.ts --outdir ./dist
```

### Performance Issues

- ใช้ Bun APIs แทน Node.js APIs
- ใช้ `--watch` สำหรับ development
- ใช้ `bun build` สำหรับ production

### Environment Variables Not Loading

```bash
ls -la .env
bun run dev
```

### Native Modules Not Working

- หา pure JavaScript alternatives
- ใช้ Node.js compatibility layer
- รอ support จาก Bun

## Debugging Tips

```bash
bun --debug run src/index.ts
bun --version
rm -rf ~/.bun/install/cache
bun install
```

## Getting Help

- [Bun Discord](https://bun.sh/discord)
- [Bun GitHub Issues](https://github.com/oven-sh/bun/issues)
- [Bun Documentation](https://bun.sh/docs)
