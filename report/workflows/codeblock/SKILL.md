---
name: report-codeblock
description: Reply in chat as a code block to highlight commands, code snippets, config, logs, or output that must be copy-pasteable
related:
  - report
---

## Goal

Reply in chat as a code block to highlight commands, code snippets, config, logs, or output that must be copy-pasteable

## Scope

Use when the data suits a code block better than a table or numbered list, e.g.:
- commands or scripts
- code snippets
- config files
- error logs
- diff output

## Execute

### 1. Select Code Block Type

> Goal: Pick the fitting language/annotation

1. Shell command → use `bash` or `powershell`
2. Code snippet → use the matching language, e.g. `typescript`, `rust`, `python`
3. Config → use `json`, `toml`, `yaml`, `kdl`
4. Log → use `text`
5. Diff → use `diff`

### 2. Add Context Header

> Goal: Say what this code block is

1. Before the code block, add a heading or a short note on which part it belongs to
2. For multiple blocks, separate them with `###` or a short description

### 3. Format Content

> Goal: Make the code block easy to read and copy

1. Do not put line numbers inside the code block
2. Use ``` to open and close
3. State the language after ```
4. For multiple blocks, separate them with a short label above each
5. Put any extra explanation outside the code block

### 4. Validate

> Goal: Check quality before sending

1. Check syntax correctness for the stated language
2. Check that the code block reads well on every device
3. If there are commands, state a dry run before execute

## Rules

- Use a code block when the work suits copy-paste or syntax highlighting
- If a multi-column report is needed, use `/report` or `/report table`
- If multiple code blocks paired with a table are needed, use `/report table`
- State the language after the ``` marker
- Do not use bold markers inside a code block
- For multiple blocks, separate with `###` or a short label
- Reply in chat only

## Expected Outcome

- Code blocks with the language correctly declared
- Content readable and copyable
- Short and clear, never longer than necessary
