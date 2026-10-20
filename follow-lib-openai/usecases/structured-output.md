# Use Case — Typed Structured Output

> Replace prompt-and-parse with a zod schema the API enforces, so the response is already typed. Source: https://platform.openai.com/docs/guides/structured-outputs (accessed 2026-10-20)

## 1. Set up the client and a schema

```ts
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30_000,
  maxRetries: 3,
});

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

const Recipe = z.object({
  title: z.string(),
  ingredients: z.array(z.object({ name: z.string(), grams: z.number() })),
  steps: z.array(z.string()),
});
```

Keep schemas flat where possible and mark optional fields explicitly — the schema, not the prompt, is what constrains the model.

## 2. Use the Responses API

```ts
const response = await client.responses.parse({
  model: MODEL,
  input: "Give me a lasagna recipe for two people.",
  text: { format: zodResponseFormat(Recipe, "recipe") },
});

const recipe = response.output_parsed; // typed as z.infer<typeof Recipe> | null
if (!recipe) throw new Error(`no structured output: ${response.output_text}`);
```

## 3. Or use Chat Completions

```ts
const completion = await client.chat.completions.parse({
  model: MODEL,
  messages: [
    { role: "system", content: "You are a precise recipe writer." },
    { role: "user", content: "Give me a lasagna recipe for two people." },
  ],
  response_format: zodResponseFormat(Recipe, "recipe"),
});

const message = completion.choices[0].message;
if (message.refusal) throw new Error(`refused: ${message.refusal}`);
const recipe = message.parsed;
```

`parsed` is `null` and `refusal` is non-null when the model declines — both paths are part of the contract, so handle them before touching fields.

## 4. Use the parsed value directly

```ts
await db.recipe.create({ data: { title: recipe.title, body: JSON.stringify(recipe) } });
for (const step of recipe.steps) console.error(`- ${step}`);
```

No `JSON.parse`, no regex extraction, no `as` cast — the SDK validates against the same zod schema you wrote.

## 5. Log cost next to the result

```ts
console.error({
  request: response.id,
  input: response.usage?.input_tokens,
  output: response.usage?.output_tokens,
  cached: response.usage?.input_tokens_details?.cached_tokens,
});
```

## Pitfalls

- Passing `zodResponseFormat(...)` as `response_format` on a raw `create` call does not populate `parsed` — use the `parse` methods.
- Wrapping the schema in extra unions/recursive types can exceed the supported JSON Schema subset; flatten the shape instead.
- Treating `refusal` as an error from the API hides the real reason — it is a normal completion outcome.
- Skipping the `null` check on `parsed` turns a refusal into a `TypeError` three lines later.
- Sending the schema but not describing fields costs accuracy — add `.describe()` to ambiguous properties.
- Never run this client in the browser; the API key belongs to the server only.

## Related

- `references/apis.md`
- `best-practices/usage.md`
- `usecases/streaming-chat.md`
