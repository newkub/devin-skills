# Use Case — Elicitation and Runtime Tool Changes

> Ask the user for input in the middle of a tool call, and change the tool set while clients stay connected. Source: https://github.com/modelcontextprotocol/typescript-sdk/blob/v1.x/docs/capabilities.md (accessed 2026-10-20)

## 1. Form elicitation for non-sensitive input

```ts
server.registerTool(
  "create_project",
  {
    description: "Create a project in the workspace and register it with the deploy pipeline",
    inputSchema: { name: z.string().min(1) },
  },
  async ({ name }) => {
    const answer = await server.server.elicitInput({
      mode: "form",
      message: `Create project ${name}?`,
      requestedSchema: {
        type: "object",
        properties: {
          visibility: {
            type: "string",
            title: "Visibility",
            enum: ["private", "public"],
            default: "private",
          },
          tags: { type: "array", title: "Tags", items: { type: "string" }, maxItems: 5 },
        },
        required: ["visibility"],
      },
    });

    if (answer.action !== "accept" || !answer.content) {
      return { content: [{ type: "text", text: "Cancelled by the user" }] };
    }

    const created = await createProject(name, String(answer.content.visibility));
    return { content: [{ type: "text", text: JSON.stringify(created) }] };
  },
);
```

`requestedSchema` is plain JSON Schema, not zod, because the client renders it as a form and validates the answer against it. The result always carries `action` — `accept`, `decline`, or `cancel` — and `content` exists only on `accept`, so branch on `action` before reading it.

## 2. URL elicitation for anything secret

```ts
const { action } = await server.server.elicitInput({
  mode: "url",
  elicitationId: "stripe-connect-42",
  message: "Connect the Stripe account for this workspace",
  url: "https://app.example.com/connect/stripe?workspace=42",
});
```

Form data travels back through the client and is visible to the model. Never put an API key, password, or OAuth code in `requestedSchema` — send the user to a browser page and let your server learn the result out of band. When that flow finishes, notify the client so it can dismiss its prompt:

```ts
const notifyComplete = server.server.createElicitationCompletionNotifier("stripe-connect-42");
await notifyComplete();
```

## 3. Degrade when the client cannot elicit

```ts
try {
  const answer = await server.server.elicitInput({ mode: "form", message, requestedSchema });
  // ... use answer
} catch {
  return {
    content: [
      {
        type: "text",
        text: "This client cannot prompt for input. Pass `visibility` as a tool argument instead.",
      },
    ],
    isError: true,
  };
}
```

Not every client implements elicitation. A server that only works with an interactive client fails in a headless agent run — accept the same fields as optional tool arguments and switch to them when the request throws.

## 4. Change the tool set at runtime

```ts
const deployTool = server.registerTool("deploy", { description: "Deploy the current branch" }, handler);

deployTool.disable(); // feature flag off — hidden from tools/list, still callable by name
deployTool.update({ description: "Deploy a specific branch" });
deployTool.remove(); // gone for good
```

`registerTool` returns a handle, and every `enable`, `disable`, `update`, and `remove` notifies connected clients automatically. `disable` is the right choice for a tool that must be revocable without a restart; `remove` when the capability no longer exists. Reserve `server.sendToolListChanged()` for changes made outside the handle API.

## 5. Cap how much a single call may carry

```ts
const server = new McpServer(
  { name: "files", version: "1.0.0" },
  { maxToolInputElements: 10_000 },
);
```

Off by default. The transport already caps a request body at 4 MiB, but a single `tools/call` can still contain a hundred thousand array elements that your handler then walks. When the limit is exceeded the call comes back as an `isError` result naming the limit, before the schema runs. Set it above the largest legitimate call — a bulk import that really does send 50k rows needs the number raised, not the feature disabled.

## 6. Return more than text

```ts
return {
  content: [
    { type: "text", text: "Chart for the last 7 days" },
    { type: "image", data: pngBase64, mimeType: "image/png" },
    {
      type: "resource",
      resource: { uri: "data://report", mimeType: "application/json", text: JSON.stringify(report) },
    },
  ],
};
```

Image and audio blocks take base64 `data` plus a `mimeType`; an embedded `resource` block attaches a full resource object so the client can keep it without a second request. Base64 pasted into a `text` block instead burns context on bytes the model cannot see.

## 7. Verify

1. Call `create_project` in the Inspector — the form appears, and declining returns "Cancelled by the user"
2. Call it from a client without elicitation support — the `isError` fallback message arrives, no hang
3. `deployTool.remove()` — `tools/list` drops the tool without reconnecting
4. Send a call with 20k array elements — `isError` names the limit when `maxToolInputElements` is set
5. An image result renders as an image in the client, not as base64 text
6. `/run-verify` and `/run-test`

## Pitfalls

- Collecting secrets through form elicitation, which puts them in the conversation.
- Reading `answer.content` without checking `action`, then crashing on decline.
- Assuming elicitation exists — headless clients reject the request instead of showing a form.
- Renaming a tool's arguments in place, so clients that cached the old schema keep sending the old shape.
- Setting `maxToolInputElements` below a real bulk workload, turning legitimate calls into errors.
- Returning base64 in a text block and paying tokens for bytes.
- Leaving a URL elicitation without the completion notifier, so the client's prompt never closes.

## Related

- `references/apis.md`
- `best-practices/tool-design.md`
- `best-practices/server.md`
- `usecases/tool-server.md`
- `usecases/streamable-http-remote.md`
