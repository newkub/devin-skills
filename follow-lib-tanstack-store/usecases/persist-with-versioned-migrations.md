# Use Case — Persist a Store With Versioned Migrations

> Keep theme, sidebar, and filters across reloads without persisting transient state, and upgrade the stored shape when it changes. Source: https://tanstack.com/store/latest (accessed 2026-10-20)

## 1. Split persisted from transient state

```ts
// src/stores/ui.ts
import { Store } from "@tanstack/react-store";

export type UiState = {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  filters: { status: string[]; assignee: string | null };
  // transient — never persisted
  saving: boolean;
  error: string | null;
};

export const PERSISTED_KEYS = ["theme", "sidebarOpen", "filters"] as const satisfies readonly (keyof UiState)[];

const INITIAL: UiState = {
  theme: "dark",
  sidebarOpen: true,
  filters: { status: [], assignee: null },
  saving: false,
  error: null,
};
```

Listing the persisted keys once is what stops `error: "Failed to save"` from reappearing after a reload — a bug users read as "it keeps failing".

## 2. Read and validate before the first render

```ts
const KEY = "ui-state";

export function loadState(): UiState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return INITIAL;
  try {
    const parsed = JSON.parse(raw) as { v?: number; state?: Partial<UiState> };
    const migrated = migrate(parsed.v ?? 0, parsed.state ?? {});
    // unknown keys from a future/old release are dropped, known keys win
    return { ...INITIAL, ...pick(migrated, PERSISTED_KEYS) };
  } catch {
    return INITIAL;           // a corrupt blob must not white-screen the app
  }
}

export const uiStore = new Store<UiState>(loadState());
```

Reading in the store's initialiser means the first paint already has the persisted theme — hydrating in an effect gives the user a flash of the default.

## 3. Migrate by version, not by guesswork

```ts
function migrate(version: number, state: Partial<UiState>): Partial<UiState> {
  let next = state;

  if (version < 1) {
    // v0 stored `darkMode: boolean`
    next = { ...next, theme: (state as { darkMode?: boolean }).darkMode ? "dark" : "light" };
  }
  if (version < 2) {
    // v1 stored `filters` as a single string
    const legacy = (state as { filters?: unknown }).filters;
    next = { ...next, filters: typeof legacy === "string" ? { status: [legacy], assignee: null } : next.filters };
  }
  return next;
}
```

Each `if` handles one version jump, so a user three versions behind migrates through the same steps as one version behind.

## 4. Write debounced and only the persisted slice

```ts
let timer: ReturnType<typeof setTimeout> | undefined;

uiStore.subscribe(() => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const state = uiStore.state;
    localStorage.setItem(KEY, JSON.stringify({ v: 2, state: pick(state, PERSISTED_KEYS) }));
  }, 200);
});
```

The version number written here must be the same constant `loadState` compares against — derive it from one `const SCHEMA_VERSION = 2`, or the next migration silently never runs.

## 5. Verify

1. `/run-test` — set `theme`, reload the module, `loadState()` returns `theme` and not `saving`/`error`
2. Feed a v0 blob (`{v:0, state:{darkMode:true}}`) — theme is `dark`, no crash
3. Feed `"{not json"` — falls back to `INITIAL`
4. Reload with `error` set — the alert does not reappear
5. Two tabs: change theme in one, reload the other — no stale write overwrites the newer value (or accept last-write-wins explicitly)
6. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Persisting the whole state object → transient flags come back after reload and confuse the user.
- No version field → the next shape change crashes on old data or silently drops settings.
- Hydrating in a `useEffect` → first paint uses defaults and the theme flashes.
- Persisting on every `setState` without debounce → a `localStorage` write per keystroke, blocking the main thread.
- Writing the version number as a literal in two places → the migration stops running after one is bumped.

## Related

- `references/apis.md`
- `best-practices/tanstack-store.md`
- `usecases/batched-actions-and-side-effects.md`
- `usecases/selector-granularity-in-react.md`
