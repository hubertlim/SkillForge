import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';

const MAX_PAYLOAD_SIZE = 500_000; // 500KB max decoded payload

interface SharePayload {
  n: { id: string; x: number; y: number; d: SkillNodeData }[];
  e: { s: string; t: string }[];
  name: string;
  desc: string;
}

function sanitizeString(val: unknown, maxLen: number = 1000): string {
  if (typeof val !== 'string') return '';
  return val.slice(0, maxLen);
}

function sanitizeNumber(val: unknown, fallback: number = 0): number {
  if (typeof val !== 'number' || !isFinite(val)) return fallback;
  return Math.round(val);
}

export function encodeWorkflow(
  nodes: Node<SkillNodeData>[],
  edges: Edge[],
  skillName: string,
  skillDescription: string,
): string {
  const payload: SharePayload = {
    n: nodes.map((n) => ({
      id: String(n.id).slice(0, 64),
      x: Math.round(n.position.x),
      y: Math.round(n.position.y),
      d: {
        label: String(n.data.label).slice(0, 200),
        category: n.data.category,
        description: String(n.data.description).slice(0, 500),
        icon: String(n.data.icon).slice(0, 10),
        instructions: String(n.data.instructions).slice(0, 5000),
      },
    })),
    e: edges.map((e) => ({ s: String(e.source).slice(0, 64), t: String(e.target).slice(0, 64) })),
    name: skillName.slice(0, 200),
    desc: skillDescription.slice(0, 500),
  };
  const json = JSON.stringify(payload);
  return btoa(encodeURIComponent(json));
}

function isValidCategory(val: unknown): val is SkillNodeData['category'] {
  return typeof val === 'string' && ['planning', 'coding', 'testing', 'review', 'utility', 'custom'].includes(val);
}

export function decodeWorkflow(hash: string): {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  skillName: string;
  skillDescription: string;
} | null {
  try {
    if (hash.length > MAX_PAYLOAD_SIZE) return null;

    const json = decodeURIComponent(atob(hash));
    if (json.length > MAX_PAYLOAD_SIZE) return null;

    const raw = JSON.parse(json);

    // Validate top-level structure
    if (!raw || typeof raw !== 'object') return null;
    if (!Array.isArray(raw.n) || !Array.isArray(raw.e)) return null;
    if (raw.n.length > 200 || raw.e.length > 500) return null; // sanity limits

    const nodeIds = new Set<string>();

    const nodes: Node<SkillNodeData>[] = raw.n.map((n: unknown, i: number) => {
      const item = n as Record<string, unknown>;
      const id = sanitizeString(item.id, 64) || `imported-${i}`;
      nodeIds.add(id);
      const d = (item.d ?? {}) as Record<string, unknown>;

      return {
        id,
        type: 'skill' as const,
        position: { x: sanitizeNumber(item.x), y: sanitizeNumber(item.y) },
        data: {
          label: sanitizeString(d.label, 200) || `Step ${i + 1}`,
          category: isValidCategory(d.category) ? d.category : 'custom',
          description: sanitizeString(d.description, 500),
          icon: sanitizeString(d.icon, 10) || '⚙️',
          instructions: sanitizeString(d.instructions, 5000),
        },
      };
    });

    // Validate edges reference existing nodes
    const edges: Edge[] = [];
    for (let i = 0; i < raw.e.length; i++) {
      const item = raw.e[i] as Record<string, unknown>;
      const source = sanitizeString(item.s, 64);
      const target = sanitizeString(item.t, 64);
      if (source && target && nodeIds.has(source) && nodeIds.has(target) && source !== target) {
        edges.push({ id: `e-${i}`, source, target, animated: true });
      }
    }

    return {
      nodes,
      edges,
      skillName: sanitizeString(raw.name, 200) || 'imported-workflow',
      skillDescription: sanitizeString(raw.desc, 500),
    };
  } catch {
    return null;
  }
}
