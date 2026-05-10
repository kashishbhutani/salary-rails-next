# Salary Command Center

Rails API + Next.js salary management tool for an HR manager supporting a 10,000 employee organization.

## Stack

- Backend: Ruby on Rails API mode, PostgreSQL, RSpec
- Frontend: Next.js, TypeScript, Tailwind CSS
- Product focus: employee CRUD, salary insights, indexed filtering, fast deterministic seeding

## Development

Backend:

```bash
cd backend
bundle install
bin/rails db:create db:migrate db:seed
bundle exec rspec
bin/rails server -p 3001
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [AI Usage](docs/AI_USAGE.md)
- [Tradeoffs](docs/TRADEOFFS.md)
- [Readiness](docs/READINESS.md)
