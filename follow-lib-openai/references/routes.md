# Lib Openai Routes / Topics

| Route / Topic | URL |
|---|---|
| API reference | https://developers.openai.com/api/reference/overview |
| Responses API guide | https://developers.openai.com/api/reference/resources/responses |
| Structured outputs | https://developers.openai.com/api/docs/guides/structured-outputs |
| Streaming | https://github.com/openai/openai-node#streaming-responses |
| Function calling | https://developers.openai.com/api/docs/guides/function-calling |
| SDK README | https://github.com/openai/openai-node |
| Compatible endpoints | baseURL สำหรับ OpenRouter/Ollama/Azure |

## Key Concepts

- SDK v7: `responses` API เป็น canonical surface (แทน `chat.completions` สำหรับงานใหม่)
- Structured outputs: `responses.parse` + `zodResponseFormat` → typed result
- Streaming: `for await (const event of stream)` หรือ `.on('text.delta', ...)`
- ใช้กับ compatible providers: `new OpenAI({baseURL, apiKey})`
