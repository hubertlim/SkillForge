import { useForgeStore } from '../store';
import { exportToSkillMd } from '../lib/exportSkill';
import { X, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import type { Node } from '@xyflow/react';
import type { SkillNodeData } from '../types';

export default function ExportPanel() {
  const { nodes, edges, skillName, skillDescription, setSkillName, setSkillDescription, setShowExport } =
    useForgeStore();
  const [copied, setCopied] = useState(false);

  const output = exportToSkillMd(nodes as Node<SkillNodeData>[], edges, {
    skillName,
    skillDescription,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SKILL.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[700px] max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Export SKILL.md</h2>
          <button
            onClick={() => setShowExport(false)}
            className="p-1.5 rounded hover:bg-forge-border transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3 border-b border-forge-border">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-forge-muted mb-1">Skill Name</label>
              <input
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full bg-forge-bg border border-forge-border rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:border-forge-accent"
              />
            </div>
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

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <pre className="bg-forge-bg border border-forge-border rounded-lg p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap text-forge-text">
            {output}
          </pre>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-forge-border">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-forge-border
                       hover:bg-forge-border transition-colors"
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                       bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors"
          >
            <Download size={14} />
            Download SKILL.md
          </button>
        </div>
      </div>
    </div>
  );
}
