use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};

use crate::graph::Graph;

pub fn load_graph(root: &Path) -> (Graph, Vec<String>) {
    let mut graph = Graph::new();
    let mut unknown: Vec<String> = Vec::new();
    let (names, by_name) = match read_skill_names(root) {
        Some(v) => v,
        None => return (graph, unknown),
    };
    let skill_set: HashSet<String> = names.iter().cloned().collect();
    for (name, file) in by_name {
        let content = fs::read_to_string(&file).unwrap_or_default();
        let (fm, body_raw) = split_frontmatter(&content);
        let mut callees = HashSet::new();
        for r in parse_related(&fm) {
            if r != name {
                if skill_set.contains(&r) {
                    callees.insert(r);
                } else {
                    unknown.push(format!("{} -> related:{}", name, r));
                }
            }
        }
        let body = clean_body(&body_raw);
        for r in body_refs(&body, &skill_set, &name) {
            if r != name {
                callees.insert(r);
            }
        }
        graph.insert(name, callees);
    }
    (graph, unknown)
}

fn read_skill_names(root: &Path) -> Option<(Vec<String>, HashMap<String, PathBuf>)> {
    let mut names = Vec::new();
    let mut by_name: HashMap<String, PathBuf> = HashMap::new();
    for entry in fs::read_dir(root).ok()? {
        let entry = entry.ok()?;
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }
        let file = path.join("SKILL.md");
        if !file.is_file() {
            continue;
        }
        let name = path.file_name()?.to_string_lossy().to_string();
        let content = fs::read_to_string(&file).unwrap_or_default();
        let fm = frontmatter_text(&content);
        let actual = extract_name(&fm).unwrap_or(name);
        names.push(actual.clone());
        by_name.insert(actual, file);
    }
    Some((names, by_name))
}

fn frontmatter_text(content: &str) -> String {
    if !content.starts_with("---") {
        return String::new();
    }
    let bytes = content.as_bytes();
    let mut start = 3usize;
    while start < bytes.len() && (bytes[start] == b'\r' || bytes[start] == b'\n') {
        start += 1;
    }
    if let Some(pos) = content[start..].find("\n---") {
        content[start..start + pos].to_string()
    } else {
        String::new()
    }
}

fn extract_name(fm: &str) -> Option<String> {
    fm.lines()
        .find(|l| l.trim_start().starts_with("name:"))
        .and_then(|l| {
            l.split_once(':')
                .map(|(_, v)| v.trim().trim_matches('"').trim_matches('\'').to_string())
        })
}

fn parse_related(fm: &str) -> Vec<String> {
    let mut out = Vec::new();
    let mut in_related = false;
    for line in fm.lines() {
        if line.trim().starts_with("related:") {
            in_related = true;
            continue;
        }
        if in_related {
            let t = line.trim();
            if t.is_empty() || !t.starts_with('-') {
                break;
            }
            if let Some(v) = t.strip_prefix('-') {
                let v = v.trim().trim_matches('"').trim_matches('\'').to_string();
                if !v.is_empty() {
                    out.push(v);
                }
            }
        }
    }
    out
}

fn clean_body(body: &str) -> String {
    let lines: Vec<&str> = body.lines().collect();
    let mut clean = Vec::new();
    let mut skip = false;
    for line in lines {
        let t = line.trim();
        if t.starts_with("```") && !skip {
            skip = true;
            continue;
        }
        if t == "```" && skip {
            skip = false;
            continue;
        }
        if !skip {
            clean.push(strip_urls(line));
        }
    }
    clean.join("\n")
}

fn strip_urls(line: &str) -> String {
    let schemes = ["http://", "https://", "ftp://", "file://"];
    let mut out = String::with_capacity(line.len());
    let chars: Vec<char> = line.chars().collect();
    let mut i = 0;
    while i < chars.len() {
        let rest: String = chars[i..].iter().collect();
        let matched = schemes
            .iter()
            .find(|&&s| rest.starts_with(s))
            .map(|s| s.len());
        if let Some(len) = matched {
            let mut end = i + len;
            while end < chars.len() && !chars[end].is_whitespace() {
                end += 1;
            }
            out.push(' ');
            i = end;
        } else {
            out.push(chars[i]);
            i += 1;
        }
    }
    out
}

fn body_refs(body: &str, skill_set: &HashSet<String>, caller: &str) -> HashSet<String> {
    let mut refs = HashSet::new();
    let chars: Vec<char> = body.chars().collect();
    let bytes: Vec<usize> = body
        .char_indices()
        .map(|(i, _)| i)
        .chain(std::iter::once(body.len()))
        .collect();
    let mut i = 0;
    while i < chars.len() {
        if chars[i] == '/' {
            let prev_ok = i == 0 || {
                let p = chars[i - 1];
                !p.is_ascii_alphanumeric()
                    && p != '_'
                    && p != '/'
                    && p != '.'
                    && p != ':'
                    && p != '\\'
                    && p != '-'
            };
            if prev_ok && i + 1 < chars.len() && chars[i + 1].is_ascii_lowercase() {
                let mut j = i + 2;
                while j < chars.len()
                    && (chars[j].is_ascii_lowercase()
                        || chars[j].is_ascii_digit()
                        || chars[j] == '-')
                {
                    j += 1;
                }
                let token = &body[bytes[i + 1]..bytes[j]];
                if token != caller && skill_set.contains(token) {
                    refs.insert(token.to_string());
                }
                i = j;
                continue;
            }
        }
        i += 1;
    }
    refs
}

fn split_frontmatter(content: &str) -> (String, String) {
    if !content.starts_with("---") {
        return (String::new(), content.to_string());
    }
    let rest = &content[3..];
    if let Some(end) = rest.find("\n---") {
        let body_start = 3 + end + 4;
        (
            rest[..end].to_string(),
            content[body_start.min(content.len())..].to_string(),
        )
    } else {
        (String::new(), content.to_string())
    }
}
