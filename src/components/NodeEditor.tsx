import { useForgeStore } from '../store';
import { CATEGORY_COLORS } from '../types';
import { Trash2 } from 'lucide-react';

export default function NodeEditor() {
  const { nodes, selectedNodeId, updateNodeData, deleteNode, selectNode } = useForgeStore();
  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) {
    return (
      <aside className="w-72 shrink-0 bg-forge-surface border-l border-forge-border flex items-center justify-center">
        <p className="text-forge-muted text-sm text-center px-6">
          Select a node on the canvas to edit its properties
        </p>
      </aside>
    );
  }

  const data = node.data;
  const color = CATEGORY_COLORS[data.category];

  return (
    <aside className="w-72 shrink-0 bg-forge-surface border-l border-forge-border flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-forge-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{data.icon}</span>
          <span className="font-semibold text-sm">{data.label}</span>
        </div>
        <button
          onClick={() => deleteNode(node.id)}
          className="p-1.5 rounded hover:bg-red-500/20 text-forge-muted hover:text-red-400 transition-colors"
          aria-label="Delete node"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <div>
          <label className="block text-xs text-forge-muted mb-1">Label</label>
          <input
            value={data.label}
            onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
            className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:border-forge-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-forge-muted mb-1">Description</label>
          <input
            value={data.description}
            onChange={(e) => updateNodeData(node.id, { description: e.target.value })}
            className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:border-forge-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-forge-muted mb-1">Instructions (Markdown)</label>
          <textarea
            value={data.instructions}
            onChange={(e) => updateNodeData(node.id, { instructions: e.target.value })}
            rows={12}
            className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                       font-mono leading-relaxed resize-y
                       focus:outline-none focus:border-forge-accent"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-forge-muted">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="capitalize">{data.category}</span>
        </div>
      </div>
    </aside>
  );
}
