# Repository Architecture Decision

Date: 2026-05-21

Status: Accepted baseline

## Executive Recommendation

Use a monorepo with `pnpm` workspaces for v1.

Do not add Turborepo at the beginning. Turborepo is approved as an optional future tool when the repository has enough apps/packages, repeated CI tasks, or slow builds/tests that make task caching and task orchestration clearly valuable.

The accepted v1 app structure is:

```txt
apps/
  api/
    # NestJS modular monolith backend
  web/
    # Next.js public website, donation flows, account area,
    # CMS rendering, media experiences, and admin panel for v1

packages/
  api-client/
  config/
  design-tokens/
  icons/
  types/
  ui/
  validation/
```

`apps/admin` may be created later only if admin needs separate deployment, private hosting, separate release cadence, separate team ownership, or public bundle size becomes a real problem.

## Accepted Decisions

| Topic | Decision | Why |
|---|---|---|
| Repository model | Monorepo | Keeps frontend, backend, shared packages, API client, types, validation, and design system coordinated. |
| Package manager | pnpm | Efficient package manager with first-class workspace support. |
| Workspace tool | pnpm workspaces | Enough for v1 monorepo linking, scripts, and package filtering. |
| Task runner/cache | Do not add Turborepo initially | v1 has only `apps/api`, `apps/web`, and a small set of packages; Turbo's main benefits are not yet needed. |
| Future task runner | Turborepo optional later | Add when build/test/lint workflows become slow or package graph grows. |
| Admin frontend | Inside `apps/web` for v1 | Reduces deployment and architecture complexity while the admin scope is still growing. |
| Future admin split | `apps/admin` only when justified | Separate app should solve a real operational problem, not just look cleaner on paper. |

## Proof for pnpm First, Turborepo Later

Official pnpm documentation says pnpm has built-in monorepo/workspace support and uses `pnpm-workspace.yaml` to unite multiple projects in one repository:

- Source: https://pnpm.io/workspaces
- Relevant point: pnpm has built-in support for monorepositories and workspaces.

Official pnpm documentation also supports filtering commands to subsets of packages:

- Source: https://pnpm.io/filtering
- Relevant point: `pnpm --filter <package_selector> <command>` can run commands for selected packages, dependencies, dependents, or changed areas.

Official Turborepo documentation describes Turborepo as a workflow optimizer that parallelizes and caches tasks:

- Source: https://turborepo.dev/docs/crafting-your-repository/running-tasks
- Relevant point: Turborepo optimizes repository workflows by running tasks through a common task graph with filtering, parallelization, and task configuration.

Official Turborepo caching documentation says Turborepo speeds up builds by restoring task outputs from cache when fingerprints match:

- Source: https://turborepo.dev/docs/crafting-your-repository/caching
- Relevant point: Turborepo's core value is task caching, including local and optional remote cache.

This means Turborepo solves a different problem than pnpm:

- pnpm answers: "How do we manage packages and workspace dependencies?"
- Turborepo answers: "How do we orchestrate and cache repeated tasks across many packages/apps?"

For v1, pnpm already gives the workspace foundation we need. Turborepo becomes useful when task orchestration and caching become a real bottleneck.

## Why Not Turborepo Immediately

Do not start with Turborepo because:

- The v1 repository is expected to have only two primary apps: `api` and `web`.
- There is not yet enough build/test/lint repetition to prove caching value.
- Turbo requires extra configuration such as `turbo.json`, task outputs, environment/input handling, and CI cache thinking.
- Misconfigured task outputs or environment inputs can create confusing cache behavior.
- pnpm filters are enough for early commands such as running only the API, only the web app, or selected packages.
- Adding Turbo later is straightforward if scripts are kept clean from the beginning.

This is not a rejection of Turborepo. It is a timing decision.

## When to Add Turborepo

Add Turborepo when at least one of these becomes true:

- CI build/test/lint time becomes noticeably slow.
- The repository has several active packages with dependency ordering needs.
- `apps/admin` is split from `apps/web`.
- A mobile app or additional frontend app is added.
- Shared packages such as `ui`, `validation`, `api-client`, and `icons` become heavily used by multiple apps.
- Developers repeatedly need affected-package task runs beyond what pnpm filtering comfortably handles.
- Remote caching would save meaningful time across machines or CI.

When Turborepo is added, keep it as a task runner/cache layer on top of pnpm, not as a replacement for pnpm.

## Admin Panel in `apps/web` for V1

The accepted v1 decision is to keep the admin panel inside `apps/web`.

Recommended route shape:

```txt
apps/web/src/app/
  [locale]/
    (public)/
    (donate)/
    (account)/
    (admin)/
```

Recommended feature shape:

```txt
apps/web/src/features/
  public/
  projects/
  donations/
  payments/
  account/
  admin/
  cms-renderer/
  media/
```

This gives one frontend deployment while still keeping admin code internally separated.

## Backend Approach for Admin-in-Web

Keeping admin inside `apps/web` must not weaken backend security.

The backend remains the security boundary:

- Admin routes in Next.js are only UI routes.
- NestJS APIs must enforce authentication, RBAC, permissions, and audit logs.
- Public APIs and admin APIs should be separated by route prefix and guards.
- Admin permissions must never rely only on frontend hiding/showing UI.
- Sensitive admin actions must be checked and logged on the backend.

Recommended API shape:

```txt
/api/public/*
/api/account/*
/api/admin/*
/api/webhooks/*
```

Recommended NestJS module posture:

- Public read operations can have public controllers.
- Account operations require user auth guards.
- Admin operations require admin auth guards and permission checks.
- Payment callbacks/webhooks use dedicated verification logic and must not depend on browser sessions.

## Future Admin Extraction

Create `apps/admin` later only if a real need appears:

- Admin must be deployed separately.
- Admin must live behind private networking, VPN, or separate hosting.
- Admin release cadence becomes different from the public website.
- Admin bundle size measurably harms public performance.
- A separate team owns admin development.
- Admin workflows become large enough to deserve their own app shell and build.

If extraction happens later, the backend should not need a rewrite because admin APIs will already be separated behind `/api/admin/*`, guards, permissions, and audit logs.

## Final Checklist

- Use pnpm workspaces for v1.
- Do not add Turborepo initially.
- Keep scripts clean so Turborepo can be added later.
- Keep `apps/api` and `apps/web` as the only initial apps.
- Keep admin inside `apps/web` for v1.
- Keep admin internally separated by route groups and feature modules.
- Enforce all admin security in the NestJS backend.
- Add `apps/admin` only after deployment, privacy, release, team, or bundle-size pressure is real.
