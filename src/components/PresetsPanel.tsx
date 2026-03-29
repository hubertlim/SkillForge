import { X } from 'lucide-react';
import { PRESETS, type Preset } from '../lib/presets';
import { useForgeStore } from '../store';
import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeData } from '../types';
import { showToast } from './Toast';

interface Props {
  onClose: () => void;
}

export default function PresetsPanel({ onClose }: Props) {
  const store = useForgeStore();

  const loadPreset = (preset: Preset) => {
    const ts = Date.now();

    if (preset.nodes && preset.edges) {
      // Advanced preset with explicit layout
      const nodes: Node<SkillNodeData>[] = preset.nodes.map((n, i) => ({
        id: `preset-${ts}-${i}`,
        type: 'skill' as const,
        position: { x: n.x, y: n.y },
        data: { ...n.data },
      }));

      const edges: Edge[] = preset.edges.map((e, i) => ({
        id: `pe-${ts}-${i}`,
        source: `preset-${ts}-${e.from}`,
        target: `preset-${ts}-${e.to}`,
        animated: true,
        label: e.label,
      }));

      const nodeCount = nodes.length;
      const edgeCount = edges.length;
      store.loadWorkflow(nodes, edges, preset.id, preset.description);
      showToast(`Loaded "${preset.label}" — ${nodeCount} blocks, ${edgeCount} connections`);
    } else if (preset.steps) {
      // Simple linear preset
      const nodes: Node<SkillNodeData>[] = preset.steps.map((step, i) => ({
        id: `preset-${ts}-${i}`,
        type: 'skill' as const,
        position: { x: 300, y: 60 + i * 140 },
        data: { ...step },
      }));

      const edges: Edge[] = nodes.slice(0, -1).map((n, i) => ({
        id: `pe-${ts}-${i}`,
        source: n.id,
        target: nodes[i + 1].id,
        animated: true,
      }));

      store.loadWorkflow(nodes, edges, preset.id, preset.description);
      showToast(`Loaded "${preset.label}" with ${preset.steps.length} steps`);
    }

    onClose();
  };

  const simple = PRESETS.filter((p) => p.complexity === 'simple');
  const advanced = PRESETS.filter((p) => p.complexity === 'advanced');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[540px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Load a Preset</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-forge-border transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Simple */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-semibold text-forge-muted mb-2 px-1">
              Simple (linear chain)
            </h3>
            <div className="space-y-2">
              {simple.map((preset) => (
                <PresetCard key={preset.id} preset={preset} onLoad={loadPreset} />
              ))}
            </div>
          </div>

          {/* Advanced */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-semibold text-forge-accent mb-2 px-1">
              Advanced (multi-branch)
            </h3>
            <div className="space-y-2">
              {advanced.map((preset) => (
                <PresetCard key={preset.id} preset={preset} onLoad={loadPreset} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PresetCard({ preset, onLoad }: { preset: Preset; onLoad: (p: Preset) => void }) {
  const nodeCount = preset.nodes?.length ?? preset.steps?.length ?? 0;
  const edgeCount = preset.edges?.length ?? (nodeCount > 0 ? nodeCount - 1 : 0);

  return (
    <button
      onClick={() => onLoad(preset)}
      className="w-full text-left px-4 py-3 rounded-lg border border-forge-border
                 hover:border-forge-accent hover:bg-forge-bg transition-colors group"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{preset.emoji}</span>
        <span className="font-semibold text-sm group-hover:text-forge-accent transition-colors">
          {preset.label}
        </span>
        <div className="flex items-center gap-2 ml-auto text-[10px] text-forge-muted">
          <span>{nodeCount} blocks</span>
          <span>{edgeCount} connections</span>
        </div>
      </div>
      <p className="text-xs text-forge-muted leading-snug">{preset.description}</p>
    </button>
  );
}
