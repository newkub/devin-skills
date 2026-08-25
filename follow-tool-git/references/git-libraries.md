# Programmatic API Reference

## Git Libraries by Language

### JavaScript/TypeScript

| Library | Description | bun |
|---------|-------------|-----|
| [simple-git](https://github.com/steveukx/git-js) | Simple Git API | `bun add simple-git` |
| [ isomorphic-git](https://isomorphic-git.org/) | Pure JS implementation | `bun add isomorphic-git` |
| [nodegit](https://www.nodegit.org/) | Native Git bindings | `bun add nodegit` |
| [git-js](https://github.com/steveukx/git-js) | Promise-based Git | `bun add git` |

### simple-git Example

```typescript
import simpleGit from 'simple-git';

const git = simpleGit();

// Clone repository
await git.clone('https://github.com/user/repo.git', './repo');

// Add and commit
await git.add('.');
await git.commit('Initial commit');

// Push
await git.push('origin', 'main');

// Pull with rebase
await git.pull({ '--rebase': null });

// Create and switch branch
await git.checkoutLocalBranch('feature/new-feature');

// Merge branch
await git.merge(['feature/other']);
```

### Python

| Library | Description | pip |
|---------|-------------|-----|
| [GitPython](https://gitpython.readthedocs.io/) | Python Git implementation | `pip install gitpython` |
| [pygit2](https://www.pygit2.org/) | Libgit2 bindings | `pip install pygit2` |
| [dulwich](https://www.dulwich.org/) | Pure Python Git | `pip install dulwich` |

### GitPython Example

```python
from git import Repo

# Clone repository
repo = Repo.clone_from('https://github.com/user/repo.git', './repo')

# Add and commit
repo.index.add(['file.txt'])
repo.index.commit('Initial commit')

# Push
origin = repo.remotes.origin
origin.push()

# Pull
origin.pull()

# Create branch
new_branch = repo.create_head('feature/new-feature')
new_branch.checkout()

# Merge branch
master = repo.heads['main']
master.merge(new_branch)
```

### Go

| Library | Description | import |
|---------|-------------|--------|
| [go-git](https://github.com/go-git/go-git) | Pure Go implementation | `github.com/go-git/go-git/v5` |
| [git2go](https://github.com/libgit2/git2go) | Libgit2 bindings | `github.com/libgit2/git2go/vXX` |

### go-git Example

```go
package main

import (
    "os"
    "github.com/go-git/go-git/v5"
)

func main() {
    // Clone repository
    r, err := git.PlainClone("/tmp/repo", false, &git.CloneOptions{
        URL: "https://github.com/user/repo.git",
    })

    // Worktree
    w, _ := r.Worktree()

    // Add file
    w.Add("file.txt")

    // Commit
    w.Commit("Initial commit", &git.CommitOptions{
        Author: &signature,
    })

    // Push
    r.Push()
}
```

### Rust

| Library | Description | Cargo |
|---------|-------------|-------|
| [git2](https://github.com/rust-lang/git2-rs) | Libgit2 bindings | `git2` |
| [gitoxide](https://github.com/Byron/gitoxide) | Pure Rust implementation | `gitoxide` |

### git2 Example

```rust
use git2::{Repository, Signature};

fn main() -> Result<(), git2::Error> {
    // Clone repository
    let repo = Repository::clone("https://github.com/user/repo.git", "/tmp/repo")?;

    // Get working tree
    let mut index = repo.index()?;
    index.add_all(["*"].iter(), git2::IndexAddOption::Default, None)?;

    // Create signature
    let signature = Signature::now("Name", "email@example.com")?;

    // Commit
    let tree_id = index.write_tree()?;
    let tree = repo.find_tree(tree_id)?;

    let parent = repo.head()?.peel_to_commit()?;
    repo.commit(
        Some("HEAD"),
        &signature,
        &signature,
        "Initial commit",
        &tree,
        &[&parent],
    )?;

    // Push
    let mut remote = repo.find_remote("origin")?;
    remote.push(&["refs/heads/main:refs/heads/main"], None)?;

    Ok(())
}
```

### API Comparison

| Operation | simple-git | GitPython | go-git | git2 |
|-----------|-----------|-----------|--------|------|
| Clone | `git.clone()` | `Repo.clone_from()` | `git.PlainClone()` | `Repository::clone()` |
| Add | `git.add()` | `repo.index.add()` | `w.Add()` | `index.add_all()` |
| Commit | `git.commit()` | `repo.index.commit()` | `w.Commit()` | `repo.commit()` |
| Push | `git.push()` | `origin.push()` | `r.Push()` | `remote.push()` |
| Pull | `git.pull()` | `origin.pull()` | `r.Pull()` | `remote.pull()` |
| Branch | `git.branchLocal()` | `repo.create_head()` | - | `repo.create_branch()` |
| Merge | `git.merge()` | `master.merge()` | - | `repo.merge()` |
| Log | `git.log()` | `repo.iter_commits()` | `r.Log()` | `repo.log()` |

### Common Operations

```typescript
// Get status
const status = await git.status();
console.log(status.modified);

// Get diff
const diff = await git.diff(['--name-only']);
console.log(diff);

// Get branches
const branches = await git.branchLocal();
console.log(branches.all);

// Get remotes
const remotes = await git.getRemotes();
console.log(remotes);

// Fetch all
await git.fetch('origin', { '--all': null });

// Stash
await git.stash(['push', '-m', 'Work in progress']);

// Tag
await git.addTag('v1.0.0');
await git.pushTags();
```

## See Also

- [CLI Reference](git-commands.md) - Command-line interface commands
- [Configuration Reference](git-config.md) - Configuration options
