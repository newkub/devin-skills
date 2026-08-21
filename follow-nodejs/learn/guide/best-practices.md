# Best Practices - Node.js

## Project Structure

```
my-project/
├── src/
│   ├── index.js
│   ├── routes/
│   └── utils/
├── tests/
├── node_modules/
├── package.json
└── .gitignore
```

## Error Handling

### Use try/catch

```javascript
async function readData() {
  try {
    const data = await fs.promises.readFile('data.json')
    return JSON.parse(data)
  } catch (err) {
    console.error('Failed to read file:', err)
    throw err
  }
}
```

### Handle Promise Rejections

```javascript
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection:', err)
})
```

## Performance

### Use Streams

```javascript
// Bad
const data = fs.readFileSync('large.txt')
fs.writeFileSync('copy.txt', data)

// Good
fs.createReadStream('large.txt')
  .pipe(fs.createWriteStream('copy.txt'))
```

### Connection Pooling

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
  connectionLimit: 10
})
```

## Security

### Input Validation

```javascript
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
```

### Environment Variables

```javascript
// .env file
DATABASE_URL=postgres://localhost/db
SECRET_KEY=your-secret-key

// Load with dotenv
require('dotenv').config()
```

## Testing

### Use Jest or Vitest

```javascript
const { test, expect } = require('@jest/globals')

test('add function', () => {
  expect(add(1, 2)).toBe(3)
})
```

## Logging

### Use Structured Logging

```javascript
const logger = {
  info: (msg, meta) => console.log(JSON.stringify({ level: 'info', msg, meta })),
  error: (msg, meta) => console.error(JSON.stringify({ level: 'error', msg, meta }))
}
```

## Package.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "node --test"
  }
}
```
