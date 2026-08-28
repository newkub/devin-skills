use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::path::PathBuf;

use regex::Regex;
use serde::Deserialize;

const PREV_ALLOWED: &[char] = &[
    ' ', '\t', '\n', '\r', '(', '[', '\'', '"', '`', '>', '*', '-', '+',
];
const NEXT_ALLOWED: &[char] = &[
    ' ', '\t', '\n', '\r', ',', ')', ']', '\'', '"', '`', '<', '!', '?',
];
const PLACEHOLDERS: &[&str] = &[
    "skill-name",
    "source-skill",
    "target-skill",
    "some-skill",
    "your-skill",
];

type SkillMap = BTreeMap<String, BTreeSet<String>>;

#[derive(Debug, Default, Deserialize)]
pub struct Frontmatter {
    pub related: Option<Vec<String>>,
}

pub fn run(root: PathBuf) {
    if !root.is_dir() {
        eprintln!("Target directory not found: {}", root.display());
        std::process::exit(1);
    }

    let (skill_set, skill_dirs) = collect_skills(&root);
    println!("=== INVENTORY ===\nTotal skills: {}\n", skill_set.len());

    let (body_broken, related_broken, body_checked, related_checked, parse_errors) =
        scan_skills(&skill_dirs, &skill_set);
    report(
        body_broken,
        related_broken,
        body_checked,
        related_checked,
        parse_errors,
    );
}

fn collect_skills(root: &PathBuf) -> (BTreeSet<String>, Vec<PathBuf>) {
    let mut set = BTreeSet::new();
    let mut dirs = Vec::new();

    for entry in fs::read_dir(root).unwrap_or_else(|e| {
        eprintln!("Could not read root: {}", e);
        std::process::exit(1);
    }) {
        let entry = match entry {
            Ok(e) => e,
            Err(err) => {
                eprintln!("Warning: could not read directory entry: {}", err);
                continue;
            }
        };

        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        let name = match path.file_name().and_then(|n| n.to_str()) {
            Some(n) => n.to_string(),
            None => continue,
        };

        if name.starts_with('.') || name == "scripts" || name == "node_modules" {
            continue;
        }

        if !path.join("SKILL.md").is_file() {
            continue;
        }

        set.insert(name);
        dirs.push(path);
    }

    dirs.sort_by(|a, b| {
        a.file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("")
            .cmp(b.file_name().and_then(|n| n.to_str()).unwrap_or(""))
    });

    (set, dirs)
}

fn scan_skills(
    skill_dirs: &[PathBuf],
    skill_set: &BTreeSet<String>,
) -> (SkillMap, SkillMap, usize, usize, Vec<String>) {
    let mut body_broken: SkillMap = BTreeMap::new();
    let mut related_broken: SkillMap = BTreeMap::new();
    let mut body_checked = 0usize;
    let mut related_checked = 0usize;
    let mut parse_errors: Vec<String> = Vec::new();

    let body_ref_re =
        Regex::new(r"/([a-z][a-z0-9]+(?:-[a-z0-9]+)+)").expect("valid body reference regex");
    let fm_re =
        Regex::new(r"(?s)^---\s*\r?\n(.*?)\r?\n---\s*\r?\n(.*)").expect("valid frontmatter regex");

    for dir in skill_dirs {
        let skill_name = dir
            .file_name()
            .and_then(|n| n.to_str())
            .map(String::from)
            .unwrap_or_default();
        let skill_file = dir.join("SKILL.md");

        let content = match fs::read_to_string(&skill_file) {
            Ok(c) => c,
            Err(err) => {
                eprintln!("Warning: could not read {}: {}", skill_file.display(), err);
                continue;
            }
        };

        let (frontmatter, body) = match fm_re.captures(&content) {
            Some(caps) => (
                Some(caps.get(1).expect("group 1").as_str()),
                caps.get(2).expect("group 2").as_str(),
            ),
            None => (None, content.as_str()),
        };

        for caps in body_ref_re.captures_iter(body) {
            let m = caps.get(0).expect("group 0");
            let ref_name = caps.get(1).expect("group 1").as_str();

            if !is_skill_reference(m.start(), m.end(), body) {
                continue;
            }

            if PLACEHOLDERS.contains(&ref_name) {
                continue;
            }

            body_checked += 1;
            if !skill_set.contains(ref_name) {
                body_broken
                    .entry(skill_name.clone())
                    .or_default()
                    .insert(ref_name.to_string());
            }
        }

        if let Some(fm) = frontmatter {
            match serde_yaml::from_str::<Frontmatter>(fm) {
                Ok(parsed) => {
                    if let Some(related) = parsed.related {
                        for rel in related {
                            let rel = rel
                                .trim()
                                .trim_matches(|c| c == '"' || c == '\'')
                                .to_string();
                            related_checked += 1;
                            if !skill_set.contains(&rel) {
                                related_broken
                                    .entry(skill_name.clone())
                                    .or_default()
                                    .insert(rel);
                            }
                        }
                    }
                }
                Err(e) => {
                    eprintln!(
                        "Error: could not parse frontmatter in {}: {}",
                        skill_file.display(),
                        e
                    );
                    parse_errors.push(format!("{}: {}", skill_name, e));
                }
            }
        }
    }

    (
        body_broken,
        related_broken,
        body_checked,
        related_checked,
        parse_errors,
    )
}

