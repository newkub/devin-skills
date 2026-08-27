
# Global Workflows — License & Contribution

> Part of [sample-readme-overview.md](sample-readme-overview.md)

## MIT License

LICENSE.md

- Free to use
- Modify
- Distribute

## Contribution

### 1. Setup

1. Fork the repository
2. Clone your fork locally

```bash
git clone https://github.com/YOUR_USERNAME/global_workflows.git
cd global_workflows
```

3. Add upstream remote

```bash
git remote add upstream https://github.com/newkub/global_workflows.git
```

### 2. Development

1. Create a new branch for your workflow

```bash
git checkout -b feature/my-workflow
```

2. Follow `/update-devin-global-skills` for workflow structure
3. Follow `/review-writing` for content standards
4. Test workflows thoroughly before submitting
5. Commit your changes

```bash
git add .
git commit -m "Add: my-workflow description"
```

### 3. Submit PR

1. Push your branch to your fork

```bash
git push origin feature/my-workflow
```

2. Create a Pull Request on GitHub
3. Update this README with new workflow descriptions
4. Wait for review and merge

### 4. Sync

1. After merge, sync your fork with upstream

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```
