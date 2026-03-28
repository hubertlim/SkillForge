# Contributing to SkillForge

Thanks for your interest in contributing. Here's how to get started.

## Ways to contribute

- **Submit a skill** — drop a `SKILL.md` into `community-skills/` and open a PR
- **Report a bug** — use the [Bug Report](https://github.com/user/skillforge/issues/new?template=bug_report.yml) template
- **Request a feature** — use the [Feature Request](https://github.com/user/skillforge/issues/new?template=feature_request.yml) template
- **Improve docs** — typos, clarifications, examples — all welcome
- **Add a skill block** — new block templates go in `src/lib/skillBlocks.ts`
- **Fix an issue** — check [good first issues](https://github.com/user/skillforge/labels/good%20first%20issue)

## Development setup

```bash
git clone https://github.com/user/skillforge.git
cd skillforge
npm install
npm run dev
```

Or with Docker:

```bash
docker compose up --build
```

## Pull request process

1. Fork the repo and create a branch from `main`
2. Make your changes — keep PRs focused on a single concern
3. Ensure the app builds without errors (`npm run build`)
4. Follow existing code style (TypeScript strict, Tailwind classes)
5. Write a clear PR description explaining what and why
6. Reference any related issues

## Submitting community skills

1. Create a folder under `community-skills/` with your skill name (e.g. `community-skills/api-design/`)
2. Add your `SKILL.md` file inside it
3. Optionally add a brief `README.md` describing the workflow
4. Open a PR with the `community-skill` label

## Code style

- TypeScript with strict mode
- Functional React components with hooks
- Zustand for state management
- Tailwind CSS for styling (no CSS modules)
- Descriptive variable names over comments

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new skill block for API design
fix: correct edge rendering on node deletion
docs: update README quickstart section
```

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
