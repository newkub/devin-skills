# Best Practices: openai SDK

Guidelines for using the `openai` SDK server-side correctly, securely, and cost-effectively

## Recommended Patterns

- Create the client once and reuse it — `new OpenAI()` reads `OPENAI_API_KEY` from env automatically; never create a new one per request
- Use the Responses API (`client.responses.create`/`parse`) as the default for new work — it handles tools, structured output, and stateful conversations better than Chat Completions
- For structured output, use `zodResponseFormat` from `openai/helpers/zod` with `.parse()` — a typed result with validation in one call
- For streaming, use `stream: true` then iterate with `for await` — accumulate `tool_calls` deltas continuously before parsing arguments
- Retry with exponential backoff for `429`/`5xx` — the SDK has built-in retry, but set `maxRetries` and `timeout` explicitly
- Set a per-request `timeout` and use `AbortSignal` when the user cancels — prevents hung requests eating resources
- Log `usage` (prompt/completion tokens) on every call for cost tracking and prompt-bloat detection

## Do / Don't

| Do | Don't |
|---|---|
| Call the API server-side only (proxy through the backend) | put `apiKey` in client-side code or bundles |
| Use zod schemas with `.parse()` for structured output | parse JSON from free-form text with raw `JSON.parse` |
| Set `maxRetries` + backoff for rate limits | retry immediately in a tight loop on 429 |
| Set `timeout` and `AbortSignal` | leave requests without a timeout |
| Keep conversation history bounded (truncate/summarize) | send the entire history every request until tokens spike |
| Use prompt caching (`prompt_cache_key` / cache-friendly prompt ordering) | reshuffle system/context order every time until the cache misses |

## Common Pitfalls

- Structured output is not a 100% guarantee — `.parse()` throws when the model output does not match the schema; keep a fallback or retry logic
- `stream: true` delays errors — HTTP 200 first, then an error mid-stream; always wrap the iterator in try/catch
- Token counting differs from what you think — count with `tiktoken` or read the real `usage` from the response; never hardcode estimates
- `baseURL` for compatible providers (Azure, OpenRouter, Ollama) — the API surface is not 100% identical (e.g. structured output is unsupported by some providers)
- Embedding batches — `input` accepts an array; don't loop calling one item at a time (slow + rate-limited)
- Function/tool calling — validate the `arguments` JSON before executing; the model may hallucinate args

## Performance Notes

- Pick the model per task — never use a flagship model for simple classification/extraction
- Use prompt caching: always place the static prefix (system prompt, docs) at the start of the prompt
- Batch non-urgent work through the Batch API for cost saving when latency does not matter
- Streaming is not faster in total latency but cuts time-to-first-token — use it when the UX needs progressive output
- Cap `max_tokens`/`max_output_tokens` sensibly — prevents cost overrun from over-long generations

## Ecosystem / Integration

- Zod for schemas → `/follow-lib-zod`
- API key management → `/follow-secret-manager`; never commit keys to the repo
- Compatible providers (Azure/OpenRouter/Ollama) via `baseURL` → see `workflows/config-providers/SKILL.md`
- Observability: log the request id + token usage per call to debug cost spikes
