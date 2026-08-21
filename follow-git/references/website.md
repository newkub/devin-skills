# Website Reference

## Official Resources

| Resource | URL |
|----------|-----|
| Official Website | https://git-scm.com |
| Documentation | https://git-scm.com/docs |
| Book (Pro Git) | https://git-scm.com/book |
| Download | https://git-scm.com/downloads |

## Community Resources

| Resource | URL |
|----------|-----|
| GitHub | https://github.com/git/git |
| Stack Overflow | https://stackoverflow.com/questions/tagged/git |
| Git Tips | https://github.com/git-tips/tips |

## Learning Resources

| Resource | Description |
|----------|-------------|
| [Pro Git Book](https://git-scm.com/book) | Free online book by Scott Chacon |
| [Git Cheat Sheet](https://training.github.com/downloads/github-git-cheat-sheet/) | Quick reference sheet |
| [Visual Git Guide](https://marklodato.github.io/visual-git-guide/index-en.html) | Visual explanations |
| [Learn Git Branching](https://learngitbranching.js.org/) | Interactive tutorial |

## Related Tools

| Tool | Description | Website |
|------|-------------|---------|
| GitHub CLI | GitHub command line tool | https://cli.github.com |
| gh | GitHub CLI (alternate) | `brew install gh` |
| GitLab CLI | GitLab command line tool | https://gitlab.com |
| lazygit | Terminal UI for Git | https://github.com/jesseduffield/lazygit |
| tig | Text-mode interface for Git | https://github.com/jonas/tig |
| SourceTree | Free Git GUI | https://www.sourcetreeapp.com |
| GitKraken | Git GUI client | https://www.gitkraken.com |
| Fork | Git GUI for Windows/Mac | https://git-fork.com |

## Configuration

### Global Gitignore

```bash
# สร้าง global .gitignore
git config --global core.excludesfile ~/.gitignore_global

# หรือเพิ่มใน ~/.gitignore
echo ".DS_Store" >> ~/.gitignore
echo "*.log" >> ~/.gitignore
```

### Credential Helpers

| Helper | Command |
|--------|---------|
| Cache (15 min) | `git config --global credential.helper cache` |
| Store | `git config --global credential.helper store` |
| macOS Keychain | `git config --global credential.helper osxkeychain` |
| Windows | `git config --global credential.helper manager` |
| libsecret (Linux) | `git config --global credential.helper libsecret` |
