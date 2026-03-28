import { ReactFlowProvider } from '@xyflow/react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import NodeEditor from './components/NodeEditor';
import ExportPanel from './components/ExportPanel';
import { useForgeStore } from './store';
import { FileDown } from 'lucide-react';

export default function App() {
  const { showExport, setShowExport, nodes } = useForgeStore();

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-11 shrink-0 bg-forge-surface border-b border-forge-border flex items-center justify-between px-4">
          <span className="text-xs text-forge-muted">
            {nodes.length} block{nodes.length !== 1 ? 's' : ''} on canvas
          </span>
          <button
            onClick={() => setShowExport(true)}
            disabled={nodes.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
                       bg-forge-accent hover:bg-forge-accent-hover text-white transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileDown size={13} />
            Export SKILL.md
          </button>
        </header>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          <NodeEditor />
        </div>
      </div>

      {showExport && <ExportPanel />}
    </ReactFlowProvider>
  );
}
