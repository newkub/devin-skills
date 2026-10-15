---
name: gen-media-3d-model
description: Generate a 3D model from a prompt or image with an AI CLI
argument-hint: "[prompt]"
related:
  - gen-media
  - gen-changelog-md
---

## Goal

Generate a 3D model from a text prompt or image with an AI generation CLI

## Scope

- Use CLIs such as Tripo or Meshy for text/image-to-3D
- Support output `.glb`, `.fbx`, `.obj`
- Support post-processing: texture, rig, animation

## Execute

### 1. Prepare Input

> Goal: Identify what to generate

1. Receive the prompt or image path from the user
2. Specify the output format (default `.glb`)
3. Specify quality or style (low-poly, high-poly, textured, rigged)
4. If the user has no API key → suggest Pollinations where applicable

### 2. Choose CLI

> Goal: Pick a ready-to-use tool

1. Primary: `bunx @tripo3d/cli generate text "<prompt>" --wait -o model.glb`
   - Supports text-to-3D
   - Requires `TRIPO_API_KEY` or `tripo auth login`
2. Fallback: `bunx meshy-cli make "<prompt>" -o model.glb`
   - OAuth login via browser
3. Fallback (image): `bunx @tripo3d/cli generate image <path> --wait -o model.glb`
4. Fallback (local): use `tripo-cli` from source or `re-ovo/tripo-cli` on GitHub

### 3. Generate Model

> Goal: Run the 3D generation

1. Check the CLI and authentication
2. Run the command with prompt/output
3. Wait for the task to finish (the CLI `--wait` flag polls for you)
4. Verify the output file

### 4. Post-Process (Optional)

> Goal: Refine the model

1. For texture → `tripo process texture <id> --wait`
2. For rig/animation → `tripo process rig <id> --wait`
3. To convert format → `tripo export <id> --format fbx`

### 5. Report

> Goal: Summarize the result

1. Show the output path
2. Show provider, model, and format
3. State the cost or credits used when known

## Rules

### 1. API Key

- Tripo/Meshy require an API key or login
- Never hardcode keys
- If the user has none → use Pollinations or a free service first when possible

### 2. Cost

- 3D generation is expensive
- Tell the user before running

### 3. Output

- Default is `.glb`
- Supports `.fbx`, `.obj` per the CLI
- Store output in the project directory

- Use /gen-media-ai-images if needed
- Use /gen-media-ai-videos if needed
- Use /gen-changelog-md if needed

## Expected Outcome

- A 3D model file is generated from the prompt/image
- The report includes provider, output path, and format
- On failure, a fallback approach is given
