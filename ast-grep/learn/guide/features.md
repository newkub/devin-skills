# Features

Features ทั้งหมดของ ast-grep

## Core Features

### Multi-Language Support
- JavaScript, TypeScript
- Python, Rust, Go, Java
- C, C++, C#
- และอื่นๆ อีก 20+ ภาษา

### Pattern Matching
- AST-based pattern matching
- Metavariables for capture
- Strictness levels control
- Regex integration

### Code Transformation
- Automatic rewriting
- Fix templates
- Complex transforms
- Rewriters for reuse

### Linting
- Custom lint rules
- Severity levels
- File filtering
- Ignore patterns

## Advanced Features

### Relational Rules
- `inside`: match within context
- `has`: match containing pattern
- `precedes`: match ordering
- `follows`: match after pattern

### Composite Rules
- `all`: combine with AND
- `any`: combine with OR
- `not`: negate condition
- `matches`: pattern matching

### Testing
- Unit test for rules
- Snapshot testing
- Valid/invalid cases
- Test runner

### Configuration
- YAML-based rules
- Language-specific settings
- Project-level config
- Rule inheritance

## CLI Features

### Commands
- `run`: ad-hoc pattern search
- `scan`: run rule-based checks
- `test`: test rules
- `new`: scaffold new project

### Options
- `--pattern`: search pattern
- `--lang`: target language
- `--rewrite`: fix pattern
- `--interactive`: selective apply
- `--json`: JSON output

## Integration

### Editor Support
- VS Code extension
- Vim/Neovim plugin
- Emacs integration

### CI/CD
- GitHub Actions
- GitLab CI
- Pre-commit hooks

### Build Tools
- bun scripts
- Make targets
- Custom workflows
