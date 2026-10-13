---
name: use-bun-shell
description: Use the Bun shell to execute commands with bun -e
argument-hint: "[command]"
related:
  - use-bun-native-api

---

## Goal

Use the Bun shell runtime to execute commands and shell operations via `bun -e` instead of using the shell directly

## Scope

Use `use-bun-shell` only for the tasks and workflows it covers (bun shell)

## Execute

### 1. Prepare Bun Shell Environment

> Goal: Prepare Bun Shell Environment

1. Run `/use-bun-native-api` to set up the Bun environment (install, verify) and Bun APIs if needed
2. Verify that Bun is installed and ready to use
3. Set the environment variables Bun needs

### 2. Execute Commands With Bun

> Goal: Execute Commands With Bun

1. Use `bun -e "console.log('command')"` for simple commands (latest runtime `1.4.2 (verified 2026-09-12)`)
2. Use `bun -e "import { $ } from 'bun'; await $\`command\`"` for complex shell commands (`$` must be imported from `bun` — it is not a global)
3. Use `bun run` to execute scripts from package.json
4. Use `bun -e` to execute JavaScript/TypeScript code (supports top-level await)

### 3. Handle File Operations

> Goal: Handle File Operations

1. Use `Bun.file()` for file reading/writing
2. Use `Bun.write()` for file operations
3. Use `await $\`ls -la\`` for directory operations (after `import { $ } from 'bun'`)
4. Use `new Bun.Glob('**/*.ts')` for file pattern matching (`Bun.Glob` is a class, not `Bun.glob()`)

### 4. Process Management

> Goal: Process Management

1. Use `Bun.spawn()` for background processes
2. Use `Bun.$` for shell command execution
3. Handle stdout/stderr with Bun APIs
4. Check process exit codes and errors

## Rules

### 1. Bun Command Execution

Use `bun -e` for:

- Simple JavaScript/TypeScript execution
- Quick shell commands that need TypeScript support
- File operations that need async/await
- JSON processing and data transformation

Example:
```bash
bun -e "console.log(JSON.stringify({test: true}, null, 2))"
bun -e "await Bun.write('output.txt', 'Hello World')"
```

### 2. Shell Integration

Use `Bun.$` for:

- Complex shell commands
- Pipeline operations
- Environment variable handling
- Process chaining

Example:
```bash
bun -e "import { $ } from 'bun'; const result = await $\`ls -la\`; console.log(result.stdout.toString())"
```

### 3. File Operations

Use Bun file APIs for:

- Reading files: `await Bun.file(path).text()`
- Writing files: `await Bun.write(path, content)`
- File existence: `await Bun.file(path).exists()`
- Directory operations: `await $`mkdir -p path``

### 4. Error Handling

Handle errors with:

- Try-catch blocks for async operations
- Process exit code checking
- Stderr capture and logging
- Graceful error recovery

### 5. Avoid File Creation

Run commands without creating temporary files whenever possible:

- Use `bun -e` or `Bun.$` for one-off commands
- Do not create `.ts` or `.js` files just to run a temporary command
- If a command has side effects, dry-run it with `print` or test the values first
- If you must write a file, verify the path with `Bun.file(path).exists()` first

### 6. Performance Optimization

Use Bun features:

- Native TypeScript support
- Fast startup time
- Built-in utilities (crypto, hash, etc.)
- Concurrent execution capabilities

## Expected Outcome

- Shell operations run through the Bun runtime
- Faster execution for JavaScript/TypeScript tasks
- Better TypeScript integration for shell scripts
- Consistent development environment across platforms