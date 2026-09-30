| key | value |
|---|---|
| version | 7.15.0 |
| package registry | https://www.npmjs.com/package/openai |
| repository | https://github.com/openai/openai-node |
| docs | https://platform.openai.com/docs |

| api | description | default | options |
|---|---|---|---|
| `new OpenAI()` | Client (อ่าน `OPENAI_API_KEY` env) | - | `apiKey`, `baseURL`, `organization`, `project` |
| `client.responses.create(...)` | Responses API (แนะนำใน SDK v7) | - | `model`, `input`, `tools`, `text` |
| `client.responses.parse(...)` | Structured output | - | `text: {format: zodResponseFormat(schema)}` |
| `client.chat.completions.create` | Chat Completions API | - | `model`, `messages`, `stream` |
| `client.embeddings.create` | Embeddings | - | `model: 'text-embedding-3-*'`, `input` |
| `client.images.generate` | Images | - | `model`, `prompt`, `size` |
| `client.audio.speech` / `transcriptions` | Audio | - | - |
