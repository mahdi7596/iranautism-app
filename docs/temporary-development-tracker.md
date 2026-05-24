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

Status: Not started

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

Status: Not started

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

Status: Not started

Goal:

Add the local development foundation for PostgreSQL, Redis, and Prisma.

Expected result:

- Local database and Redis service can run.
- Prisma is configured for the API app.
- No full domain schema is implemented unless separately confirmed.

Suggested commit message:

```txt
chore(db): add local database and prisma foundation
```

### Step 5: Add first identity/security database slice

Status: Not started

Goal:

Implement the first users, auth, admin membership, RBAC, audit log, and activity log schema slice based on the documented database decision.

Expected result:

- The schema foundation supports later donation, payment, Pump, Peyman, CMS, and admin workflows.
- No frontend auth flow is implemented unless separately confirmed.

Suggested commit message:

```txt
feat(auth): add initial identity and admin security schema
```

## Completed Work

- 2026-05-24: Completed Step 1 by adding the pnpm workspace skeleton, root package manifest, app package manifests, and shared package manifests. No framework, database, UI, or feature implementation was added.

## Current Next Action

Review Step 1 changes. If accepted, the next confirmed implementation step is Step 2: scaffold the NestJS API application shell.
