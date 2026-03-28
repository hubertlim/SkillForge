import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';

interface SharePayload {
  n: { id: string; x: number; y: number; d: SkillNodeData }[];
  e: { s: string; t: string }[];
  name: string;
  desc: string;
}

export function encodeWorkflow(
  nodes: Node<SkillNodeData>[],
  edges: Edge[],
  skillName: string,
  skillDescription: string,
): string {
  const payload: SharePayload = {
    n: nodes.map((n) => ({
      id: n.id,
      x: Math.round(n.position.x),
      y: Math.round(n.position.y),
      d: n.data as SkillNodeData,
    })),
    e: edges.map((e) => ({ s: e.source, t: e.target })),
    name: skillName,
    desc: skillDescription,
  };
  const json = JSON.stringify(payload);
  const encoded = btoa(encodeURIComponent(json));
  return encoded;
}

export function decodeWorkflow(hash: string): {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
  skillName: string;
  skillDescription: string;
} | null {
  try {
    const json = decodeURIComponent(atob(hash));
    const payload: SharePayload = JSON.parse(json);

    const nodes: Node<SkillNodeData>[] = payload.n.map((n) => ({
      id: n.id,
      type: 'skill' as const,
      position: { x: n.x, y: n.y },
      data: n.d,
    }));

    const edges: Edge[] = payload.e.map((e, i) => ({
      id: `e-${i}`,
      source: e.s,
      target: e.t,
      animated: true,
    }));

    return {
      nodes,
      edges,
      skillName: payload.name,
      skillDescription: payload.desc,
    };
  } catch {
    return null;
  }
}
