# Use Case — Accessible Form Fields With Validation

> The registry's `TextField` family wraps Kobalte: the label, description, and error message are wired to the input through ARIA, so the only thing you write is the validation rule. Source: https://shadcn-solid.com/docs/components/textfield (accessed 2026-10-20)

## 1. Compose the field from the TextField parts

```tsx
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "@/components/ui/textfield";

<TextFieldRoot name="email" required>
  <TextFieldLabel>Email</TextFieldLabel>
  <TextField type="email" placeholder="teammate@acme.com" />
</TextFieldRoot>
```

`TextFieldRoot` is Kobalte's `TextField`, `TextField` is its `Input`, and the label is associated automatically — no `for`/`id` pairing to maintain. `name` makes the field submit with the form; `required` exposes the required state to assistive technology.

## 2. Hold the value and the touched state

```tsx
import { Show, createMemo, createSignal } from "solid-js";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function InviteForm(props: { onInvite: (email: string) => Promise<void> }) {
  const [email, setEmail] = createSignal("");
  const [touched, setTouched] = createSignal(false);
  const [pending, setPending] = createSignal(false);
  const [sent, setSent] = createSignal(false);

  const error = createMemo(() => {
    if (!touched()) return null;
    if (email().trim() === "") return "Email is required";
    if (!EMAIL.test(email())) return "Enter a valid email address";
    return null;
  });

  return (
    <form onSubmit={submit} noValidate>
      <TextFieldRoot
        name="email"
        value={email()}
        onChange={setEmail}
        validationState={error() ? "invalid" : undefined}
        required
      >
        <TextFieldLabel>Email</TextFieldLabel>
        <TextField
          type="email"
          placeholder="teammate@acme.com"
          onBlur={() => setTouched(true)}
        />
        <TextFieldDescription>
          The invite link expires in 24 hours.
        </TextFieldDescription>
        <TextFieldErrorMessage>{error()}</TextFieldErrorMessage>
      </TextFieldRoot>
    </form>
  );
}
```

`createMemo` derives the message from the value instead of storing an error state that can drift. `touched` keeps the field neutral until the user leaves it, so the form does not open covered in red.

## 3. Let `validationState` drive the styling

```tsx
validationState={error() ? "invalid" : undefined}
```

```tsx
<TextFieldErrorMessage>{error()}</TextFieldErrorMessage>
```

Kobalte renders `ErrorMessage` only while `validationState` is `"invalid"`, and marks the input with `data-invalid` for the destructive border. Passing `undefined` before the first interaction avoids a green "valid" state on an empty field. Passing `"valid"` explicitly is fine once the value really has been checked.

## 4. Submit with a guard and a pending state

```tsx
const submit = async (event: SubmitEvent) => {
  event.preventDefault();
  setTouched(true);
  if (error()) return;

  setPending(true);
  try {
    await props.onInvite(email().trim());
    setSent(true);
    setEmail("");
    setTouched(false);
  } finally {
    setPending(false);
  }
};

<Button type="submit" disabled={pending()}>
  {pending() ? "Sending…" : "Send invite"}
</Button>
<Show when={sent()}>
  <p role="status">Invite sent.</p>
</Show>
```

`event.preventDefault()` plus `noValidate` keeps the browser's bubble out of the way and gives one consistent message. The `try/finally` guarantees the button re-enables even when the request rejects; `role="status"` announces the success without stealing focus.

## 5. Keep an uncontrolled variant for plain HTML forms

```tsx
<form action="/api/invites" method="post">
  <TextFieldRoot name="email" defaultValue="">
    <TextFieldLabel>Email</TextFieldLabel>
    <TextField type="email" placeholder="teammate@acme.com" />
    <TextFieldDescription>We send one link that expires in 24 hours.</TextFieldDescription>
  </TextFieldRoot>
  <Button type="submit">Send invite</Button>
</form>
```

With `name` and no `value`, the field submits natively and works before hydration. Server-side validation is still required — a client rule is a convenience, not a security boundary.

## 6. Verify

1. Click the label — focus moves into the input
2. Tab into an empty field and leave — "Email is required" appears and the input is marked invalid
3. Type `not-an-email` and submit — the message changes and focus stays on the form
4. Submit a valid address — the button disables, then the status message appears
5. Screen reader — the input is announced with its label, description, and error text
6. Disable JavaScript — the uncontrolled form still submits the `email` field
7. `/deep-test a11y` — no "form field without a label" finding

## Pitfalls

- Hand-writing `<label for>` and `<input id>` next to the TextField parts, which duplicates the association Kobalte already made.
- Keeping `error` in a signal and forgetting to clear it after a successful submit, so a stale message blocks the next attempt.
- Showing validation before the first interaction, which makes an untouched form look broken.
- `validationState="valid"` on an empty field, which paints a success state before anything was checked.
- Using `preventDefault()` without replacing the browser's validation — with `noValidate` removed, the native bubble and your message can both appear.
- Reading `email()` inside a JSX attribute that is not reactive (for example, capturing it into a local at setup).
- Naming the field only on the input instead of `TextFieldRoot` — Kobalte reads `name` from the root for form integration.

## Related

- `references/apis.md`
- `best-practices/shadcn-solid.md`
- `usecases/add-and-customize-component.md`
- `usecases/keep-components-reactive-with-splitprops.md`
