# Use Case — Discriminated Unions and Exhaustive Narrowing

> Model a closed set of variants with literal tags, then let TypeScript narrow every branch — no casts, no optional-field soup. Source: https://arktype.io/docs/union (accessed 2026-10-20)

## 1. Tag each variant with a literal

```ts
import { type } from "arktype";

const emailChannel = type({ kind: "'email'", address: "string.email" });
const smsChannel = type({ kind: "'sms'", phone: /^\+\d{10,15}$/ });
const pushChannel = type({ kind: "'push'", deviceId: "string.uuid" });

export const Channel = emailChannel.or(smsChannel).or(pushChannel);
export type Channel = typeof Channel.infer;
```

`"'email'"` is an exact-string literal. Writing `kind: "string"` instead collapses the union into one object type and every `switch` branch loses its narrowed fields.

`.or()` is a union, not a merge: a payload that matches two variants is accepted, so keep the tags mutually exclusive by construction.

## 2. Narrow with a plain `switch`

```ts
export function send(channel: Channel, message: string) {
  switch (channel.kind) {
    case "email":
      return sendEmail(channel.address, message);
    case "sms":
      return sendSms(channel.phone, message);
    case "push":
      return sendPush(channel.deviceId, message);
    default:
      return assertNever(channel);
  }
}

function assertNever(value: never): never {
  throw new Error(`unhandled channel: ${JSON.stringify(value)}`);
}
```

The `assertNever` default is what makes adding a variant a type error at every incomplete site — the compiler finds the work for you. Without it, a new variant silently falls through.

## 3. Validate the boundary, then trust the type

```ts
const result = Channel(payload);
if (result instanceof type.errors) {
  return Response.json({ errors: result.summary.split("\n") }, { status: 422 });
}

return send(result, "hello");
```

After the guard, `result` is `Channel` — no `as`, no optional chaining. The union is the contract; the schema is how it is enforced once, at the edge.

For arrays and nested unions, compose rather than re-declare: `type({ channels: Channel.array(), primary: Channel })`.

## 4. Verify

1. `/run-typecheck` — remove one `case` and confirm the build fails at `assertNever`
2. `/run-test` — a payload with `kind: "email"` and a `phone` field must be rejected (excess keys), not silently stripped
3. `/deep-test api` — send `kind: "sms"` with a malformed phone and expect 422 with a field-level message

## Pitfalls

- Using `"string"` for the tag, which makes all variants structurally compatible and disables narrowing.
- Declaring the union with a bare `|` type instead of the schema, so runtime validation and the TS type drift apart.
- Adding `kind` to an existing variant's payload without updating `assertNever` call sites — the build catches it only if `assertNever` is used.
- Treating an unknown tag as a 500; an unrecognised `kind` is a client error and belongs in the 422 path.

## Related

- `references/apis.md`
- `best-practices/arktype.md`
- `usecases/api-boundary-validation.md`
- `usecases/morph-and-pipe-transforms.md`
