# PLANS.md

Use this file for planning meaningful DogbookX features, refactors, or architecture changes.

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
