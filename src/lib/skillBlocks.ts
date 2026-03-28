import type { SkillBlockTemplate } from '../types';

export const SKILL_BLOCKS: SkillBlockTemplate[] = [
  {
    id: 'brainstorm',
    label: 'Brainstorm',
    category: 'planning',
    icon: '💡',
    description: 'Generate and explore ideas before committing to a plan',
    defaultInstructions: `- Gather requirements from the user
- List at least 3 possible approaches
- Evaluate trade-offs for each approach
- Recommend the best path forward with reasoning`,
  },
  {
    id: 'plan',
    label: 'Plan',
    category: 'planning',
    icon: '📋',
    description: 'Create a structured implementation plan',
    defaultInstructions: `- Break the task into discrete, ordered steps
- Identify dependencies between steps
- Estimate complexity for each step
- Define clear acceptance criteria`,
  },
  {
    id: 'implement',
    label: 'Implement',
    category: 'coding',
    icon: '⚡',
    description: 'Write production code following best practices',
    defaultInstructions: `- Follow the established plan step by step
- Write clean, idiomatic code
- Add inline comments for complex logic
- Keep functions small and focused`,
  },
  {
    id: 'refactor',
    label: 'Refactor',
    category: 'coding',
    icon: '🔧',
    description: 'Improve code structure without changing behavior',
    defaultInstructions: `- Identify code smells and duplication
- Extract reusable functions and modules
- Improve naming for clarity
- Ensure all existing tests still pass after changes`,
  },
  {
    id: 'test-first',
    label: 'Test First (TDD)',
    category: 'testing',
    icon: '🧪',
    description: 'Write tests before implementation code',
    defaultInstructions: `- Write a failing test for the next requirement
- Implement the minimum code to make it pass
- Refactor while keeping tests green
- Repeat for each requirement`,
  },
  {
    id: 'test-suite',
    label: 'Test Suite',
    category: 'testing',
    icon: '✅',
    description: 'Generate comprehensive test coverage',
    defaultInstructions: `- Write unit tests for all public functions
- Add edge case and error path tests
- Include integration tests for key workflows
- Aim for >80% code coverage`,
  },
  {
    id: 'code-review',
    label: 'Code Review',
    category: 'review',
    icon: '🔍',
    description: 'Review code for quality, security, and correctness',
    defaultInstructions: `- Check for security vulnerabilities
- Verify error handling is comprehensive
- Ensure consistent code style
- Flag any performance concerns
- Validate that tests cover critical paths`,
  },
  {
    id: 'document',
    label: 'Document',
    category: 'review',
    icon: '📝',
    description: 'Generate documentation for the codebase',
    defaultInstructions: `- Write a clear README with setup instructions
- Document public API with examples
- Add JSDoc/docstrings to exported functions
- Include architecture decision records if relevant`,
  },
  {
    id: 'debug',
    label: 'Debug',
    category: 'utility',
    icon: '🐛',
    description: 'Systematically diagnose and fix issues',
    defaultInstructions: `- Reproduce the issue with a minimal test case
- Add logging to narrow down the root cause
- Fix the underlying issue, not just symptoms
- Add a regression test to prevent recurrence`,
  },
  {
    id: 'deploy-check',
    label: 'Deploy Check',
    category: 'utility',
    icon: '🚀',
    description: 'Validate the project is ready for deployment',
    defaultInstructions: `- Run the full test suite
- Check for environment variable requirements
- Verify build completes without errors
- Review any migration or setup scripts`,
  },
  {
    id: 'custom',
    label: 'Custom Step',
    category: 'custom',
    icon: '⚙️',
    description: 'A blank step — define your own instructions',
    defaultInstructions: `- Describe what this step should do\n- Add your custom instructions here`,
  },
];
