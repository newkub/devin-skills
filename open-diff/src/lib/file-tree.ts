import type { FileEntry } from '../types';

export interface TreeFile {
  idx: number;
  name: string;      // basename
  path: string;      // full path
  type: string;
  additions: number;
  deletions: number;
}

export interface TreeDir {
  name: string;      // segment name (may be "a/b/c" after collapse)
  path: string;      // full dir path
  dirs: TreeDir[];
  files: TreeFile[];
}

export interface FileTree {
  dirs: TreeDir[];
  files: TreeFile[]; // root-level files
}

function basename(path: string) {
  const i = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  return i >= 0 ? path.slice(i + 1) : path;
}

// Collapse single-child directory chains: a/b/c → single node "a/b/c"
function collapseDir(dir: TreeDir): TreeDir {
  let cur = dir;
  while (cur.dirs.length === 1 && cur.files.length === 0) {
    const child = cur.dirs[0];
    cur = { name: `${cur.name}/${child.name}`, path: child.path, dirs: child.dirs, files: child.files };
  }
  return { ...cur, dirs: cur.dirs.map(collapseDir) };
}

export function buildFileTree(files: FileEntry[], indices: number[]): FileTree {
  const root: TreeDir = { name: '', path: '', dirs: [], files: [] };
  const dirMap = new Map<string, TreeDir>();
  dirMap.set('', root);

  const ensureDir = (path: string): TreeDir => {
    let dir = dirMap.get(path);
    if (dir) return dir;
    const sep = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
    const parent = ensureDir(sep > 0 ? path.slice(0, sep) : '');
    dir = { name: path.slice(sep + 1), path, dirs: [], files: [] };
    parent.dirs.push(dir);
    dirMap.set(path, dir);
    return dir;
  };

  for (const idx of indices) {
    const f = files[idx];
    if (!f) continue;
    const sep = Math.max(f.name.lastIndexOf('/'), f.name.lastIndexOf('\\'));
    const dirPath = sep > 0 ? f.name.slice(0, sep) : '';
    ensureDir(dirPath).files.push({
      idx,
      name: basename(f.name),
      path: f.name,
      type: f.type,
      additions: f.additions,
      deletions: f.deletions,
    });
  }

  const sortDir = (d: TreeDir) => {
    d.dirs.sort((a, b) => a.name.localeCompare(b.name));
    d.files.sort((a, b) => a.name.localeCompare(b.name));
    d.dirs.forEach(sortDir);
  };
  sortDir(root);

  return { dirs: root.dirs.map(collapseDir), files: root.files };
}

export function allDirPaths(tree: FileTree): string[] {
  const out: string[] = [];
  const walk = (d: TreeDir) => { out.push(d.path); d.dirs.forEach(walk); };
  tree.dirs.forEach(walk);
  return out;
}
