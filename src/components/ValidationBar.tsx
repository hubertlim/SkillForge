import { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useForgeStore } from '../store';

interface Warning {
  nodeId: string;
  label: string;
  message: string;
}

export default function ValidationBar() {
  const { nodes, edges } = useForgeStore();

  const warnings = useMemo(() => {
    const w: Warning[] = [];
    if (nodes.length === 0) return w;

    // Find disconnected nodes (no incoming or outgoing edges) when there are multiple nodes
    if (nodes.length > 1) {
      const connected = new Set<string>();
      for (const e of edges) {
        connected.add(e.source);
        connected.add(e.target);
      }
      for (const n of nodes) {
        if (!connected.has(n.id)) {
          w.push({ nodeId: n.id, label: n.data.label as string, message: 'not connected to any other block' });
        }
      }
    }

    // Empty instructions
    for (const n of nodes) {
      const instructions = (n.data.instructions as string || '').trim();
      if (!instructions || instructions === '- Describe what this step should do\n- Add your custom instructions here') {
        w.push({ nodeId: n.id, label: n.data.label as string, message: 'has empty or default instructions' });
      }
    }

    return w;
  }, [nodes, edges]);

  if (warnings.length === 0) return null;

  return (
    <div className="shrink-0 bg-amber-500/10 border-t border-amber-500/30 px-4 py-1.5 flex items-center gap-2 overflow-x-auto">
      <AlertTriangle size={13} className="text-amber-400 shrink-0" />
      <div className="flex items-center gap-3 text-xs text-amber-300">
        {warnings.slice(0, 3).map((w, i) => (
          <span key={i}>
            <span className="font-medium">{w.label}</span> {w.message}
          </span>
        ))}
        {warnings.length > 3 && (
          <span className="text-amber-400/70">+{warnings.length - 3} more</span>
        )}
      </div>
    </div>
  );
}
