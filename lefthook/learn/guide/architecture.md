# Architecture

Architecture ของ Lefthook

## Overview

Lefthook เป็น Git hooks manager ที่:
- เขียนด้วย Go
- รวดเร็วและทรงพลัง
- รองรับหลายภาษา
- รองรับ parallel execution

## Components

### Core
- **Hook Manager**: จัดการ Git hooks
- **Command Executor**: Execute commands
- **Config Parser**: Parse lefthook.yml
- **File Watcher**: Monitor file changes

### Git Integration
- **Hook Installation**: Install Git hooks
- **Hook Triggering**: Trigger hooks on Git events
- **Hook Removal**: Remove Git hooks

## Execution Model

### Sequential Execution
```
Hook Trigger
    ↓
Command 1
    ↓
Command 2
    ↓
Command 3
    ↓
Result
```

### Parallel Execution
```
Hook Trigger
    ↓
Command 1 ──┐
Command 2 ──┼─→ Result
Command 3 ──┘
```

## Configuration Loading

### Local Config
1. Read `lefthook.yml`
2. Parse configuration
3. Validate configuration

### Remote Config
1. Read remote config URL
2. Fetch remote config
3. Merge with local config

## File Processing

### File Detection
1. Detect changed files
2. Apply file patterns
3. Filter files

### File Staging
1. Stage files
2. Run commands on staged files
3. Unstage if needed

## Error Handling

### Command Failure
- Capture exit code
- Capture output
- Determine failure

### Hook Blocking
- Block Git operation on failure
- Show error message
- Allow retry

## Performance

### Caching
- Cache command results
- Cache file states
- Invalidate cache on changes

### Parallel Execution
- Execute commands in parallel
- Wait for all commands
- Aggregate results

## Security

### Command Execution
- Execute commands in controlled environment
- Limit command permissions
- Validate commands

### Remote Configs
- Validate remote config URLs
- Use HTTPS only
- Cache remote configs

## Extensibility

### Custom Hooks
- Support custom Git hooks
- Support custom commands
- Support custom configurations

### Plugins
- Support plugin system
- Support custom executors
- Support custom parsers
