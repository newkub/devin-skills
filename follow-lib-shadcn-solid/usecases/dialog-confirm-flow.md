# Use Case — Dialog Confirmation With an Async Action

> A destructive action needs a focus-trapped dialog, a title and description for assistive tech, and a button that stays disabled until the request settles. Source: https://shadcn-solid.com/docs/components/dialog (accessed 2026-10-20)

## 1. Own the open state

```tsx
import { Show, createSignal } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteProjectDialog(props: {
  name: string;
  onDelete: () => Promise<void>;
}) {
  const [open, setOpen] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        as={(triggerProps) => (
          <Button variant="destructive" {...triggerProps}>
            Delete project
          </Button>
        )}
      />
      {/* DialogContent: see section 2 */}
    </Dialog>
  );
}
```

`Dialog` is the Kobalte dialog root re-exported by the registry, so `open`/`onOpenChange` are its controlled props. `DialogTrigger` is polymorphic: `as` renders your `Button` while keeping the trigger's click and `aria-*` wiring — wrapping the button in a `<div>` instead loses that.

## 2. Give the dialog a title and a description

```tsx
<DialogContent class="sm:max-w-md">
  <DialogHeader>
    <DialogTitle>Delete {props.name}?</DialogTitle>
    <DialogDescription>
      This removes the project, its deployments, and its environment variables. This cannot be undone.
    </DialogDescription>
  </DialogHeader>
</DialogContent>
```

Kobalte labels the dialog from `DialogTitle` and describes it from `DialogDescription`; without them screen-reader users hear an unlabeled modal. `DialogContent` already renders the portal, the overlay, and the close button, so the markup stays at one level.

## 3. Run the action inside the dialog

```tsx
const confirm = async () => {
  setPending(true);
  setError(null);
  try {
    await props.onDelete();
    setOpen(false);
  } catch (cause) {
    setError(cause instanceof Error ? cause.message : "Delete failed");
  } finally {
    setPending(false);
  }
};

<DialogFooter>
  <Button variant="outline" onClick={() => setOpen(false)} disabled={pending()}>
    Cancel
  </Button>
  <Button variant="destructive" onClick={confirm} disabled={pending()}>
    {pending() ? "Deleting…" : "Delete"}
  </Button>
</DialogFooter>
```

Closing only after `await` resolves is what makes the dialog a confirmation rather than a fire-and-forget button. On failure the dialog stays open with the message visible, so the user can retry without reopening it.

## 4. Surface the failure inside the content

```tsx
<Show when={error()}>
  <p role="alert" class="text-sm text-destructive">
    {error()}
  </p>
</Show>
```

`role="alert"` announces the failure when it appears. Keep the message next to the buttons; a toast fired from a modal is easy to miss and disappears before the user can act on it. `Show` is imported from `solid-js` — it renders nothing while the accessor is `null`.

## 5. Let Kobalte own the keyboard

Escape closes the dialog, focus is trapped inside it, and focus returns to the trigger on close — all from the primitive. Do not add a manual `onKeyDown` handler for Escape or a `tabIndex` loop on the content: it duplicates behaviour that is already correct and usually breaks the return-focus step.

## 6. Verify

1. Open with the keyboard — focus lands inside the content, not on the page behind
2. Tab through the footer — focus cycles within the dialog and never reaches the page
3. Escape and the overlay click both close it, and focus returns to the trigger
4. Press Delete — both buttons disable, the label changes, and the dialog closes only after the promise resolves
5. Make `onDelete` reject — the dialog stays open and `role="alert"` shows the message
6. Screen reader — the dialog is announced with its title and description
7. `/deep-test a11y` — no "dialog without an accessible name" finding

## Pitfalls

- Rendering `DialogContent` without `DialogTitle` — the modal is announced as an unlabeled dialog.
- Wrapping the trigger in a `<div>` instead of using `as`, so the click target and the `aria-*` attributes end up on different elements.
- Closing the dialog before the request settles, which hides a failure the user needs to see.
- Awaited work in an `onClick` without a pending flag — double clicks fire the delete twice.
- Adding a manual Escape handler, which closes the dialog twice or skips focus restoration.
- Rendering a second `Dialog` inside the first for a nested confirm; use one dialog per decision.
- Using `class="hidden"` to keep a dialog mounted — mount state belongs to `open`, not CSS.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/shadcn-solid.md`
- `usecases/add-and-customize-component.md`
- `usecases/keep-components-reactive-with-splitprops.md`
