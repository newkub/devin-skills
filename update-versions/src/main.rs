//! update-versions — one-shot dependency/runtime/tool version updater.
//!
//! Usage: update-versions [path] [--yes] [--level patch|minor|latest] [--skip-verify] [--no-actions]
//!   [path]        repo root (default: .)
//!   --yes         apply updates (default: dry-run detect + report only)
//!   --level       patch | minor | latest (default: latest — bumps to newest incl. major)
//!   --skip-verify skip post-update build/check verification
//!   --no-actions  skip GitHub Actions version updates

use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

const SKIP_DIRS: &[&str] = &[
    ".git", "node_modules", "target", "dist", ".next", ".venv", "vendor", ".devin", "bin", "obj",
];

#[derive(Clone, Copy, PartialEq, Debug)]
enum Level {
    Patch,
    Minor,
    Latest,
}

struct Repo {
    root: PathBuf,
    bun: Vec<PathBuf>,     // dirs containing package.json
    cargo: Vec<PathBuf>,   // dirs containing Cargo.toml
    go: Vec<PathBuf>,      // dirs containing go.mod
    python: Vec<PathBuf>,  // dirs containing pyproject.toml or requirements.txt
    mise: Vec<PathBuf>,    // mise.toml / .tool-versions files
    actions: Vec<PathBuf>, // workflow yml files
    docker: Vec<PathBuf>,  // Dockerfiles
}

fn is_dir(e: &fs::DirEntry) -> bool {
    e.file_type().map(|t| t.is_dir() && !t.is_symlink()).unwrap_or(false)
}

fn detect(root: &Path) -> Repo {
    let mut r = Repo {
        root: root.to_path_buf(),
        bun: vec![], cargo: vec![], go: vec![], python: vec![], mise: vec![], actions: vec![], docker: vec![],
    };
    let mut stack = vec![root.to_path_buf()];
    while let Some(d) = stack.pop() {
        let Ok(rd) = fs::read_dir(&d) else { continue };
        let mut has_pkg = false;
        let mut has_cargo = false;
        let mut has_go = false;
        let mut has_py = false;
        for e in rd.flatten() {
            let name = e.file_name();
            let name = name.to_string_lossy().to_string();
            if is_dir(&e) {
                if !SKIP_DIRS.contains(&name.as_str()) && !name.starts_with('.') {
                    stack.push(e.path());
                } else if name == ".github" {
                    stack.push(e.path()); // still need workflows
                }
                continue;
            }
            match name.as_str() {
                "package.json" => has_pkg = true,
                "Cargo.toml" => has_cargo = true,
                "go.mod" => has_go = true,
                "pyproject.toml" | "requirements.txt" | "requirements-dev.txt" => has_py = true,
                "mise.toml" | ".mise.toml" | ".tool-versions" => r.mise.push(e.path()),
                "Dockerfile" | "Containerfile" => r.docker.push(e.path()),
                _ => {
                    if e.path().to_string_lossy().contains(".github/workflows")
                        && (name.ends_with(".yml") || name.ends_with(".yaml"))
                    {
                        r.actions.push(e.path());
                    }
                }
            }
        }
        if has_pkg {
            r.bun.push(d.clone());
        }
        if has_cargo {
            r.cargo.push(d.clone());
        }
        if has_go {
            r.go.push(d.clone());
        }
        if has_py {
            r.python.push(d.clone());
        }
    }
    r
}

// ---------- version snapshot parsing ----------

fn semverish(s: &str) -> bool {
    let core = s.trim_start_matches(['~', '^', '>', '<', '=', 'v', ' ']);
    let mut it = core.split('.');
    matches!(it.next(), Some(m) if !m.is_empty() && m.chars().all(|c| c.is_ascii_digit()))
        && matches!(it.next(), Some(m) if m.chars().all(|c| c.is_ascii_digit()))
        && matches!(it.next(), Some(m) if m.chars().take_while(|c| c.is_ascii_digit()).count() > 0)
}

