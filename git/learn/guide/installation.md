# Installation

## Windows

```bash
# Download from official website
# https://git-scm.com/download/win

# Or using winget
winget install --id Git.Git -e --source winget

# Or using Chocolatey
choco install git
```

## macOS

```bash
# Using Homebrew
brew install git

# Or download from official website
# https://git-scm.com/download/mac
```

## Linux

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install git
```

### Fedora
```bash
sudo dnf install git
```

### Arch Linux
```bash
sudo pacman -S git
```

## Verify Installation

```bash
git --version
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## SSH Setup

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key to GitHub/GitLab
cat ~/.ssh/id_ed25519.pub
```
