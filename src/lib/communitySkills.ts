export interface CommunitySkill {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  content: string;
}

// Bundled community skills — contributors add entries here via PR
export const COMMUNITY_SKILLS: CommunitySkill[] = [
  {
    id: 'tdd-workflow',
    name: 'TDD Workflow',
    description: 'Test-driven development: brainstorm, plan, test-first, implement, review',
    author: 'SkillForge',
    tags: ['testing', 'tdd', 'workflow'],
    content: `---
name: "tdd-workflow"
description: "Use when the user asks to build a feature using test-driven development"
---

## Step 1: Brainstorm

> Generate and explore ideas before committing to a plan

- Gather requirements from the user
- List at least 3 possible approaches
- Evaluate trade-offs for each approach
- Recommend the best path forward with reasoning

## Step 2: Plan

> Create a structured implementation plan

- Break the task into discrete, ordered steps
- Identify dependencies between steps
- Define clear acceptance criteria

## Step 3: Test First (TDD)

> Write tests before implementation code

- Write a failing test for the next requirement
- Implement the minimum code to make it pass
- Refactor while keeping tests green
- Repeat for each requirement

## Step 4: Implement

> Write production code following best practices

- Follow the established plan step by step
- Write clean, idiomatic code
- Add inline comments for complex logic
- Keep functions small and focused

## Step 5: Code Review

> Review code for quality, security, and correctness

- Check for security vulnerabilities
- Verify error handling is comprehensive
- Ensure consistent code style
- Validate that tests cover critical paths`,
  },
  {
    id: 'code-review-checklist',
    name: 'Code Review Checklist',
    description: 'Thorough code review covering security, performance, readability, and tests',
    author: 'SkillForge',
    tags: ['review', 'quality', 'security'],
    content: `---
name: "code-review-checklist"
description: "Use when reviewing a pull request or code changes"
---

## Step 1: Understand Context

> Read the PR description and linked issues

- Understand what problem this change solves
- Check if the approach matches the agreed design
- Note the scope of changes

## Step 2: Security Review

> Check for security vulnerabilities

- Look for injection vulnerabilities (SQL, XSS, command)
- Verify authentication and authorization checks
- Ensure no secrets or keys are hardcoded
- Validate all user inputs are sanitized

## Step 3: Logic and Correctness

> Verify the code does what it claims

- Trace the happy path end to end
- Check edge cases and error handling
- Look for off-by-one errors and null checks
- Verify concurrent access is handled

## Step 4: Readability

> Ensure the code is maintainable

- Check naming clarity for variables and functions
- Verify comments explain why, not what
- Look for unnecessary complexity
- Ensure consistent code style

## Step 5: Test Coverage

> Validate test quality

- Check that new code has corresponding tests
- Verify edge cases are tested
- Ensure tests are deterministic
- Look for missing integration tests`,
  },
  {
    id: 'api-first-design',
    name: 'API-First Design',
    description: 'Design APIs before implementation with schema validation and docs',
    author: 'SkillForge',
    tags: ['api', 'design', 'documentation'],
    content: `---
name: "api-first-design"
description: "Use when designing a new API or endpoint"
---

## Step 1: Requirements

> Gather and document API requirements

- Identify consumers of the API
- List required operations (CRUD, search, etc.)
- Define authentication and authorization needs
- Document rate limiting requirements

## Step 2: Schema Design

> Define request and response schemas

- Design resource models and relationships
- Define JSON schemas for each endpoint
- Standardize error response format
- Plan pagination and filtering

## Step 3: OpenAPI Spec

> Write the API specification

- Create OpenAPI/Swagger document
- Add request/response examples
- Document all status codes
- Include authentication details

## Step 4: Implement

> Build the API from the spec

- Generate server stubs from the spec
- Implement business logic
- Add input validation matching the schema
- Wire up authentication middleware

## Step 5: Test and Document

> Validate and publish

- Write integration tests for each endpoint
- Test error cases and edge conditions
- Generate documentation from the spec
- Set up API monitoring`,
  },
  {
    id: 'security-hardening',
    name: 'Security Hardening',
    description: 'Systematic security review and hardening for production applications',
    author: 'SkillForge',
    tags: ['security', 'audit', 'production'],
    content: `---
name: "security-hardening"
description: "Use when preparing an application for production security review"
---

## Step 1: Dependency Audit

> Scan and update vulnerable dependencies

- Run npm audit / pip audit / equivalent
- Update packages with known CVEs
- Remove unused dependencies
- Pin dependency versions

## Step 2: Input Validation

> Harden all user-facing inputs

- Validate and sanitize all form inputs
- Add rate limiting to API endpoints
- Implement CSRF protection
- Set up Content Security Policy headers

## Step 3: Authentication Review

> Verify auth implementation

- Check password hashing (bcrypt/argon2)
- Verify JWT token expiration and rotation
- Review session management
- Test for broken access control

## Step 4: Secrets Management

> Ensure no secrets are exposed

- Move all secrets to environment variables
- Rotate any previously committed keys
- Set up secret scanning in CI
- Review .gitignore for sensitive files

## Step 5: Monitoring

> Set up security monitoring

- Enable logging for auth events
- Set up alerts for suspicious activity
- Configure error tracking (no PII in logs)
- Document incident response procedure`,
  },
  {
    id: 'database-migration',
    name: 'Database Migration',
    description: 'Safe database schema migration with rollback planning',
    author: 'SkillForge',
    tags: ['database', 'migration', 'devops'],
    content: `---
name: "database-migration"
description: "Use when performing database schema changes or data migrations"
---

## Step 1: Plan Migration

> Document current and target state

- Map current schema to target schema
- Identify breaking changes
- Estimate data volume and migration time
- Plan maintenance window if needed

## Step 2: Write Migration Scripts

> Create reversible migration files

- Write forward migration (up)
- Write rollback migration (down)
- Handle data transformations
- Add indexes after bulk inserts

## Step 3: Test on Copy

> Validate against production-like data

- Clone production database (anonymized)
- Run migration on the copy
- Verify data integrity after migration
- Measure execution time

## Step 4: Execute

> Run the migration

- Take a database backup
- Run migration in a transaction if possible
- Monitor for errors during execution
- Verify application works with new schema

## Step 5: Verify and Monitor

> Confirm everything is healthy

- Run data integrity checks
- Monitor application error rates
- Check query performance
- Keep rollback ready for 24 hours`,
  },
];
