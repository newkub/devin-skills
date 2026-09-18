//! cleanup-artifact — scan and remove build artifacts and dependency caches.
//!
//! Usage: cleanup-artifact [path] [--yes] [--deep] [--min <MB>]
//!   [path]      root to scan (default: current directory)
//!   --yes       actually delete (default is dry-run)
//!   --deep      also scan global caches (~/.bun, ~/.cargo/registry, pip, ...)
//!   --min <MB>  only report/delete dirs at least this size (default: 0)

use std::env;
use std::fs;
use std::path::{Path, PathBuf};

/// Artifact directory names removed unconditionally (exact match).
const ARTIFACT_DIRS: &[&str] = &[
    "node_modules",
    "target",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".output",
    ".svelte-kit",
    ".turbo",
    ".vercel",
    ".parcel-cache",
    ".vite",
    "coverage",
    "storybook-static",
    "__pycache__",
    ".venv",
    "venv",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".tox",
    ".nox",
    ".gradle",
    ".build",
    "zig-out",
    ".zig-cache",
    "Pods",
    "DerivedData",
];

/// Directories never descended into or deleted.
const SKIP_DIRS: &[&str] = &[".git", ".svn", ".hg", ".devin", ".idea", ".vscode"];

struct Hit {
    path: PathBuf,
    size: u64,
}

fn human(n: u64) -> String {
    const U: [&str; 5] = ["B", "KB", "MB", "GB", "TB"];
    let mut v = n as f64;
    let mut i = 0;
    while v >= 1024.0 && i < U.len() - 1 {
        v /= 1024.0;
        i += 1;
    }
    format!("{:.1}{}", v, U[i])
}

/// Names like `bin`, `obj` are too generic — only artifacts when the parent
/// holds a .NET/VC++ project file.
fn is_guarded_dotnet_dir(name: &str, parent: &Path) -> bool {
    if !matches!(name, "bin" | "obj") {
        return false;
    }
    if let Ok(rd) = fs::read_dir(parent) {
        return rd.flatten().any(|e| {
            let n = e.file_name();
            let n = n.to_string_lossy();
            n.ends_with(".csproj")
                || n.ends_with(".fsproj")
                || n.ends_with(".vcxproj")
                || n.ends_with(".sln")
        });
    }
    false
}

fn is_artifact_dir(name: &str, parent: &Path) -> bool {
    ARTIFACT_DIRS.contains(&name)
        || name.ends_with(".egg-info")
        || name.starts_with("cmake-build-")
        || is_guarded_dotnet_dir(name, parent)
}

/// Sum file sizes under `dir` without following symlinks.
fn dir_size(dir: &Path) -> u64 {
    let mut total = 0u64;
    let mut stack = vec![dir.to_path_buf()];
    while let Some(d) = stack.pop() {
        if let Ok(rd) = fs::read_dir(&d) {
            for e in rd.flatten() {
                let Ok(ft) = e.file_type() else { continue };
                if ft.is_symlink() {
                    continue;
                }
                if ft.is_dir() {
                    stack.push(e.path());
                } else if let Ok(m) = e.metadata() {
                    total = total.saturating_add(m.len());
                }
            }
        }
    }
    total
}

/// Recursively collect artifact dirs under `root`; never descends into a hit.
fn scan(root: &Path, hits: &mut Vec<Hit>) {
    let Ok(rd) = fs::read_dir(root) else { return };
    for e in rd.flatten() {
        let Ok(ft) = e.file_type() else { continue };
        if ft.is_symlink() || !ft.is_dir() {
            continue;
        }
        let name = e.file_name();
        let name = name.to_string_lossy();
        if SKIP_DIRS.contains(&name.as_ref()) {
            continue;
        }
        if is_artifact_dir(&name, root) {
            hits.push(Hit {
                path: e.path(),
                size: dir_size(&e.path()),
            });
            continue; // do not descend — nested artifacts are inside the hit
        }
        scan(&e.path(), hits);
    }
}

/// Global caches — only reported/deleted with --deep.
fn deep_hits() -> Vec<Hit> {
    let Some(home) = env::var_os(if cfg!(windows) { "USERPROFILE" } else { "HOME" })
        .map(PathBuf::from)
    else {
        return vec![];
    };
    let local = env::var_os("LOCALAPPDATA")
        .map(PathBuf::from)
        .unwrap_or_else(|| home.join(".cache"));
    let candidates = [
        home.join(".bun/install/cache"),
        home.join(".npm"),
        home.join(".cargo/registry"),
        home.join(".cargo/git"),
        home.join("go/pkg/mod"),
        home.join(".cache/pip"),
        home.join("Library/Caches/pip"),
        home.join(".local/share/pnpm/store"),
        home.join(".m2/repository"),
        home.join(".gradle/caches"),
        home.join("Library/Developer/Xcode/DerivedData"),
        local.join("pip/cache"),
    ];
    candidates
        .iter()
        .filter(|p| p.is_dir())
        .map(|p| Hit {
            path: p.clone(),
            size: dir_size(p),
        })
        .collect()
}

fn print_table(hits: &[Hit], root: &Path) -> u64 {
    let mut total = 0u64;
    for (i, h) in hits.iter().enumerate() {
        let rel = h
            .path
            .strip_prefix(root)
            .map(|r| r.display().to_string())
            .unwrap_or_else(|_| h.path.display().to_string());
        println!("{:>3}. {:>10}  {}", i + 1, human(h.size), rel);
        total += h.size;
    }
    println!("\n{} dirs — total {}", hits.len(), human(total));
    total
}

fn main() {
    let mut root = PathBuf::from(".");
    let mut yes = false;
    let mut deep = false;
    let mut min: u64 = 0;
    let mut args = env::args().skip(1);
    while let Some(a) = args.next() {
        match a.as_str() {
            "--yes" | "-y" => yes = true,
            "--deep" => deep = true,
            "--min" => {
                min = args
                    .next()
                    .and_then(|v| v.parse::<u64>().ok())
                    .unwrap_or(0)
                    .saturating_mul(1024 * 1024);
            }
            "--help" | "-h" => {
                println!("cleanup-artifact [path] [--yes] [--deep] [--min <MB>]");
                println!("  [path]     root to scan (default: .)");
                println!("  --yes      delete (default: dry-run report only)");
                println!("  --deep     include global caches (~/.bun, ~/.cargo/registry, pip, ...)");
                println!("  --min MB   only dirs at least MB in size");
                return;
            }
            _ if !a.starts_with('-') => root = PathBuf::from(&a),
            _ => {
                eprintln!("unknown flag: {a} (see --help)");
                std::process::exit(2);
            }
        }
    }

    let root = fs::canonicalize(&root).unwrap_or(root);
    let mut hits = Vec::new();
    scan(&root, &mut hits);
    if deep {
        hits.extend(deep_hits());
    }
    hits.retain(|h| h.size >= min);
    hits.sort_by(|a, b| b.size.cmp(&a.size));

    if hits.is_empty() {
        println!("no artifact dirs found under {}", root.display());
        return;
    }

    let total = print_table(&hits, &root);
    if !yes {
        println!("dry-run — rerun with --yes to delete");
        return;
    }

    let mut freed = 0u64;
    for h in &hits {
        match fs::remove_dir_all(&h.path) {
            Ok(()) => {
                freed += h.size;
                println!("removed {}", h.path.display());
            }
            Err(e) => eprintln!("failed {}: {}", h.path.display(), e),
        }
    }
    println!("\nfreed {} of {}", human(freed), human(total));
}
