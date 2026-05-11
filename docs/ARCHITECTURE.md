# Architecture

## Product Framing

The primary user is an HR manager who needs to maintain employee salary records and quickly answer compensation questions by country, role, and department.

The product is intentionally operational rather than decorative:

- employee search, filters, pagination, add/edit/delete flows
- dashboard-level salary health metrics
- country and job-title salary analysis
- salary bands and percentile-style summaries to support HR decisions

## Backend

Rails API mode exposes REST endpoints:

- `GET /employees`
- `POST /employees`
- `PATCH /employees/:id`
- `DELETE /employees/:id`
- `GET /insights/dashboard`
- `GET /insights/country`

Core backend structure:

- `Employee` ActiveRecord model
- query objects for filtering and pagination
- service objects for salary insight calculations
- serializers for stable API payloads

## Database

PostgreSQL stores employee records. The app adds indexes for the expected read patterns:

- `country`
- `job_title`
- `[country, job_title]`
- `department`

Salary insights are computed with aggregation queries so the database does the heavy lifting.
The country insight endpoint accepts an optional `job_title` query parameter so the HR manager can answer "average salary for this role in this country" without introducing another endpoint for the same bounded report.

## Frontend

Next.js + TypeScript provides:

- dashboard page
- employee table with search and filters
- add/edit modal
- salary insight panels

The UI consumes the Rails API through a small typed API client.
