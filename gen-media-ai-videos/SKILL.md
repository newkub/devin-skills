---
name: gen-media-ai-videos
description: Generate videos with AI via bunx CLI
argument-hint: "[prompt]"
related:
  - gen-media
  - gen-subtitle-video
---

## Goal

Generate a short video from a prompt with an AI CLI

## Scope

- Use `bunx` CLIs for text-to-video or image-to-video
- Supports both free providers (Pollinations) and paid providers (FAL, Google Veo, Runway)
- Save output as `.mp4` or `.webm`

## Execute

### 1. Prepare Prompt

> Goal: Have a clear prompt and config

1. Receive the prompt from the user
2. Specify duration (default 5 seconds) and aspect ratio (16:9, 9:16, 1:1)
3. If there is a first-frame image → record its path
4. Specify the output path

### 2. Choose Provider

> Goal: Pick a usable CLI

1. Default: `bunx @pollinations/cli gen video "<prompt>" --duration 5 --output <file>`
   - No API key required
   - Supports duration and prompt
2. If the user has an API key:
   - `bunx ai-vid generate -p "<prompt>" -P <provider> -m <model> -o <file>`
   - `bunx @fal-ai/cli` if available
3. For high quality → ask the user for an API key first

### 3. Generate Video

> Goal: Run the CLI to get the video

1. Check network and CLI availability
2. Run the command with prompt, duration, and output
3. Wait until the file is downloaded
4. Verify the file size > 0

### 4. Report

> Goal: Summarize the result

1. Show the output path
2. Show provider, model, and duration
3. If it fails → show stderr and suggest trying another provider or reducing duration

## Rules

### 1. Cost Awareness

- Tell the user that video generation usually costs more than image generation
- A paid provider requires an API key

### 2. Reasonable Defaults

- Default duration = 5 seconds
- Default aspect ratio = 16:9
- Never generate an overly long video without asking the user

### 3. No Leaks

- Never hardcode API keys
- Use an environment variable or ask first

- Use /gen-media-ai-images if needed
- Use /gen-subtitle-video if needed

## Expected Outcome

- A video file is generated from the prompt
- The report includes provider, duration, and output path
- On failure, a fallback approach is given
