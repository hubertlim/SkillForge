import { X } from 'lucide-react';
import { PRESETS, type Preset } from '../lib/presets';
import { useForgeStore } from '../store';
import type { Node } from '@xyflow/react';
import type { SkillNodeData } from '../types';
import { showToast } from './Toast';

interface Props {
  onClose: () => void;
}

export default function PresetsPanel({ onClose }: Props) {
  const store = useForgeStore();

  const loadPreset = (preset: Preset) => {
    const VERTICAL_GAP = 140;
    const START_X = 300;
    const START_Y = 60;

    const nodes: Node<SkillNodeData>[] = preset.steps.map((step, i) => ({
      id: `preset-${Date.now()}-${i}`,
      type: 'skill' as const,
      position: { x: START_X, y: START_Y + i * VERTICAL_GAP },
      data: step,
    }));

    const edges = nodes.slice(0, -1).map((n, i) => ({
      id: `pe-${Date.now()}-${i}`,
      source: n.id,
      target: nodes[i + 1].id,
      animated: true,
    }));

    store.loadWorkflow(nodes, edges, preset.id, preset.description);
    showToast(`Loaded "${preset.label}" with ${preset.steps.length} steps`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Load a Preset</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-forge-border transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className="w-full text-left px-4 py-3 rounded-lg border border-forge-border
                         hover:border-forge-accent hover:bg-forge-bg transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{preset.emoji}</span>
                <span className="font-semibold text-sm group-hover:text-forge-accent transition-colors">
                  {preset.label}
                </span>
                <span className="text-xs text-forge-muted ml-auto">{preset.steps.length} steps</span>
              </div>
              <p className="text-xs text-forge-muted leading-snug">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
