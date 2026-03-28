import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { SkillNodeData } from '../types';
import { CATEGORY_COLORS } from '../types';
import { useForgeStore } from '../store';

export default function SkillNode({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as SkillNodeData;
  const color = CATEGORY_COLORS[nodeData.category];
  const selectNode = useForgeStore((s) => s.selectNode);

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
