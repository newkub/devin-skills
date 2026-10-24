# Built-in presets

Read the live definition with the MCP resource `ollaya://presets/<name>` (or `GET /api/show`, or `ollaya preset show <name>`) before using one — a preset is the contract its instructions name.

| Preset | State field | Questions | Use for |
|---|---|---|---|
| `triage` | `message` | `intent` (choice), `is_urgent` (noul), `frustration` (score 0–3), `refund_requested` (noul), `churn_risk` (noul) | support tickets, chat messages |
| `email` | `body` | `category` (choice), `is_spam` (noul), `is_phishing` (noul), `urgency` (score), `needs_reply` (noul) | inbox routing and filtering |
| `guard` | `prompt` | `jailbreak` (noul), `prompt_injection` (noul), `sensitive_data` (noul), `harm_severity` (score), `topic` (choice) | screening untrusted input |
| `moderation` | `post` | `toxic`, `harassment`, `threat`, `spam` (all noul), `severity` (score) | community content |
| `router` | `request` | `difficulty` (score), `domain` (choice), `needs_tools` (noul), `is_sensitive` (noul) | choosing a model or handling path |
| `agent` | `request` + `command` | `action` (choice: `run`/`ask`/`block`), `on_task` (noul), `risk` (score 0–2), `destructive` (noul) | reviewing a command before it runs |
| `decima-guard` | text | `injection`, `harmful`, `toxic` (noul) | a smaller injection/harm gate |

## `triage` in full

```json
{
  "intent": {
    "type": "choice",
    "instructions": "What does the customer want in `message`?",
    "criteria": {
      "refund": "money returned or a duplicate charge reversed",
      "technical_help": "a bug, outage or integration problem",
      "billing_question": "a question about an invoice, plan or payment method",
      "information": "general information, pricing or how-to",
      "cancellation": "wants to cancel or downgrade",
      "other": "none of the other options fits"
    }
  },
  "is_urgent": {
    "type": "noul",
    "instructions": "Does `message` communicate time pressure or a deadline?"
  },
  "frustration": {
    "type": "score",
    "instructions": "How frustrated does the customer sound in `message`?",
    "criteria": ["calm and neutral", "concerned but civil", "clearly annoyed", "very angry or using strong language"]
  },
  "refund_requested": {
    "type": "noul",
    "instructions": "Does the customer ask for money back?"
  },
  "churn_risk": {
    "type": "noul",
    "instructions": "Does `message` suggest the customer may leave for a competitor or cancel?"
  }
}
```

## Choosing between a preset and custom questions

- The preset fits the domain and the state already has the expected field → use the preset, then read `ollaya://presets/<name>` so the instructions and the state match
- The preset asks something irrelevant → write custom questions; do not post-process a preset answer as if it answered a different question
- You will reuse the set across sessions → save it with `ollaya preset create` and treat it as a versioned question set

## State passing

- A preset that names one field (`message`, `body`, `prompt`, `post`, `request`) accepts the raw string, or an object with that field
- `agent` needs both `request` and `command`; pass an object with exactly those keys
- Extra fields are visible to the model through the instructions only if the instructions name them — do not assume the model reads metadata you did not reference
