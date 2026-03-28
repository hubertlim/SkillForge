import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SkillNodeData } from '../types';
import { CATEGORY_COLORS } from '../types';
import { useForgeStore } from '../store';
import { useMemo } from 'react';

function useStepNumber(nodeId: string): number | null {
  const nodes = useForgeStore((s) => s.nodes);
  const edges = useForgeStore((s) => s.edges);

  return useMemo(() => {
    if (nodes.length === 0) return null;
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
      const cur = queue.shift()!;
      sorted.push(cur);
      for (const next of adj.get(cur) ?? []) {
        const deg = (inDeg.get(next) ?? 1) - 1;
        inDeg.set(next, deg);
        if (deg === 0) queue.push(next);
      }
    }
    for (const n of nodes) {
      if (!sorted.includes(n.id)) sorted.push(n.id);
    }
    const idx = sorted.indexOf(nodeId);
    return idx >= 0 ? idx + 1 : null;
  }, [nodes, edges, nodeId]);
}

export default function SkillNode({ id, data, selected }: NodeProps) {
  const nodeData = data as SkillNodeData;
  const color = CATEGORY_COLORS[nodeData.category];
  const selectNode = useForgeStore((s) => s.selectNode);
  const stepNum = useStepNumber(id);

  return (
    <div
      onClick={() => selectNode(id)}
      className="relative rounded-xl border px-4 py-3 shadow-lg transition-all"
      style={{
        background: '#1e1e2e',
        borderColor: selected ? color : '#2a2a3a',
        boxShadow: selected ? `0 0 16px ${color}44` : undefined,
        minWidth: 180,
      }}
    >
      <Handle type="target" position={Position.Top} />

      {/* Step number badge */}
      {stepNum !== null && (
        <div
          className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: color }}
        >
          {stepNum}
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{nodeData.icon}</span>
        <span className="font-semibold text-sm text-forge-text">{nodeData.label}</span>
      </div>
      <p className="text-xs text-forge-muted leading-snug">{nodeData.description}</p>
      <div
        className="absolute top-0 left-0 w-full h-0.5 rounded-t-xl"
        style={{ background: color }}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
