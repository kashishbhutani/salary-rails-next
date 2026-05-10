# Readiness

## Verification

- Backend: `bundle exec rspec`
- Frontend: `npm test`
- Frontend production build: `npm run build`
- Seed: `bin/rails db:create db:migrate db:seed`

## Latest Local Results

- RSpec: 18 examples, 0 failures
- Vitest: 1 file, 2 tests, 0 failures
- Next build: successful
- Seed: 10,000 employees in 1,355ms using `insert_all` batches

## Demo Flow

1. Start Rails API on port 3001.
2. Start Next.js on port 3000.
3. Open the dashboard.
4. Show total employees, average salary, top role, and country insights.
5. Search employees by name/title/country.
6. Open the add employee modal.
7. Use edit/delete row actions from the employee table.
