# OXC Stack

## Definition

OXC Stack คือ collection ของ tools สำหรับ JavaScript/TypeScript ที่เขียนด้วย Rust:
- **Oxlint**: Linter
- **Oxlint-parser**: Parser
- **Oxlint-resolver**: Module resolver
- **Oxlint-typecheck**: Type checker
- **Oxlint-transform**: Code transformer

## Components

### Oxlint Parser
- Parses JavaScript/TypeScript
- Fast and accurate
- Supports latest syntax
- Error recovery

### Oxlint Resolver
- Resolves module imports
- Handles node_modules
- Supports workspace monorepos
- Path aliases

### Oxlint Typecheck
- Type-aware linting
- Uses tsgo for TypeScript
- Fast type checking
- Compatible with TypeScript

### Oxlint Transform
- Code transformation
- Auto-fix support
- AST-based
- Preserves formatting

## Benefits

### Performance
- 50-100x faster than ESLint
- Written in Rust
- Parallel processing
- Zero-copy parsing

### Compatibility
- ESLint compatible rules
- TypeScript support
- Modern JavaScript syntax
- JSX support

## Best Practices

1. **Use Full Stack**: ใช้ full OXC stack สำหรับ best performance
2. **Update Regularly**: Update OXC tools เป็นประจำ
3. **Report Issues**: Report bugs และ issues
4. **Contribute**: Contribute ถ้าเป็นไปได้
