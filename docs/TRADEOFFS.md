# Tradeoffs

## What Is Intentionally Included

- Rails API mode for fast backend delivery with strong conventions
- PostgreSQL because indexed aggregation and production deployment are expected
- service/query objects where they clarify business logic
- bulk seeding with `insert_all` for repeatable engineer workflows
- focused RSpec coverage for model validations, request contracts, query behavior, and insight calculations

## What Is Intentionally Excluded

- authentication and authorization, because the assignment centers on salary management behavior
- GraphQL, because REST is sufficient and faster to evaluate
- background jobs, because 10,000 row seed and aggregation workloads fit comfortably in request/seed paths
- microservices, because the problem is a single bounded HR tool

## Scalability Notes

10,000 employees is large enough to require pagination, indexes, and bulk inserts, but not large enough to justify distributed systems. The design keeps the next step open: materialized reports or cached aggregates could be added later if the dataset grows significantly.
