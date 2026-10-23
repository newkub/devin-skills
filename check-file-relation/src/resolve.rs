use std::collections::HashMap;
use std::path::{Path, PathBuf};

use crate::walk::{rel, INDEX_FILES, RESOLVE_EXTS};

// Normalize `.`/`..` segments without touching the filesystem.
fn normalize(p: &Path) -> PathBuf {
    let mut out = PathBuf::new();
    for c in p.components() {
        match c {
            std::path::Component::CurDir => {}
            std::path::Component::ParentDir => {
                out.pop();
            }
            other => out.push(other),
        }
    }
    out
}

fn find_src_root(root: &Path) -> PathBuf {
    let s = root.join("src");
    if s.is_dir() {
        s
    } else {
        root.to_path_buf()
    }
}

fn try_file(p: &Path, with_index: bool) -> Option<PathBuf> {
    for ext in RESOLVE_EXTS {
        let cand = p.with_extension(&ext[1..]);
        // p.with_extension replaces existing ext — also try appending for extless spec
        let cand2 = PathBuf::from(format!("{}{}", p.display(), ext));
        for c in [cand, cand2] {
            if c.is_file() {
                return Some(c);
            }
        }
    }
    if p.is_file() {
        return Some(p.to_path_buf());
    }
    if with_index && p.is_dir() {
        for idx in INDEX_FILES {
            let f = p.join(idx);
            if f.is_file() {
                return Some(f);
            }
        }
    }
    None
}

fn candidates(
    spec: &str,
    from_file: &Path,
    root: &Path,
    by_base: &HashMap<String, Vec<PathBuf>>,
) -> Vec<PathBuf> {
    let dir = from_file.parent().unwrap_or(root).to_path_buf();
    let src_root = find_src_root(root);
    let mut out = Vec::new();
    if spec.starts_with("./") || spec.starts_with("../") {
        out.push(dir.join(spec));
    } else if let Some(rest) = spec.strip_prefix("@/").or_else(|| spec.strip_prefix("~/")) {
        out.push(src_root.join(rest));
    } else if spec.contains("::") {
        let parts: Vec<&str> = spec.split("::").filter(|s| !s.is_empty()).collect();
        let tail: PathBuf = parts[1..].iter().collect();
        match parts[0] {
            "crate" => out.push(src_root.join(&tail)),
            "super" => {
                out.push(dir.join(&tail));
                if let Some(up) = dir.parent() {
                    out.push(up.join(&tail));
                }
            }
            "self" => out.push(dir.join(&tail)),
            first => {
                // `use foo::bar` — resolve only if `foo` is a local module; else external crate
                'outer: for base in [&dir, &src_root] {
                    for suffix in [".rs", "/mod.rs"] {
                        let m = base.join(format!("{}{}", first, suffix));
                        if m.is_file() {
                            out.push(m);
                            break 'outer;
                        }
                    }
                }
            }
        }
    } else if spec.contains('.') && !spec.contains('/') {
        if let Some(hits) = by_base.get(&spec.to_lowercase()) {
            out.extend(hits.iter().cloned());
        } else {
            let p: PathBuf = spec.split('.').collect();
            out.push(dir.join(&p));
            out.push(root.join(&p));
            out.push(src_root.join(&p));
        }
    } else if !spec.contains('/') {
        out.push(dir.join(spec));
        out.push(src_root.join(spec));
        if let Some(hits) = by_base.get(&spec.to_lowercase()) {
            out.extend(hits.iter().cloned());
        }
    }
    out
}

pub(crate) fn resolve_rel(
    spec: &str,
    from_file: &Path,
    root: &Path,
    by_base: &HashMap<String, Vec<PathBuf>>,
) -> Option<String> {
    let may_strip = spec.contains("::")
        && (spec.starts_with("crate::")
            || spec.starts_with("self::")
            || spec.starts_with("super::"));
    for cand0 in candidates(spec, from_file, root, by_base) {
        let mut cand = cand0.clone();
        loop {
            if let Some(hit) = try_file(&cand, cand == cand0) {
                return Some(rel(root, &normalize(&hit)));
            }
            if !may_strip {
                break;
            }
            match cand.parent() {
                Some(parent) if parent != cand && parent != Path::new("") => {
                    if parent == root.parent().unwrap_or(root) && !cand.starts_with(root) {
                        break;
                    }
                    cand = parent.to_path_buf();
                }
                _ => break,
            }
        }
    }
    None
}
