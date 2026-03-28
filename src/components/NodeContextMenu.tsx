import { useForgeStore } from '../store';
import { CATEGORY_COLORS, type SkillCategory } from '../types';
import { Copy, Trash2, Palette } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  nodeId: string;
  x: number;
  y: number;
  onClose: () => void;
}

const CATEGORIES: { key: SkillCategory; label: string }[] = [
  { key: 'planning', label: 'Planning' },
  { key: 'coding', label: 'Coding' },
  { key: 'testing', label: 'Testing' },
  { key: 'review', label: 'Review' },
  { key: 'utility', label: 'Utility' },
  { key: 'custom', label: 'Custom' },
];

export default function NodeContextMenu({ nodeId, x, y, onClose }: Props) {
  const { duplicateNode, deleteNode, updateNodeData } = useForgeStore();
  const [showCategories, setShowCategories] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-[60] bg-forge-surface border border-forge-border rounded-lg shadow-2xl py-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => { duplicateNode(nodeId); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-forge-text hover:bg-forge-bg transition-colors"
      >
        <Copy size={13} className="text-forge-muted" />
        Duplicate
      </button>

      <div className="relative">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-forge-text hover:bg-forge-bg transition-colors"
        >
          <Palette size={13} className="text-forge-muted" />
          Change category
        </button>
        {showCategories && (
          <div className="absolute left-full top-0 ml-1 bg-forge-surface border border-forge-border rounded-lg shadow-2xl py-1 min-w-[130px]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { updateNodeData(nodeId, { category: cat.key }); onClose(); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-forge-text hover:bg-forge-bg transition-colors"
              >
                <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat.key] }} />
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-forge-border my-1" />

      <button
        onClick={() => { deleteNode(nodeId); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 size={13} />
        Delete
      </button>
    </div>
  );
}
