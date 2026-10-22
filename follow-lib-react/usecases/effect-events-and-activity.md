# Use Case — Effect Events and State-Preserving UI

> `useEffectEvent` reads the latest props from inside an effect without adding them to its dependencies, and `<Activity>` hides a subtree while keeping its state — both remove a whole class of "why did this re-run?" bugs. Source: https://react.dev/reference/react/useEffectEvent (accessed 2026-10-20)

## 1. Pull non-reactive logic out of the dependency list

```tsx
"use client";

import { useEffect, useEffectEvent, useState } from "react";

export function ChatRoom({ roomId, theme }: { roomId: string; theme: "light" | "dark" }) {
  const [messages, setMessages] = useState<string[]>([]);

  const onConnected = useEffectEvent(() => {
    showToast(`Connected to ${roomId}`, { theme });
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on("connected", onConnected);
    connection.connect();
    return () => connection.close();
  }, [roomId]);

  return <MessageList messages={messages} />;
}
```

The effect reconnects only when `roomId` changes. `theme` is read at call time through the effect event, so a theme switch does not tear down and rebuild the connection — the old pattern of silencing the linter with an empty dependency array is no longer needed.

## 2. Respect the call-site rules

```tsx
// allowed: called from inside an effect or another effect event
const onTick = useEffectEvent(() => {
  track("tick", { roomId, theme });
});

useEffect(() => {
  const id = setInterval(onTick, 1_000);
  return () => clearInterval(id);
}, []);
```

An effect event can only be called from an effect or another effect event — never during render, never from an event handler, and it must not be passed down as a prop. The lint rule from `eslint-plugin-react-hooks` enforces all three, so keep the plugin current.

## 3. Hide UI without losing state

```tsx
import { Activity, useState } from "react";

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);

  return (
    <>
      <nav>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActive(tab.id)} aria-selected={tab.id === active}>
            {tab.label}
          </button>
        ))}
      </nav>

      {tabs.map((tab) => (
        <Activity key={tab.id} mode={tab.id === active ? "visible" : "hidden"}>
          <tab.panel />
        </Activity>
      ))}
    </>
  );
}
```

`mode="hidden"` keeps the subtree mounted with its state (scroll position, form input, local counters) but removes it from layout and unmounts its effects. Switching tabs back restores exactly what the user left — the behaviour a tab strip is supposed to have.

## 4. Know what hiding does to effects

```tsx
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

When an `<Activity>` becomes hidden, its effects are cleaned up; when it becomes visible again, they re-run. That is the point — a hidden video keeps its playback position but releases the camera, the socket, and the timers. Code that assumes "mounted once" breaks here; code that always cleans up keeps working.

## 5. Use it for panels, not for routing

```tsx
<Activity mode={isOpen ? "visible" : "hidden"}>
  <ComposePanel draftId={draftId} />
</Activity>
```

An activity is a good fit for a side panel, a step in a wizard, or an inactive tab. It is not a router: hidden content still occupies React's tree, so hiding twenty routes keeps all twenty mounted. Keep the number of hidden subtrees bounded.

## 6. Verify

1. Change `theme` with the chat open — no reconnect in the network panel, and the toast uses the new theme
2. Change `roomId` — the connection closes and reopens exactly once
3. Type into a tab, switch away and back — the text is still there
4. Switch away — a video pauses and its subscription is released (visible in the devtools)
5. Switch back — the effect re-runs and the video resumes from the same position
6. `eslint` — no warnings about a missing dependency and none about calling an effect event in the wrong place
7. `/run-test` — a test asserting the effect runs once while a prop changes

## Pitfalls

- Calling an effect event during render or from `onClick` — it is only valid inside effects.
- Passing an effect event to a child as a prop, which the lint rule rejects and which defeats its purpose.
- Keeping a stale value in a `useRef` to avoid the dependency list when `useEffectEvent` is the intended tool.
- Wrapping the whole app in `<Activity>` — every hidden effect still exists in memory, and start-up cost doubles.
- Assuming hidden means unmounted: refs stay populated, state stays alive, and effects re-run on show.
- Forgetting the cleanup in an activity's effect — it runs again on every show, duplicating subscriptions.
- Using `<Activity>` for modal dialogs that must also release focus and DOM — prefer conditional rendering there.

## Related

- `references/apis.md`
- `best-practices/react.md`
- `usecases/concurrent-ui-transitions.md`
- `usecases/error-boundaries-and-recovery.md`
