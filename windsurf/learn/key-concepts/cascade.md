# Cascade

## Purpose

Cascade คือ AI agent system หลักของ Windsurf ที่ทำงานแบบ agentic สำหรับ multi-step tasks

## Overview

Cascade คือ core AI engine ของ Windsurf ที่:
- Operates in multiple modes (Code, Plan, Ask)
- Uses tools to interact with codebase
- Plans and executes complex tasks
- Maintains context across operations

## Cascade Modes

### Code Mode

Default mode for code generation and editing:
- Writes and edits code
- Runs commands
- Uses tools to complete tasks

### Plan Mode

For complex multi-step tasks:
- Creates detailed plan first
- Breaks down into steps
- Allows review before execution
- Can continue from existing plan

### Ask Mode

For questions and explanations:
- Answers questions about code
- Explains concepts
- Provides analysis
- No code changes

## Key Features

### Tool Calling

Cascade ใช้ tools เพื่อโต้ตอบกับ codebase:
- Read files
- Write files
- Run commands
- Search code
- Use MCP servers

### Plans and Todo Lists

Cascade สามารถ:
- Create todo lists for tasks
- Track progress
- Update status as work completes
- Provide visibility into process

### Queued Messages

Handle multiple requests:
- Queue multiple tasks
- Process in order
- Maintain context between tasks

### Voice Input

Use voice to interact:
- Speak commands
- Dictate responses
- Hands-free operation

### Named Checkpoints and Reverts

- Save checkpoints during work
- Revert to previous states
- Compare changes
- Safe experimentation

### Real-time Awareness

Cascade เข้าใจ:
- Current file state
- Open tabs
- Terminal output
- Git status

## Cascade Hooks

Extend Cascade behavior with hooks:

**Hook Events**
- `pre_read_code` - Before reading files
- `post_read_code` - After reading files
- `pre_write_code` - Before writing files
- `post_write_code` - After writing files
- `pre_run_command` - Before running commands
- `post_run_command` - After running commands
- `pre_mcp_tool_use` - Before MCP tool use
- `post_mcp_tool_use` - After MCP tool use

**Configuration**
```json
{
  "cascadeHooks": {
    "pre_write_code": "./hooks/pre-write.js"
  }
}
```

## Best Practices

1. **Be Specific** - Provide clear, detailed instructions
2. **Use Context** - @-mention relevant files and folders
3. **Plan First** - Use Plan mode for complex tasks
4. **Review Plans** - Check plans before execution
5. **Use Checkpoints** - Save progress for complex tasks

## Example Usage

```
// Code Mode
Refactor the authentication module to use JWT tokens

// Plan Mode
Plan the migration from REST to GraphQL for the API layer

// Ask Mode
Explain how the caching strategy works in this service
```

## Summary

| Feature | Description |
|---------|-------------|
| **Code Mode** | Write and edit code |
| **Plan Mode** | Plan before execute |
| **Ask Mode** | Questions and analysis |
| **Tool Calling** | Interact with codebase |
| **Hooks** | Extend behavior |
| **Checkpoints** | Save and revert states |
