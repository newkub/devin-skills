# Quick Start - Node.js

## Hello World

```javascript
console.log("Hello, World!")
```

```bash
node hello.js
```

## HTTP Server

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<h1>Hello World</h1>')
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/')
})
```

## File Operations

### Read File

```javascript
const fs = require('fs')

// Sync
const data = fs.readFileSync('input.txt', 'utf8')
console.log(data)

// Async
fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// Promise
const fsPromises = require('fs').promises
const data = await fsPromises.readFile('input.txt', 'utf8')
```

## Working with Modules

### Export and Import

```javascript
// lib.js
module.exports.add = (a, b) => a + b
module.exports.multiply = (a, b) => a * b

// main.js
const { add, multiply } = require('./lib')
console.log(add(2, 3))
```

## Working with JSON

```javascript
// Write JSON
const data = { name: 'Alice', age: 30 }
fs.writeFileSync('data.json', JSON.stringify(data, null, 2))

// Read JSON
const raw = fs.readFileSync('data.json', 'utf8')
const parsed = JSON.parse(raw)
```

## Working with bun

```bash
# Create project
bun init -y

# Add dependency
bun install express

# Add dev dependency
bun install -D jest

# Run script
bun start

# Run tests
bun test
```

## Express.js Server

```bash
bun install express
```

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Hello!' })
})

app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Alice' })
})

app.listen(3000, () => {
  console.log('Express server on port 3000')
})
```

## Running

```bash
# Run script
node index.js

# With watch
node --watch index.js

# With debugger
node --inspect index.js
```
