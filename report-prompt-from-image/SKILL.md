---
name: report-prompt-from-image
description: Build an image generation prompt from a picture with AI vision via bunx CLI
argument-hint: "[image-path] [style]"
related:
  - report
---

## Goal

Build a prompt for AI image generation from an image the user provides

## Scope

- Supports local image files and URLs
- Supports output for Midjourney, Stable Diffusion, DALL-E, Pollinations
- Use a bunx CLI or a vision API without writing code

## Execute

### 1. Prepare Image

> Goal: Validate the input

1. Take the image path or URL
2. If a local file → verify it exists
3. If a URL → verify it is reachable
4. If the file is too large → resize first or tell the user

### 2. Choose Vision Tool

> Goal: Pick the tool to analyze the image

1. Primary: `bunx @pollinations/cli gen text "<question>" --image <path>`
   - No API key needed
   - Use a specific question to request the prompt
2. Fallback: `bunx ollama run llava "<question>" --image <path>` if Ollama is running
3. Fallback: use an OpenAI/Anthropic vision API via `bunx openai` or `curl` if a key is available

### 3. Generate Prompt

> Goal: Get the prompt from the image

1. Craft a specific question per style:
   - For Midjourney/SD: `Generate a detailed Midjourney-style prompt that describes this image, including subject, style, lighting, composition, color palette, and mood.`
   - For DALL-E: `Generate a concise DALL-E prompt that describes this image in English.`
   - If the user does not specify a style → use the generic question: `Generate a detailed image generation prompt that describes this image.`
2. Run the command with the image path
3. Wait for the result
4. Save the prompt to a file if the user wants

### 4. Refine And Report

> Goal: Polish the prompt to be ready to use

1. Cut the unnecessary parts, e.g. "Sure, here is..."
2. If the prompt is too long → condense it to about 100 words
3. If the user wants a specific style → add parameters such as `--ar 16:9` or `--v 6`
4. Present with `/report`

## Rules

### 1. No API Key Leak

- Never hardcode an API key
- Use an environment variable or ask the user

### 2. Image Size

- Support `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`
- Resize first if the image is too large

### 3. Prompt Output

- Default to English for compatibility with image generators
- If the user asks for another language, state it

### 4. Output Only Prompt

- No small talk in the output
- If extra explanation is needed, keep it brief

- Use /gen-media-ai-images if needed
- Use /gen-media-image-character if needed

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files; the generated prompt stays in chat

## Expected Outcome

- An image generation prompt ready to copy and use
- The tool used is stated
- If it fails, a fallback approach exists
