# All Features - Node.js

## Built-in Modules

| Module | Description |
|--------|-------------|
| fs | File system |
| http | HTTP server |
| path | Path utilities |
| os | OS utilities |
| crypto | Cryptography |
| stream | Data streams |
| util | Utilities |

## HTTP Server

```javascript
const http = require('http')
const server = http.createServer((req, res) => {
  res.end('Hello World')
})
server.listen(3000)
```
