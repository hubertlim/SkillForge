<p align="center">
  <img src="docs/logo.svg" width="120" alt="SkillForge logo" />
</p>

<h1 align="center">SkillForge</h1>

<p align="center">
  Visual drag-and-drop builder for composable AI agent skills
</p>

<p align="center">
  <a href="https://hubertlim.github.io/SkillForge/">Live Demo</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#usage">Usage</a> &bull;
  <a href="#contributing">Contributing</a> &bull;
  <a href="#community-skills">Community Skills</a> &bull;
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <a href="https://hubertlim.github.io/SkillForge/"><img src="https://img.shields.io/badge/demo-live-7c5cfc?style=flat-square" alt="Live Demo" /></a>
  <a href="https://github.com/hubertlim/SkillForge/actions"><img src="https://img.shields.io/github/actions/workflow/status/hubertlim/SkillForge/ci.yml?style=flat-square&label=build" alt="CI" /></a>
  <a href="https://github.com/hubertlim/SkillForge/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-7c5cfc?style=flat-square" alt="MIT License" /></a>
  <a href="https://github.com/hubertlim/SkillForge/stargazers"><img src="https://img.shields.io/github/stars/hubertlim/SkillForge?style=flat-square&color=7c5cfc" alt="Stars" /></a>
  <a href="https://github.com/hubertlim/SkillForge/issues"><img src="https://img.shields.io/github/issues/hubertlim/SkillForge?style=flat-square" alt="Issues" /></a>
  <a href="https://github.com/hubertlim/SkillForge/pulls"><img src="https://img.shields.io/github/issues-pr/hubertlim/SkillForge?style=flat-square" alt="PRs" /></a>
</p>

<!-- Add a screenshot: take one and save as docs/screenshot.png -->
<!-- <p align="center">
  <img src="docs/screenshot.png" width="800" alt="SkillForge screenshot" />
</p> -->

---

## Why SkillForge?

The AI agent skills ecosystem is exploding. But creating skills today means writing YAML and Markdown files by hand.

SkillForge gives you a visual canvas where you drag skill blocks, wire them into workflows, edit instructions inline, and export in multiple formats. Works with **Claude Code**, **Kiro**, **GitHub Copilot**, **Cursor**, and any agent that reads the open skill format.

