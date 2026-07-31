# Installation

## การเตรียม Environment สำหรับ Security Engineering

### เครื่องมือที่จำเป็น

- **Programming Language**: Go, Rust, Python, Node.js
- **Security Tools**: OpenSSL, GPG, Hashcat
- **Testing Tools**: OWASP ZAP, Burp Suite
- **Documentation**: Markdown, Security policies

### การติดตั้ง

#### บน Linux

```bash
# ติดตั้ง OpenSSL
sudo apt-get install openssl

# ติดตั้ง GPG
sudo apt-get install gnupg

# ติดตั้ง Hashcat
sudo apt-get install hashcat

# ติดตั้ง OWASP ZAP
sudo apt-get install zaproxy
```

#### บน macOS

```bash
# ติดตั้ง OpenSSL ผ่าน Homebrew
brew install openssl

# ติดตั้ง GPG ผ่าน Homebrew
brew install gnupg

# ติดตั้ง Hashcat ผ่าน Homebrew
brew install hashcat
```

#### บน Windows

```powershell
# ติดตั้ง OpenSSL
winget install ShiningLight.OpenSSL

# ติดตั้ง GPG
winget install GnuPG.Gpg4Win

# ติดตั้ง Hashcat
winget install hashcat.hashcat
```

### การติดตั้ง VS Code Extensions

```bash
# ติดตั้ง extensions ที่จำเป็น
code --install-extension PKief.material-icon-theme
code --install-extension ms-azuretools.vscode-docker
```

### การตั้งค่า Project

```bash
# สร้าง project structure
mkdir security-demo
cd security-demo
mkdir src tests docs keys

# เริ่ม Git repository
git init
echo "# Security Demo" > README.md
git add .
git commit -m "Initial commit"
```

### Dependencies

- **TypeScript/Node.js**: crypto, bcrypt, jsonwebtoken, @types/bcrypt
- **Rust**: rust-crypto, rand, bcrypt
- **Python**: cryptography, bcrypt, pyjwt
