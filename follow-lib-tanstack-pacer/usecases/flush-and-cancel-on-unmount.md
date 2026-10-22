# Use Case — Cancel, Pause, and Flush Pending Work on Unmount

> Stop debounced or queued work when a screen closes, and still deliver the last edit — the two halves that ad-hoc `setTimeout` code always gets wrong. Source: https://tanstack.com/pacer/latest (accessed 2026-10-20)

## 1. Hooks clean up automatically; core classes do not

```tsx
// ✅ the hook cancels its pending call on unmount
const save = useDebouncedCallback((text: string) => api.saveDraft(text), { wait: 800 });

// ✅ the core class needs an explicit cancel
const debouncer = new Debouncer((text: string) => api.saveDraft(text), { wait: 800 });
useEffect(() => () => debouncer.cancel(), [debouncer]);
```

A `Debouncer` created in a module or a provider lives longer than the component that triggered it; without `cancel()` its callback fires after the editor is gone.

## 2. Pause instead of tearing down

```tsx
const onSearch = useDebouncedCallback(search, { wait: 300, enabled: isOnline });

// offline → subsequent triggers are ignored but the instance survives
// back online → the same callback resumes; no re-subscription
```

`enabled: false` is for temporary conditions (offline, read-only, modal closed). Destroy and recreate the hook only when the identity of the work changes.

## 3. Flush the last edit before leaving

```tsx
function Editor({ docId }: { docId: string }) {
  const [text, setText] = useState("");
  const save = useDebouncedCallback((value: string) => api.saveDraft(docId, value), { wait: 800 });

  useEffect(() => () => { save.flush?.(); }, [save]);   // deliver, don't drop

  return <textarea value={text} onChange={(e) => { setText(e.target.value); save(e.target.value); }} />;
}
```

Cancel is for work that is no longer wanted. When navigation should still persist the edit, flush — otherwise the last 800 ms of typing is lost. If the package version has no `flush`, call the save function with the latest value in the cleanup instead.

## 4. Guard the async tail

```ts
const save = useDebouncedCallback(async (value: string) => {
  const controller = new AbortController();
  try {
    await api.saveDraft(docId, value, { signal: controller.signal });
  } catch (err) {
    if (!isAbortError(err)) throw err;
  }
  return () => controller.abort();
}, { wait: 800 });
```

A debounced call usually fires once, but the request it starts can outlive the screen. Abort on teardown and swallow only the abort error — every other failure still belongs to the app's error path.

## 5. Verify

1. `/run-test` — type, unmount before `wait`, assert the mock was called once (flush) or zero times (cancel) per the chosen policy
2. Queue variant: unmount with three items pending — the queue stops and no further items start
3. Set `enabled: false`, trigger, advance timers — nothing fires; re-enable and trigger — it fires once
4. Navigate away mid-save — no "setState on unmounted component" warning
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Recreating the debouncer on every render → the previous instance's timer is orphaned and fires anyway; keep one instance per intent.
- Choosing cancel where the product needs flush → users lose the last edit and report "it didn't save".
- Flushing in a cleanup that also aborts the request → the flush starts and is immediately cancelled.
- Forgetting that core classes have no lifecycle → timers fire after the route changed.
- Using `enabled` to model "different work" → stale arguments from the previous context are delivered; create a new instance instead.

## Related

- `references/apis.md`
- `best-practices/tanstack-pacer.md`
- `usecases/batch-writes-and-analytics.md`
- `usecases/debounce-search-input.md`
