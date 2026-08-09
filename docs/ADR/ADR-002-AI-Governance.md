# ADR-002: AI Governance and Routing Authority

## Status

Accepted

## Date

2026-08-09

## Context

ICMS will use AI to analyze incoming institutional correspondence and recommend or perform routing.

Because the system will operate within a real university environment, AI decisions must remain subject to institutional policies and human oversight.

## Decision

AI may automatically route correspondence when its confidence score is at or above the configured threshold of 95%, provided no institutional policy requires human approval.

When confidence is below the threshold, the correspondence must be presented for human review.

Institutional policy always overrides AI recommendations.

## Rules

1. AI is an assistant to institutional processes.
2. AI does not override institutional policy.
3. Confidence must be recorded.
4. AI recommendations must be auditable.
5. Human reviewers must be able to override AI decisions.
6. AI-generated summaries and classifications must be traceable to the correspondence processed.

## Consequences

### Positive

- Faster routing
- Reduced manual workload
- Human oversight for uncertain decisions
- Clear accountability
- Auditable AI behavior

### Negative

- AI processing introduces external service dependency.
- Incorrect AI classification remains possible.
- Confidence thresholds require monitoring and periodic evaluation.