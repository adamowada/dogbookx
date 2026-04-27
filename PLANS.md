# PLANS.md

# Plan: Full Local DogbookX MVP

## Goal

Build DogbookX into a runnable local social media MVP for dog owners with a React frontend, Express API, shared packages, test coverage, and a clear path toward database-backed persistence.

## Context

The repository started as a lightweight shell with documentation and reusable React/Tailwind components. This plan turns it into a monorepo that can be installed, tested, and run locally.

## Scope

In scope:

- npm workspace monorepo
- React home feed with composer, posts, reactions, follows, dog identity, notifications, groups, and moderation cues
- Express API with thin routes
- Service layer for feed, posting, follows, likes, reposts, and simple moderation
- Repository/data-access layer with deterministic local seed data
- Shared TypeScript types
- Unit, smoke, integration-style component, and Playwright end-to-end tests
- README run instructions

Out of scope:

- Production authentication
- Durable database migrations
- Uploaded media storage
- Real-time WebSocket delivery
- GitHub Actions CI setup

## Architecture

Presentation tier:

- `apps/web` renders the social product experience.
- `@dogbookx/ui` exposes the existing reusable React/Tailwind components.
- Web components call the API through `apps/web/src/lib/api.ts`.

Application tier:

- `apps/api/src/routes` owns HTTP routing and request validation.
- `apps/api/src/services` owns business rules and moderation checks.
- Routes remain thin and delegate to `SocialService`.

Data tier:

- `apps/api/src/repositories` owns persistence operations.
- `apps/api/src/seed.ts` provides local seed data until a database is introduced.

## Monorepo impact

- `apps/web`: new Vite React app
- `apps/api`: new Express API
- `packages/ui`: moved existing reusable components into a package
- `packages/types`: new shared social-domain types
- Other packages: root npm workspace, lint, typecheck, and test config

## Test plan

Write or update tests for:

- Service feed enrichment, moderation, ownership checks, and post creation
- UI rendering of the loaded feed
- Shared UI button accessibility
- API health/feed smoke test
- End-to-end feed and composer visibility

Expected validation commands:

```bash
npm test
npm run test:smoke
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

## Implementation steps

1. [x] Create `dev` and feature branch structure.
2. [x] Scaffold npm workspace packages and apps.
3. [x] Move existing UI components into `packages/ui`.
4. [x] Add shared social-domain types.
5. [x] Add API seed data, repository, service, validation, and routes.
6. [x] Build the React frontend using shared UI components.
7. [x] Add smoke, unit, component, and e2e test coverage.
8. [x] Run validation and fix failures.
9. [ ] Commit, push, create PR, review, and merge after checks pass.

## Risks and tradeoffs

- The first data tier uses in-memory seed data so local development is instant; durable database persistence should be the next feature branch.
- Authentication is represented by a seeded viewer. Production auth and authorization hardening should be added before real user data.
- Real-time behavior is modeled through API state updates, not WebSockets yet.

## Definition of done

The app is complete for this slice when it installs, runs locally, passes validation, and is merged through the requested GitHub branch workflow.

# Plan: Durable Session Data MVP Branch

## Goal

Move DogbookX from seeded in-memory state to durable local JSON persistence and replace hardcoded viewer usage with a lightweight local session identity. The app should remember created posts, follows, likes, and reposts across API restarts.

## Context

The current MVP is runnable but resets all social activity when the API process restarts. A local MVP needs persistence before profile, comment, and moderation workflows can feel trustworthy.

## Scope

In scope:

- JSON-file data store under `.dogbookx/data.json`
- Repository save behavior for posts, follows, likes, and reposts
- Session viewer resolution through `x-dogbookx-user-id`
- Frontend localStorage session id
- Tests for persistence and session-driven API behavior
- Documentation updates

Out of scope:

- Production password authentication
- Database server or ORM setup
- Multi-device account sync

## Architecture

Presentation tier:

- `apps/web/src/lib/session.ts` owns the local viewer id.
- API client attaches the viewer header to each request.

Application tier:

- Routes resolve viewer id from headers and delegate to services.
- Services continue to own authorization and business rules.

Data tier:

- Repository owns JSON file loading, default seeding, mutation, and saving.
- Seed data remains the fallback for first local launch.

## Monorepo impact

- `apps/web`: session helper and API client updates
- `apps/api`: persistent repository and route viewer resolution
- `packages/types`: optional persisted data shape
- Other packages: `.gitignore` and README updates

## Test plan

- Unit test repository persistence across instances
- Unit test service behavior remains intact
- API smoke test verifies session-aware feed response
- Existing UI and e2e tests continue to pass

## Implementation steps

1. [x] Branch from `dev`.
2. [x] Add plan entry.
3. [x] Add persistent repository tests.
4. [x] Implement JSON repository persistence.
5. [x] Add session header support in routes and web API client.
6. [x] Run validation and fix failures.
7. [ ] Commit, push, PR to `dev`, review, and merge.

Use this file for planning meaningful DogbookX features, refactors, or architecture changes.

# Plan: Dog Profiles and Replies MVP Branch

## Goal

Add the remaining core social MVP flows: dog profile management and post replies. A local user should be able to create a dog profile, edit an existing dog, reply to feed posts, and see reply counts update.

## Context

DogbookX treats dog profiles as first-class product concepts, and replies are part of the expected short-post social loop. The durable data branch gives these flows persistence.

## Scope

In scope:

- Create dog profile API and form
- Update dog profile API and quick-edit controls
- Reply API, repository persistence, notification generation, and UI composer
- Shared types and validation schemas
- Unit, route, UI, and e2e coverage updates

Out of scope:

- Multi-owner dog profiles
- Thread detail pages
- Reply deletion and moderation queue UI

## Architecture

Presentation tier:

- Add reusable `DogManager` and inline reply controls.
- Continue using `@dogbookx/ui` components and Tailwind utilities.

Application tier:

- Extend `SocialService` with dog profile and reply business rules.
- Keep API routes thin and schema-validated.

Data tier:

- Extend JSON repository state with dog mutation and reply persistence.
- Maintain backward compatibility for existing `.dogbookx/data.json` files.

## Test plan

- Unit tests for dog ownership and reply counts
- Route tests for creating dogs and replies as the session viewer
- UI test for rendered dog management controls
- E2E test for replying from the feed

## Implementation steps

1. [x] Branch from updated `dev`.
2. [x] Add plan entry.
3. [x] Add shared types and validation.
4. [x] Implement repository/service/routes for dogs and replies.
5. [x] Add dog profile and reply UI.
6. [x] Run validation and fix failures.
7. [ ] Commit, push, PR to `dev`, review, and merge.

Plans should be clear, practical, and easy to execute. Keep them updated as work progresses.

## When to create a plan

Create a plan for work involving:

- New product features
- Database schema changes
- API changes
- Multi-package monorepo changes
- Significant frontend flows
- Authentication or authorization changes
- Feed, notification, or moderation logic
- Refactors touching multiple layers
- Any task where the implementation path is not obvious

Small bug fixes do not need a full plan unless they affect architecture or product behavior.

## Plan format

Use the following format.

```md
# Plan: <Feature or Change Name>