fn snap_package_json(path: &Path, out: &mut Vec<(String, String, PathBuf)>) {
    let Ok(text) = fs::read_to_string(path) else { return };
    for line in text.lines() {
        let l = line.trim();
        let Some(rest) = l.strip_prefix('"') else { continue };
        let Some(q) = rest.find('"') else { continue };
        let name = &rest[..q];
        let Some(colon) = rest[q + 1..].find(':') else { continue };
        let after = rest[q + 1 + colon + 1..].trim_start();
        let Some(v) = after.strip_prefix('"') else { continue };
        let Some(end) = v.find('"') else { continue };
        let ver = &v[..end];
        if semverish(ver) && !["name", "version", "private", "type", "main", "module"].contains(&name) {
            out.push((name.to_string(), ver.to_string(), path.to_path_buf()));
        }
    }
}

fn snap_cargo(path: &Path, out: &mut Vec<(String, String, PathBuf)>) {
    let Ok(text) = fs::read_to_string(path) else { return };
    let mut in_deps = false;
    for line in text.lines() {
        let l = line.trim();
        if l.starts_with('[') {
            in_deps = l.contains("dependencies");
            continue;
        }
        if !in_deps || l.starts_with('#') {
            continue;
        }
        // dep = "1.2.3"  |  dep = { version = "1.2.3", ... }
        if let Some(eq) = l.find('=') {
            let name = l[..eq].trim().to_string();
            let rhs = l[eq + 1..].trim();
            if let Some(v) = rhs.strip_prefix('"').and_then(|r| r.split('"').next()) {
                if semverish(v) {
                    out.push((name, v.to_string(), path.to_path_buf()));
                }
            } else if let Some(vp) = rhs.find("version") {
                let tail = &rhs[vp + 7..];
                if let Some(q) = tail.find('"') {
                    let v = &tail[q + 1..];
                    if let Some(e) = v.find('"') {
                        let ver = &v[..e];
                        if semverish(ver) {
                            out.push((name, ver.to_string(), path.to_path_buf()));
                        }
                    }
                }
            }
        }
    }
}

fn snap_go(path: &Path, out: &mut Vec<(String, String, PathBuf)>) {
    let Ok(text) = fs::read_to_string(path) else { return };
    for line in text.lines() {
        let l = line.trim().trim_end_matches("// indirect").trim_end().to_string();
        let l = l.trim_start_matches("require ").trim().to_string();
        let parts: Vec<&str> = l.split_whitespace().collect();
        if parts.len() == 2 && parts[1].starts_with('v') && parts[0].contains('.') {
            out.push((parts[0].to_string(), parts[1].to_string(), path.to_path_buf()));
        }
    }
}

fn snap_python(path: &Path, out: &mut Vec<(String, String, PathBuf)>) {
    let Ok(text) = fs::read_to_string(path) else { return };
    for line in text.lines() {
        let l = line.trim();
        for sep in ["==", ">=", "~="] {
            if let Some(i) = l.find(sep) {
                let name = l[..i].trim();
                let ver = l[i + sep.len()..].split(',').next().unwrap_or("").trim();
                if !name.is_empty() && semverish(ver) {
                    out.push((name.to_string(), ver.to_string(), path.to_path_buf()));
                }
                break;
            }
        }
    }
}

fn snap_mise(path: &Path, out: &mut Vec<(String, String, PathBuf)>) {
    let Ok(text) = fs::read_to_string(path) else { return };
    for line in text.lines() {
        let l = line.trim();
        if l.starts_with('#') || l.starts_with('[') {
            continue;
        }
        if let Some(eq) = l.find('=') {
            // mise.toml: tool = "1.2.3"
            let v = l[eq + 1..].trim().trim_matches('"');
            if semverish(v) {
                out.push((l[..eq].trim().to_string(), v.to_string(), path.to_path_buf()));
            }
        } else {
            // .tool-versions: tool 1.2.3
            let parts: Vec<&str> = l.split_whitespace().collect();
            if parts.len() == 2 && semverish(parts[1]) {
                out.push((parts[0].to_string(), parts[1].to_string(), path.to_path_buf()));
            }
        }
    }
}

