---
name: gen-media-image-character
description: Generate consistent character images from description, style, pose, and expression
argument-hint: "[character-description] [output]"
related:
  - draw-svg-image
  - convert
  - create-video-story
---

## Goal

Generate character images that stay consistent across pictures using a prompt anchor, seed, and negative prompt

## Scope

- Accept a character description, style, pose, facial expression, and aspect ratio
- Generate images via `bunx` CLIs, defaulting to Pollinations (no API key)
- Support paid providers such as Replicate/FAL when an API key is available
- Save output as `.png`, `.jpg`, or `.webp`
- Hand off to `/create-video-story` to create per-scene characters

## Execute

### 1. Prepare Character Brief

> Goal: Collect clear character information

1. Receive the `character-description` from the user
2. Ask for `style` such as `anime`, `realistic`, `cartoon`, `3d-render`
3. Ask for `aspect-ratio` such as `portrait (9:16)`, `landscape (16:9)`, `square (1:1)`
4. Ask for the shot type such as `full-body`, `half-body`, `close-up`
5. Specify the `output` path/filename
6. If details are unclear, expand with age, clothing, hair, and color palette

### 2. Build Consistency Prompt

> Goal: Create a prompt anchor that keeps the character on-model

1. Build a character anchor containing the outfit, hairstyle, hair/eye color, and distinctive features
2. Specify pose, gesture, facial expression, and camera angle per the user
3. Add a suitable background
4. Add a negative prompt to reduce deform, extra limbs, and blurry faces if the CLI supports it
5. Ask the user for a seed or use a fixed seed such as `42`

### 3. Choose Provider

> Goal: Pick a usable CLI

1. Default: `bunx @pollinations/cli gen image "<prompt>" --output <file>`
   - No API key required
   - Supports `--model` such as `flux`, `turbo`, `gptimage`
   - Supports `--seed` when available
2. If the user has a Replicate API key: `bunx flux-replicate-mcp --api-key <key> --model ...`
3. If the user has a FAL API key: `bunx @fal-ai/cli`
4. If unsure, try Pollinations first

### 4. Generate Image

> Goal: Run the CLI to get the image

1. Check network and CLI availability in PATH
2. Run the command with prompt, output, seed, and aspect-ratio
3. Wait until the image is downloaded
4. Verify the output file size > 0

### 5. Validate

> Goal: Confirm the file is usable

1. Use `file` or `ffprobe` to check the format
2. For a quality check, ask the user to inspect the output
3. Report the output path, provider, model, and seed
4. On failure, show stderr and recommend another provider

## Rules

### 1. No API Key Leak

- Never hardcode API keys in the skill
- Read from an environment variable or ask the user
- Pass `--api-key` via a variable, not a literal

### 2. Consistency

- Keep the character anchor and seed in context for subsequent images
- Between scenes, change only pose/expression/background, never core traits
- Use a fixed seed whenever possible

### 3. Output

- Default output is `.png`
- Supports `.jpg` and `.webp` via `--format`
- Store output in the project or a temp directory

- Use /gen-media-ai-images if needed
- Use /draw-svg-image if needed
- Use /convert if needed

## Expected Outcome

- Character images that stay consistent
- The report includes output path, prompt anchor, provider, model, and seed
- On failure, a fallback approach is given
