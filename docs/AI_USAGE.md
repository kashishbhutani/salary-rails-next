# AI Usage

AI was used intentionally as an engineering accelerator, not as an unchecked code generator.

## Used AI For

- decomposing the assessment into product, backend, frontend, data, and testing workstreams
- drafting small TDD-oriented implementation slices
- generating initial test ideas for salary aggregation edge cases
- scaffolding repetitive UI and API plumbing
- reviewing performance considerations for seeding 10,000 employees

## Manually Validated

- API contracts and request/response shapes
- salary aggregation correctness
- database indexes and seed strategy
- test determinism
- product relevance for the HR manager persona

## Corrections Made

- kept architecture simple instead of adding auth, queues, GraphQL, or background jobs
- prioritized indexed SQL aggregation over application-side calculations
- used deterministic seed generation instead of fully random data
