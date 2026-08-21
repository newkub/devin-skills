# Quick Start

## Initialize New Repository

```bash
# Create new directory
mkdir my-project
cd my-project

# Initialize Git
git init

# Create initial file
echo "# My Project" > README.md

# Stage and commit
git add README.md
git commit -m "Initial commit"
```

## Clone Existing Repository

```bash
# Clone via HTTPS
git clone https://github.com/user/repo.git

# Clone via SSH
git clone git@github.com:user/repo.git

# Clone specific branch
git clone -b develop https://github.com/user/repo.git
```

## Basic Workflow

```bash
# Check status
git status

# Stage changes
git add .
# or specific file
git add filename.txt

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin main

# Pull from remote
git pull origin main
```

## Branching

```bash
# Create new branch
git branch feature-branch

# Switch to branch
git checkout feature-branch
# or
git switch feature-branch

# Create and switch in one command
git checkout -b feature-branch
# or
git switch -c feature-branch

# List branches
git branch -a
```

## Merging

```bash
# Switch to main branch
git checkout main

# Merge feature branch
git merge feature-branch

# Delete merged branch
git branch -d feature-branch
```
