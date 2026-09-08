# Edge.js Components, Slots, and Layouts

## Creating a component

สร้างไฟล์ `.edge` ใน `views/components/`

```edge
// title: views/components/button.edge
<button type="{{ type || 'submit' }}">{{ text }}</button>
```

## Using components

```edge
<form>
  @!component('components/button', { text: 'Login' })
  @!component('components/button', { text: 'Cancel', type: 'reset' })
</form>
```

Output

```html
<form>
  <button type="submit">Login</button>
  <button type="reset">Cancel</button>
</form>
```

## Components from named disks

```edge
@!component('uikit::components/button', { text: 'Login' })
```

## Props

Access props directly by name

```edge
{{ type }}
{{ class }}
{{ text }}
```

หรือใช้ `$props`

```edge
{{ $props.get('type') }}
{{ $props.get('class') }}
```

Convert props to HTML attributes

```edge
<button {{ $props.toAttrs() }}>
  {{ text }}
</button>
```

## Slots

Component สามารถรับ content ผ่าน slots

```edge
// title: views/components/button.edge
<button {{ $props.toAttrs() }}>
  {{{ await $slots.main() }}}
</button>
```

ใช้ component พร้อม slot

```edge
@component('components/button', {
  class: ['flex', 'align-center']
})
  <i class="fa-lock"></i>
  <span>Login</span>
@end
```

Multiple slots

```edge
// title: views/components/modal.edge
<div class="modal">
  <header>
    {{{ await $slots.header() }}}
  </header>
  <main>
    {{{ await $slots.content() }}}
  </main>
  <footer>
    {{{ await $slots.footer() }}}
  </footer>
</div>
```

```edge
@modal()
  @slot('header')
    <h2>Delete post</h2>
  @end

  @slot('content')
    <p>You are about to delete the post permanently</p>
  @end

  @slot('footer')
    <button>Yes, delete it</button>
    <button>Cancel</button>
  @end
@end
```

Slot สามารถรับ arguments จาก component

```edge
{{ $slots.main({ message: 'hello' }) }}
```

## Components as tags

ถ้า component อยู่ใน `views/components/` สามารถใช้เป็น tag ได้โดยอัตโนมัติ

| Template path | Tag name |
|---------------|----------|
| `form/input.edge` | `@form.input` |
| `tool_tip.edge` | `@toolTip` |
| `checkout_form/input.edge` | `@checkoutForm.input` |
| `modal/index.edge` | `@modal` |

```edge
@!button({ text: 'Login' })
```

## Layouts

สร้าง layout ใน `views/components/layout/app.edge`

```edge
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{ title || "Default title" }}</title>
  @if ($slots.meta)
    {{{ await $slots.meta() }}}
  @endif
</head>
<body>
  {{{ await $slots.main() }}}
</body>
</html>
```

ใช้ layout

```edge
@layout.app({ title: "Welcome page" })
  @slot('meta')
    <meta name="description" content="Welcome to EdgeJS">
  @endslot

  @slot('main')
    <h1>Hello world</h1>
  @endslot
@end
```

## In-memory components

```ts
edge.registerTemplate('uikit.button', {
  template: `<button {{
    $props.except(['text']).toAttrs()
  }}>
    {{ text }}
  </button>`
})
```

ใช้งาน

```edge
@!component('uikit.button', {
  text: 'Submit',
  type: 'submit',
  class: ['btn', 'btn-primary']
})
```
