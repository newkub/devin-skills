# ollaya MCP surface

Verified against `ollaya 0.16.0` on 2026-10-24 by connecting to `ollaya mcp` over stdio: 4 tools, 8 resources, no resource templates, no prompts.

## Tools

| Tool | Input | Returns |
|---|---|---|
| `decide` | `state` (required: string or JSON), `questions` (object keyed by id), `preset` (string), `model` (string, default `laya`) | One answer per question |
| `list_models` | — | Models installed locally, with size and pull time |
| `pull_model` | `model` (required) | Download progress; verifies every file |
| `show_model` | `model` (required) | Family, parameters, context length, languages, capabilities, license, built-in questions |

`decide` takes `questions` **or** `preset`, never both. A guard model (`qwen3guard`) has built-in questions: send neither.

## Resources

| URI | Content |
|---|---|
| `ollaya://models` | Same data as `list_models` |
| `ollaya://presets/triage` | Questions of the `triage` preset |
| `ollaya://presets/email` | Questions of the `email` preset |
| `ollaya://presets/guard` | Questions of the `guard` preset |
| `ollaya://presets/moderation` | Questions of the `moderation` preset |
| `ollaya://presets/router` | Questions of the `router` preset |
| `ollaya://presets/agent` | Questions of the `agent` preset |
| `ollaya://presets/decima-guard` | Questions of the `decima-guard` preset |

Read a preset resource before using it: the instructions name the state field the questions expect (`message`, `body`, `prompt`, `post`, `request`, or `request` + `command`).

## Example decide call

```json
{
  "model": "laya",
  "state": { "message": "Charged twice again. Refund it today or I cancel." },
  "questions": {
    "intent": {
      "type": "choice",
      "instructions": "What does the customer want in `message`?",
      "criteria": {
        "refund": "money returned or a duplicate charge reversed",
        "technical_help": "a bug, outage or integration problem",
        "other": "none of the other options fits"
      }
    },
    "wants_refund": {
      "type": "noul",
      "instructions": "Does the customer ask for their money back?"
    },
    "frustration": {
      "type": "score",
      "instructions": "How frustrated does the customer sound in `message`?",
      "criteria": ["calm", "concerned", "annoyed", "very angry"]
    }
  }
}
```

Answer (shape — values vary by model):

```json
{
  "answers": {
    "intent": { "choice": "refund", "confidence": 0.91, "probabilities": { "refund": 0.91, "technical_help": 0.05, "other": 0.04 } },
    "wants_refund": { "noul": 0.99 },
    "frustration": { "score": 2.89, "confidence": 0.86, "legend": ["calm", "concerned", "annoyed", "very angry"], "probabilities": { "calm": 0.01, "concerned": 0.02, "annoyed": 0.22, "very angry": 0.75 } }
  }
}
```

`/api/decide` adds routing information and timings. `/v1/systemone` is the TypeSafe wire format and is what MCP returns.

## Runtime fallbacks

1. MCP — tool `decide` on server `ollaya`.
2. CLI:

```sh
ollaya run laya --preset triage --format json "Charged twice again. Refund it today or I cancel."
ollaya run laya --questions questions.json --format json "$TEXT"
echo '{"subject":"…","body":"…"}' | ollaya run laya --preset email --format json
```

The CLI starts the daemon if it is not running and pulls the model on first use.

3. HTTP — TypeSafe-compatible, base `http://127.0.0.1:11435`:

```sh
curl -s http://127.0.0.1:11435/v1/systemone \
  -H 'Content-Type: application/json' \
  -d '{"model":"laya","state":"…","questions":{…}}'
```

`/v1/decisions` is an alias of `/v1/systemone`; `GET /v1/models` lists local models. Set `OLLAYA_API_KEY` to require `Authorization`; any non-empty value is accepted.

## Errors

| Code | Cause | Action |
|---|---|---|
| `MODEL_NOT_FOUND` | the model is not local; no endpoint pulls implicitly | `pull_model`, then retry |
| `INVALID_REQUEST` | bad question shape | read `detail`, fix the question |
| `TOO_MANY_OPTIONS` | too many `choice` options for that model | split the question or use a high-option model |
| `INPUT_TOO_LONG` | state exceeds the model context | shorten or chunk the state |
| `STATE_TRUNCATED` | state was cut to fit | shorten the state |

The daemon also exposes `/api/pull`, `/api/tags`, `/api/show`, `/api/ps`, `/api/copy`, `/api/create`, `/api/delete` and `/api/decide` — see `docs/api.md` upstream.

## Model sizes and disk

Models are hundreds of megabytes (weights come from the author's Hugging Face repo, pinned by commit and sha256; only the small ONNX graph is served by ollaya). `decide` may auto-pull on first use. Check free disk and `list_models` before a batch, and pull explicitly rather than letting a batch trigger downloads.
