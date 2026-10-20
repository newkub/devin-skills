# Use Case — Resources and Prompts

> Expose read-only context as resources and reusable templates as prompts, so the client can attach data and users can start a task with one click. Source: https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/server.md (accessed 2026-10-20)

## 1. Register a fixed resource

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({ name: "platform", version: "1.0.0" });

server.registerResource(
  "app-config",
  "config://app",
  {
    title: "Application config",
    description: "Runtime settings that are safe to read",
    mimeType: "application/json",
  },
  async (url) => ({
    contents: [{ uri: url.href, mimeType: "application/json", text: JSON.stringify(config) }],
  }),
);
```

A resource is data, not an action: no side effects and no expensive compute, because some clients read every listed resource as soon as they connect. Anything that mutates state belongs in a tool.

## 2. Return binary content with `blob`

```ts
const logo = Buffer.from(await Bun.file("assets/logo.png").arrayBuffer()).toString("base64");

server.registerResource(
  "logo",
  "images://logo.png",
  { title: "Logo", mimeType: "image/png" },
  async (url) => ({ contents: [{ uri: url.href, blob: logo }] }),
);
```

`text` carries UTF-8 strings, `blob` carries base64 bytes. Putting a PNG in `text` produces mojibake that the client renders as a wall of replacement characters.

## 3. Template a dynamic resource

```ts
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

server.registerResource(
  "user-profile",
  new ResourceTemplate("users://{userId}/profile", { list: undefined }),
  { title: "User profile", mimeType: "application/json" },
  async (url, { userId }) => ({
    contents: [
      {
        uri: url.href,
        mimeType: "application/json",
        text: JSON.stringify(await getUser(String(userId))),
      },
    ],
  }),
);
```

Template parameters arrive as strings, so convert before using them. `list: undefined` declares that the server cannot enumerate instances — correct when the set is unbounded. Add a `list` callback only when enumeration is cheap, because the client may call it on every connect.

## 4. Register a prompt with an argument schema

```ts
import { z } from "zod";

server.registerPrompt(
  "review-diff",
  {
    title: "Review a diff",
    description: "Ask the model to review a unified diff for correctness",
    argsSchema: { diff: z.string().describe("Unified diff, at most 400 lines") },
  },
  ({ diff }) => ({
    messages: [
      {
        role: "user",
        content: { type: "text", text: `Review this diff for correctness:\n\n${diff}` },
      },
    ],
  }),
);
```

Tools are chosen by the model, prompts are chosen by the user. A prompt that wraps a single tool without adding instructions is a duplicate entry in the picker — put the review instructions in the prompt text and keep the tool for the action.

## 5. Offer argument completions

```ts
import { completable } from "@modelcontextprotocol/sdk/server/completable.js";

argsSchema: {
  project: completable(z.string(), (value) =>
    projects.filter((name) => name.startsWith(value)),
  ),
}
```

The callback runs while the user types, so keep it in memory. A completion that queries the database per keystroke turns autocomplete into a load test.

## 6. Notify when resource content changes

```ts
import { SubscribeRequestSchema, UnsubscribeRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const subscriptions = new Set<string>();

server.server.setRequestHandler(SubscribeRequestSchema, async (request) => {
  subscriptions.add(request.params.uri);
  return {};
});

server.server.setRequestHandler(UnsubscribeRequestSchema, async (request) => {
  subscriptions.delete(request.params.uri);
  return {};
});

if (subscriptions.has("config://app")) {
  await server.server.sendResourceUpdated({ uri: "config://app" });
}
```

Registering, removing, or disabling a resource notifies the client automatically. A changed value does not — that needs `sendResourceUpdated` for each subscriber, or the client keeps reading the copy it cached at connect time.

## 7. Verify

1. Inspector from `usecases/tool-server.md` step 5 — it lists both resources and reads `config://app` as JSON
2. Read `users://42/profile` — the handler receives `userId` as `"42"` and returns one profile
3. `prompts/list` shows `review-diff`; `prompts/get` with a diff returns one user message
4. `client.complete()` with `value: "ap"` returns the matching project names
5. Change the config file — a subscribed client receives the update without reconnecting
6. `/run-verify` and `/run-test`

## Pitfalls

- Doing heavy compute inside a resource read, which every connecting client pays for.
- Registering a resource the model needs but the client never attaches — duplicate the payload as a tool result when the model must use it.
- Returning `text` for an image or audio resource.
- Declaring `list: undefined` with no other discovery path, so clients cannot enumerate URIs.
- Passing template parameters straight into a database query without validation.
- Writing a prompt description that says "review" without saying what it reviews.

## Related

- `references/apis.md`
- `best-practices/server.md`
- `best-practices/tool-design.md`
- `usecases/tool-server.md`
- `usecases/streamable-http-remote.md`
