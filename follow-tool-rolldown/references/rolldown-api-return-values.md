# Programmatic API - Return Values

## Return Values

### BuildResult

```typescript
interface BuildResult {
  output: OutputChunk[]
  error?: Error
}
```

### OutputChunk

```typescript
interface OutputChunk {
  type: 'chunk'
  fileName: string
  code: string
  map?: SourceMap
  modules: Record<string, ModuleJSON>
}
```

### OutputAsset

```typescript
interface OutputAsset {
  type: 'asset'
  fileName: string
  source: string | Buffer
}
```

## Summary

| Function | Usage |
|----------|-------|
| `build(options)` | Bundle project |
| `watch(options)` | Watch mode |
| `defineConfig(options)` | Create config |
