# Quick Start Guide

## Purpose

เริ่มต้นใช้งาน Windsurf (Devin Desktop IDE) อย่างรวดเร็ว

## First Steps

### 1. Sign Up / Log In

เมื่อเปิด Windsurf ครั้งแรก:
1. Select setup flow (New user หรือ Import settings)
2. Choose editor theme
3. Sign up หรือ Log in ด้วย account
4. Click "Let's Surf!"

### 2. Basic Features

**Autocomplete**
- Type code และ Windsurf จะ suggest completions
- Press `Tab` เพื่อ accept suggestion
- Press `Esc` เพื่อ dismiss

**Chat**
- Open Chat panel (Cmd/Ctrl + L)
- Ask questions about code
- Use @-mentions to add context

**Command**
- Press `Cmd/Ctrl + Shift + P`
- Type natural language commands
- Cascade will execute the task

**Cascade**
- Open Cascade panel (Cmd/Ctrl + I)
- Give complex multi-step tasks
- Cascade uses tools to complete work

### 3. Adding Context

**@-Mentions**
- `@file` - Add specific file
- `@folder` - Add entire folder
- `@terminal` - Add terminal output
- `@web` - Search web for context

**Fast Context**
- Click Fast Context button
- Select files to include
- Cascade automatically indexes relevant code

## Common Use Cases

### Generate Code

```
Create a React component for a user profile with name, email, and avatar
```

### Refactor Code

```
Refactor this function to use async/await instead of callbacks
```

### Write Tests

```
Write unit tests for the calculateTotal function
```

### Debug Issues

```
Why is this API call failing? Check the error handling
```

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Open Chat | `Ctrl + L` | `Cmd + L` |
| Open Cascade | `Ctrl + I` | `Cmd + I` |
| Command Palette | `Ctrl + Shift + P` | `Cmd + Shift + P` |
| Accept Autocomplete | `Tab` | `Tab` |
| Dismiss Autocomplete | `Esc` | `Esc` |

## Next Steps

- Read [installation.md](installation.md) for setup details
- Read [configuration.md](configuration.md) for customization
- Learn about [Cascade](../key-concepts/cascade.md)
- Explore [Skills](../key-concepts/skills.md)

## Summary

| Feature | Shortcut | Description |
|---------|----------|-------------|
| **Chat** | `Ctrl/Cmd + L` | Ask questions |
| **Cascade** | `Ctrl/Cmd + I` | Multi-step tasks |
| **Command** | `Ctrl/Cmd + Shift + P` | Quick commands |
| **Autocomplete** | `Tab` | Accept suggestions |
