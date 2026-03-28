import { MousePointerClick, LayoutTemplate, Upload } from 'lucide-react';

interface Props {
  onOpenPresets: () => void;
  onOpenImport: () => void;
}

export default function EmptyState({ onOpenPresets, onOpenImport }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="pointer-events-auto text-center max-w-sm">
        <div className="text-5xl mb-4">⚒️</div>
        <h2 className="text-lg font-semibold mb-2">Start building your skill</h2>
        <p className="text-sm text-forge-muted mb-6 leading-relaxed">
          Drag blocks from the sidebar, load a preset template, or import an existing SKILL.md
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-forge-surface border border-forge-border text-sm text-forge-muted">
            <MousePointerClick size={16} className="text-forge-accent shrink-0" />
            <span>Drag a block from the left sidebar</span>
          </div>
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-forge-surface border border-forge-border
                       text-sm text-forge-muted hover:border-forge-accent hover:text-forge-text transition-colors"
          >
            <LayoutTemplate size={16} className="text-forge-accent shrink-0" />
            <span>Load a preset template</span>
          </button>
          <button
            onClick={onOpenImport}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-forge-surface border border-forge-border
                       text-sm text-forge-muted hover:border-forge-accent hover:text-forge-text transition-colors"
          >
            <Upload size={16} className="text-forge-accent shrink-0" />
            <span>Import a SKILL.md file</span>
          </button>
        </div>
      </div>
    </div>
  );
}
