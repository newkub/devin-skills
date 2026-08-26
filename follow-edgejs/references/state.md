# Edge.js Template State

Edge มี 4 layers สำหรับ template state

| Name | Shared with components | Isolated | Priority |
|------|------------------------|----------|----------|
| Globals | ใช้ | ไม่ | ต่ำสุด |
| Locals | ใช้ | ใช้ | 2 |
| Rendering data object | ไม่ | ใช้ | 3 |
| Inline variables | ไม่ | ใช้ | สูงสุด |

final state = `Object.assign({}, globals, locals, renderingData, inlineVariables)`

## Globals

Available ทุก template รวมถึง components

```ts
edge.global('config', {
  colorScheme: 'dark',
  menu: [],
  socialLinks: []
})
```

```edge
<html class="{{ config.colorScheme }}">
  <header>
    @each(item in config.menu)
      <a href="{{ item.url }}">{{ item.label }}</a>
    @end
  </header>
</html>
```

สามารถแชร์ function หรือ class ได้

```ts
edge.global('findUser', async function (id) {
  return User.findById(id)
})
```

```edge
@let(user = await findUser(1))
{{ user.username }}
```

## Locals

เหมือน globals แต่ isolated ระหว่าง render calls แต่ละครั้ง

```ts
const view = edge.createRenderer().share({
  url: req.url
})

await view.render('template-path')
```

ใช้ประโยชน์ใน middleware ของ Express/AdonisJS เพื่อแยก request context

```ts
app.use(function (req, res) {
  res.view = edge.createRenderer()
})

app.use(function (req, res) {
  res.view.share({
    url: req.url,
    user: req.auth.user
  })
})

app.get('/posts', async (req, res) => {
  const html = await res.view.render('posts')
  res.send(html)
})
```

## Rendering data object

ข้อมูลทีส่งผ่าน `edge.render()` หรือ `view.render()`

```ts
const html = await edge.render('home', { username: 'virk' })
```

ไม่ถูกแชร์กับ components ภายใน template

```edge
{{ username }}
```

## Inline variables

ตัวแปรภายใน template

```edge
@let(total = 0)

<ul>
  @each(item in items)
    @assign(total = total + item.price)
    <li>{{ item.name }} = {{ item.price }}</li>
  @end

  <li>Total = {{ total }}</li>
</ul>
```

scope เหมือน JavaScript `let`

## Reserved keywords

ห้ามใช้เป็นชื่อ template state

- `template`
- `$context`
- `state`
- `$filename`

## Rendering API

### render

```ts
const html = await edge.render('home', { username: 'virk' })
```

### renderSync

```ts
const html = edge.renderSync('home')
```

แนะนำให้ใช้ `render` เป็นหลัก

### renderRaw

```ts
const template = `<h1>Hello {{ username || 'Guest' }}!</h1>`
const html = await edge.renderRaw(template, { username: 'virk' })
```

### renderRawSync

```ts
const html = edge.renderRawSync(template, { username: 'virk' })
```

## Caching

เปิด cache ใน production เพื่อหลีกเลี่ยง re-compile

```ts
const edge = Edge.create({
  cache: process.env.NODE_ENV === 'production'
})
```

compiled output จะถูกเก็บไว้ใน memory
