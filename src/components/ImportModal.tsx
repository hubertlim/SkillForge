import { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { parseSkillMd, parsedSkillToNodes } from '../lib/importSkill';
import { useForgeStore } from '../store';
import { showToast } from './Toast';

interface Props {
  onClose: () => void;
}

export default function ImportModal({ onClose }: Props) {
  const [content, setContent] = useState('');
  const store = useForgeStore();

  const handleImport = () => {
    const parsed = parseSkillMd(content);
    if (!parsed) {
      showToast('Could not parse SKILL.md — check the format', 'error');
      return;
    }
    const { nodes, edges, skillName, skillDescription } = parsedSkillToNodes(parsed);
    store.loadWorkflow(nodes, edges, skillName, skillDescription);
    showToast(`Imported "${skillName}" with ${nodes.length} steps`);
    onClose();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setContent(reader.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Import SKILL.md</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-forge-border transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3 flex-1 overflow-y-auto">
          <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-forge-border
                            hover:border-forge-accent cursor-pointer transition-colors text-sm text-forge-muted">
            <FileText size={16} />
            <span>Choose a SKILL.md file</span>
            <input type="file" accept=".md,.markdown" onChange={handleFile} className="hidden" />
          </label>

          <div className="text-xs text-forge-muted text-center">or paste content below</div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder={`---\nname: "my-skill"\ndescription: "When to activate"\n---\n\n## Step 1: 💡 Brainstorm\n\n> Explore ideas\n\n- Gather requirements\n- List approaches`}
            className="w-full bg-forge-bg border border-forge-border rounded-lg px-4 py-3 text-xs
                       font-mono leading-relaxed resize-y focus:outline-none focus:border-forge-accent"
          />
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-forge-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm border border-forge-border hover:bg-forge-border transition-colors">
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!content.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-forge-accent hover:bg-forge-accent-hover
                       text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload size={14} />
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
