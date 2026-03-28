import { useState } from 'react';
import { X, Search } from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  content: string;
}

const DOCS: DocSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: `SkillForge is a visual drag-and-drop builder for composable AI agent skills. It lets you create skill workflows by dragging blocks onto a canvas, connecting them, editing their instructions, and exporting the result as a SKILL.md file, Kiro steering file, or JSON.

Skills work with Claude Code, Kiro, GitHub Copilot, Cursor, and any agent that reads the open skill format.`,
  },
  {
    id: 'blocks',
    title: 'Skill Blocks',
    content: `The sidebar contains 15 predefined blocks across 6 categories:

Planning: Brainstorm, Plan
Coding: Implement, Refactor
Testing: Test First (TDD), Test Suite
Review: Code Review, Document, Security Audit, Accessibility
Utility: Debug, Deploy Check, Performance, Migration
Custom: Custom Step (blank template)

Each block has a default set of instructions that you can fully customize. Drag any block from the sidebar onto the canvas to add it to your workflow.`,
  },
  {
    id: 'canvas',
    title: 'Canvas',
    content: `The canvas is your workspace. You can:

- Drag blocks from the sidebar to add them
- Pan by clicking and dragging the background
- Zoom with the scroll wheel
- Select a block by clicking it
- Move blocks by dragging them
- Delete a block by selecting it and pressing Delete
- Right-click a block for quick actions (duplicate, delete, change category)
- Snap-to-grid is enabled (20px grid) for clean alignment
- Auto-connect: dropping a block near and below another will automatically wire them`,
  },
  {
    id: 'connections',
    title: 'Connections',
    content: `Connect blocks by dragging from the bottom handle of one block to the top handle of another. This defines the execution order of your workflow.

Connections are validated:
- No self-connections (a block can't connect to itself)
- No duplicate connections
- No cycles (the workflow must be a directed acyclic graph)

Click the "+" label on any connection to add an annotation (e.g. "on success", "if tests pass").`,
  },
  {
    id: 'editing',
    title: 'Editing Blocks',
    content: `Click any block to select it. The right panel shows its properties:

- Label: the block's display name
- Category: determines the color and grouping
- Description: a short summary shown on the block
- Instructions: the Markdown content that gets exported (this is the core of your skill)
- Notes: internal annotations that are NOT exported (for your own reference)

You can also collapse/expand blocks using the chevron icon to save canvas space.`,
  },
  {
    id: 'export',
    title: 'Export',
    content: `Click the Export button (or press Ctrl+S) to open the export panel. You can export in three formats:

SKILL.md: The standard skill format for Claude Code, Copilot, Cursor, and other agents. Includes YAML frontmatter with name and description, followed by ordered steps.

Kiro Steering: The .kiro/steering/ format for Kiro. Includes frontmatter with description and inclusion mode.

JSON: Machine-readable format for programmatic use. Contains the workflow as a structured object.

You can copy to clipboard or download as a file.`,
  },
  {
    id: 'sharing',
    title: 'Sharing',
    content: `Share button: Encodes your entire workflow into a URL. Anyone who opens the link will see your exact workflow loaded on their canvas.

Screenshot: Click the camera icon to export your canvas as a high-resolution PNG image. Great for sharing on social media or documentation.`,
  },
  {
    id: 'import',
    title: 'Import',
    content: `Click Import to load an existing SKILL.md file. You can either:

- Upload a .md file from your computer
- Paste the SKILL.md content directly

The parser auto-detects step headings, descriptions, instructions, categories, and icons.`,
  },
  {
    id: 'gallery',
    title: 'Community Gallery',
    content: `The Gallery contains community-contributed skill workflows. You can:

- Browse all available skills
- Search by name, description, or tag
- Preview the full SKILL.md content
- Load any skill onto your canvas with one click

Want to contribute? Export your workflow and submit a PR to the community-skills/ directory on GitHub.`,
  },
  {
    id: 'workflows',
    title: 'Saved Workflows',
    content: `The Workflows panel lets you save and manage multiple workflows in your browser's localStorage.

- Save: Saves the current canvas state with its name and timestamp
- Load: Restores a previously saved workflow onto the canvas
- Delete: Removes a saved workflow

This is useful for working on multiple skill workflows without losing progress.`,
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    content: `Ctrl+Z: Undo
Ctrl+Shift+Z / Ctrl+Y: Redo
Ctrl+S: Open export panel
Delete / Backspace: Delete selected block
?: Toggle keyboard shortcuts help
Escape: Close any open panel

On Mac, use Cmd instead of Ctrl.`,
  },
  {
    id: 'toolbar',
    title: 'Toolbar',
    content: `The top toolbar contains:

Left side:
- Workflow name (click to rename)
- Block count
- Undo / Redo
- Clear canvas (with confirmation)
- Auto-layout (arranges blocks in topological order)
- Fit to view (zooms to show all blocks)
- Screenshot (exports canvas as PNG)
- Keyboard shortcuts help

Right side:
- Gallery (community skills)
- Workflows (save/load)
- Presets (built-in templates)
- Import (load SKILL.md)
- Share (copy URL)
- Export (download workflow)`,
  },
];

interface Props {
  onClose: () => void;
}

export default function DocsPanel({ onClose }: Props) {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  const filtered = search.trim()
    ? DOCS.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.content.toLowerCase().includes(search.toLowerCase()),
      )
    : DOCS;

  const active = DOCS.find((d) => d.id === activeSection) ?? DOCS[0];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-[760px] h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <h2 className="font-bold text-base">Documentation</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-forge-border transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar nav */}
          <div className="w-48 shrink-0 border-r border-forge-border flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-forge-border">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-forge-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search docs..."
                  className="w-full bg-forge-bg border border-forge-border rounded-lg pl-7 pr-2 py-1 text-[11px]
                             focus:outline-none focus:border-forge-accent placeholder:text-forge-muted/50"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {filtered.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveSection(doc.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    activeSection === doc.id
                      ? 'text-forge-accent bg-forge-accent/10'
                      : 'text-forge-muted hover:text-forge-text hover:bg-forge-bg'
                  }`}
                >
                  {doc.title}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <h3 className="font-bold text-sm mb-3">{active.title}</h3>
            <div className="text-sm text-forge-muted leading-relaxed whitespace-pre-line">
              {active.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
