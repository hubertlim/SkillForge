import { useForgeStore } from '../store';
import { Trash2, Copy, AlignVerticalSpaceAround } from 'lucide-react';
import { showToast } from './Toast';

export default function MultiSelectToolbar() {
  const nodes = useForgeStore((s) => s.nodes);
  const deleteSelectedNodes = useForgeStore((s) => s.deleteSelectedNodes);
  const duplicateSelectedNodes = useForgeStore((s) => s.duplicateSelectedNodes);

  const selectedCount = nodes.filter((n) => n.selected).length;

  if (selectedCount < 2) return null;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 animate-slide-up">
      <div className="bg-forge-surface border border-forge-border rounded-xl shadow-2xl px-3 py-2 flex items-center gap-2">
        <span className="text-xs text-forge-muted mr-1">
          {selectedCount} selected
        </span>
        <div className="w-px h-4 bg-forge-border" />
        <button
          onClick={() => {
            duplicateSelectedNodes();
            showToast(`Duplicated ${selectedCount} blocks`);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs
                     hover:bg-forge-bg text-forge-muted hover:text-forge-text transition-colors"
          title="Duplicate selected"
        >
          <Copy size={12} />
          Duplicate
        </button>
        <button
          onClick={() => {
            deleteSelectedNodes();
            showToast(`Deleted ${selectedCount} blocks`);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs
                     hover:bg-red-500/10 text-forge-muted hover:text-red-400 transition-colors"
          title="Delete selected"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
}
