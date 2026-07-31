# Key Management

## Key Generation

```bash
# Generate RSA key pair
openssl genrsa -out private.key 2048
openssl rsa -in private.key -pubout -out public.key

# Generate AES key
openssl rand -base64 32
```

## Key Storage

**Best Practices**:
- Use key management services (AWS KMS, HashiCorp Vault)
- Never store keys in code
- Use environment variables
- Encrypt keys at rest
- Rotate keys regularly
