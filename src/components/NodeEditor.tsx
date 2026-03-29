import { useForgeStore } from '../store';
import { CATEGORY_COLORS, type SkillCategory } from '../types';
import { Trash2, Copy, Layers, Unlink, ArrowDown, ArrowUp } from 'lucide-react';
import WorkflowStats from './WorkflowStats';
import { showToast } from './Toast';

const CATEGORY_OPTIONS: { key: SkillCategory; label: string }[] = [
  { key: 'planning', label: 'Planning' },
  { key: 'coding', label: 'Coding' },
  { key: 'testing', label: 'Testing' },
  { key: 'review', label: 'Review' },
  { key: 'utility', label: 'Utility' },
  { key: 'custom', label: 'Custom' },
];

export default function NodeEditor() {
  const { nodes, selectedNodeId, updateNodeData, deleteNode, duplicateNode,
          deleteSelectedNodes, duplicateSelectedNodes, edges, deleteEdge, disconnectNode } = useForgeStore();

  const selectedNodes = nodes.filter((n) => n.selected);
  const multiSelected = selectedNodes.length > 1;
  const node = !multiSelected ? nodes.find((n) => n.id === selectedNodeId) : null;

  // Multi-selection view
  if (multiSelected) {
    return (
      <aside className="w-72 shrink-0 bg-forge-surface border-l border-forge-border flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-forge-border flex items-center gap-2">
          <Layers size={14} className="text-forge-accent" />
          <span className="font-semibold text-sm">{selectedNodes.length} blocks selected</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="space-y-1.5">
            {selectedNodes.map((n) => (
              <div key={n.id} className="flex items-center gap-2 text-xs text-forge-muted">
                <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[n.data.category] }} />
                <span>{n.data.icon} {n.data.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                duplicateSelectedNodes();
                showToast(`Duplicated ${selectedNodes.length} blocks`);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-forge-border
                         hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors"
            >
              <Copy size={13} />
              Duplicate all
            </button>
            <button
              onClick={() => {
                deleteSelectedNodes();
                showToast(`Deleted ${selectedNodes.length} blocks`);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-forge-border
                         hover:border-red-500/50 text-forge-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
              Delete all
            </button>
          </div>

          <p className="text-[11px] text-forge-muted leading-relaxed">
            Shift+click or drag-select to add/remove blocks from the selection. Press Delete to remove all selected.
          </p>
        </div>
      </aside>
    );
  }

  // No selection
  if (!node) {
    return (
      <aside className="w-72 shrink-0 bg-forge-surface border-l border-forge-border flex flex-col overflow-hidden">
        {nodes.length > 0 ? (
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <WorkflowStats />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-forge-muted text-sm text-center px-6">
              Select a node on the canvas to edit its properties
            </p>
          </div>
        )}
      </aside>
    );
  }

  // Single selection
  const data = node.data;
  const color = CATEGORY_COLORS[data.category];

  return (
    <aside className="w-72 shrink-0 bg-forge-surface border-l border-forge-border flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-forge-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{data.icon}</span>
          <span className="font-semibold text-sm">{data.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateNode(node.id)}
            className="p-1.5 rounded hover:bg-forge-accent/20 text-forge-muted hover:text-forge-accent transition-colors"
            aria-label="Duplicate node"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => deleteNode(node.id)}
            className="p-1.5 rounded hover:bg-red-500/20 text-forge-muted hover:text-red-400 transition-colors"
            aria-label="Delete node"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
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
          <label className="block text-xs text-forge-muted mb-1">Category</label>
          <select
            value={data.category}
            onChange={(e) => updateNodeData(node.id, { category: e.target.value as SkillCategory })}
            className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:border-forge-accent appearance-none cursor-pointer"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
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
            rows={10}
            className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                       font-mono leading-relaxed resize-y
                       focus:outline-none focus:border-forge-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-forge-muted mb-1">Notes (not exported)</label>
          <textarea
            value={(data.notes as string) ?? ''}
            onChange={(e) => updateNodeData(node.id, { notes: e.target.value })}
            rows={3}
            placeholder="Internal notes, reminders, TODOs..."
            className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                       leading-relaxed resize-y
                       focus:outline-none focus:border-forge-accent placeholder:text-forge-muted/40"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-forge-muted">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="capitalize">{data.category}</span>
        </div>

        {/* Connections */}
        {(() => {
          const incoming = edges.filter((e) => e.target === node.id);
          const outgoing = edges.filter((e) => e.source === node.id);
          const hasConnections = incoming.length > 0 || outgoing.length > 0;
          if (!hasConnections) return null;

          return (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-forge-muted">Connections</label>
                <button
                  onClick={() => { disconnectNode(node.id); showToast('All connections removed'); }}
                  className="text-[10px] text-forge-muted hover:text-red-400 transition-colors"
                >
                  Disconnect all
                </button>
              </div>
              <div className="space-y-1">
                {incoming.map((e) => {
                  const src = nodes.find((n) => n.id === e.source);
                  return (
                    <div key={e.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-forge-bg border border-forge-border text-xs">
                      <div className="flex items-center gap-1.5 text-forge-muted min-w-0">
                        <ArrowDown size={11} className="text-emerald-400 shrink-0" />
                        <span className="truncate">from {src ? src.data.label : '?'}</span>
                      </div>
                      <button
                        onClick={() => { deleteEdge(e.id); showToast('Connection removed'); }}
                        className="p-0.5 rounded hover:bg-red-500/20 text-forge-muted hover:text-red-400 transition-colors shrink-0 ml-1"
                        title="Remove connection"
                        aria-label="Remove connection"
                      >
                        <Unlink size={11} />
                      </button>
                    </div>
                  );
                })}
                {outgoing.map((e) => {
                  const tgt = nodes.find((n) => n.id === e.target);
                  return (
                    <div key={e.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-forge-bg border border-forge-border text-xs">
                      <div className="flex items-center gap-1.5 text-forge-muted min-w-0">
                        <ArrowUp size={11} className="text-blue-400 shrink-0" />
                        <span className="truncate">to {tgt ? tgt.data.label : '?'}</span>
                      </div>
                      <button
                        onClick={() => { deleteEdge(e.id); showToast('Connection removed'); }}
                        className="p-0.5 rounded hover:bg-red-500/20 text-forge-muted hover:text-red-400 transition-colors shrink-0 ml-1"
                        title="Remove connection"
                        aria-label="Remove connection"
                      >
                        <Unlink size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </aside>
  );
}
