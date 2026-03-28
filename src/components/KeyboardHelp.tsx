import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'Z'], action: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo' },
  { keys: ['Ctrl', 'Y'], action: 'Redo (alt)' },
  { keys: ['Ctrl', 'S'], action: 'Open export panel' },
  { keys: ['Delete'], action: 'Delete selected node' },
  { keys: ['Backspace'], action: 'Delete selected node' },
  { keys: ['?'], action: 'Toggle this help' },
  { keys: ['Escape'], action: 'Close any open panel' },
];

export default function KeyboardHelp({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[420px] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-forge-border transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-forge-muted">{s.action}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <kbd
                    key={j}
                    className="px-2 py-0.5 rounded bg-forge-bg border border-forge-border text-xs font-mono text-forge-text"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-forge-border flex items-center justify-between">
          <p className="text-xs text-forge-muted">On Mac, use Cmd instead of Ctrl</p>
          <p className="text-xs text-forge-muted">Right-click nodes for more actions</p>
        </div>
      </div>
    </div>
  );
}
