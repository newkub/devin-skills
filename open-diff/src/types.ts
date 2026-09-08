import type { FileDiffMetadata } from '@pierre/diffs';

export interface FileEntry {
  name: string;
  type: string;
  additions: number;
  deletions: number;
  chunk: string;
}

export interface DiffFile {
  meta: FileDiffMetadata;
  additions: number;
  deletions: number;
}

export interface PrMeta {
  title: string;
  author?: { login: string; avatarUrl?: string };
  state: string;
  url: string;
  number: number;
}

export interface DiffResult {
  source: DiffSource;
  files: FileEntry[];
  raw: string;
  prMeta?: PrMeta | null;
}

export type DiffSource =
  | { kind: 'pr'; pr: number; repo?: string; theme?: string }
  | { kind: 'git'; ref: string; repo?: string; theme?: string }
  | { kind: 'branch'; base: string; head: string; repo?: string; theme?: string }
  | { kind: 'file'; old: string; new: string; theme?: string };

export type SourceKind = DiffSource['kind'];
