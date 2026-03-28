---
name: "api-first-design"
description: "Use when designing a new API or endpoint"
---

## Step 1: Requirements

> Gather and document API requirements

- Identify consumers of the API
- List required operations (CRUD, search, etc.)
- Define authentication and authorization needs

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

## Step 4: Implement

> Build the API from the spec

- Generate server stubs from the spec
- Implement business logic
- Add input validation matching the schema

## Step 5: Test and Document

> Validate and publish

- Write integration tests for each endpoint
- Test error cases and edge conditions
- Generate documentation from the spec