fn report(
    body_broken: SkillMap,
    related_broken: SkillMap,
    body_checked: usize,
    related_checked: usize,
    parse_errors: Vec<String>,
) {
    let critical: usize = related_broken.values().map(|s| s.len()).sum();
    let warning: usize = body_broken.values().map(|s| s.len()).sum();

    println!(
        "=== SCAN RESULTS ===\nBody references checked: {}\nRelated entries checked: {}\n",
        body_checked, related_checked
    );
    println!(
        "=== BROKEN REFERENCES ===\nCritical (broken related:): {}\nWarning (broken body /ref): {}\nParse errors: {}\n",
        critical,
        warning,
        parse_errors.len()
    );

    if critical > 0 {
        println!("--- CRITICAL: broken related: entries ---");
        for (skill, refs) in &related_broken {
            println!(
                "  {} -> {}",
                skill,
                refs.iter().cloned().collect::<Vec<_>>().join(", ")
            );
        }
        println!();
    }

    if warning > 0 {
        println!("--- WARNING: broken body /skill-name refs ---");
        for (skill, refs) in &body_broken {
            println!(
                "  {} -> {}",
                skill,
                refs.iter().cloned().collect::<Vec<_>>().join(", ")
            );
        }
        println!();
    }

    if !parse_errors.is_empty() {
        println!("--- PARSE ERRORS: invalid frontmatter YAML ---");
        for err in &parse_errors {
            println!("  {}", err);
        }
        println!();
    }

    if critical == 0 && warning == 0 && parse_errors.is_empty() {
        println!("no broken references found");
    } else {
        println!("=== RECOMMENDED NEXT ACTIONS ===");
        if critical > 0 {
            println!("- Run /update-references to fix broken related: entries");
        }
        if warning > 0 {
            println!("- Run /update-references to fix broken body /skill-name refs");
        }
        if !parse_errors.is_empty() {
            println!("- Fix invalid YAML frontmatter and scan again");
        }
    }
}

fn is_skill_reference(start: usize, end: usize, body: &str) -> bool {
    if let Some(c) = body.get(..start).unwrap_or("").chars().next_back()
        && !PREV_ALLOWED.contains(&c)
    {
        return false;
    }

    let lookback: String = body
        .get(..start)
        .unwrap_or("")
        .chars()
        .rev()
        .take(20)
        .collect();
    if lookback.contains("://") {
        return false;
    }

    if let Some(c) = body.get(end..).unwrap_or("").chars().next()
        && !NEXT_ALLOWED.contains(&c)
    {
        return false;
    }

    true
}
