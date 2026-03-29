import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Canvas from './components/canvas/Canvas';
import Sidebar from './components/layout/Sidebar';
import NodeEditor from './components/panels/NodeEditor';
import ExportPanel from './components/panels/ExportPanel';
import ImportModal from './components/panels/ImportModal';
import PresetsPanel from './components/panels/PresetsPanel';
import GalleryPanel from './components/panels/GalleryPanel';
import KeyboardHelp from './components/panels/KeyboardHelpardHelp';
import ValidationBar from './components/ui/ValidationBar';
import ConfirmDialog from './components/ui/ConfirmDialoglog';
import MobileWarning from './components/ui/MobileWarninging';
import WorkflowManager from './components/panels/WorkflowManager';
import WelcomeScreen from './components/onboarding/WelcomeScreenlcomeScreen';
import InteractiveTutorial from './components/onboarding/InteractiveTutorial';
import DocsPanel from './components/panels/DocsPanelcsPanel';
import { shouldShowOnboarding, dismissOnboarding } from './components/onboarding/onboardingoarding';
import ToastContainer, { showToast } from './components/ui/Toastast';
import { useForgeStore } from './store';
import { encodeWorkflow, decodeWorkflow } from './lib/shareUrl';
import {
  FileDown, Upload, LayoutTemplate, Share2, Trash2,
  Undo2, Redo2, AlignVerticalSpaceAround, Maximize2, BookOpen, Camera,
  FolderOpen, HelpCircle,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Node } from '@xyflow/react';
import type { SkillNodeData } from './types';

