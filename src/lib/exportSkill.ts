import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';

/** Topologically sort nodes following edge connections */
function topoSort(nodes: Node[], edges: Edge[]): Node[] {
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();

  for (const n of nodes) {
    adj.set(n.id, []);
    inDeg.set(n.id, 0);
  }
  for (const e of edges) {
    adj.get(e.source)?.push(e.target);
    inDeg.set(e.target, (inDeg.get(e.target) ?? 0) + 1);
  }

  const queue = nodes.filter((n) => (inDeg.get(n.id) ?? 0) === 0).map((n) => n.id);
  const sorted: string[] = [];

  while (queue.length) {
    const id = queue.shift()!;
    sorted.push(id);
    for (const next of adj.get(id) ?? []) {
      const deg = (inDeg.get(next) ?? 1) - 1;
      inDeg.set(next, deg);
      if (deg === 0) queue.push(next);
    }
  }

  const idToNode = new Map(nodes.map((n) => [n.id, n]));
  return sorted.map((id) => idToNode.get(id)!).filter(Boolean);
}

export interface ExportOptions {
  skillName: string;
  skillDescription: string;
}

export function exportToSkillMd(
  nodes: Node<SkillNodeData>[],
  edges: Edge[],
  options: ExportOptions,
): string {
  const sorted = topoSort(nodes, edges);
  const lines: string[] = [];

  // YAML frontmatter
  lines.push('---');
  lines.push(`name: "${options.skillName}"`);
  lines.push(`description: "${options.skillDescription}"`);
  lines.push('---');
  lines.push('');

  for (let i = 0; i < sorted.length; i++) {
    const node = sorted[i];
    const data = node.data as SkillNodeData;
    lines.push(`## Step ${i + 1}: ${data.icon} ${data.label}`);
    lines.push('');
    if (data.description) {
      lines.push(`> ${data.description}`);
      lines.push('');
    }
    lines.push(data.instructions);
    lines.push('');
  }

  return lines.join('\n');
}
