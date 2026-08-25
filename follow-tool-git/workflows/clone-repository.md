# Clone Repository

## Description

Clone existing Git repository จาก remote

## Steps

### 1. Clone via HTTPS

```bash
# Clone repository
git clone https://github.com/user/repo.git

# Clone to specific directory
git clone https://github.com/user/repo.git my-directory
```

### 2. Clone via SSH

```bash
# Clone with SSH (recommended)
git clone git@github.com:user/repo.git
```

### 3. Clone Specific Branch

```bash
# Clone specific branch
git clone -b develop https://github.com/user/repo.git

# Clone with depth (shallow clone)
git clone --depth 1 https://github.com/user/repo.git
```

### 4. Navigate to Repository

```bash
cd repo
```

### 5. Configure Repository

```bash
# Set user name (if not set globally)
git config user.name "Your Name"

# Set user email (if not set globally)
git config user.email "your.email@example.com"
```

### 6. Verify Clone

```bash
# Check status
git status

# View branches
git branch -a

# View remotes
git remote -v
```

## Advanced Options

### Shallow Clone

```bash
# Clone only latest commit
git clone --depth 1 https://github.com/user/repo.git

# Clone with specific depth
git clone --depth 5 https://github.com/user/repo.git
```

### Partial Clone

```bash
# Clone without blobs
git clone --filter=blob:none https://github.com/user/repo.git

# Clone specific directory
git clone --filter=blob:limit=1m https://github.com/user/repo.git
```

### Mirror Clone

```bash
# Clone with full history and refs
git clone --mirror https://github.com/user/repo.git
```

## Common Issues

### Authentication Failed

```bash
# Use SSH instead of HTTPS
git clone git@github.com:user/repo.git

# Or configure credentials
git config --global credential.helper manager-core
```

### Repository Not Found

```bash
# Check repository URL
# Verify you have access
# Check if repository is private
```

### Permission Denied

```bash
# Check SSH key
ssh -T git@github.com

# Add SSH key to GitHub/GitLab
```
