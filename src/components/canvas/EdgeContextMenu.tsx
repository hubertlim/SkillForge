import { useEffect, useRef } from 'react';
import { useForgeStore } from '../../store';
import { Unlink, Tag } from 'lucide-react';
import { showToast } from '../ui/Toast';

interface Props {
  edgeId: string;
  sourceLabel: string;
  targetLabel: string;
  x: number;
  y: number;
  onClose: () => void;
}

export default function EdgeContextMenu({ edgeId, sourceLabel, targetLabel, x, y, onClose }: Props) {
  const deleteEdge = useForgeStore((s) => s.deleteEdge);
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
      className="fixed z-[60] bg-forge-surface border border-forge-border rounded-lg shadow-2xl py-1 min-w-[200px]"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-1.5 text-[10px] text-forge-muted border-b border-forge-border">
        {sourceLabel} &rarr; {targetLabel}
      </div>
      <button
        onClick={() => {
          deleteEdge(edgeId);
          showToast('Connection removed');
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <Unlink size={13} />
        Remove connection
      </button>
    </div>
  );
}
