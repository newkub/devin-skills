---
name: gen-media
description: Generate media with AI — images, videos, character consistency, 3D models via gen-media-* skills
argument-hint: "[domain]"
related:
  - report-prompt-from-image
  - draw-svg-image
  - convert
  - ask-me
  - report

---

## Goal

Dispatch to the skill matching the media domain — the parent only routes

## Scope

- The argument is the domain; if unspecified → `/ask-me` to pick a domain

## Execute

### Gen Media Skills

| Domain | Skill |
|---|---|
| `ai-images` | `/gen-media-ai-images` — generate images with AI via bunx CLI |
| `ai-videos` | `/gen-media-ai-videos` — generate videos with AI via bunx CLI |
| `image-character` | `/gen-media-image-character` — generate consistent characters |
| `3d-model` | `/gen-media-3d-model` — generate a 3D model from a prompt with an AI CLI |

1. Identify the domain from the argument (e.g. `/gen-media ai-images`)
2. If the domain is supported → call the skill in the table and follow its flow
3. If no domain is given or it is unknown → `/ask-me` to pick a domain

## Rules

- The parent only dispatches — never duplicate a target skill's workflow
- Every generated prompt must confirm the output path before generating

- Use /report-prompt-from-image if needed
- Use /draw-svg-image if needed
- Use /convert if needed
- Use /report if needed

## Expected Outcome

- The caller is dispatched to the skill matching the domain and generates the media per that flow
