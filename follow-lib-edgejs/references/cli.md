# Lib Edgejs CLI

Edge.js เป็น template library — ไม่มี standalone CLI

## Programmatic Usage

```ts
import { Edge } from 'edge.js'

const edge = Edge.create()
edge.mount(new URL('./views', import.meta.url))
const html = await edge.render('welcome', { user })
```
