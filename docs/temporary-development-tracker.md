# Temporary Development Tracker

Status: Temporary working document
Created: 2026-05-24

This file tracks the small confirmed development steps while the platform foundation is being built.
It is intentionally temporary and should be deleted after the foundational sequence is complete and the durable decisions have been captured in the normal project documents.

## Working Rule

- Do one small confirmed step at a time.
- Keep each step focused enough to become one clear commit.
- Do not bundle unrelated framework, database, UI, or feature work into the same step.
- Update this file after each completed step so it is always clear what has been done and what remains.
- Keep permanent architecture and product decisions in `docs/decisions/`, `docs/product/`, and `AGENTS.md`; this file is only an execution tracker.

## Foundation Sequence

### Step 1: Bootstrap pnpm monorepo skeleton

Status: Completed on 2026-05-24

Goal:

Create the minimum repository structure needed for the accepted monorepo approach.

Expected files/folders:

- `pnpm-workspace.yaml`
- root `package.json`
- `apps/api/package.json`
- `apps/web/package.json`
- `packages/api-client/package.json`
- `packages/config/package.json`
- `packages/design-tokens/package.json`
- `packages/icons/package.json`
- `packages/types/package.json`
- `packages/ui/package.json`
- `packages/validation/package.json`

Expected result:

- pnpm recognizes `apps/*` and `packages/*` as workspace packages.
- Package boundaries match the accepted repository architecture.
- No real application or feature code exists yet.

Explicitly excluded from Step 1:

- NestJS scaffolding
- Next.js scaffolding
- Prisma setup
- Docker/PostgreSQL/Redis setup
- UI components
- auth, admin, donation, payment, Pump, CMS, or media implementation
- Turborepo

Suggested commit message:

```txt
chore(repo): bootstrap pnpm monorepo skeleton
```

### Step 2: Scaffold API application shell

Status: Completed on 2026-05-24

Goal:

Create the initial NestJS API app shell inside `apps/api` without implementing business domains.

Expected result:

- API app can start locally.
- Basic health endpoint or equivalent minimal smoke check exists.
- Initial source layout supports future modular monolith boundaries.

Suggested commit message:

```txt
chore(api): scaffold NestJS application shell
```

### Step 3: Scaffold Web application shell

Status: Completed on 2026-05-24

Goal:

Create the initial Next.js App Router web app inside `apps/web` without implementing real product pages.

Expected result:

- Web app can start locally.
- Initial App Router structure exists.
- Persian/RTL and design-system direction are prepared at the shell level.

Suggested commit message:

```txt
chore(web): scaffold Next.js app router shell
```

### Step 4: Add local database and service foundation

Status: In progress

Goal:

Add the local development foundation for PostgreSQL, Redis, and Prisma.

Expected result:

- Local database and Redis service can run.
- Prisma is configured for the API app.
- No full domain schema is implemented unless separately confirmed.

Progress:

- 2026-05-24: Started Step 4 by adding local PostgreSQL/Redis Compose service definitions and environment examples. Prisma setup and service smoke checks remain pending.
- 2026-05-24: Adjusted local service host ports to avoid existing development-service conflicts: PostgreSQL defaults to `55434`, Redis defaults to `6384`.
- 2026-05-24: Added Prisma 7 foundation in `apps/api`, including Prisma config, schema location, and API database scripts. PostgreSQL and Redis local service checks passed. PostgreSQL migration SQL was generated and verified directly against local Postgres. Normal `prisma migrate dev` currently fails with an unhelpful Prisma schema-engine error and needs follow-up before treating Prisma workflow as fully settled.
- 2026-05-24: Corrected the first Prisma schema scope before commit: the schema now starts only with the agreed `USERS` table, using `mobile` as the canonical unique mobile column.

Suggested commit message:

```txt
chore(db): add local database and prisma foundation
```

### Step 5: Add first user database slice

Status: In progress

Goal:

Implement the first users table based on the simplified documented database decision.

Expected result:

- The Prisma schema contains only the agreed `User` model and `UserStatus` enum.
- No auth, admin, OTP, session, RBAC, audit log, donation, payment, Pump, Peyman, CMS, or frontend flow is implemented unless separately confirmed.

Progress:

- 2026-05-24: Removed the broader identity/security schema draft from the current implementation slice. Step 5 now contains only the agreed `USERS` table shape: `id`, `mobile`, `first_name`, `last_name`, `status`, `last_login_at`, `last_login_ip_address`, `created_at`, and `updated_at`.

Suggested commit message:

```txt
feat(db): add initial users schema
```

## Completed Work

- 2026-05-24: Completed Step 1 by adding the pnpm workspace skeleton, root package manifest, app package manifests, and shared package manifests. No framework, database, UI, or feature implementation was added.
- 2026-05-24: Cleaned root-level source assets by moving `pump/`, `debit-peyman/`, and `design/` into `docs/source/client/`, then updated references. Kept `docs/`, `openspec/`, and `.codex/` at the root because they are active project memory/tooling paths.
- 2026-05-24: Completed Step 2 by adding a minimal NestJS API application shell, TypeScript config, a `/health` endpoint, an e2e smoke test, and the planned modular monolith source folders. No business domain implementation was added.
- 2026-05-24: Completed Step 3 by adding a minimal Next.js App Router web shell, `/` to `/fa` redirect, Persian RTL layout, base CSS, locale config, and initial feature boundary folders. No real product pages, donation flow, admin UI, CMS rendering, or shared UI package implementation was added.

## Current Next Action

Review the simplified Step 5 user schema and resolve the Prisma `migrate dev` schema-engine issue before committing or moving to auth/API implementation.