fn snap_actions(path: &Path, out: &mut Vec<(String, String, PathBuf)>) {
    let Ok(text) = fs::read_to_string(path) else { return };
    for line in text.lines() {
        let l = line.trim();
        if let Some(u) = l.strip_prefix("uses:") {
            let u = u.trim();
            if let Some(at) = u.rfind('@') {
                out.push((u[..at].to_string(), u[at + 1..].to_string(), path.to_path_buf()));
            }
        }
    }
}

fn snapshot(repo: &Repo) -> Vec<(String, String, PathBuf)> {
    let mut out = vec![];
    for d in &repo.bun {
        snap_package_json(&d.join("package.json"), &mut out);
    }
    for d in &repo.cargo {
        snap_cargo(&d.join("Cargo.toml"), &mut out);
    }
    for d in &repo.go {
        snap_go(&d.join("go.mod"), &mut out);
    }
    for d in &repo.python {
        for f in ["requirements.txt", "requirements-dev.txt", "pyproject.toml"] {
            snap_python(&d.join(f), &mut out);
        }
    }
    for f in &repo.mise {
        snap_mise(f, &mut out);
    }
    for f in &repo.actions {
        snap_actions(f, &mut out);
    }
    out
}

// ---------- command helpers ----------

fn run(dir: &Path, cmd: &str, args: &[&str]) -> bool {
    println!("  $ {cmd} {}", args.join(" "));
    Command::new(cmd)
        .args(args)
        .current_dir(dir)
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

fn has(cmd: &str, args: &[&str]) -> bool {
    Command::new(cmd)
        .args(args)
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}

// ---------- updates ----------

fn update_all(repo: &Repo, level: Level) {
    for d in &repo.bun {
        let mode = match level {
            Level::Patch => "patch",
            Level::Minor => "minor",
            Level::Latest => "major", // taze major = bump to highest incl. majors
        };
        run(d, "bunx", &["taze", mode, "-w", "-r"]);
        run(d, "bun", &["install"]);
    }
    for d in &repo.cargo {
        run(d, "cargo", &["update", "--workspace"]);
        if level == Level::Latest && has("cargo", &["upgrade", "--version"]) {
            run(d, "cargo", &["upgrade", "--workspace", "--incompatible"]);
        }
    }
    for d in &repo.go {
        run(d, "go", &["get", "-u", "./..."]);
        run(d, "go", &["mod", "tidy"]);
    }
    for d in &repo.python {
        if d.join("uv.lock").exists() && has("uv", &["--version"]) {
            run(d, "uv", &["lock", "--upgrade"]);
        } else if d.join("requirements.txt").exists() {
            run(d, "pip", &["install", "-U", "-r", "requirements.txt"]);
        }
    }
    for f in &repo.mise {
        let dir = f.parent().unwrap_or(&repo.root);
        run(dir, "mise", &["upgrade", "--bump"]);
    }
}

fn update_actions(repo: &Repo) {
    if !has("gh", &["--version"]) {
        println!("skip actions update — gh CLI not found");
        return;
    }
    for f in &repo.actions {
        let Ok(text) = fs::read_to_string(f) else { continue };
        let mut new = text.clone();
        for line in text.lines() {
            let l = line.trim();
            let Some(u) = l.strip_prefix("uses:") else { continue };
            let u = u.trim();
            let Some(at) = u.rfind('@') else { continue };
            let (repo, cur) = (&u[..at], &u[at + 1..]);
            let Ok(o) = Command::new("gh")
                .args(["api", &format!("repos/{repo}/releases/latest"), "--jq", ".tag_name"])
                .output()
            else {
                continue;
            };
            let latest = String::from_utf8_lossy(&o.stdout).trim().to_string();
            if !latest.is_empty() && latest != *cur {
                println!("  action {repo}: {cur} -> {latest}");
                new = new.replace(u, &format!("{repo}@{latest}"));
            }
        }
        if new != text {
            let _ = fs::write(f, new);
        }
    }
}

// ---------- verify ----------

fn verify(repo: &Repo) {
    println!("\n== verify ==");
    for d in &repo.bun {
        let pkg = fs::read_to_string(d.join("package.json")).unwrap_or_default();
        if pkg.contains("\"verify\"") {
            run(d, "bun", &["run", "verify"]);
        } else if pkg.contains("\"build\"") {
            run(d, "bun", &["run", "build"]);
        }
    }
    for d in &repo.cargo {
        run(d, "cargo", &["check", "--workspace"]);
    }
    for d in &repo.go {
        run(d, "go", &["build", "./..."]);
    }
}

// ---------- report ----------

fn report(before: &[(String, String, PathBuf)], after: &[(String, String, PathBuf)]) {
    println!("\n== changes ==");
    let mut n = 0;
    for (name, old, file) in before {
        if let Some((_, new, _)) = after
            .iter()
            .find(|(n2, _, f2)| n2 == name && f2 == file)
        {
            if new != old {
                n += 1;
                println!("{:>3}. {:<40} {:<14} -> {:<14} {}", n, name, old, new, file.display());
            }
        }
    }
    if n == 0 {
        println!("no version changes detected in manifests");
    } else {
        println!("\n{n} deps updated");
    }
}

fn usage() {
    println!("update-versions [path] [--yes] [--level patch|minor|latest] [--skip-verify] [--no-actions]");
    println!("  [path]        repo root (default: .)");
    println!("  --yes         apply updates (default: dry-run detect + report)");
    println!("  --level       patch | minor | latest (default: latest — bumps incl. majors)");
    println!("  --skip-verify skip post-update build/check");
    println!("  --no-actions  skip GitHub Actions version bumps");
}

fn main() {
    let mut root = PathBuf::from(".");
    let mut yes = false;
    let mut level = Level::Latest;
    let mut skip_verify = false;
    let mut no_actions = false;
    let mut args = env::args().skip(1);
    while let Some(a) = args.next() {
        match a.as_str() {
            "--yes" | "-y" => yes = true,
            "--skip-verify" => skip_verify = true,
            "--no-actions" => no_actions = true,
            "--level" => {
                level = match args.next().as_deref() {
                    Some("patch") => Level::Patch,
                    Some("minor") => Level::Minor,
                    _ => Level::Latest,
                };
            }
            "--help" | "-h" => {
                usage();
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
    let repo = detect(&root);

    println!("== ecosystems detected ==");
    println!("  bun/node manifests : {}", repo.bun.len());
    println!("  cargo workspaces   : {}", repo.cargo.len());
    println!("  go modules         : {}", repo.go.len());
    println!("  python dirs        : {}", repo.python.len());
    println!("  mise/tool-versions : {}", repo.mise.len());
    println!("  gh workflows       : {}", repo.actions.len());
    println!("  dockerfiles        : {}", repo.docker.len());

    if repo.bun.is_empty() && repo.cargo.is_empty() && repo.go.is_empty() && repo.python.is_empty()
        && repo.mise.is_empty() && repo.actions.is_empty()
    {
        println!("nothing to update");
        return;
    }

    if !yes {
        println!("\ndry-run — rerun with --yes to apply (level: {:?})", level);
        return;
    }

    let before = snapshot(&repo);
    println!("\n== updating (level: {:?}) ==", level);
    update_all(&repo, level);
    if !no_actions {
        update_actions(&repo);
    }
    let after = snapshot(&repo);
    report(&before, &after);
    if !skip_verify {
        verify(&repo);
    }
}
