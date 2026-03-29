import type { SkillNodeData } from '../types';

export interface PresetNode {
  data: SkillNodeData;
  x: number;
  y: number;
}

export interface PresetEdge {
  from: number; // index into nodes array
  to: number;
  label?: string;
}

export interface Preset {
  id: string;
  label: string;
  emoji: string;
  description: string;
  complexity: 'simple' | 'advanced';
  // Simple presets: linear chain
  steps?: SkillNodeData[];
  // Advanced presets: explicit graph
  nodes?: PresetNode[];
  edges?: PresetEdge[];
}

export const PRESETS: Preset[] = [
  // ── Simple linear presets ──────────────────────────────
  {
    id: 'tdd',
    label: 'TDD Workflow',
    emoji: '🧪',
    complexity: 'simple',
    description: 'Test-driven development: plan, test, implement, review',
    steps: [
      { label: 'Plan', category: 'planning', icon: '📋', description: 'Create a structured implementation plan', instructions: '- Break the task into discrete, ordered steps\n- Identify dependencies between steps\n- Define clear acceptance criteria' },
      { label: 'Test First', category: 'testing', icon: '🧪', description: 'Write tests before implementation code', instructions: '- Write a failing test for the next requirement\n- Implement the minimum code to make it pass\n- Refactor while keeping tests green' },
      { label: 'Implement', category: 'coding', icon: '⚡', description: 'Write production code following best practices', instructions: '- Follow the established plan step by step\n- Write clean, idiomatic code\n- Keep functions small and focused' },
      { label: 'Code Review', category: 'review', icon: '🔍', description: 'Review code for quality and correctness', instructions: '- Check for security vulnerabilities\n- Verify error handling is comprehensive\n- Validate that tests cover critical paths' },
    ],
  },
  {
    id: 'bug-fix',
    label: 'Bug Fix',
    emoji: '🐛',
    complexity: 'simple',
    description: 'Systematic bug investigation and fix workflow',
    steps: [
      { label: 'Reproduce', category: 'utility', icon: '🐛', description: 'Reproduce the bug with a minimal test case', instructions: '- Read the bug report carefully\n- Create a minimal reproduction\n- Document exact steps to trigger the issue' },
      { label: 'Diagnose', category: 'planning', icon: '💡', description: 'Find the root cause', instructions: '- Add logging around the suspected area\n- Trace the execution path\n- Identify the root cause, not just symptoms' },
      { label: 'Regression Test', category: 'testing', icon: '🧪', description: 'Write a test that fails with the current bug', instructions: '- Write a test that reproduces the exact failure\n- Confirm the test fails before the fix' },
      { label: 'Fix', category: 'coding', icon: '⚡', description: 'Apply the minimal fix', instructions: '- Fix the root cause, not symptoms\n- Keep the change as small as possible\n- Ensure the regression test now passes' },
      { label: 'Review', category: 'review', icon: '🔍', description: 'Verify the fix is complete and safe', instructions: '- Check for similar bugs elsewhere\n- Verify no regressions were introduced' },
    ],
  },

  // ── Advanced multi-branch presets ──────────────────────
  {
    id: 'fullstack-feature',
    label: 'Full-Stack Feature',
    emoji: '🏗️',
    complexity: 'advanced',
    description: 'Parallel frontend + backend development with shared design, converging at integration testing',
    nodes: [
      { x: 300, y: 0, data: { label: 'Requirements', category: 'planning', icon: '📋', description: 'Gather and document feature requirements', instructions: '- Interview stakeholders\n- Define user stories and acceptance criteria\n- Identify API contract between frontend and backend\n- Create wireframes or mockups' } },
      { x: 300, y: 140, data: { label: 'API Contract', category: 'planning', icon: '📝', description: 'Define the shared API interface', instructions: '- Write OpenAPI spec for new endpoints\n- Define request/response schemas\n- Agree on error format and status codes\n- Document authentication requirements' } },
      { x: 100, y: 280, data: { label: 'Backend', category: 'coding', icon: '⚡', description: 'Implement server-side logic', instructions: '- Implement API endpoints per the contract\n- Add input validation and error handling\n- Write database migrations if needed\n- Add middleware for auth and logging' } },
      { x: 500, y: 280, data: { label: 'Frontend', category: 'coding', icon: '⚡', description: 'Implement client-side UI', instructions: '- Build UI components from wireframes\n- Connect to API using the agreed contract\n- Handle loading, error, and empty states\n- Ensure responsive design' } },
      { x: 100, y: 420, data: { label: 'Backend Tests', category: 'testing', icon: '🧪', description: 'Test API endpoints', instructions: '- Unit tests for business logic\n- Integration tests for each endpoint\n- Test auth and permission checks\n- Test error cases and edge conditions' } },
      { x: 500, y: 420, data: { label: 'Frontend Tests', category: 'testing', icon: '✅', description: 'Test UI components', instructions: '- Component unit tests\n- User interaction tests\n- Mock API responses\n- Accessibility checks' } },
      { x: 300, y: 560, data: { label: 'Integration Test', category: 'testing', icon: '🔗', description: 'End-to-end testing with real API', instructions: '- Run frontend against real backend\n- Test the full user flow end to end\n- Verify data persistence\n- Test with different user roles' } },
      { x: 300, y: 700, data: { label: 'Security Review', category: 'review', icon: '🛡️', description: 'Security audit before deploy', instructions: '- Check for injection vulnerabilities\n- Verify CORS and CSP headers\n- Review authentication flow\n- Scan dependencies for CVEs' } },
      { x: 300, y: 840, data: { label: 'Deploy', category: 'utility', icon: '🚀', description: 'Ship to production', instructions: '- Run full test suite in CI\n- Deploy backend first, then frontend\n- Verify health checks pass\n- Monitor error rates for 30 minutes' } },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2, label: 'backend track' },
      { from: 1, to: 3, label: 'frontend track' },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 6, label: 'backend ready' },
      { from: 5, to: 6, label: 'frontend ready' },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
    ],
  },
  {
    id: 'ci-cd-pipeline',
    label: 'CI/CD Pipeline',
    emoji: '🔄',
    complexity: 'advanced',
    description: 'Build, test in parallel (unit + integration + security), gate, and deploy',
    nodes: [
      { x: 300, y: 0, data: { label: 'Build', category: 'coding', icon: '🔨', description: 'Compile and bundle the application', instructions: '- Install dependencies\n- Run the build command\n- Verify no build warnings\n- Generate build artifacts' } },
      { x: 60, y: 160, data: { label: 'Unit Tests', category: 'testing', icon: '🧪', description: 'Run unit test suite', instructions: '- Run all unit tests\n- Enforce minimum coverage threshold\n- Fail fast on first error in CI\n- Report coverage to dashboard' } },
      { x: 300, y: 160, data: { label: 'Integration Tests', category: 'testing', icon: '✅', description: 'Run integration test suite', instructions: '- Spin up test database\n- Run API integration tests\n- Test external service mocks\n- Verify data migrations' } },
      { x: 540, y: 160, data: { label: 'Security Scan', category: 'review', icon: '🛡️', description: 'Automated security analysis', instructions: '- Run SAST (static analysis)\n- Scan dependencies for CVEs\n- Check for secrets in code\n- Verify container image security' } },
      { x: 300, y: 320, data: { label: 'Quality Gate', category: 'review', icon: '🚦', description: 'All checks must pass before deploy', instructions: '- Verify all test suites passed\n- Check coverage meets threshold\n- Confirm no critical security findings\n- Validate build artifacts are signed' } },
      { x: 100, y: 480, data: { label: 'Deploy Staging', category: 'utility', icon: '🔄', description: 'Deploy to staging environment', instructions: '- Deploy to staging environment\n- Run smoke tests against staging\n- Verify feature flags are correct\n- Test with staging data' } },
      { x: 500, y: 480, data: { label: 'Performance Test', category: 'testing', icon: '⏱️', description: 'Load and performance testing', instructions: '- Run load tests against staging\n- Verify response times under load\n- Check for memory leaks\n- Compare against baseline metrics' } },
      { x: 300, y: 620, data: { label: 'Deploy Production', category: 'utility', icon: '🚀', description: 'Ship to production', instructions: '- Deploy with rolling update strategy\n- Monitor error rates during rollout\n- Verify health check endpoints\n- Keep rollback ready for 1 hour' } },
      { x: 300, y: 760, data: { label: 'Post-Deploy', category: 'review', icon: '📊', description: 'Monitor and verify production', instructions: '- Monitor application metrics for 30 min\n- Check error tracking dashboard\n- Verify key user flows work\n- Update status page and changelog' } },
    ],
    edges: [
      { from: 0, to: 1, label: 'parallel' },
      { from: 0, to: 2, label: 'parallel' },
      { from: 0, to: 3, label: 'parallel' },
      { from: 1, to: 4, label: 'pass' },
      { from: 2, to: 4, label: 'pass' },
      { from: 3, to: 4, label: 'pass' },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 5, to: 7, label: 'staging OK' },
      { from: 6, to: 7, label: 'perf OK' },
      { from: 7, to: 8 },
    ],
  },
  {
    id: 'microservice-design',
    label: 'Microservice Design',
    emoji: '🧩',
    complexity: 'advanced',
    description: 'Design a microservice with API, data layer, messaging, and observability',
    nodes: [
      { x: 300, y: 0, data: { label: 'Domain Analysis', category: 'planning', icon: '💡', description: 'Define bounded context and domain model', instructions: '- Identify the bounded context\n- Map domain entities and aggregates\n- Define service boundaries\n- Document domain events' } },
      { x: 100, y: 160, data: { label: 'API Design', category: 'planning', icon: '🌐', description: 'Design the service API', instructions: '- Define REST/gRPC endpoints\n- Write OpenAPI or protobuf spec\n- Plan versioning strategy\n- Define rate limits and quotas' } },
      { x: 500, y: 160, data: { label: 'Data Model', category: 'planning', icon: '📋', description: 'Design the data layer', instructions: '- Choose database technology\n- Design schema and indexes\n- Plan data migration strategy\n- Define backup and retention policy' } },
      { x: 100, y: 320, data: { label: 'Implement API', category: 'coding', icon: '⚡', description: 'Build the API layer', instructions: '- Implement endpoints per spec\n- Add input validation\n- Implement auth middleware\n- Add request/response logging' } },
      { x: 500, y: 320, data: { label: 'Implement Data', category: 'coding', icon: '⚡', description: 'Build the data access layer', instructions: '- Implement repository pattern\n- Write database migrations\n- Add connection pooling\n- Implement caching layer' } },
      { x: 300, y: 320, data: { label: 'Event Bus', category: 'coding', icon: '📡', description: 'Implement async messaging', instructions: '- Set up message broker connection\n- Implement event publishers\n- Implement event consumers\n- Add dead letter queue handling' } },
      { x: 300, y: 480, data: { label: 'Tests', category: 'testing', icon: '🧪', description: 'Comprehensive service testing', instructions: '- Unit tests for domain logic\n- Integration tests for API\n- Contract tests for consumers\n- Test event publishing and consuming' } },
      { x: 100, y: 640, data: { label: 'Observability', category: 'utility', icon: '📊', description: 'Add monitoring and tracing', instructions: '- Add structured logging\n- Implement health check endpoint\n- Add distributed tracing\n- Set up metrics and dashboards' } },
      { x: 500, y: 640, data: { label: 'Documentation', category: 'review', icon: '📝', description: 'Document the service', instructions: '- Write service README\n- Document API with examples\n- Create architecture diagram\n- Document runbook for on-call' } },
      { x: 300, y: 800, data: { label: 'Deploy & Monitor', category: 'utility', icon: '🚀', description: 'Ship and observe', instructions: '- Containerize the service\n- Set up CI/CD pipeline\n- Deploy to staging, then production\n- Monitor metrics for 24 hours' } },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 0, to: 5, label: 'events' },
      { from: 3, to: 6 },
      { from: 4, to: 6 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 6, to: 8 },
      { from: 7, to: 9 },
      { from: 8, to: 9 },
    ],
  },
  {
    id: 'release-process',
    label: 'Release Process',
    emoji: '📦',
    complexity: 'advanced',
    description: 'Full release cycle: freeze, QA, hotfix track, release, and post-release',
    nodes: [
      { x: 300, y: 0, data: { label: 'Code Freeze', category: 'planning', icon: '🧊', description: 'Freeze the release branch', instructions: '- Create release branch from main\n- Announce code freeze to team\n- Lock branch from new features\n- Document included changes' } },
      { x: 100, y: 160, data: { label: 'QA Testing', category: 'testing', icon: '✅', description: 'Manual and automated QA', instructions: '- Run full regression suite\n- Execute manual test plan\n- Test on all target platforms\n- Verify accessibility compliance' } },
      { x: 500, y: 160, data: { label: 'Release Notes', category: 'review', icon: '📝', description: 'Prepare release documentation', instructions: '- Compile changelog from commits\n- Write user-facing release notes\n- Update version numbers\n- Prepare migration guide if needed' } },
      { x: 100, y: 320, data: { label: 'Bug Fixes', category: 'coding', icon: '🐛', description: 'Fix bugs found during QA', instructions: '- Triage QA-reported bugs by severity\n- Fix critical and high bugs\n- Cherry-pick fixes to release branch\n- Re-run affected tests' } },
      { x: 500, y: 320, data: { label: 'Security Audit', category: 'review', icon: '🛡️', description: 'Final security review', instructions: '- Run dependency vulnerability scan\n- Review any new auth changes\n- Check for exposed secrets\n- Verify CSP and CORS settings' } },
      { x: 300, y: 480, data: { label: 'Staging Deploy', category: 'utility', icon: '🔄', description: 'Deploy release candidate to staging', instructions: '- Deploy release branch to staging\n- Run smoke tests\n- Verify all fixes are included\n- Get sign-off from QA lead' } },
      { x: 300, y: 620, data: { label: 'Production Deploy', category: 'utility', icon: '🚀', description: 'Ship to production', instructions: '- Deploy with canary or blue-green strategy\n- Monitor error rates during rollout\n- Verify critical user flows\n- Keep rollback ready' } },
      { x: 100, y: 780, data: { label: 'Post-Release QA', category: 'testing', icon: '🔍', description: 'Verify production deployment', instructions: '- Run production smoke tests\n- Verify key metrics are stable\n- Check error tracking dashboard\n- Test with real user accounts' } },
      { x: 500, y: 780, data: { label: 'Communicate', category: 'review', icon: '📢', description: 'Announce the release', instructions: '- Publish release notes\n- Update status page\n- Notify customers of new features\n- Merge release branch back to main' } },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3, label: 'bugs found' },
      { from: 3, to: 1, label: 're-test' },
      { from: 1, to: 5, label: 'QA pass' },
      { from: 2, to: 5 },
      { from: 4, to: 5, label: 'secure' },
      { from: 0, to: 4 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 6, to: 8 },
    ],
  },
];
