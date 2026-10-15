---
name: gen-media-ai-images
description: Generate images with AI via bunx CLI
argument-hint: "[prompt]"
related:
  - convert
  - draw-svg-image
  - report-prompt-from-image
---

## Goal

Generate an image from a prompt with an AI CLI without writing code

## Scope

- Use `bunx` CLIs for text-to-image generation
- Supports both Pollinations (no API key) and Replicate/FAL (API key required)
- Save output as `.png`, `.jpg`, or `.webp`

## Execute

### 1. Prepare Prompt

> Goal: Have a clear prompt

1. Receive the prompt from the user
2. If the prompt is short/ambiguous → expand it with details such as style, lighting, aspect ratio
3. Specify the output path/filename
4. Specify the aspect ratio or size when needed

### 2. Choose Provider

> Goal: Pick a usable CLI

1. Default: `bunx @pollinations/cli gen image "<prompt>" --output <file>`
   - No API key required
   - Supports `--model` such as `flux`, `gptimage`, `turbo`
2. If the user has a Replicate API key → `bunx flux-replicate-mcp --api-key <key> --model ... --format <fmt>`
3. If the user has a FAL API key → `bunx ai-vid` or the FAL CLI
4. If unsure → try Pollinations first

### 3. Generate Image

> Goal: Run the CLI to get the image

1. Check network and CLI availability in PATH
2. Run the command with the specified prompt and output
3. Wait until the image is downloaded
4. Verify the output file size > 0

### 4. Report

> Goal: Summarize the result

1. Show the output path
2. Show the provider and model used
3. If it fails → show stderr and recommend another provider

## Rules

### 1. No API Key Leak

- Never hardcode API keys in the skill
- Read from an environment variable or ask the user
- Pass `--api-key` via a variable, not a literal

### 2. Default Free Provider

- Always try Pollinations first when the user does not specify a provider
- State the cost when using a paid provider

### 3. Output Format

- Default output is `.png`
- Supports `.jpg`, `.webp` via `--format`
- Store output in the project or a temp directory

- Use /convert if needed
- Use /draw-svg-image if needed
- Use /report-prompt-from-image if needed

## Expected Outcome

- An image file is generated from the prompt
- The report includes provider, model, and output path
- On failure, a fallback approach is given