export default function App() {
  const store = useForgeStore();
  const {
    showExport, setShowExport, nodes, edges, skillName, skillDescription,
    setSkillName, undo, redo, clearCanvas, autoLayout, fitView,
  } = store;

  // Modal states
  const [showImport, setShowImport] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showWorkflows, setShowWorkflows] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  // Onboarding states
  const [showWelcome, setShowWelcome] = useState(() => shouldShowOnboarding());
  const [showTutorial, setShowTutorial] = useState(false);

  // Help dropdown
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);

  // Load from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const decoded = decodeWorkflow(hash);
    if (decoded) {
      store.loadWorkflow(decoded.nodes, decoded.edges, decoded.skillName, decoded.skillDescription);
      showToast(`Loaded shared workflow "${decoded.skillName}"`);
      window.location.hash = '';
      setShowWelcome(false); // Don't show welcome if loading a shared workflow
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
        setShowGallery(false);
        setShowHelp(false);
        setShowClearConfirm(false);
        setShowWorkflows(false);
        setShowDocs(false);
        setHelpMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setShowExport]);

  // Close help menu on outside click
  useEffect(() => {
    if (!helpMenuOpen) return;
    const handler = () => setHelpMenuOpen(false);
    setTimeout(() => document.addEventListener('click', handler), 0);
    return () => document.removeEventListener('click', handler);
  }, [helpMenuOpen]);

  const handleShare = async () => {
    const encoded = encodeWorkflow(nodes as Node<SkillNodeData>[], edges, skillName, skillDescription);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    await navigator.clipboard.writeText(url);
    showToast('Share link copied to clipboard');
  };

  const handleClear = () => {
    clearCanvas();
    setShowClearConfirm(false);
    showToast('Canvas cleared');
  };

  const handleScreenshot = async () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewport) return;
    try {
      const dataUrl = await toPng(viewport, {
        backgroundColor: '#0f0f13',
        pixelRatio: 2,
        filter: (node) => {
          const cls = (node as HTMLElement).className ?? '';
          if (typeof cls === 'string' && (cls.includes('react-flow__controls') || cls.includes('react-flow__minimap'))) return false;
          return true;
        },
      });
      const link = document.createElement('a');
      link.download = `${skillName}-workflow.png`;
      link.href = dataUrl;
      link.click();
      showToast('Screenshot saved');
    } catch {
      showToast('Screenshot failed', 'error');
    }
  };

  // Welcome screen handlers
  const handleWelcomeStartTutorial = () => {
    dismissOnboarding();
    setShowWelcome(false);
    setShowTutorial(true);
  };

  const handleWelcomeOpenDocs = () => {
    dismissOnboarding();
    setShowWelcome(false);
    setShowDocs(true);
  };

  const handleWelcomeSkip = () => {
    dismissOnboarding();
    setShowWelcome(false);
  };

  return (
    <>
      <MobileWarning />
      <ReactFlowProvider>
        <div className="h-screen w-screen flex-col overflow-hidden hidden md:flex">
          <header className="h-11 shrink-0 bg-forge-surface border-b border-forge-border flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {editingTitle ? (
                <input
                  autoFocus
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitle(false); }}
                  className="bg-forge-bg border border-forge-accent rounded px-2 py-0.5 text-xs w-36 focus:outline-none text-forge-text"
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
              <span className="text-[10px] text-forge-muted">{nodes.length} block{nodes.length !== 1 ? 's' : ''}</span>

              <div className="flex items-center gap-0.5 ml-1">
                <button onClick={undo} className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors" title="Undo (Ctrl+Z)" aria-label="Undo">
                  <Undo2 size={13} />
                </button>
                <button onClick={redo} className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors" title="Redo (Ctrl+Shift+Z)" aria-label="Redo">
                  <Redo2 size={13} />
                </button>
                <div className="w-px h-4 bg-forge-border mx-0.5" />
                <button onClick={() => nodes.length > 0 && setShowClearConfirm(true)} disabled={nodes.length === 0} className="p-1.5 rounded hover:bg-red-500/20 text-forge-muted hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Clear canvas" aria-label="Clear canvas">
                  <Trash2 size={13} />
                </button>
                <button onClick={autoLayout} disabled={nodes.length === 0} className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Auto-layout" aria-label="Auto-layout">
                  <AlignVerticalSpaceAround size={13} />
                </button>
                <button onClick={fitView} disabled={nodes.length === 0} className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Fit to view" aria-label="Fit to view">
                  <Maximize2 size={13} />
                </button>
                <button onClick={handleScreenshot} disabled={nodes.length === 0} className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Screenshot (PNG)" aria-label="Screenshot">
                  <Camera size={13} />
                </button>
                <div className="w-px h-4 bg-forge-border mx-0.5" />

                {/* Help dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setHelpMenuOpen(!helpMenuOpen); }}
                    className="p-1.5 rounded hover:bg-forge-border text-forge-muted hover:text-forge-text transition-colors"
                    title="Help & Learning"
                    aria-label="Help menu"
                  >
                    <HelpCircle size={13} />
                  </button>
                  {helpMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-forge-surface border border-forge-border rounded-lg shadow-2xl py-1 min-w-[180px] z-50">
                      <button
                        onClick={() => { setShowTutorial(true); setHelpMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-forge-text hover:bg-forge-bg transition-colors"
                      >
                        Interactive Tutorial
                      </button>
                      <button
                        onClick={() => { setShowDocs(true); setHelpMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-forge-text hover:bg-forge-bg transition-colors"
                      >
                        Documentation
                      </button>
                      <button
                        onClick={() => { setShowHelp(true); setHelpMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-forge-text hover:bg-forge-bg transition-colors"
                      >
                        Keyboard Shortcuts
                      </button>
                      <div className="border-t border-forge-border my-1" />
                      <a
                        href="https://github.com/hubertlim/SkillForge"
                        target="_blank"
                        rel="noopener"
                        className="block px-3 py-2 text-xs text-forge-muted hover:text-forge-text hover:bg-forge-bg transition-colors"
                      >
                        GitHub Repository
                      </a>
                      <a
                        href="https://github.com/hubertlim/SkillForge/issues/new?template=bug_report.yml"
                        target="_blank"
                        rel="noopener"
                        className="block px-3 py-2 text-xs text-forge-muted hover:text-forge-text hover:bg-forge-bg transition-colors"
                      >
                        Report a Bug
                      </a>
                      <a
                        href="https://github.com/hubertlim/SkillForge/issues/new?template=feature_request.yml"
                        target="_blank"
                        rel="noopener"
                        className="block px-3 py-2 text-xs text-forge-muted hover:text-forge-text hover:bg-forge-bg transition-colors"
                      >
                        Request a Feature
                      </a>
                      <div className="border-t border-forge-border my-1" />
                      <a
                        href={`https://x.com/intent/tweet?text=${encodeURIComponent('Check out SkillForge — a visual drag-and-drop builder for AI agent skills')}&url=${encodeURIComponent('https://hubertlim.github.io/SkillForge/')}`}
                        target="_blank"
                        rel="noopener"
                        className="block px-3 py-2 text-xs text-forge-muted hover:text-forge-text hover:bg-forge-bg transition-colors"
                      >
                        Share on X
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowGallery(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-forge-border hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors">
                <BookOpen size={12} /> Gallery
              </button>
              <button onClick={() => setShowWorkflows(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-forge-border hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors">
                <FolderOpen size={12} /> Workflows
              </button>
              <button onClick={() => setShowPresets(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-forge-border hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors">
                <LayoutTemplate size={12} /> Presets
              </button>
              <button onClick={() => setShowImport(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-forge-border hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors">
                <Upload size={12} /> Import
              </button>
              <button onClick={handleShare} disabled={nodes.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-forge-border hover:border-forge-accent text-forge-muted hover:text-forge-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <Share2 size={12} /> Share
              </button>
              <button onClick={() => setShowExport(true)} disabled={nodes.length === 0} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                <FileDown size={13} /> Export
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <Canvas onOpenPresets={() => setShowPresets(true)} onOpenImport={() => setShowImport(true)} />
            <NodeEditor />
          </div>
          <ValidationBar />
        </div>

        {/* Modals */}
        {showExport && <ExportPanel />}
        {showImport && <ImportModal onClose={() => setShowImport(false)} />}
        {showPresets && <PresetsPanel onClose={() => setShowPresets(false)} />}
        {showGallery && <GalleryPanel onClose={() => setShowGallery(false)} />}
        {showWorkflows && <WorkflowManager onClose={() => setShowWorkflows(false)} />}
        {showHelp && <KeyboardHelp onClose={() => setShowHelp(false)} />}
        {showDocs && <DocsPanel onClose={() => setShowDocs(false)} />}
        {showClearConfirm && (
          <ConfirmDialog
            title="Clear canvas?"
            message={`This will remove all ${nodes.length} blocks and their connections. This action can be undone with Ctrl+Z.`}
            confirmLabel="Clear all"
            onConfirm={handleClear}
            onCancel={() => setShowClearConfirm(false)}
          />
        )}

        {/* Onboarding */}
        {showWelcome && (
          <WelcomeScreen
            onStartTutorial={handleWelcomeStartTutorial}
            onOpenDocs={handleWelcomeOpenDocs}
            onSkip={handleWelcomeSkip}
          />
        )}
        {showTutorial && (
          <InteractiveTutorial
            onClose={() => setShowTutorial(false)}
            onComplete={() => setShowTutorial(false)}
          />
        )}

        <ToastContainer />
      </ReactFlowProvider>
    </>
  );
}
