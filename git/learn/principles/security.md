# Security

## Definition

Security ใน Git คือการปกป้อง sensitive data และ repository:
- ไม่ commit secrets
- ใช้ environment variables
- Access control
- Audit trail

## Sensitive Data

### What Not to Commit

❌ **Never Commit:**
- API keys
- Passwords
- Tokens
- Certificates
- SSH keys
- Database credentials
- Private keys
- Secrets

### Examples

❌ **Bad:**
```javascript
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "my-secret-password";
```

✅ **Good:**
```javascript
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

## Environment Variables

### .env Files

```bash
# .env (never commit)
API_KEY=sk-1234567890abcdef
DB_PASSWORD=my-secret-password
```

```bash
# .env.example (commit this)
API_KEY=your_api_key_here
DB_PASSWORD=your_db_password_here
```

### .gitignore

```gitignore
# Environment files
.env
.env.local
.env.*.local

# Secrets
secrets/
*.key
*.pem
*.cert
```

### Loading Environment Variables

```javascript
// Node.js
require('dotenv').config();
const apiKey = process.env.API_KEY;

// Python
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('API_KEY')
```

## Secret Scanning

### Tools

- **GitGuardian**: Scan for secrets in Git
- **TruffleHog**: Find secrets in Git history
- **GitLeaks**: Secret scanner
- **GitHub Secret Scanning**: Built-in GitHub feature

### Using GitGuardian

```bash
# Install
pip install gitguardian

# Scan repository
ggshield scan .
```

### Using TruffleHog

```bash
# Install
pip install truffleHog

# Scan repository
trufflehog --regex --entropy=False /path/to/repo
```

## Signed Commits

### GPG Signing

```bash
# Generate GPG key
gpg --full-generate-key

# List GPG keys
gpg --list-secret-keys --keyid-format LONG

# Configure Git to use GPG
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

### Signing Commits

```bash
# Sign commit
git commit -S -m "Signed commit"

# Sign tag
git tag -s v1.0.0 -m "Release v1.0.0"
```

### Verifying Signatures

```bash
# Verify commit
git log --show-signature

# Verify tag
git tag -v v1.0.0
```

## Access Control

### Branch Protection

- **Require Pull Request**: ไม่อนุญาต direct push
- **Required Reviews**: ต้องมี reviewers อนุมัติ
- **Restrict Push**: จำกัดผู้ที่ push ได้
- **Require Status Checks**: ต้องผ่าน CI/CD

### SSH Keys

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

### Personal Access Tokens

- ใช้ PAT แทน password
- Set expiration
- Limit scopes
- Revoke เมื่อไม่ใช้แล้ว

## Auditing

### Git Log

```bash
# View commit history
git log --all --pretty=format:"%h %an %ad %s" --date=short

# View who changed what
git blame filename.txt

# View changes by author
git log --author="John Doe"
```

### GitHub Audit Log

- Settings → Audit log
- View all activities
- Export logs
- Set up alerts

## Best Practices

1. **Never Commit Secrets**: ใช้ environment variables
2. **Use .gitignore**: Exclude sensitive files
3. **Scan for Secrets**: ใช้ secret scanning tools
4. **Sign Commits**: ใช้ GPG signing สำหรับ critical projects
5. **Use SSH**: ใช้ SSH แทน HTTPS
6. **Rotate Keys**: เปลี่ยน keys เป็นประจำ
7. **Review Access**: Review access permissions เป็นประจำ
8. **Monitor Activity**: Monitor repository activity
