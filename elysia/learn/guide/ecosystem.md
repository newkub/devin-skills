# Ecosystem

Ecosystem ของ Elysia ประกอบด้วย plugins, tools, และ community resources

## Official Plugins

### Core Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| @elysia/cors | CORS support | `bun add @elysia/cors` |
| @elysia/jwt | JWT authentication | `bun add @elysia/jwt` |
| @elysia/swagger | OpenAPI documentation | `bun add @elysia/swagger` |
| @elysia/cookie | Cookie management | `bun add @elysia/cookie` |
| @elysia/session | Session management | `bun add @elysia/session` |
| @elysia/ws | WebSocket support | `bun add @elysia/ws` |

### Database Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| @elysia/postgres | PostgreSQL integration | `bun add @elysia/postgres` |
| @elysia/mongodb | MongoDB integration | `bun add @elysia/mongodb` |
| @elysia/redis | Redis integration | `bun add @elysia/redis` |
| @elysia/prisma | Prisma ORM integration | `bun add @elysia/prisma` |

### Validation Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| @elysia/zod | Zod schema validation | `bun add @elysia/zod` |
| @elysia/valibot | Valibot schema validation | `bun add @elysia/valibot` |

### Utility Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| @elysia/compress | Response compression | `bun add @elysia/compress` |
| @elysia/rate-limit | Rate limiting | `bun add @elysia/rate-limit` |
| @elysia/caching | Response caching | `bun add @elysia/caching` |
| @elysia/logger | Request logging | `bun add @elysia/logger` |

## Community Plugins

### Authentication

- `elysia-auth` - OAuth2 providers
- `elysia-passport` - Passport.js integration
- `elysia-keycloak` - Keycloak integration

### File Upload

- `elysia-file-upload` - Multipart file upload
- `elysia-s3` - AWS S3 integration
- `elysia-cloudinary` - Cloudinary integration

### Email

- `elysia-nodemailer` - Email sending
- `elysia-sendgrid` - SendGrid integration
- `elysia-mailgun` - Mailgun integration

## Development Tools

### CLI Tools

```bash
# สร้าง project ใหม่
bun create elysia my-app

# Development server
bun run dev

# Build for production
bun run build

# Type checking
bun run typecheck
```

### Testing Tools

```bash
# Install testing tools
bun add -d @elysia/testing buntest

# Run tests
bun test
```

### Code Quality

```bash
# Linting
bun add -d @biomejs/biome
bunx biome check

# Formatting
bunx biome format
```

## IDE Support

### VS Code Extensions

- **Elysia Snippets** - Code snippets for Elysia
- **TypeScript Importer** - Auto import types
- **Error Lens** - Inline error display

### JetBrains IDEs

- **Elysia Support** - Syntax highlighting
- **TypeScript** - Built-in TypeScript support

## Documentation

### Official Documentation

- [Elysia Docs](https://elysiajs.com) - Official documentation
- [API Reference](https://elysiajs.com/reference) - API documentation
- [Examples](https://elysiajs.com/examples) - Code examples

### Community Resources

- [Discord](https://discord.gg/elysia) - Community chat
- [GitHub Discussions](https://github.com/elysiajs/elysia/discussions) - Q&A
- [Stack Overflow](https://stackoverflow.com/questions/tagged/elysia) - Q&A

## Templates

### Starter Templates

```bash
# Basic template
bun create elysia my-app

# With TypeScript
bun create elysia my-app --template typescript

# With database
bun create elysia my-app --template database

# Full-stack
bun create elysia my-app --template fullstack
```

### Examples Repository

[elysia-examples](https://github.com/elysiajs/examples) - Collection of examples

## Deployment

### Cloud Platforms

| Platform | Guide |
|----------|-------|
| Vercel | [Deploy to Vercel](https://elysiajs.com/deployment/vercel) |
| Cloudflare Workers | [Deploy to Workers](https://elysiajs.com/deployment/cloudflare) |
| Railway | [Deploy to Railway](https://elysiajs.com/deployment/railway) |
| Fly.io | [Deploy to Fly.io](https://elysiajs.com/deployment/fly) |

### Docker

```dockerfile
FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
```

## Best Practices

- **Use Official Plugins**: ใช้ plugins ที่ official เมื่อเป็นไปได้
- **Check Compatibility**: ตรวจสอบ version compatibility
- **Read Documentation**: อ่าน docs ก่อนใช้ plugins
- **Community Support**: ใช้ plugins ที่มี community support
- **Regular Updates**: อัปเดต plugins สม่ำเสมอ
