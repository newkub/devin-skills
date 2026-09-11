# Lib Openai Routes / Topics

| Route / Topic | URL |
|---|---|
| API reference | https://platform.openai.com/docs/api-reference |
| Responses API guide | https://platform.openai.com/docs/api-reference/responses |
| Structured outputs | https://platform.openai.com/docs/guides/structured-outputs |
| Streaming | https://github.com/openai/openai-node#streaming-responses |
| Function calling | https://platform.openai.com/docs/guides/function-calling |
| SDK README | https://github.com/openai/openai-node |
| Compatible endpoints | baseURL สำหรับ OpenRouter/Ollama/Azure |

## Key Concepts

- SDK v7: `responses` API เป็น canonical surface (แทน `chat.completions` สำหรับงานใหม่)
- Structured outputs: `responses.parse` + `zodResponseFormat` → typed result
- Streaming: `for await (const event of stream)` หรือ `.on('text.delta', ...)`
- ใช้กับ compatible providers: `new OpenAI({baseURL, apiKey})`
