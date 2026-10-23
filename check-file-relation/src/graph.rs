use std::collections::{BTreeMap, HashMap, HashSet, VecDeque};
use std::fs;
use std::path::{Path, PathBuf};

use regex::Regex;

use crate::resolve::resolve_rel;
use crate::walk::rel;

#[derive(Clone)]
pub(crate) struct Edge {
    pub(crate) spec: String,
    pub(crate) resolved: Option<String>,
}

fn extractors_for(ext: &str) -> Vec<Regex> {
    let pats: &[&str] = match ext {
        "ts" | "tsx" | "js" | "jsx" | "mts" | "cts" | "vue" | "svelte" => &[
            r#"import(?:\s+type)?(?:[\s\S]*?)from\s+['"]([^'"]+)['"]"#,
            r#"import\s*['"]([^'"]+)['"]"#,
            r#"require\(\s*['"]([^'"]+)['"]\s*\)"#,
            r#"import\(\s*['"]([^'"]+)['"]\s*\)"#,
            r#"export[\s\S]*?from\s+['"]([^'"]+)['"]"#,
        ],
        "go" => &[r#"import\s+(?:\(\s*)?["']([^"']+)["']"#],
        "rs" => &[r"\buse\s+([a-zA-Z_][\w:]*)", r"\bmod\s+([a-zA-Z_]\w*)\s*;"],
        "py" => &[
            r"(?m)^\s*import\s+([\w.]+)",
            r"(?m)^\s*from\s+([\w.]+)\s+import",
        ],
        "java" => &[r"(?m)^\s*import\s+(?:static\s+)?([\w.]+)"],
        "kt" | "kts" => &[r"(?m)^\s*import\s+([\w.]+)"],
        "cs" => &[r"(?m)^\s*using\s+([\w.]+)"],
        _ => &[],
    };
    pats.iter().filter_map(|p| Regex::new(p).ok()).collect()
}

fn extract(
    file: &Path,
    root: &Path,
    custom: &[Regex],
    by_base: &HashMap<String, Vec<PathBuf>>,
    cache: &mut HashMap<String, Vec<Regex>>,
) -> Vec<Edge> {
    let ext = file
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();
    let builtins = cache
        .entry(ext.clone())
        .or_insert_with(|| extractors_for(&ext));
    let content = match fs::read_to_string(file) {
        Ok(c) => c,
        Err(_) => return Vec::new(),
    };
    let mut specs = HashSet::new();
    for re in builtins.iter().chain(custom.iter()) {
        for m in re.captures_iter(&content) {
            if let Some(g) = m.get(1) {
                specs.insert(g.as_str().to_string());
            }
        }
    }
    let rel_self = rel(root, file);
    let mut seen = HashSet::new();
    specs
        .into_iter()
        .map(|spec| Edge {
            resolved: resolve_rel(&spec, file, root, by_base),
            spec,
        })
        .filter(|e| match &e.resolved {
            None => true,
            Some(r) => {
                if *r == rel_self || seen.contains(r) {
                    false
                } else {
                    seen.insert(r.clone());
                    true
                }
            }
        })
        .collect()
}

pub(crate) fn build_graph(
    root: &Path,
    files: &[PathBuf],
    custom: &[Regex],
    by_base: &HashMap<String, Vec<PathBuf>>,
) -> BTreeMap<String, Vec<Edge>> {
    let mut graph = BTreeMap::new();
    let mut cache: HashMap<String, Vec<Regex>> = HashMap::new();
    for f in files {
        graph.insert(rel(root, f), extract(f, root, custom, by_base, &mut cache));
    }
    graph
}

pub(crate) fn topo_order(
    graph: &BTreeMap<String, Vec<Edge>>,
    subset: &HashSet<String>,
) -> Vec<String> {
    // DFS post-order: dependencies emitted before dependents. Cycles broken by alpha fallback.
    let mut order = Vec::new();
    let mut visited: HashSet<String> = HashSet::new();
    let mut stack: HashSet<String> = HashSet::new();
    let mut nodes: Vec<&String> = subset.iter().collect();
    nodes.sort();
    fn dfs(
        node: &str,
        graph: &BTreeMap<String, Vec<Edge>>,
        subset: &HashSet<String>,
        visited: &mut HashSet<String>,
        stack: &mut HashSet<String>,
        order: &mut Vec<String>,
    ) {
        if visited.contains(node) || stack.contains(node) {
            return;
        }
        stack.insert(node.to_string());
        if let Some(edges) = graph.get(node) {
            let mut deps: Vec<&String> = edges
                .iter()
                .filter_map(|e| e.resolved.as_ref())
                .filter(|r| subset.contains(*r))
                .collect();
            deps.sort();
            for d in deps {
                dfs(d, graph, subset, visited, stack, order);
            }
        }
        stack.remove(node);
        visited.insert(node.to_string());
        order.push(node.to_string());
    }
    for n in nodes {
        dfs(n, graph, subset, &mut visited, &mut stack, &mut order);
    }
    order
}

pub(crate) fn reachable_from(
    entry: &str,
    graph: &BTreeMap<String, Vec<Edge>>,
) -> HashSet<String> {
    let mut seen = HashSet::from([entry.to_string()]);
    let mut queue = VecDeque::from([entry.to_string()]);
    while let Some(n) = queue.pop_front() {
        if let Some(edges) = graph.get(&n) {
            for e in edges {
                if let Some(r) = &e.resolved {
                    if seen.insert(r.clone()) {
                        queue.push_back(r.clone());
                    }
                }
            }
        }
    }
    seen
}

pub(crate) fn smart_order(files: &[String], graph: &BTreeMap<String, Vec<Edge>>) -> Vec<String> {
    let is_config = |f: &str| {
        let base = f.rsplit('/').next().unwrap_or(f);
        (base.contains(".config.")
            || matches!(base, "package.json" | "Cargo.toml" | "tsconfig.json")
            || base.starts_with("tsconfig")
            || (base.ends_with(".toml") || base.ends_with(".json")) && !f.contains('/'))
            && !f.contains('/')
    };
    let is_entry = |f: &str| {
        let base = f.rsplit('/').next().unwrap_or(f);
        base.starts_with("index.")
            || base.starts_with("main.")
            || matches!(
                base,
                "lib.rs" | "mod.rs" | "__init__.py" | "app.ts" | "app.js"
            )
    };
    let mut configs: Vec<String> = Vec::new();
    let mut entries: Vec<String> = Vec::new();
    let mut rest: Vec<String> = Vec::new();
    for f in files {
        if is_config(f) {
            configs.push(f.clone());
        } else if is_entry(f) {
            entries.push(f.clone());
        } else {
            rest.push(f.clone());
        }
    }
    configs.sort();
    entries.sort();
    let subset: HashSet<String> = rest.iter().cloned().collect();
    let ordered_rest = topo_order(graph, &subset);
    configs
        .into_iter()
        .chain(entries)
        .chain(ordered_rest)
        .collect()
}
