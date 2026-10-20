# Use Case — Workers and Raw Assets

> Run a heavy module off the main thread and read a source file as text, both without a build step. Source: https://esm.sh/#docs (accessed 2026-10-20)

## 1. A module worker from a CDN URL

```ts
const worker = new Worker("https://esm.sh/heavy-parser@2?worker", {
  type: "module",
});

worker.postMessage({ csv: text });
worker.onmessage = (event) => renderRows(event.data);
```

`?worker` makes esm.sh return a worker entry that bundles the dependency graph for worker scope. `type: "module"` is required — a classic worker cannot use `import`.

The worker URL must be same-origin or allowed by `worker-src` in the CSP. A CDN worker blocked by CSP fails with a generic network error in the console.

## 2. Terminate when the owner unmounts

```ts
export function startParser(text: string) {
  const worker = new Worker("https://esm.sh/heavy-parser@2?worker", { type: "module" });
  worker.postMessage(text);

  return {
    result: new Promise<Row[]>((resolve) => {
      worker.onmessage = (event) => resolve(event.data);
    }),
    dispose: () => worker.terminate(),
  };
}
```

A worker keeps running after the component that created it is gone. `terminate()` is the only reliable cleanup — posting a "stop" message leaves the worker alive if it is stuck in a loop.

## 3. Read a source file as text

```ts
import reactSource from "https://esm.sh/react@19.2.0/index.js?raw";

const lines = reactSource.split("\n").length;
```

`?raw` returns the file's text as the default export instead of executing it. Use it for licence headers, changelog snippets, or a "view source" panel — not for anything you intend to run.

## 4. Keep the CSP honest

```http
Content-Security-Policy:
  script-src 'self' https://esm.sh;
  worker-src 'self' blob: https://esm.sh;
  connect-src 'self' https://esm.sh;
```

`worker-src` and `connect-src` are separate directives. A page that loads modules fine can still fail to start a worker because `worker-src` was never added.

## 5. Verify

1. `/run-dev` — the worker starts, and the main thread stays responsive during the parse
2. Navigate away mid-parse — the worker terminates (check the task manager)
3. Console shows no CSP violation for `worker-src`
4. `?raw` returns a string; `typeof source === "string"` in a test
5. `/run-build` — the worker URL is still pinned, not `@latest`

## Pitfalls

- Creating a classic worker (`type` omitted) from a module URL, which fails silently on older engines.
- Forgetting `worker-src` in the CSP and debugging it as a network failure.
- Leaking workers on every render, one per keystroke.
- Using `?raw` on a large bundle and shipping megabytes of text to the client.
- Pinning the app but not the worker URL, so the worker's dependency floats.

## Related

- `references/apis.md`
- `best-practices/esm-sh.md`
- `usecases/browser-modules-no-bundler.md`
- `usecases/bundle-options-and-targets.md`
