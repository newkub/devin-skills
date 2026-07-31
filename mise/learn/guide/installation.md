# วิธีติดตั้ง

## Installation Methods

### curl (Linux/macOS)

```bash
curl https://mise.run | sh
```

### Homebrew (macOS/Linux)

```bash
brew install mise
```

### Scoop (Windows)

```bash
scoop install mise
```

### Cargo

```bash
cargo install mise
```

## Shell Activation

### Bash/Zsh

```bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
# หรือ
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
```

### Fish

```bash
echo 'eval (mise activate fish)' >> ~/.config/fish/config.fish
```

### PowerShell

```powershell
Invoke-Expression (&mise activate powershell)
```

## Verification

```bash
mise --version
```

## Uninstallation

```bash
# Remove installation
rm -rf ~/.local/share/mise

# Remove shell integration
# ลบบรรทัดที่เพิ่มใน shell config
```
