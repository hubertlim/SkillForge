import { AlertTriangle } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[380px] flex flex-col">
        <div className="px-5 py-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">{title}</h2>
            <p className="text-xs text-forge-muted leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-forge-border">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs border border-forge-border hover:bg-forge-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-xs bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