## Goal

Describe the user-facing or engineering goal in 1-3 sentences.

## Context

Explain the current state of the codebase and why this change is needed.

## Scope

In scope:

- Item 1
- Item 2

Out of scope:

- Item 1
- Item 2

## Architecture

Describe how the change fits into the 3-tier architecture.

Presentation tier:

- React pages/components involved
- Existing reusable React + Tailwind components to use or extend

Application tier:

- API routes, services, validation, authorization, and business logic

Data tier:

- Models, migrations, repositories, queries, and persistence concerns

## Monorepo impact

List affected apps and packages.

- `apps/web`:
- `apps/api`:
- `packages/ui`:
- `packages/types`:
- Other packages:

## Test plan

Follow test-driven development.

Write or update tests for:

- Unit behavior
- API behavior
- UI behavior
- Permission checks
- Edge cases

Expected validation commands:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Implementation steps

1. Add or update tests for the intended behavior.
2. Update shared types if needed.
3. Update data models, migrations, or repositories if needed.
4. Implement application-tier service logic.
5. Implement or update API routes.
6. Build the frontend using existing reusable React + Tailwind components.
7. Add loading, empty, error, and success states.
8. Run tests and validation.
9. Refactor for readability and remove duplication.
10. Update documentation if needed.

## Risks and tradeoffs

Document important risks, such as:

- Data model complexity
- Feed performance
- Privacy concerns
- Authorization gaps
- UI duplication
- Migration risk
- Test coverage gaps

## Definition of done

The plan is complete when:

- The feature works end to end.
- The architecture remains separated into presentation, application, and data tiers.
- Existing reusable components are used where appropriate.
- Tests cover the important behavior.
- Linting, typechecking, and builds pass.
- The implementation is readable and maintainable.
```

## Example plan

```md
# Plan: Create Dog Profile Pages

## Goal

Allow users to create and view profile pages for their dogs, including name, breed, age, bio, avatar, and recent posts.

## Context

DogbookX treats dog profiles as a core part of the social experience. Users should be able to represent themselves and their dogs.

## Scope

In scope:

- Dog profile model
- API endpoints for creating and reading dog profiles
- Dog profile page in the web app
- Reusable profile card component
- Tests for validation and permissions

Out of scope:

- Multiple owners per dog
- Advanced privacy settings
- Dog profile analytics

## Architecture

Presentation tier:

- Add a dog profile page.
- Reuse existing card, avatar, button, form, and layout components from the repository.
- Use Tailwind CSS for responsive layout.

Application tier:

- Add validation for dog profile input.
- Add service logic for creating and reading dog profiles.
- Ensure users can only edit dogs they own.

Data tier:

- Add dog profile table/model.
- Add repository functions for creating, reading, and updating dog profiles.

## Monorepo impact

- `apps/web`: dog profile page and form
- `apps/api`: dog profile routes
- `packages/ui`: reusable dog profile card if no suitable component exists
- `packages/types`: shared dog profile types

## Test plan

Write tests first for:

- Creating a valid dog profile
- Rejecting invalid dog profile input
- Preventing users from editing dogs they do not own
- Rendering the dog profile page
- Showing empty states when a dog has no posts

## Implementation steps

1. Write failing tests for dog profile creation and authorization.
2. Add shared DogProfile type.
3. Add data model and migration.
4. Add repository functions.
5. Add service logic.
6. Add API routes.
7. Add frontend page and form using existing UI components.
8. Add loading, error, and empty states.
9. Run tests, linting, typechecking, and build.
10. Refactor for clarity.

## Risks and tradeoffs

- Dog ownership rules should be simple at first.
- Profile media upload can be handled separately.
- Privacy controls should be considered before launch.

## Definition of done

Dog owners can create and view a dog profile, tests cover the core behavior, and the implementation follows the 3-tier monorepo architecture.
```
