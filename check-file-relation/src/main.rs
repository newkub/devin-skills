// check-file-relation — file relation (import graph) scanner + file bundler.
// Modes:
//   graph   (default) file -> imports, resolved or [external]
//   --all            concat every matched file as `===== <path> =====` + content
//   --from <file>    concat only files reachable from entry via imports (deps first)
//   --summary        top imported internal files
//   --json           machine-readable graph
use std::collections::{BTreeMap, HashMap, HashSet, VecDeque};
use std::env;
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};

use globset::{Glob, GlobSet, GlobSetBuilder};
use ignore::WalkBuilder;
use regex::Regex;

const DEFAULT_EXTS: &[&str] = &[
    "ts", "tsx", "js", "jsx", "mts", "cts", "rs", "go", "py", "java", "kt", "kts", "cs", "vue",
    "svelte",
];

const IGNORE_DIRS: &[&str] = &[
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

const RESOLVE_EXTS: &[&str] = &[
    ".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".rs", ".go", ".py", ".java", ".kt", ".cs",
    ".vue", ".svelte",
];

const INDEX_FILES: &[&str] = &[
    "index.ts",
    "index.tsx",
    "index.js",
    "mod.rs",
    "lib.rs",
    "__init__.py",
];

#[derive(Clone)]
struct Edge {
    spec: String,
    resolved: Option<String>,
}

struct Opts {
    target: PathBuf,
    exts: HashSet<String>,
    patterns: Vec<Regex>,
    all: bool,
    from: Option<PathBuf>,
    json: bool,
    summary: bool,
    no_ignore: bool,
    order: Order,
    max_lines: Option<usize>,
    out: Option<PathBuf>,
    includes: GlobSet,
}

#[derive(Clone, Copy, PartialEq)]
enum Order {
    Alpha,
    Deps,
    Smart,
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

fn walk(root: &Path, exts: Option<&HashSet<String>>, no_ignore: bool) -> Vec<PathBuf> {
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

fn rel(root: &Path, p: &Path) -> String {
    path_clean(&p.strip_prefix(root).unwrap_or(p).to_path_buf())
}

fn path_clean(p: &Path) -> String {
    p.to_string_lossy().replace('\\', "/")
}

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

fn resolve_rel(
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

fn build_graph(
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

fn topo_order(graph: &BTreeMap<String, Vec<Edge>>, subset: &HashSet<String>) -> Vec<String> {
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

fn reachable_from(entry: &str, graph: &BTreeMap<String, Vec<Edge>>) -> HashSet<String> {
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

fn smart_order(files: &[String], graph: &BTreeMap<String, Vec<Edge>>) -> Vec<String> {
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

fn emit_concat(
    paths: &[String],
    root: &Path,
    max_lines: Option<usize>,
    out: &mut dyn Write,
) -> std::io::Result<()> {
    for rel_path in paths {
        writeln!(out, "===== {} =====", rel_path)?;
        let full = root.join(rel_path.replace('/', std::path::MAIN_SEPARATOR_STR));
        match fs::read_to_string(&full) {
            Ok(content) => {
                if let Some(max) = max_lines {
                    let mut count = 0;
                    for line in content.lines() {
                        if count >= max {
                            writeln!(out, "… (truncated at {} lines)", max)?;
                            break;
                        }
                        writeln!(out, "{}", line)?;
                        count += 1;
                    }
                } else {
                    out.write_all(content.as_bytes())?;
                    if !content.ends_with('\n') {
                        writeln!(out)?;
                    }
                }
            }
            Err(e) => writeln!(out, "(unreadable: {})", e)?,
        }
    }
    Ok(())
}

fn usage() -> ! {
    eprintln!(
        "check-file-relation <dir> [options]

Modes:
  (default)            relation map: file -> imports (resolved or [external])
  --all                concat every matched file: ===== <path> ===== + content
  --from <file>        concat only files reachable from <file> via imports (deps first)
  --summary            stats only: most imported internal files
  --json               machine-readable graph JSON

Options:
  --ext <csv>          extensions (default: ts,tsx,js,jsx,mts,cts,rs,go,py,java,kt,kts,cs,vue,svelte)
  --include <glob>     only files matching glob vs root-rel path (repeatable, csv ok;
                       overrides --ext so non-source files like *.json match too)
  --pattern <regex>    custom import regex, first capture group = specifier (repeatable)
  --order <mode>       concat order: alpha | deps (import topo) | smart (config->entry->deps->rest)
  --max-lines <n>      truncate each file in concat modes
  --no-ignore          also scan node_modules/.git/target/dist/...
  --out <file>         write output to file instead of stdout
  -h, --help           this help"
    );
    std::process::exit(2);
}

fn parse_args() -> Opts {
    let args: Vec<String> = env::args().skip(1).collect();
    let mut o = Opts {
        target: PathBuf::from("."),
        exts: DEFAULT_EXTS.iter().map(|s| s.to_string()).collect(),
        patterns: Vec::new(),
        all: false,
        from: None,
        json: false,
        summary: false,
        no_ignore: false,
        order: Order::Alpha,
        max_lines: None,
        out: None,
        includes: GlobSet::empty(),
    };
    let mut inc_builder = GlobSetBuilder::new();
    let mut order_set = false;
    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "-h" | "--help" => usage(),
            "--all" => o.all = true,
            "--json" => o.json = true,
            "--summary" => o.summary = true,
            "--no-ignore" => o.no_ignore = true,
            "--ext" => {
                i += 1;
                o.exts = args
                    .get(i)
                    .unwrap_or_else(|| usage())
                    .split(',')
                    .map(|e| e.trim_start_matches('.').to_lowercase())
                    .collect();
            }
            "--include" => {
                i += 1;
                for part in args.get(i).unwrap_or_else(|| usage()).split(',') {
                    match Glob::new(part.trim()) {
                        Ok(g) => {
                            inc_builder.add(g);
                        }
                        Err(e) => {
                            eprintln!("invalid --include '{}': {}", part, e);
                            std::process::exit(2);
                        }
                    }
                }
            }
            "--pattern" => {
                i += 1;
                let p = args.get(i).unwrap_or_else(|| usage());
                match Regex::new(p) {
                    Ok(r) => o.patterns.push(r),
                    Err(e) => {
                        eprintln!("invalid --pattern '{}': {}", p, e);
                        std::process::exit(2);
                    }
                }
            }
            "--from" => {
                i += 1;
                o.from = Some(PathBuf::from(args.get(i).unwrap_or_else(|| usage())));
                if !order_set {
                    o.order = Order::Deps;
                }
            }
            "--order" => {
                i += 1;
                order_set = true;
                o.order = match args.get(i).map(|s| s.as_str()) {
                    Some("alpha") => Order::Alpha,
                    Some("deps") => Order::Deps,
                    Some("smart") => Order::Smart,
                    other => {
                        eprintln!("invalid --order {:?} (alpha|deps|smart)", other);
                        std::process::exit(2);
                    }
                };
            }
            "--max-lines" => {
                i += 1;
                o.max_lines = args.get(i).and_then(|s| s.parse().ok());
            }
            "--out" => {
                i += 1;
                o.out = Some(PathBuf::from(args.get(i).unwrap_or_else(|| usage())));
            }
            a if a.starts_with("--") => {
                eprintln!("unknown flag: {}", a);
                usage();
            }
            a => o.target = PathBuf::from(a),
        }
        i += 1;
    }
    o.includes = inc_builder.build().unwrap_or_else(|_| GlobSet::empty());
    o
}

fn open_out(out: &Option<PathBuf>) -> Box<dyn Write> {
    match out {
        Some(p) => Box::new(std::io::BufWriter::new(fs::File::create(p).unwrap_or_else(
            |e| {
                eprintln!("cannot create {}: {}", p.display(), e);
                std::process::exit(1)
            },
        ))),
        None => Box::new(std::io::BufWriter::new(std::io::stdout())),
    }
}

fn main() {
    let o = parse_args();
    let root = match o.target.canonicalize() {
        Ok(p) => p,
        Err(e) => {
            eprintln!("cannot read {}: {}", o.target.display(), e);
            std::process::exit(1);
        }
    };
    // strip \\?\ prefix on Windows for display
    let root = PathBuf::from(root.to_string_lossy().trim_start_matches(r"\\?\"));
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
