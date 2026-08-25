# Initialize Repository

## Description

สร้าง Git repository ใหม่สำหรับ project

## Steps

### 1. Create Project Directory

```bash
mkdir my-project
cd my-project
```

### 2. Initialize Git

```bash
# Initialize with default branch (main)
git init

# Initialize with specific branch name
git init -b main
```

### 3. Create Initial Files

```bash
# Create README
echo "# My Project" > README.md

# Create .gitignore
echo "node_modules/" > .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore
```

### 4. Configure Git

```bash
# Set user name (if not set globally)
git config user.name "Your Name"

# Set user email (if not set globally)
git config user.email "your.email@example.com"
```

### 5. Make Initial Commit

```bash
# Stage all files
git add .

# Commit
git commit -m "Initial commit"
```

### 6. Create Remote Repository

```bash
# On GitHub/GitLab:
# Create new repository
# Copy repository URL
```

### 7. Add Remote

```bash
# Add remote origin
git remote add origin https://github.com/user/repo.git

# Or with SSH
git remote add origin git@github.com:user/repo.git
```

### 8. Push to Remote

```bash
# Push main branch
git push -u origin main
```

## Verification

```bash
# Check repository status
git status

# View commit history
git log

# View remote
git remote -v
```

## Common Issues

### Branch Name Mismatch

```bash
# If remote uses different branch name
git branch -M main
git push -u origin main
```

### Authentication Issues

```bash
# Use SSH instead of HTTPS
git remote set-url origin git@github.com:user/repo.git

# Or use credential helper
git config --global credential.helper manager-core
```
