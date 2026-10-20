# Use Case — Forms, CSRF, and Validation Errors

> Render a server-validated form that keeps the user's input and shows field errors without a client framework. Source: https://edgejs.dev/docs/components (accessed 2026-10-20)

## 1. The form carries a CSRF token

```edge
<form method="POST" action="/posts">
  {{ csrfField() }}

  <label for="title">Title</label>
  <input id="title" name="title" value="{{ old('title', '') }}" required>
  @if(errorFor('title'))
    <p class="error" role="alert">{{ errorFor('title') }}</p>
  @end

  <button type="submit">Publish</button>
</form>
```

`csrfField()` is the framework helper that emits the hidden token input — if the project does not expose it, register a global that returns it. A POST without the token is rejected by the CSRF middleware, which is the intended failure.

`old()` and `errorFor()` come from the validation layer; register them as globals or pass them explicitly in state. Without them, a failed submit clears the whole form.

## 2. Validate in the controller, redirect back on failure

```ts
const result = schema.safeParse(await request.formData());
if (!result.success) {
  return redirectBack({ errors: fieldErrors(result.error), old: formValues(request) });
}

await createPost(result.data);
return redirect("/posts", { status: 303 });
```

Redirect after POST instead of re-rendering — a re-render on refresh resubmits the form. `303` makes the browser switch to GET.

Keep the validation in the controller. Template conditionals only display the errors; they never decide whether the data is valid.

## 3. Show success and disabled states honestly

```edge
@if(session.get('status'))
  <p role="status">{{ session.get('status') }}</p>
@end

<button type="submit" @if(processing) disabled @end>
  {{ processing ? 'Publishing…' : 'Publish' }}
</button>
```

`role="status"` and `role="alert"` give the message to a screen reader without moving focus. A plain `<div>` after a redirect is invisible to assistive tech.

## 4. Verify

1. Submit with an empty title — the page returns with the old values and the error next to the field
2. Remove the CSRF input in devtools and submit — the request is rejected, not silently accepted
3. Submit twice quickly — one post, or a clear conflict message
4. Refresh after a successful submit — no resubmission prompt
5. Tab through the form — every field reachable, the error announced after the field

## Pitfalls

- Re-rendering the form instead of redirecting, so refresh resubmits the POST.
- Putting the CSRF token only in the form template and forgetting the same field on fetch-based submits.
- Echoing `old()` without escaping, which turns a validation error into stored XSS.
- Rendering errors as a single banner, so the user cannot tell which field failed.
- Validating in the template with `@if` logic instead of a schema in the controller.

## Related

- `references/apis.md`
- `best-practices/edgejs.md`
- `usecases/escaping-and-raw-html.md`
- `usecases/components-and-state.md`
