---
name: list-devin-global-subagents
description: List all global subagents in the devin agents repo with details
argument-hint: "[scope]"
---

## Goal

List all global subagents in `%APPDATA%\devin\agents` with name, description, model, and allowed-tools

## Scope

Use when you want to see the existing global subagents, or to check whether a subagent already exists before creating a new one

## Execute

### 1. Scan Agents Directory

> Goal: find all global subagents

1. Scan `%APPDATA%\devin\agents` for subdirectories containing `AGENT.md`
2. Skip the `.backup/` directory
3. If the directory is not found → report that there are no global subagents

### 2. Extract Metadata

> Goal: extract metadata from each subagent

1. Read each subagent's `AGENT.md`
2. Extract the frontmatter: `name`, `description`, `model`, `allowed-tools`, `permissions`
3. If the frontmatter is incomplete → note it in the report

### 3. Report

> Goal: present the global subagent list

1. Present a table: name, description, model, allowed-tools
2. Sort by name
3. State the total number of global subagents
4. If any subagent has incomplete frontmatter → note it in the footer

## Rules

### 1. Directory Scope

- Scan only `%APPDATA%\devin\agents`
- Skip the `.backup/` directory
- Show only subdirectories containing `AGENT.md`

### 2. Output Format

- Use a table for the listing
- Columns: name, description, model, allowed-tools
- Sort by name

### 3. Completeness

- Check every subdirectory
- Identify global subagents with incomplete frontmatter

- Use /update-devin-global-subagents if needed

## Expected Outcome

- The full global subagent list in a table
- Each entry with name, description, model, allowed-tools
- The total count of global subagents
- Global subagents with incomplete frontmatter identified (if any)
