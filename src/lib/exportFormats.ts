import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';
import { exportToSkillMd, type ExportOptions } from './exportSkill';

export type ExportFormat = 'skill-md' | 'kiro-steering' | 'json';

export interface FormatInfo {
  id: ExportFormat;
  label: string;
  filename: string;
  description: string;
}

export const FORMATS: FormatInfo[] = [
  { id: 'skill-md', label: 'SKILL.md', filename: 'SKILL.md', description: 'Claude Code / Copilot / Cursor skill format' },
  { id: 'kiro-steering', label: 'Kiro Steering', filename: 'steering.md', description: 'Kiro .kiro/steering/ format' },
  { id: 'json', label: 'JSON', filename: 'workflow.json', description: 'Machine-readable workflow for programmatic use' },
];

/** Topological sort (shared) */
function topoSort(nodes: Node[], edges: Edge[]): Node[] {
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();
  for (const n of nodes) { adj.set(n.id, []); inDeg.set(n.id, 0); }
  for (const e of edges) {
    adj.get(e.source)?.push(e.target);
    inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1);
  }
  const queue = nodes.filter((n) => (inDeg.get(n.id) ?? 0) === 0).map((n) => n.id);
  const sorted: string[] = [];
  while (queue.length) {
    const cur = queue.shift()!;
    sorted.push(cur);
    for (const next of adj.get(cur) ?? []) {
      const deg = (inDeg.get(next) ?? 1) - 1;
      inDeg.set(next, deg);
      if (deg === 0) queue.push(next);
    }
  }
  const idToNode = new Map(nodes.map((n) => [n.id, n]));
  return sorted.map((id) => idToNode.get(id)!).filter(Boolean);
}

function exportToKiroSteering(
  nodes: Node<SkillNodeData>[],
  edges: Edge[],
  options: ExportOptions,
): string {
  const sorted = topoSort(nodes, edges);
  const lines: string[] = [];

  lines.push('---');
  lines.push(`description: "${options.skillDescription}"`);
  lines.push('inclusion: manual');
  lines.push('---');
  lines.push('');
  lines.push(`# ${options.skillName}`);
  lines.push('');
  lines.push(`> ${options.skillDescription}`);
  lines.push('');

  for (let i = 0; i < sorted.length; i++) {
    const data = sorted[i].data as SkillNodeData;
    lines.push(`## ${i + 1}. ${data.icon} ${data.label}`);
    lines.push('');
    if (data.description) {
      lines.push(data.description);
      lines.push('');
    }
    lines.push(data.instructions);
    lines.push('');
  }

  lines.push('<!-- Built with SkillForge — https://github.com/hubertlim/SkillForge -->');

  return lines.join('\n');
}

function exportToJson(
  nodes: Node<SkillNodeData>[],
  edges: Edge[],
  options: ExportOptions,
): string {
  const sorted = topoSort(nodes, edges);
  const workflow = {
    name: options.skillName,
    description: options.skillDescription,
    _meta: { generator: 'SkillForge', url: 'https://github.com/hubertlim/SkillForge' },
    steps: sorted.map((n, i) => {
      const d = n.data as SkillNodeData;
      return {
        order: i + 1,
        label: d.label,
        category: d.category,
        icon: d.icon,
        description: d.description,
        instructions: d.instructions,
      };
    }),
  };
  return JSON.stringify(workflow, null, 2);
}

export function exportWorkflow(
  format: ExportFormat,
  nodes: Node<SkillNodeData>[],
  edges: Edge[],
  options: ExportOptions,
): string {
  switch (format) {
    case 'skill-md':
      return exportToSkillMd(nodes, edges, options);
    case 'kiro-steering':
      return exportToKiroSteering(nodes, edges, options);
    case 'json':
      return exportToJson(nodes, edges, options);
  }
}
