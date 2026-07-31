# Best Practices

## 1. Use Strong Key Sizes

```go
// ✅ Good: 2048+ bit RSA
privateKey, err := rsa.GenerateKey(rand.Reader, 2048)

// ❌ Bad: 512 bit RSA (insecure)
privateKey, err := rsa.GenerateKey(rand.Reader, 512)
```

## 2. Use Secure Random Numbers

```go
// ✅ Good: Crypto random
rand.Read(buffer)

// ❌ Bad: Pseudo random
math/rand.Read(buffer)
```

## 3. Use Established Algorithms

```go
// ✅ Good: AES, RSA, SHA-256
// Well-vetted algorithms

// ❌ Bad: Custom algorithms
// Insecure implementations
```

## 4. Never Roll Your Own Crypto

```go
// ❌ Bad: Custom encryption
// Likely insecure

// ✅ Good: Use established libraries
// crypto/aes, crypto/rsa
```
