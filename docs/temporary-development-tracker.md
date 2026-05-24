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

Status: Completed on 2026-05-24

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

Status: Completed on 2026-05-24

Goal:

Implement the first users table based on the simplified documented database decision.

Expected result:

- The Prisma schema contains only the agreed `User` model and `UserStatus` enum.
- No auth, admin, OTP, session, RBAC, audit log, donation, payment, Pump, Peyman, CMS, or frontend flow is implemented unless separately confirmed.

Progress:

- 2026-05-24: Removed the broader identity/security schema draft from the current implementation slice. Step 5 now contains only the agreed `USERS` table shape: `id`, `mobile`, `first_name`, `last_name`, `status`, `last_login_at`, `last_login_ip_address`, `created_at`, and `updated_at`.
- 2026-05-24: Committed the simplified users-only Prisma schema in `feat(db): add initial users prisma schema`.

Suggested commit message:

```txt
feat(db): add initial users schema
```

### Step 6: Add remaining first database slice tables

Status: Completed on 2026-05-24

Goal:

Add the rest of the already documented first database slice to Prisma without expanding into auth, admin, OTP, Peyman, CMS, media, or project tables.

Expected result:

- Prisma includes `Donation`, `PaymentTransaction`, `PartnerMission`, and `PartnerMissionCompletion`.
- The schema preserves nullable user ownership for guest donations.
- Payment transaction fields support idempotent gateway attempts and reconciliation.
- Partner mission completions can be counted by `mission_id + mobile_snapshot`.
- No API routes, frontend flows, auth logic, seed data, or provider integrations are implemented in this step.

Progress:

- 2026-05-24: Started Step 6 by adding Prisma models, enums, relations, indexes, and a SQL migration for donations, payment transactions, partner missions, and partner mission completions.
- 2026-05-24: Verified Step 6 with Prisma format, schema validation, client generation, API tests, API typecheck, and full workspace build.

Suggested commit message:

```txt
feat(db): add donation payment and partner mission schema
```

### Step 7: Stabilize Prisma migration workflow

Status: Completed on 2026-05-24

Goal:

Make the normal Prisma migration workflow reliable for local development before adding application database code.

Expected result:

- Local PostgreSQL can be started cleanly for migration testing.
- `pnpm --filter @iranautism/api db:migrate` works against the local database, or the exact blocker is documented with a safe agreed workaround.
- Existing migrations apply in order from an empty database.
- Prisma validation and client generation still pass.
- No schema expansion, API routes, business logic, seed data, frontend work, or provider integration is added in this step.

Progress:

- 2026-05-24: Reproduced the migration failure against a fresh local database. The project-side blocker was a stale empty migration directory left after removing the broad identity/security migration; Prisma failed with `P3015` because that directory had no `migration.sql`.
- 2026-05-24: Removed the stale empty migration directory. The remaining migration folder list is now only `20260524150000_init_users` and `20260524170000_add_donation_payment_partner_mission_tables`.
- 2026-05-24: Verified that `prisma migrate deploy` applies both migrations in order from an empty local database.
- 2026-05-24: Verified that `pnpm --filter @iranautism/api db:migrate` reports the database is already in sync after the migrations are applied.
- 2026-05-24: Re-ran Prisma validation, Prisma client generation, API tests, API typecheck, and full workspace build successfully.

Suggested commit message:

```txt
chore(db): stabilize prisma migration workflow
```

### Step 8: Add NestJS Prisma integration layer

Status: Completed on 2026-05-24

Goal:

Connect the NestJS API app to Prisma through a small infrastructure module without implementing product features.

Expected result:

- API has a reusable Prisma service/module.
- App startup and shutdown handle Prisma connection lifecycle cleanly.
- Tests can import the database module safely.
- No user, donation, payment, Pump, auth, admin, or frontend business flows are implemented in this step.

Progress:

- 2026-05-24: Added a global `PrismaModule` and shared `PrismaService` under `apps/api/src/infrastructure/prisma`.
- 2026-05-24: Configured `PrismaService` for Prisma 7 using the official PostgreSQL driver adapter.
- 2026-05-24: Wired `PrismaModule` into `AppModule` so future API modules have one shared database access path.
- 2026-05-24: Added a focused test proving `AppModule` provides the shared Prisma service, while keeping the health smoke test independent from a live database connection.
- 2026-05-24: Verified Step 8 with API tests, API typecheck, Prisma validation/client generation, and full workspace build.

Suggested commit message:

```txt
chore(api): add prisma integration layer
```

### Step 9: Add backend domain module boundaries

Status: Completed on 2026-05-24

Goal:

Create the first NestJS module boundaries that match the current Prisma/database slice.

Expected result:

- Minimal module folders/classes exist for users, donations, payments, and partner missions.
- Modules are wired enough to compile, but contain no public product endpoints unless separately confirmed.
- The API source tree starts matching the documented modular monolith direction.

Progress:

- 2026-05-24: Added minimal NestJS module classes for users, donations, payments, and partner missions.
- 2026-05-24: Wired the initial domain modules into `AppModule` without adding controllers, providers, routes, or business logic.
- 2026-05-24: Added a focused test proving `AppModule` includes the initial domain module boundaries.
- 2026-05-24: Verified Step 9 with API tests, API typecheck, Prisma validation, and full workspace build.

Suggested commit message:

```txt
chore(api): add initial domain module boundaries
```

### Step 10: Start first Pump donation backend flow

Status: Not started

Goal:

Begin the first real business flow after database and module foundations are stable.

Expected result:

- Define the smallest backend slice for Pump donation intent, payment transaction creation, payment confirmation, and partner mission completion update.
- Keep provider-specific payment and Pump integration details behind interfaces/stubs until real credentials and final provider contracts are confirmed.
- Do not build frontend screens or admin UI in this step unless separately confirmed.

Suggested commit message:

```txt
feat(pump): add initial donation mission backend flow
```

## Completed Work

- 2026-05-24: Completed Step 1 by adding the pnpm workspace skeleton, root package manifest, app package manifests, and shared package manifests. No framework, database, UI, or feature implementation was added.
- 2026-05-24: Cleaned root-level source assets by moving `pump/`, `debit-peyman/`, and `design/` into `docs/source/client/`, then updated references. Kept `docs/`, `openspec/`, and `.codex/` at the root because they are active project memory/tooling paths.
- 2026-05-24: Completed Step 2 by adding a minimal NestJS API application shell, TypeScript config, a `/health` endpoint, an e2e smoke test, and the planned modular monolith source folders. No business domain implementation was added.
- 2026-05-24: Completed Step 3 by adding a minimal Next.js App Router web shell, `/` to `/fa` redirect, Persian RTL layout, base CSS, locale config, and initial feature boundary folders. No real product pages, donation flow, admin UI, CMS rendering, or shared UI package implementation was added.

## Current Next Action

Review and confirm Step 10 before implementation.
