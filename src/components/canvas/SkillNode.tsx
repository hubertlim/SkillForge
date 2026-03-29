import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SkillNodeData } from '../../types';
import { CATEGORY_COLORS } from '../../types';
import { useForgeStore } from '../../store';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function useStepNumber(nodeId: string): number | null {
  const nodes = useForgeStore((s) => s.nodes);
  const edges = useForgeStore((s) => s.edges);

  return useMemo(() => {
    if (nodes.length === 0) return null;
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
    for (const n of nodes) {
      if (!sorted.includes(n.id)) sorted.push(n.id);
    }
    const idx = sorted.indexOf(nodeId);
    return idx >= 0 ? idx + 1 : null;
  }, [nodes, edges, nodeId]);
}

function truncateInstructions(text: string, maxLines: number = 2): string {
  const lines = text.split('\n').filter((l) => l.trim());
  const truncated = lines.slice(0, maxLines).map((l) => l.trim().replace(/^-\s*/, '')).join(', ');
  if (lines.length > maxLines) return truncated + '...';
  return truncated;
}

export default function SkillNode({ id, data, selected }: NodeProps) {
  const nodeData = data as SkillNodeData;
  const color = CATEGORY_COLORS[nodeData.category];
  const selectNode = useForgeStore((s) => s.selectNode);
  const updateNodeData = useForgeStore((s) => s.updateNodeData);
  const stepNum = useStepNumber(id);
  const hasNotes = !!(nodeData.notes as string);
  const collapsed = !!(nodeData.collapsed as boolean);
  const preview = truncateInstructions(nodeData.instructions);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateNodeData(id, { collapsed: !collapsed });
  };

  if (collapsed) {
    return (
      <div
        onClick={() => selectNode(id)}
        className="relative rounded-xl border px-3 py-2 shadow-lg transition-all flex items-center gap-2"
        style={{
          background: '#1e1e2e',
          borderColor: selected ? color : '#2a2a3a',
          boxShadow: selected ? `0 0 16px ${color}44` : undefined,
          minWidth: 140,
        }}
      >
        <Handle type="target" position={Position.Top} />
        {stepNum !== null && (
          <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: color }}>
            {stepNum}
          </div>
        )}
        <span className="text-base">{nodeData.icon}</span>
        <span className="font-semibold text-xs text-forge-text truncate">{nodeData.label}</span>
        <button onClick={toggleCollapse} className="ml-auto text-forge-muted hover:text-forge-text p-0.5 nodrag">
          <ChevronDown size={12} />
        </button>
        <div className="absolute top-0 left-0 w-full h-0.5 rounded-t-xl" style={{ background: color }} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  return (
    <div
      onClick={() => selectNode(id)}
      className="relative rounded-xl border px-4 py-3 shadow-lg transition-all"
      style={{
        background: '#1e1e2e',
        borderColor: selected ? color : '#2a2a3a',
        boxShadow: selected ? `0 0 16px ${color}44` : undefined,
        minWidth: 200,
        maxWidth: 260,
      }}
    >
      <Handle type="target" position={Position.Top} />

      {stepNum !== null && (
        <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: color }}>
          {stepNum}
        </div>
      )}

      {hasNotes && (
        <div className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-amber-500 text-white font-bold" title="Has notes">
          N
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{nodeData.icon}</span>
        <span className="font-semibold text-sm text-forge-text flex-1">{nodeData.label}</span>
        <button onClick={toggleCollapse} className="text-forge-muted hover:text-forge-text p-0.5 nodrag">
          <ChevronUp size={12} />
        </button>
      </div>
      <p className="text-xs text-forge-muted leading-snug">{nodeData.description}</p>

      {preview && (
        <p className="text-[10px] text-forge-muted/60 leading-snug mt-1.5 italic truncate">
          {preview}
        </p>
      )}

      <div className="absolute top-0 left-0 w-full h-0.5 rounded-t-xl" style={{ background: color }} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
