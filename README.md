# DogbookX

DogbookX is a local-first social media MVP for dog owners. It includes a React + Tailwind frontend, an Express API, shared TypeScript types, and a reusable UI package built from the components already present in the repository.

## MVP Features

- Short-post home feed
- Dog-profile posting identity
- Create and edit local dog profiles
- Inline replies with reply counts
- Likes, reposts, follows, suggestions, groups, and notifications
- Lightweight moderation checks for posts and replies
- Durable local JSON persistence for development
- Session viewer identity stored in browser localStorage

## Run Locally

```bash
npm install
npm run dev
```

The API runs on [http://127.0.0.1:4100](http://127.0.0.1:4100) and the web app runs on [http://127.0.0.1:5173](http://127.0.0.1:5173).

Local API data is stored in `.dogbookx/data.json` after first launch. Delete that folder to reset to the bundled seed data.

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

Persistence uses a local JSON repository seeded for development. The API is organized so a database-backed repository can replace it without moving business rules into routes or UI code.