**[Try it now](https://hubertlim.github.io/SkillForge/)** -- no install required.

## Features

- **Drag and drop** 15 predefined blocks across 6 categories
- **Wire workflows** connect blocks to define execution order
- **Editable edge labels** annotate connections (e.g. "on success", "if tests pass")
- **Inline editing** label, description, category, and Markdown instructions per node
- **Multi-format export** SKILL.md, Kiro steering file, or JSON
- **Canvas screenshot** export your workflow as a PNG image
- **Import** load an existing SKILL.md back onto the canvas (file upload or paste)
- **Shareable links** encode your workflow into a URL and share it with anyone
- **Community gallery** browse, preview, and load community-contributed skills
- **Preset templates** start from TDD, API Design, Bug Fix, or Feature Ship workflows
- **Undo / Redo** Ctrl+Z / Ctrl+Shift+Z with full history stack
- **Keyboard shortcuts** Delete, Ctrl+Z, Ctrl+Y, Ctrl+S, ? for help, Escape to close
- **Right-click menu** duplicate, delete, change category from context menu
- **Step numbering** live topological step badges on each node
- **Node notes** internal annotations that don't get exported
- **Instruction preview** truncated instructions shown directly on nodes
- **Workflow stats** block count, connections, category breakdown when no node selected
- **Auto-layout** snap nodes into a clean vertical chain
- **Snap-to-grid** 20px grid for clean node placement
- **Validation** warnings for disconnected nodes and empty instructions
- **Auto-save** localStorage persistence across page refreshes
- **Collapsible sidebar** maximize canvas space
- **Search** filter sidebar blocks by name or description
- **Editable title** click the workflow name in the header to rename
- **Confirm dialog** safety prompt before clearing the canvas
- **Category-colored minimap** each node colored by its category
- **Fit-to-view** button to zoom to fit all nodes
- **Mobile warning** friendly message on small screens
- **Dark theme** easy on the eyes, built for long sessions
- **Dockerized** one command to run
- **GitHub Pages** live demo auto-deployed on every push

## Quick Start

### Try online

**[https://hubertlim.github.io/SkillForge/](https://hubertlim.github.io/SkillForge/)**

### Docker

```bash
git clone https://github.com/hubertlim/SkillForge.git
cd SkillForge
docker compose up --build
```

Open [http://localhost:5173](http://localhost:5173)

### Local

```bash
git clone https://github.com/hubertlim/SkillForge.git
cd SkillForge
npm install
npm run dev
```

## Usage

1. **Drag** a block from the sidebar onto the canvas
2. **Connect** blocks by dragging from a bottom handle to a top handle
3. **Click** a block to edit its label, description, and instructions
4. **Right-click** a block for quick actions (duplicate, delete, change category)
5. **Click an edge** to add a label to a connection
6. **Export** hit the button in the top bar, pick a format (SKILL.md, Kiro, JSON), preview, copy, or download
7. **Screenshot** click the camera icon to save your workflow as a PNG
8. **Share** click Share to copy a link that anyone can open to load your workflow
9. **Import** click Import to load an existing SKILL.md file or paste its content
10. **Gallery** browse and load community-contributed skill workflows
11. **Presets** click Presets to start from a built-in template
12. **Press ?** to see all keyboard shortcuts

### Example output

```yaml
---
name: "tdd-workflow"
description: "Use when the user asks to build a feature using test-driven development"
---

## Step 1: Brainstorm

> Generate and explore ideas before committing to a plan

- Gather requirements from the user
- List at least 3 possible approaches
- Recommend the best path forward

## Step 2: Test First (TDD)

> Write tests before implementation code

- Write a failing test for the next requirement
- Implement the minimum code to make it pass
- Refactor while keeping tests green

## Step 3: Implement

> Write production code following best practices

- Follow the established plan step by step
- Write clean, idiomatic code

## Step 4: Code Review

> Review code for quality, security, and correctness

- Check for security vulnerabilities
- Verify error handling is comprehensive
```

## Community Skills

Have a great skill workflow? We'd love to feature it.

Browse skills in the app via the **Gallery** button, or contribute your own:

1. Drop your exported `SKILL.md` files in the [`community-skills/`](community-skills/) directory
2. Open a PR with the `community-skill` label
3. See [CONTRIBUTING.md](CONTRIBUTING.md) for details

| Skill | Description |
|-------|-------------|
| [tdd-workflow](community-skills/tdd-workflow/) | Test-driven development: brainstorm, plan, TDD, implement, review |
| [api-first-design](community-skills/api-first-design/) | API-first: requirements, schema, OpenAPI spec, implement, test |
| [code-review-checklist](community-skills/code-review-checklist/) | Code review: context, security, logic, readability, tests |

## Roadmap

- [x] ~~Shareable workflow links~~
- [x] ~~Import existing SKILL.md files~~
- [x] ~~Preset templates~~
- [x] ~~Undo / Redo~~
- [x] ~~Multi-format export (SKILL.md, Kiro steering, JSON)~~
- [x] ~~Right-click context menu~~
- [x] ~~Validation warnings~~
- [x] ~~Auto-layout and snap-to-grid~~
- [x] ~~localStorage persistence~~
- [x] ~~Community skill gallery~~
- [x] ~~Canvas screenshot export~~
- [x] ~~Editable edge labels~~
- [x] ~~Node notes and instruction preview~~
- [x] ~~Workflow stats panel~~
- [x] ~~GitHub Pages live demo~~
- [ ] Skill templates marketplace
- [ ] Multi-agent orchestration view (subagent chains)
- [ ] VS Code / Kiro extension for in-editor skill building
- [ ] Collaborative editing (multiplayer canvas)

## Tech Stack

| Layer | Tech |
|-------|------|
| UI | React 19, TypeScript |
| Canvas | React Flow (@xyflow/react) |
| State | Zustand |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Screenshot | html-to-image |
| Build | Vite |
| Container | Docker |
| Deploy | GitHub Pages |

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

## License

[MIT](LICENSE) -- use it, fork it, build on it.

---

<p align="center">
  <a href="https://hubertlim.github.io/SkillForge/">Try SkillForge</a>
</p>
