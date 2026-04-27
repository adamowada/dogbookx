# AGENTS.md

## Project

DogbookX is a social media web app for dog owners. It combines familiar social features from Facebook-style communities with X-style short posts, follows, feeds, replies, reposts, and real-time updates.

The product should feel friendly, fast, trustworthy, and dog-owner focused.

## Architecture

Use a 3-tier architecture:

1. Presentation tier
   - React frontend
   - Tailwind CSS styling
   - Reusable UI components from the existing repository

2. Application tier
   - API/server logic
   - Authentication and authorization
   - Business rules for users, dogs, posts, feeds, follows, comments, notifications, and moderation

3. Data tier
   - Database models and migrations
   - Repository/data-access layer
   - Clear separation between persistence logic and business logic

Keep responsibilities separated. UI code should not contain database logic. API handlers should stay thin and delegate business logic to services.

## Monorepo expectations

This repository is a monorepo. Prefer shared packages instead of duplicating logic.

Expected structure may include:

- `apps/web` for the React frontend
- `apps/api` for backend/API code
- `packages/ui` for shared React + Tailwind components
- `packages/types` for shared TypeScript types
- `packages/config` for shared linting, formatting, and build config
- `packages/test-utils` for reusable test helpers

Before adding a new package, check whether an existing package can be extended.

## Frontend guidelines

Use existing reusable React + Tailwind CSS components wherever possible.

Before creating a new component:

1. Search the repository for an existing component.
2. Reuse or extend existing components when reasonable.
3. Keep new components small, composable, and accessible.
4. Avoid hardcoded styling when a shared component or design token already exists.

Prefer:

- Clear component names
- Small props interfaces
- Accessible markup
- Responsive layouts
- Tailwind utility classes
- Composition over large conditional components

Avoid:

- Duplicated UI patterns
- Inline styles unless necessary
- Large components with unrelated responsibilities
- Mixing API calls directly into deeply nested presentational components

## Backend guidelines

Keep API routes/controllers thin.

Use service functions for business logic, such as:

- Creating posts
- Following users
- Managing dog profiles
- Building feeds
- Sending notifications
- Applying moderation rules

Use repository/data-access functions for persistence.

Validate all input at API boundaries. Never trust client-provided data.

## Test-driven development

Use test-driven development for meaningful behavior changes.

Preferred workflow:

1. Write or update a failing test.
2. Implement the smallest change that makes the test pass.
3. Refactor while keeping tests green.
4. Add edge-case tests when behavior is subtle.

Add tests for:

- Business logic
- API behavior
- Data validation
- Permission checks
- Important React components
- User flows such as posting, replying, following, liking, and editing dog profiles

Do not skip tests for critical paths.

## Coding standards

Write code that is simple, readable, and maintainable.

Prefer:

- TypeScript
- Explicit types at public boundaries
- Small functions
- Clear names
- Early returns
- Pure functions where practical
- Consistent error handling
- Centralized validation
- Reusable utilities

Avoid:

- Unnecessary abstractions
- Large files with mixed responsibilities
- Duplicated logic
- Silent failures
- Overly clever code
- Adding dependencies without a clear reason

## Product conventions

DogbookX should support dog-owner social experiences, including:

- User profiles
- Dog profiles
- Short posts
- Photos and media
- Replies and comments
- Likes or reactions
- Reposts/shares
- Follows
- Feed ranking
- Groups or communities
- Notifications
- Basic moderation and reporting

When implementing features, consider both the human user and their dog profile as first-class product concepts.

## Security and privacy

Protect user data.

Always consider:

- Authentication
- Authorization
- Input validation
- Rate limiting where appropriate
- Safe handling of uploaded media
- Private vs public profile data
- Abuse, spam, and moderation flows

Do not expose private user data in frontend responses or logs.

## Definition of done

A task is complete when:

- The implementation follows the 3-tier architecture.
- Existing reusable components are used where appropriate.
- New code is covered by relevant tests.
- Existing tests pass.
- Linting and formatting pass.
- The solution is simple and readable.
- Any important tradeoffs are documented in the final response.

## Validation

Before finishing, run the most relevant checks available in the repository.

Common commands may include:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

If a command cannot be run, explain why and list the exact command that should be run manually.

## Agent response expectations

When finishing a task, summarize:

- What changed
- Which files were touched
- Which tests or checks were run
- Any risks, limitations, or follow-up work
