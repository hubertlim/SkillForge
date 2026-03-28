import type { SkillNodeData } from '../types';

export interface Preset {
  id: string;
  label: string;
  emoji: string;
  description: string;
  steps: SkillNodeData[];
}

export const PRESETS: Preset[] = [
  {
    id: 'tdd',
    label: 'TDD Workflow',
    emoji: '🧪',
    description: 'Test-driven development: plan → test → implement → review',
    steps: [
      {
        label: 'Plan',
        category: 'planning',
        icon: '📋',
        description: 'Create a structured implementation plan',
        instructions: `- Break the task into discrete, ordered steps\n- Identify dependencies between steps\n- Define clear acceptance criteria`,
      },
      {
        label: 'Test First',
        category: 'testing',
        icon: '🧪',
        description: 'Write tests before implementation code',
        instructions: `- Write a failing test for the next requirement\n- Implement the minimum code to make it pass\n- Refactor while keeping tests green\n- Repeat for each requirement`,
      },
      {
        label: 'Implement',
        category: 'coding',
        icon: '⚡',
        description: 'Write production code following best practices',
        instructions: `- Follow the established plan step by step\n- Write clean, idiomatic code\n- Keep functions small and focused`,
      },
      {
        label: 'Code Review',
        category: 'review',
        icon: '🔍',
        description: 'Review code for quality, security, and correctness',
        instructions: `- Check for security vulnerabilities\n- Verify error handling is comprehensive\n- Validate that tests cover critical paths`,
      },
    ],
  },
  {
    id: 'api-design',
    label: 'API Design',
    emoji: '🌐',
    description: 'Design, implement, test, and document an API',
    steps: [
      {
        label: 'Brainstorm',
        category: 'planning',
        icon: '💡',
        description: 'Explore API design options and resource modeling',
        instructions: `- Identify the resources and their relationships\n- List required endpoints and HTTP methods\n- Consider pagination, filtering, and versioning strategies\n- Evaluate REST vs GraphQL trade-offs`,
      },
      {
        label: 'Design Schema',
        category: 'planning',
        icon: '📋',
        description: 'Define request/response schemas and error formats',
        instructions: `- Define JSON schemas for each endpoint\n- Standardize error response format\n- Document authentication requirements\n- Plan rate limiting strategy`,
      },
      {
        label: 'Implement',
        category: 'coding',
        icon: '⚡',
        description: 'Build the API endpoints',
        instructions: `- Implement routes and controllers\n- Add input validation and sanitization\n- Implement proper HTTP status codes\n- Add middleware for auth and error handling`,
      },
      {
        label: 'Test Suite',
        category: 'testing',
        icon: '✅',
        description: 'Comprehensive API testing',
        instructions: `- Write integration tests for each endpoint\n- Test error cases and edge conditions\n- Verify auth and permission checks\n- Load test critical endpoints`,
      },
      {
        label: 'Document',
        category: 'review',
        icon: '📝',
        description: 'Generate API documentation',
        instructions: `- Write OpenAPI/Swagger spec\n- Add request/response examples\n- Document authentication flow\n- Include rate limit information`,
      },
    ],
  },
  {
    id: 'bug-fix',
    label: 'Bug Fix',
    emoji: '🐛',
    description: 'Systematic bug investigation and fix workflow',
    steps: [
      {
        label: 'Reproduce',
        category: 'utility',
        icon: '🐛',
        description: 'Reproduce the bug with a minimal test case',
        instructions: `- Read the bug report carefully\n- Create a minimal reproduction\n- Document exact steps to trigger the issue\n- Note the expected vs actual behavior`,
      },
      {
        label: 'Diagnose',
        category: 'planning',
        icon: '💡',
        description: 'Find the root cause',
        instructions: `- Add logging around the suspected area\n- Trace the execution path\n- Identify the root cause, not just symptoms\n- Document findings`,
      },
      {
        label: 'Write Regression Test',
        category: 'testing',
        icon: '🧪',
        description: 'Write a test that fails with the current bug',
        instructions: `- Write a test that reproduces the exact failure\n- Confirm the test fails before the fix\n- Cover edge cases related to the bug`,
      },
      {
        label: 'Fix',
        category: 'coding',
        icon: '⚡',
        description: 'Apply the minimal fix',
        instructions: `- Fix the root cause, not symptoms\n- Keep the change as small as possible\n- Ensure the regression test now passes\n- Run the full test suite`,
      },
      {
        label: 'Review',
        category: 'review',
        icon: '🔍',
        description: 'Verify the fix is complete and safe',
        instructions: `- Check for similar bugs elsewhere in the codebase\n- Verify no regressions were introduced\n- Update documentation if behavior changed`,
      },
    ],
  },
  {
    id: 'feature-ship',
    label: 'Feature Ship',
    emoji: '🚀',
    description: 'Full feature lifecycle: brainstorm → ship → document',
    steps: [
      {
        label: 'Brainstorm',
        category: 'planning',
        icon: '💡',
        description: 'Explore approaches and trade-offs',
        instructions: `- Gather requirements from the user\n- List at least 3 possible approaches\n- Evaluate trade-offs for each\n- Recommend the best path forward`,
      },
      {
        label: 'Plan',
        category: 'planning',
        icon: '📋',
        description: 'Break down into implementation tasks',
        instructions: `- Break into discrete, ordered steps\n- Identify dependencies\n- Estimate complexity per step\n- Define acceptance criteria`,
      },
      {
        label: 'Implement',
        category: 'coding',
        icon: '⚡',
        description: 'Build the feature',
        instructions: `- Follow the plan step by step\n- Write clean, idiomatic code\n- Add inline comments for complex logic`,
      },
      {
        label: 'Test',
        category: 'testing',
        icon: '✅',
        description: 'Comprehensive test coverage',
        instructions: `- Unit tests for all new functions\n- Integration tests for the workflow\n- Edge case and error path tests`,
      },
      {
        label: 'Review',
        category: 'review',
        icon: '🔍',
        description: 'Quality and security review',
        instructions: `- Check for security vulnerabilities\n- Verify error handling\n- Ensure consistent code style`,
      },
      {
        label: 'Deploy Check',
        category: 'utility',
        icon: '🚀',
        description: 'Validate deployment readiness',
        instructions: `- Run the full test suite\n- Verify build completes without errors\n- Check environment variable requirements`,
      },
      {
        label: 'Document',
        category: 'review',
        icon: '📝',
        description: 'Update documentation',
        instructions: `- Update README if needed\n- Document new API or config options\n- Add changelog entry`,
      },
    ],
  },
];
