export interface Feature {
  number: number;
  type: 'Extends' | 'New';
  impact: string;
  feature: string;
  description: string;
  phase: string;
  effort: string;
  mvpScore: number;
  risk: string;
  reason?: string;
  how?: string;
  riskDetail?: string;
  sketch?: string;
  tags?: string[];
  files?: string[];
}
