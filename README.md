# DogbookX

DogbookX is a local-first social media MVP for dog owners. It includes a React + Tailwind frontend, an Express API, shared TypeScript types, and a reusable UI package built from the components already present in the repository.

## Run Locally

```bash
npm install
npm run dev
```

The API runs on [http://127.0.0.1:4100](http://127.0.0.1:4100) and the web app runs on [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Useful Commands

```bash
npm test
npm run test:smoke
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

## Architecture

- `apps/web`: React presentation tier using Tailwind CSS and `@dogbookx/ui`.
- `apps/api`: Express application tier with thin routes, validation, services, and repository-backed data access.
- `packages/types`: shared TypeScript contracts for users, dogs, posts, feeds, groups, and notifications.
- `packages/ui`: reusable React UI components.

Persistence is currently an in-memory repository seeded for local development. The API is organized so a database-backed repository can replace it without moving business rules into routes or UI code.
