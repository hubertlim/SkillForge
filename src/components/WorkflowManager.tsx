import { useState, useEffect } from 'react';
import { X, Save, FolderOpen, Trash2, Plus } from 'lucide-react';
import { listWorkflows, saveWorkflow, deleteWorkflow, generateId, type SavedWorkflow } from '../lib/workflowManager';
import { useForgeStore } from '../store';
import { showToast } from './Toast';
import type { Node } from '@xyflow/react';
import type { SkillNodeData } from '../types';

interface Props {
  onClose: () => void;
}

export default function WorkflowManager({ onClose }: Props) {
  const store = useForgeStore();
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([]);
  const [tab, setTab] = useState<'save' | 'load'>('load');

  useEffect(() => {
    setWorkflows(listWorkflows());
  }, []);

  const handleSave = () => {
    const wf: SavedWorkflow = {
      id: generateId(),
      name: store.skillName,
      description: store.skillDescription,
      nodes: JSON.parse(JSON.stringify(store.nodes)),
      edges: JSON.parse(JSON.stringify(store.edges)),
      updatedAt: Date.now(),
    };
    saveWorkflow(wf);
    setWorkflows(listWorkflows());
    showToast(`Saved "${wf.name}"`);
  };

  const handleLoad = (wf: SavedWorkflow) => {
    store.loadWorkflow(
      wf.nodes as Node<SkillNodeData>[],
      wf.edges,
      wf.name,
      wf.description,
    );
    showToast(`Loaded "${wf.name}"`);
    onClose();
  };

  const handleDelete = (id: string, name: string) => {
    deleteWorkflow(id);
    setWorkflows(listWorkflows());
    showToast(`Deleted "${name}"`);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Workflows</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-forge-border transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-forge-border">
          <button
            onClick={() => setTab('load')}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
              tab === 'load' ? 'text-forge-accent border-b-2 border-forge-accent' : 'text-forge-muted hover:text-forge-text'
            }`}
          >
            <FolderOpen size={12} className="inline mr-1.5" />
            Saved Workflows
          </button>
          <button
            onClick={() => setTab('save')}
            className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
              tab === 'save' ? 'text-forge-accent border-b-2 border-forge-accent' : 'text-forge-muted hover:text-forge-text'
            }`}
          >
            <Save size={12} className="inline mr-1.5" />
            Save Current
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'save' ? (
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs text-forge-muted">
                Save the current canvas as a named workflow. You can load it later from the Saved Workflows tab.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-forge-muted">Name:</span>
                <span className="font-medium">{store.skillName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-forge-muted">Blocks:</span>
                <span>{store.nodes.length}</span>
              </div>
              <button
                onClick={handleSave}
                disabled={store.nodes.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-forge-accent hover:bg-forge-accent-hover
                           text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={14} />
                Save Workflow
              </button>
            </div>
          ) : (
            <div className="px-5 py-3 space-y-2">
              {workflows.length === 0 ? (
                <div className="text-center py-8">
                  <Plus size={24} className="text-forge-muted mx-auto mb-2" />
                  <p className="text-sm text-forge-muted">No saved workflows yet</p>
                  <p className="text-xs text-forge-muted/60 mt-1">Use the Save tab to save your current canvas</p>
                </div>
              ) : (
                workflows
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((wf) => (
                    <div
                      key={wf.id}
                      className="flex items-center justify-between px-4 py-3 rounded-lg border border-forge-border hover:border-forge-accent/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm truncate">{wf.name}</div>
                        <div className="text-[11px] text-forge-muted">
                          {wf.nodes.length} blocks &middot; {formatDate(wf.updatedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 ml-3 shrink-0">
                        <button
                          onClick={() => handleLoad(wf)}
                          className="px-3 py-1.5 rounded-lg text-xs bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDelete(wf.id, wf.name)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-forge-muted hover:text-red-400 transition-colors"
                          aria-label="Delete workflow"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
