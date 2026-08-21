# Performance

## หลักการประสิทธิภาพ

### 1. ใช้ Caching

Cache dependencies เพื่อลด build time

```yaml
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/bun.lockb') }}
```

### 2. ใช้ Bun Package Manager

Bun เร็วกว่า bun และ bun

```yaml
- run: bun install
```

### 3. Parallel Jobs

รัน jobs แบบ parallel เมื่อไม่มี dependencies

### 4. Conditional Execution

รัน steps เฉพาะเมื่อจำเป็น

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: bun run deploy
```

### 5. ใช้ Matrix Strategy อย่างเหมาะสม

ไม่ test บน platforms ที่ไม่จำเป็น
