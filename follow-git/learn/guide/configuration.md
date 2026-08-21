# Configuration

## User Configuration

```bash
# Set user name
git config --global user.name "Your Name"

# Set user email
git config --global user.email "your.email@example.com"

# View all configuration
git config --list

# View specific configuration
git config user.name
```

## Default Branch Name

```bash
# Set default branch name to main
git config --global init.defaultBranch main
```

## Editor

```bash
# Set default editor
git config --global core.editor "code --wait"
# or
git config --global core.editor "vim"
```

## Line Endings

```bash
# Windows: Convert to CRLF on checkout, LF on commit
git config --global core.autocrlf true

# macOS/Linux: Keep LF as-is
git config --global core.autocrlf input
```

## SSH Keys

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

## Credential Helper

```bash
# Cache credentials for 1 hour
git config --global credential.helper 'cache --timeout=3600'

# Use Windows Credential Manager
git config --global credential.helper manager-core

# Use macOS Keychain
git config --global credential.helper osxkeychain
```

## Aliases

```bash
# Create aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

## Diff Tool

```bash
# Set diff tool
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# Set merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

## Color Output

```bash
# Enable color output
git config --global color.ui true

# Disable color output
git config --global color.ui false
```

## Repository-Specific Configuration

```bash
# Set configuration for current repository only
git config user.name "Work Name"
git config user.email "work@example.com"

# This creates .git/config file
```

## Ignore File

```bash
# Create .gitignore
echo "node_modules/" > .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore
```

## Global Ignore

```bash
# Set global ignore file
git config --global core.excludesfile ~/.gitignore_global

# Add patterns to global ignore
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
```
