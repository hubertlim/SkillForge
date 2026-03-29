import { useState } from 'react';
import { useForgeStore } from '../../store';
import { exportWorkflow, FORMATS, type ExportFormat } from '../../lib/exportFormats';
import { X, Copy, Download } from 'lucide-react';
import { showToast } from '../ui/Toast';
import type { Node } from '@xyflow/react';
import type { SkillNodeData } from '../../types';

export default function ExportPanel() {
  const { nodes, edges, skillName, skillDescription, setSkillName, setSkillDescription, setShowExport } =
    useForgeStore();
  const [format, setFormat] = useState<ExportFormat>('skill-md');

  const formatInfo = FORMATS.find((f) => f.id === format)!;

  const output = exportWorkflow(
    format,
    nodes as Node<SkillNodeData>[],
    edges,
    { skillName, skillDescription },
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    showToast('Copied to clipboard');
  };

  const handleDownload = () => {
    const mime = format === 'json' ? 'application/json' : 'text/markdown';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = formatInfo.filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${formatInfo.filename}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[720px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Export Workflow</h2>
          <button
            onClick={() => setShowExport(false)}
            className="p-1.5 rounded hover:bg-forge-border transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Format selector */}
        <div className="px-5 py-3 border-b border-forge-border">
          <div className="flex gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                  format === f.id
                    ? 'bg-forge-accent/20 border-forge-accent text-forge-accent'
                    : 'border-forge-border text-forge-muted hover:border-forge-accent/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-forge-muted mt-1.5">{formatInfo.description}</p>
        </div>

        {/* Metadata */}
        <div className="px-5 py-3 space-y-2.5 border-b border-forge-border">
          <div>
            <label className="block text-xs text-forge-muted mb-1">Skill Name</label>
            <input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:border-forge-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-forge-muted mb-1">Description (triggers activation)</label>
            <input
              value={skillDescription}
              onChange={(e) => setSkillDescription(e.target.value)}
              className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:border-forge-accent"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <pre className="bg-forge-bg border border-forge-border rounded-lg p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap text-forge-text">
            {output}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-forge-border">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-forge-muted">{formatInfo.filename}</span>
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(`I just built a "${skillName}" AI agent skill workflow with SkillForge`)}&url=${encodeURIComponent('https://hubertlim.github.io/SkillForge/')}`}
              target="_blank"
              rel="noopener"
              className="text-[11px] text-forge-muted hover:text-forge-accent transition-colors"
            >
              Share on X
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-forge-border
                         hover:bg-forge-border transition-colors"
            >
              <Copy size={14} />
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                         bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
