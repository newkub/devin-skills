export interface SgMatch {
  file: string;
  line: number;
  text: string;
  vars: Record<string, string>;
}

export type Row = Record<string, string | number>;
