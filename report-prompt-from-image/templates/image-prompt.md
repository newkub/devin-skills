# Image Generation Prompt

Source: [image path or URL] — analyzed with [bunx @pollinations/cli | ollama llava | vision API]
Style target: [Midjourney | Stable Diffusion | DALL-E | Pollinations | generic]
Date: [YYYY-MM-DD]

## Prompt (ready to copy)

```text
[subject], [style], [lighting], [composition], [color palette], [mood][, --ar 16:9 --v 6]
```

Tool used: [the exact command or API that produced the prompt]

## Fill Rules

- The prompt body describes what is in the image only — no "Sure, here is..." preamble, no small talk.
- Midjourney/SD style fills all six facets (subject, style, lighting, composition, color palette, mood); DALL-E keeps it concise in English.
- Condense to about 100 words when the raw output runs long.
- Append style parameters (`--ar`, `--v`, etc.) only when the user asked for that target style.
- Default to English; state another language explicitly if the user requested it.
- If the tool failed, name the fallback attempted before the prompt block.
