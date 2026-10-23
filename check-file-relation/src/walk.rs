use std::collections::HashSet;
use std::path::{Path, PathBuf};

use ignore::WalkBuilder;

pub(crate) const DEFAULT_EXTS: &[&str] = &[
    "ts", "tsx", "js", "jsx", "mts", "cts", "rs", "go", "py", "java", "kt", "kts", "cs", "vue",
    "svelte",
];

pub(crate) const IGNORE_DIRS: &[&str] = &[
    "node_modules",
    ".git",
    "target",
    "dist",
    "build",
    "out",
    ".next",
    "nuxt",
    ".svelte-kit",
    "coverage",
    ".output",
    "vendor",
    "__pycache__",
];

pub(crate) const RESOLVE_EXTS: &[&str] = &[
    ".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".rs", ".go", ".py", ".java", ".kt", ".cs",
    ".vue", ".svelte",
];

pub(crate) const INDEX_FILES: &[&str] = &[
    "index.ts",
    "index.tsx",
    "index.js",
    "mod.rs",
    "lib.rs",
    "__init__.py",
];

pub(crate) fn walk(root: &Path, exts: Option<&HashSet<String>>, no_ignore: bool) -> Vec<PathBuf> {
    let mut out = Vec::new();
    let builder = WalkBuilder::new(root)
        .require_git(false)
        .hidden(false)
        .build();
    for entry in builder.flatten() {
        let ft = match entry.file_type() {
            Some(f) => f,
            None => continue,
        };
        let path = entry.path();
        if ft.is_dir() {
            if !no_ignore && path != root {
                if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                    if IGNORE_DIRS.contains(&name) {
                        continue;
                    }
                }
            }
            continue;
        }
        if !ft.is_file() {
            continue;
        }
        if !no_ignore {
            if path.components().any(|c| {
                c.as_os_str()
                    .to_str()
                    .map(|s| IGNORE_DIRS.contains(&s))
                    .unwrap_or(false)
            }) {
                continue;
            }
        }
        if let Some(set) = exts {
            let e = path
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("")
                .to_lowercase();
            if !set.contains(&e) {
                continue;
            }
        }
        out.push(path.to_path_buf());
    }
    out.sort();
    out
}

pub(crate) fn rel(root: &Path, p: &Path) -> String {
    path_clean(&p.strip_prefix(root).unwrap_or(p).to_path_buf())
}

pub(crate) fn path_clean(p: &Path) -> String {
    p.to_string_lossy().replace('\\', "/")
}
