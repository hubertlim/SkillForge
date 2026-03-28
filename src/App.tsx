import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import NodeEditor from './components/NodeEditor';
import ExportPanel from './components/ExportPanel';
import ImportModal from './components/ImportModal';
import PresetsPanel from './components/PresetsPanel';
import KeyboardHelp from './components/KeyboardHelp';
import ValidationBar from './components/ValidationBar';
import ConfirmDialog from './components/ConfirmDialog';
import ToastContainer, { showToast } from './components/Toast';
import { useForgeStore } from './store';
import { encodeWorkflow, decodeWorkflow } from './lib/shareUrl';
import {
  FileDown, Upload, LayoutTemplate, Share2, Trash2,
  Undo2, AlignVerticalSpaceAround, Keyboard, Maximize2,
} from 'lucide-react';
import type { Node } from '@xyflow/react';
import type { SkillNodeData } from './types';

export default function App() {
  const store = useForgeStore();
  const {
    showExport, setShowExport, nodes, edges, skillName, skillDescription,
    setSkillName, undo, clearCanvas, autoLayout, fitView,
  } = store;
  const [showImport, setShowImport] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  // Load from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const decoded = decodeWorkflow(hash);
    if (decoded) {
      store.loadWorkflow(decoded.nodes, decoded.edges, decoded.skillName, decoded.skillDescription);
      showToast(`Loaded shared workflow "${decoded.skillName}"`);
      window.location.hash = '';
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === '?') setShowHelp((v) => !v);
      if (e.key === 'Escape') {
        setShowExport(false);
        setShowImport(false);
        setShowPresets(false);
        setShowHelp(false);
        setShowClearConfirm(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setShowExport]);

  const handleShare = async () => {
    const encoded = encodeWorkflow(
      nodes as Node<SkillNodeData>[],
      edges,
      skillName,
      skillDescription,
    );
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    await navigator.clipboard.writeText(url);
    showToast('Share link copied to clipboard');
  };

  const handleClear = () => {
    clearCanvas();
    setShowClearConfirm(false);
    showToast('Canvas cleared');
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-11 shrink-0 bg-forge-surface border-b border-forge-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* Editable workflow title */}
            {editingTitle ? (
              <input
                autoFocus
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitle(false); }}
                className="bg-forge-bg border border-forge-accent rounded px-2 py-0.5 text-xs w-36
                           focus:outline-none text-forge-text"
              />
            ) : (
              <button
                onClick={() => setEditingTitle(true)}
                className="text-xs text-forge-text hover:text-forge-accent transition-colors truncate max-w-[140px]"
                title="Click to rename workflow"
              >
                {skillName}
              </button>
            )}

            <span className="text-[10px] text-forge-muted">
              {nodes.length} block{nodes.length !== 1 ? 's' : ''}
            </span>

            <div className="flex items-center gap-0.5 ml-1">
              <button
                onClick={undo}
                className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors"
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
              >
                <Undo2 size={13} />
              </button>
              <button
                onClick={() => nodes.length > 0 && setShowClearConfirm(true)}
                disabled={nodes.length === 0}
                className="p-1.5 rounded hover:bg-red-500/20 text-forge-muted hover:text-red-400 transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
                title="Clear canvas"
                aria-label="Clear canvas"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={autoLayout}
                disabled={nodes.length === 0}
                className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
                title="Auto-layout"
                aria-label="Auto-layout"
              >
                <AlignVerticalSpaceAround size={13} />
              </button>
              <button
                onClick={fitView}
                disabled={nodes.length === 0}
                className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
                title="Fit to view"
                aria-label="Fit to view"
              >
                <Maximize2 size={13} />
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors"
                title="Keyboard shortcuts (?)"
                aria-label="Keyboard shortcuts"
              >
                <Keyboard size={13} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPresets(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                         border border-forge-border hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors"
            >
              <LayoutTemplate size={12} />
              Presets
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                         border border-forge-border hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors"
            >
              <Upload size={12} />
              Import
            </button>
            <button
              onClick={handleShare}
              disabled={nodes.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                         border border-forge-border hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Share2 size={12} />
              Share
            </button>
            <button
              onClick={() => setShowExport(true)}
              disabled={nodes.length === 0}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
                         bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FileDown size={13} />
              Export
            </button>
          </div>
        </header>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas
            onOpenPresets={() => setShowPresets(true)}
            onOpenImport={() => setShowImport(true)}
          />
          <NodeEditor />
        </div>

        <ValidationBar />
      </div>

      {showExport && <ExportPanel />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
      {showPresets && <PresetsPanel onClose={() => setShowPresets(false)} />}
      {showHelp && <KeyboardHelp onClose={() => setShowHelp(false)} />}
      {showClearConfirm && (
        <ConfirmDialog
          title="Clear canvas?"
          message={`This will remove all ${nodes.length} blocks and their connections. This action can be undone with Ctrl+Z.`}
          confirmLabel="Clear all"
          onConfirm={handleClear}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
      <ToastContainer />
    </ReactFlowProvider>
  );
}
