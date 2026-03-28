---
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

## Step 4: Readability

> Ensure the code is maintainable

- Check naming clarity for variables and functions
- Verify comments explain why, not what
- Look for unnecessary complexity

## Step 5: Test Coverage

> Validate test quality

- Check that new code has corresponding tests
- Verify edge cases are tested
- Ensure tests are deterministic
