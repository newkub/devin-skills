# Lib Openai API & Dependencies

## Install

```sh
bun add openai
bun add zod          # สำหรับ structured outputs + zodResponseFormat
```

## Version

- Latest: `7.15.0` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/openai)
- [Repository](https://github.com/openai/openai-node)

## Dependencies

- Runtime deps น้อย — ใช้ `fetch` ของ runtime (Bun/Node 18+ built-in)
- Helpers: `zod` (`openai/helpers/zod` → `zodResponseFormat`)

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `new OpenAI()` | Client (อ่าน `OPENAI_API_KEY` env) | - | `apiKey`, `baseURL`, `organization`, `project` |
| `client.responses.create(...)` | Responses API (แนะนำใน SDK v7) | - | `model`, `input`, `tools`, `text` |
| `client.responses.parse(...)` | Structured output | - | `text: {format: zodResponseFormat(schema)}` |
| `client.chat.completions.create` | Chat Completions API | - | `model`, `messages`, `stream` |
| `client.embeddings.create` | Embeddings | - | `model: 'text-embedding-3-*'`, `input` |
| `client.images.generate` | Images | - | `model`, `prompt`, `size` |
| `client.audio.speech` / `transcriptions` | Audio | - | - |

## Source

- Official docs: https://platform.openai.com/docs
- Description: Official OpenAI API client — Responses API, streaming, structured outputs.
