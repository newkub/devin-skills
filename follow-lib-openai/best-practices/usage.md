# Best Practices: openai SDK

แนวทางใช้ `openai` SDK ฝั่ง server ให้ถูกต้อง ปลอดภัย และคุ้ม cost

## Recommended Patterns

- สร้าง client ครั้งเดียวแล้ว reuse — `new OpenAI()` อ่าน `OPENAI_API_KEY` จาก env อัตโนมัติ อย่าสร้างใหม่ทุก request
- ใช้ Responses API (`client.responses.create`/`parse`) เป็น default สำหรับงานใหม่ — รองรับ tools, structured output และ stateful conversation ดีกว่า Chat Completions
- Structured output ใช้ `zodResponseFormat` จาก `openai/helpers/zod` คู่กับ `.parse()` — ได้ typed result พร้อม validation ในคำสั่งเดียว
- Streaming ใช้ `stream: true` แล้ว iterate ด้วย `for await` — เก็บ `tool_calls` deltas ต่อเนื่องกันก่อน parse arguments
- Retry ด้วย exponential backoff สำหรับ `429`/`5xx` — SDK มี built-in retry แต่ควรตั้ง `maxRetries` และ `timeout` ให้ชัดเจน
- ตั้ง `timeout` ต่อ request และใช้ `AbortSignal` เมื่อ user cancel — กัน request ค้างกิน resource
- Log `usage` (prompt/completion tokens) ทุก call เพื่อ cost tracking และ detect prompt bloat

## Do / Don't

| Do | Don't |
|---|---|
| เรียก API ฝั่ง server เท่านั้น (proxy ผ่าน backend) | ใส่ `apiKey` ใน client-side code หรือ bundle |
| ใช้ zod schema กับ `.parse()` สำหรับ structured output | parse JSON จาก free-form text ด้วย `JSON.parse` ล้วนๆ |
| ตั้ง `maxRetries` + backoff สำหรับ rate limit | retry ทันทีแบบ tight loop เมื่อเจอ 429 |
| ตั้ง `timeout` และ `AbortSignal` | ปล่อย request ไม่มี timeout |
| เก็บ conversation history แบบจำกัด (truncate/summarize) | ส่ง history ทั้งหมดทุก request จน token พุ่ง |
| ใช้ prompt caching (`prompt_cache_key` / cache-friendly prompt ordering) | สลับลำดับ system/context ทุกครั้งจน cache miss |

## Common Pitfalls

- Structured output ไม่ใช่ guarantee 100% — `.parse()` throw เมื่อ model output ไม่ตรง schema; ต้องมี fallback หรือ retry logic
- `stream: true` ทำให้ error มาช้า — HTTP 200 แล้วค่อย error กลาง stream; wrap iterator ด้วย try/catch เสมอ
- Token counting ต่างจากที่คิด — นับด้วย `tiktoken` หรืออ่าน `usage` จริงจาก response อย่า hardcode ประมาณการ
- `baseURL` สำหรับ compatible providers (Azure, OpenRouter, Ollama) — API surface ไม่เหมือนกัน 100% (เช่น structured output บาง provider ไม่รองรับ)
- Embedding batch — `input` รับ array ได้ อย่า loop เรียกทีละ item (ช้า + โดน rate limit)
- Function/tool calling — validate `arguments` JSON ก่อน execute; model อาจ hallucinate args

## Performance Notes

- เลือก model ตามงาน — อย่าใช้ flagship model กับงาน classification/extraction ง่ายๆ
- ใช้ prompt caching: วาง static prefix (system prompt, docs) ไว้ต้น prompt เสมอ
- Batch non-urgent work ผ่าน Batch API สำหรับ cost saving เมื่อ latency ไม่สำคัญ
- Streaming ไม่ได้เร็วกว่าในแง่ total latency แต่ลด time-to-first-token — ใช้เมื่อ UX ต้องการ progressive output
- จำกัด `max_tokens`/`max_output_tokens` ให้สมเหตุสมผล — กัน cost overrun จาก generation ยาวเกิน

## Ecosystem / Integration

- Zod สำหรับ schemas → `/follow-lib-zod`
- API key management → `/follow-secret-manager` ห้าม commit key ลง repo
- Compatible providers (Azure/OpenRouter/Ollama) ผ่าน `baseURL` → ดู `workflows/config-providers/SKILL.md`
- Observability: log request id + token usage ต่อ call เพื่อ debug cost spike
