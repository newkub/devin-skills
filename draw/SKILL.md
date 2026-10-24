---
name: draw
description: Create Excalidraw or tldraw diagram files from a shape description
argument-hint: "<excalidraw|tldraw> [description]"
related:
  - draw-ansi
  - draw-svg-image
  - create-mermaid-diagram
---

## Goal

Produce a diagram file in the requested format — `.excalidraw` or `.tldr` — from a plain-language description

## Scope

Applies to one diagram and one output format; for SVG or ANSI output use `/draw-svg-image` or `/draw-ansi`, and for a Mermaid source file use `/create-mermaid-diagram`

| Format | File | Workflow |
|--------|------|----------|
| Excalidraw | `.excalidraw` | `workflows/excalidraw/SKILL.md` |
| tldraw | `.tldr` | `workflows/tldraw/SKILL.md` |

## Execute

### 1. Pick The Format

> Goal: Choose one output format and a destination
1. Read the format from the argument; if unspecified → run `/ask-me`
2. Save next to the source material unless the user names a path

### 2. Run The Workflow

> Goal: Emit a valid diagram file
1. Read `workflows/<format>/SKILL.md` and follow it exactly
2. Invoke it as `/draw <format> <description>`
3. Keep the workflow's own file schema — do not invent fields

### 3. Verify

> Goal: Confirm the file opens
1. Confirm the file parses as the target format
2. Report the output path and the shape count

## Rules

### 1. Format Fidelity
- Emit only the declared format; never hand-write a different schema

### 2. Overwrite
- Ask before overwriting an existing diagram file

### 3. References
- The tldraw schema reference lives in `workflows/tldraw/references/`

## Expected Outcome

- A valid diagram file at the reported path, matching the requested format
