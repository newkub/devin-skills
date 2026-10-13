---
name: convert-files-format
description: Convert files between formats with bunx CLIs, covering images and documents.
argument-hint: "[input] [output-format]"
related:
  - convert
  - ask-me
  - run-lint
  - run-format
  - run-drizzle-studio
---

## Goal

Convert a file from one format to another with the `bunx` CLI that matches the output format the user specifies.

## Scope

- Supports image formats: `.webp`, `.svg` (vector)
- Use the `bunx` CLI appropriate to the format
- Hand off to a dedicated skill when the format has one of its own
- Supports both a single file and a directory

## Execute

### 1. Identify Input

> Goal: Confirm the input and output format

1. Take the input path from the user
2. Determine the output format from the argument or the desired extension
3. Check that the input file exists and is in a supported format
4. If no output format is given → `/ask-me`

### 2. Route By Format

> Goal: Pick the conversion method based on the format

1. If output is `.webp` → use [references/webp.md](references/webp.md)
2. If output is `.svg` → run `/convert-svg`
3. If output is another format → find a CLI or library that supports it
4. If no tool exists → `/ask-me` or write a Bun script

### 3. Run Conversion

> Goal: Run the format-conversion command

1. Run the command per the guide for the chosen format
2. Check the output path
3. If the input is a directory → do a batch/recursive run

### 4. Validate

> Goal: Confirm the output is correct

1. Check that the output file size is > 0
2. Verify the type with the `file` command or by opening it
3. Report the input/output paths and the tool used

## Rules

### 1. Format Selection

- If output is `.webp`, use the guide in `references/webp.md`
- If output is `.svg`, use `/convert-svg`
- Never delete the source file by default

### 2. Fallback

- If the `bunx` CLI is unavailable → use `sharp` for images or write a Bun script
- On failure → try the next tool in the format's chain

### 3. Quality

- For WebP: default quality = 85
- For SVG: best suited to line art and logos
- Tell the user if the format doesn't suit the input
- Use /run-lint if needed
- Use /run-format if needed
- Use /run-drizzle-studio if needed

## Expected Outcome

- The output file is created in the requested format
- Report the tool, paths, and options
- No source file is deleted
