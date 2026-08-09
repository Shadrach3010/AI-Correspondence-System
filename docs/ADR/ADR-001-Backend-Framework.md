# ADR-001: Backend Framework Selection

## Status

Accepted

## Date

2026-08-09

## Context

ICMS is intended to be deployed as a long-term institutional system within a university environment. The backend must support authentication, role-based access control, workflow management, AI integration, email integration, notifications, auditing, and future expansion.

The system will likely evolve beyond a simple CRUD application and may eventually support multiple institutional processes.

## Decision

ICMS will use NestJS with TypeScript as its backend framework.

## Reasons

- Strong modular architecture
- Dependency injection
- Built-in support for scalable application structure
- Guards and interceptors suitable for RBAC and cross-cutting concerns
- Good support for REST APIs
- Strong TypeScript integration
- Suitable structure for enterprise applications
- Good fit for AI, email, queue, and workflow integrations
- Familiarity with Node.js and TypeScript ecosystem

## Alternatives Considered

- Express.js
- FastAPI
- Django REST Framework

## Consequences

### Positive

- Clear module boundaries
- Easier separation of business domains
- Better long-term maintainability
- Strong foundation for enterprise functionality

### Negative

- Higher learning curve than Express
- More architectural structure and boilerplate
- Requires disciplined module design

## Related Decisions

- Sequential workflow architecture
- AI-assisted routing
- Role-based access control