// check-file-relation — file relation (import graph) scanner + file bundler.
// Modes:
//   graph   (default) file -> imports, resolved or [external]
//   --all            concat every matched file as `===== <path> =====` + content
//   --from <file>    concat only files reachable from entry via imports (deps first)
//   --summary        top imported internal files
//   --json           machine-readable graph
mod args;
mod concat;
mod graph;
mod resolve;
mod walk;

use std::collections::HashMap;
use std::io::Write;
use std::path::{Path, PathBuf};

use args::{open_out, parse_args, Order};
use concat::emit_concat;
use graph::{build_graph, reachable_from, smart_order, topo_order};
use walk::{path_clean, rel, walk};

fn main() {
    let o = parse_args();
    let root = match o.target.canonicalize() {
        Ok(p) => p,
        Err(e) => {
            eprintln!("cannot read {}: {}", o.target.display(), e);
            std::process::exit(1);
        }
    };
    // strip \?\ prefix on Windows for display
    let root = PathBuf::from(root.to_string_lossy().trim_start_matches(r"\?\"));
    let use_exts = o.includes.is_empty();
    let mut files = walk(
        &root,
        if use_exts { Some(&o.exts) } else { None },
        o.no_ignore,
    );
    if !use_exts {
        files.retain(|f| o.includes.is_match(f.strip_prefix(&root).unwrap_or(f)));
        files.sort();
    }

    // basename index over ALL files for literal-filename/custom-pattern resolution
    let mut by_base: HashMap<String, Vec<PathBuf>> = HashMap::new();
    for f in walk(&root, None, o.no_ignore) {
        if let Some(b) = f.file_name().and_then(|n| n.to_str()) {
            by_base.entry(b.to_lowercase()).or_default().push(f);
        }
    }

    let mut out = open_out(&o.out);

    if o.all || o.from.is_some() {
        let graph = build_graph(&root, &files, &o.patterns, &by_base);
        let rel_files: Vec<String> = files.iter().map(|f| rel(&root, f)).collect();
        let ordered: Vec<String> = if let Some(from) = &o.from {
            let entry = path_clean(from);
            let entry = if Path::new(&entry).is_absolute() {
                rel(&root, Path::new(&entry))
            } else {
                entry
            };
            let subset = reachable_from(&entry, &graph);
            match o.order {
                Order::Alpha => {
                    let mut v: Vec<String> = subset.into_iter().collect();
                    v.sort();
                    v
                }
                _ => topo_order(&graph, &subset),
            }
        } else {
            match o.order {
                Order::Alpha => rel_files,
                Order::Deps => topo_order(&graph, &rel_files.iter().cloned().collect()),
                Order::Smart => smart_order(&rel_files, &graph),
            }
        };
        if emit_concat(&ordered, &root, o.max_lines, &mut out).is_err() {
            std::process::exit(1);
        }
        return;
    }

    let graph = build_graph(&root, &files, &o.patterns, &by_base);
    let edge_count: usize = graph.values().map(|e| e.len()).sum();
    let internal: usize = graph
        .values()
        .flatten()
        .filter(|e| e.resolved.is_some())
        .count();

    if o.json {
        let jgraph: serde_json::Map<String, serde_json::Value> = graph
            .iter()
            .map(|(f, edges)| {
                (
                    f.clone(),
                    serde_json::json!(edges
                        .iter()
                        .map(|e| {
                            serde_json::json!({
                                "spec": e.spec,
                                "resolved": e.resolved,
                            })
                        })
                        .collect::<Vec<_>>()),
                )
            })
            .collect();
        let doc = serde_json::json!({
            "root": root.display().to_string(),
            "files": files.len(),
            "edges": edge_count,
            "internal": internal,
            "graph": jgraph,
        });
        writeln!(out, "{}", serde_json::to_string_pretty(&doc).unwrap()).ok();
        return;
    }

    writeln!(
        out,
        "# file-relation — {} files, {} imports ({} resolved to files)\n",
        files.len(),
        edge_count,
        internal
    )
    .ok();
    if !o.summary {
        for (file, edges) in &graph {
            writeln!(out, "## {}", file).ok();
            if edges.is_empty() {
                writeln!(out, "  (no imports)\n").ok();
                continue;
            }
            for e in edges {
                match &e.resolved {
                    Some(r) => writeln!(out, "  → {}", r).ok(),
                    None => writeln!(out, "  → [external] {}", e.spec).ok(),
                };
            }
            writeln!(out).ok();
        }
    } else {
        let mut imported_by: HashMap<&String, usize> = HashMap::new();
        for edges in graph.values() {
            for e in edges {
                if let Some(r) = &e.resolved {
                    *imported_by.entry(r).or_default() += 1;
                }
            }
        }
        let mut top: Vec<(&String, usize)> = imported_by.into_iter().collect();
        top.sort_by(|a, b| b.1.cmp(&a.1));
        writeln!(out, "## Most imported internal files").ok();
        for (f, n) in top.iter().take(15) {
            writeln!(out, "  {}× {}", n, f).ok();
        }
    }
}
