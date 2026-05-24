# Backend Architecture Decision

Date: 2026-05-17

Status: Accepted baseline

Updated: 2026-05-21 to align with the accepted repository/tooling decision in `docs/decisions/repository-architecture.md`.

## Executive Recommendation

Build the Iran Autism platform backend as a TypeScript modular monolith using NestJS, PostgreSQL, Prisma, Redis/BullMQ, and S3-compatible object storage.

The backend should be one deployable application at first, with strict internal module boundaries so individual domains can later be extracted, reused, or evolved without rewriting the platform.

This decision fits the current project because the platform combines CMS, crowdfunding, payments, donation history, construction progress transparency, media management, reporting, admin workflows, and future service modules. It needs reliability and clean boundaries more than early distributed-system complexity.

## Accepted Stack

| Layer | Decision | Why |
|---|---|---|
| Primary language | TypeScript | Matches current developer experience and frontend ecosystem. |
| Backend framework | NestJS | Strong module structure, DI, guards, validation, queues, and scalable code organization. |
| Runtime | Node.js LTS | Stable production target; better default than Bun for this project. |
| Database | PostgreSQL | Best fit for relational donation, payment, project, CMS, and reporting data. |
| ORM | Prisma | Productive, type-safe, migration-friendly, and suitable for a small team. |
| Queue/cache | Redis + BullMQ | Handles OTP, payment retries, reports, notifications, and background jobs. |
| File storage | S3-compatible object storage | Keeps media out of the database and supports future CDN delivery. |
| Deployment | Docker/Docker Compose first | Operationally simple and easy to move across VPS/cloud environments. |
| API style | REST first | Direct, predictable, and enough for current public/admin needs. |

## Explicit Non-Decisions for MVP

The following are intentionally not selected for the first backend build:

| Option | Decision | Reason |
|---|---|---|
| Go as primary backend | Do not use now | Technically strong, but slower for current developer productivity and CMS/admin-heavy delivery. |
| Bun as production runtime | Do not use now | Useful as tooling later, but Node.js LTS is safer for production. |
| Microservices | Do not start with them | Adds deployment, auth, observability, and consistency complexity too early. |
| Multiple primary databases | Do not start with them | One PostgreSQL database keeps transactions, reporting, and backups simpler. |
| MongoDB/document database | Do not use as primary DB | The core model is relational and financial. |
| Full page-builder CMS | Do not build first | Controlled CMS sections are safer and faster for MVP. |

## Architecture Style

Use a modular monolith.

One backend application should contain separate domain modules with clear ownership. Modules may share infrastructure, but domain logic should not be casually mixed across boundaries.

Initial deployable unit:

- One API application.
- One worker process from the same codebase when background jobs require separation.
- One PostgreSQL database.
- One Redis instance.
- One object storage provider.

Future deployable units may be extracted only when a module has proven independent scaling, operational, or reuse needs.

## Backend Module Boundaries

| Module | Owns | Notes |
|---|---|---|
| Auth | OTP, sessions, login, token issuing, auth rate limits | Reusable across future projects. |
| Users | Public user profiles, donation history references, user status | Keep user identity separate from payment records. |
| Admin/RBAC | Admin accounts, roles, permissions, admin guards | Required early because this is a financial/content platform. |
| CMS | Pages, menus, blog/news, SEO fields, redirects, site content | Start controlled, not as a full free-form page builder. |
| Media | Uploads, metadata, albums, validation, file references | Files live in object storage, metadata lives in PostgreSQL. |
| Projects | Campaigns, project types, statuses, public project data | Core fundraising domain. |
| Construction Phases | Phase budgets, status, progress, phase media | Separate financial and operational progress. |
| Transparency Timeline | Project/phase updates, progress reports, public visibility | Public trust mechanism. |
| Donations | Donation intent, target selection, donor message, donor visibility | Do not merge with gateway transaction logic. |
| Payments | Gateway abstraction, initiation, callbacks, verification | Isolate and log heavily. |
| Transactions | Payment attempts, gateway refs, transaction lifecycle | Financial records should be append-friendly and auditable. |
| Reports | Filters, aggregations, CSV/XLSX exports | Start PostgreSQL-based. |
| Notifications | OTP SMS, confirmations, admin alerts, future updates | Queue-backed provider abstraction. |
| Audit Log | Sensitive admin/payment/content events | Needed for accountability. |
| Settings | Site, gateway, SMS, feature flags, platform config | Avoid hard-coded provider assumptions. |

## Database Strategy

Use one PostgreSQL database as the source of truth.

Do not split databases by module in the MVP. Instead, use clear table naming, Prisma models, service boundaries, and module ownership.

Recommended concepts:

- `users`
- `admin_users`
- `roles`
- `permissions`
- `projects`
- `project_phases`
- `funding_items`
- `donations`
- `payment_transactions`
- `payment_attempts`
- `gateway_callback_logs`
- `timeline_entries`
- `media_assets`
- `pages`
- `articles`
- `menus`
- `site_settings`
- `audit_logs`
- `report_exports`

Important modeling rule: keep donation intent, payment transaction, payment attempt, project progress, financial progress, and public transparency updates as separate concepts.

## Payment Strategy

Payments must be treated as a carefully isolated domain.

Standard payment flow:

1. Create a donation intent.
2. Create an internal payment transaction with `pending` status.
3. Redirect the donor to the selected gateway.
4. Receive the gateway callback.
5. Verify the payment server-to-server.
6. Mark the transaction successful or failed.
7. Confirm the donation only after verified payment success.
8. Update project/phase financial totals through controlled logic.
9. Store callback logs and verification results.

Use a gateway interface so Zarinpal or another Iranian gateway can be swapped or extended later.

Do not build recurring payments or international donations in MVP unless explicitly confirmed. Keep the architecture ready by isolating payment providers and transaction states.

## Authentication and Authorization Strategy

## Message Language Rule

All user-facing backend messages must be Persian by default.

This includes:

- API error messages returned to clients.
- API success messages intended for display.
- validation messages exposed to frontend users.
- authentication, OTP, payment, donation, and Pump mission flow messages.

English is allowed only for internal code identifiers, protocol fields, third-party provider constants, developer/operator logs, and values that must match external API contracts.

Backend responses should keep machine-readable fields stable while returning Persian human-readable messages where a human message is needed.

Public users:

- Mobile OTP login/register.
- Donation history after login.
- Rate-limited OTP requests.

Admins:

- Separate admin authentication.
- Role-based authorization.
- Stronger protection for finance and super-admin actions.
- Audit logs for sensitive operations.

Initial admin roles:

- `super_admin`
- `content_manager`
- `finance_manager`
- `project_manager`
- `media_manager`

## CMS/Admin Strategy

Build a controlled CMS for MVP:

- Pages.
- Menus.
- Header/footer settings.
- Homepage sections.
- Slider items.
- Blog/news.
- SEO fields.
- Media reuse.
- Project and phase content.

Avoid a full page builder at first. It can be added later if the client confirms that editors need flexible block composition.

## Media Strategy

Store files in object storage and metadata in PostgreSQL.

The media module should support:

- Images.
- Videos.
- Documents.
- Albums/categories/tags.
- Visibility status.
- Reuse across pages, articles, projects, phases, galleries, timelines, and videos.

Do not build video transcoding in MVP unless direct video hosting becomes a confirmed requirement. Prefer upload limits, object storage/CDN, and support for external embeds when needed.

## Background Jobs and Notifications

Use Redis and BullMQ.

Initial jobs:

- OTP SMS sending.
- Payment verification retries.
- Payment callback recovery.
- Report export generation.
- Media metadata extraction.
- Donation confirmation notifications.
- Admin alerts.
- Cleanup of expired OTPs and stale payment attempts.

Run workers from the same codebase. They may become separate containers before they become separate services.

## Reporting and Analytics

Start with PostgreSQL-based reports and exports.

MVP reports:

- Donations by date.
- Donations by project.
- Donations by phase.
- Payment success/failure rates.
- Transaction exports.
- User/donor growth.
- Project funding progress.
- Gateway callback errors.
- Admin export history.

Add read replicas, materialized views, or a separate analytics store only when reporting becomes too slow or business analytics requirements grow.

## Suggested Repository Structure

Detailed monorepo/tooling decisions are documented in `docs/decisions/repository-architecture.md`.

Use `pnpm` workspaces for v1. Do not add Turborepo initially; keep it optional for later if task caching and orchestration become valuable.

```txt
apps/
  api/
    src/
      main.ts
      app.module.ts
      modules/
        auth/
        users/
        admin/
        cms/
        media/
        projects/
        phases/
        transparency/
        donations/
        payments/
        transactions/
        reports/
        notifications/
        audit-log/
        settings/
      common/
        guards/
        decorators/
        filters/
        interceptors/
        pipes/
        pagination/
        errors/
      infrastructure/
        prisma/
        redis/
        storage/
        sms/
        payment-gateways/
        logger/

  web/
    # Next.js public website, donation flows, account area,
    # CMS rendering, media experiences, and admin panel for v1

  admin/
    # Optional later only if admin needs separate deployment,
    # private hosting, release cadence, team ownership,
    # or bundle-size isolation

packages/
  api-client/
  config/
  design-tokens/
  icons/
  types/
  validation/
  ui/
  eslint-config/
  tsconfig/
```

Because admin lives inside `apps/web` for v1, the NestJS backend must remain the security boundary. Admin APIs must be protected by backend admin auth, RBAC, permission checks, and audit logs; hiding admin UI in the frontend is not security.

## Reusable Components for Future Projects

Build the following as clean internal modules so they can later be reused:

- OTP authentication.
- Admin RBAC.
- Audit logging.
- Media upload/storage.
- Payment gateway abstraction.
- Transaction state handling.
- Donation/crowdfunding core.
- CMS pages/menus/blog.
- Report/export generation.
- Notification provider abstraction.
- Platform settings.

Reuse should come from clean boundaries and configuration first. Do not prematurely publish separate packages unless another project actually needs them.

## Build Now

Build these early:

1. Monorepo/backend foundation.
2. Dockerized local environment.
3. PostgreSQL and Prisma migrations.
4. Auth, admin auth, RBAC, and audit log.
5. Project and construction phase model.
6. Media module foundation.
7. Donation intent model.
8. Payment transaction lifecycle.
9. Domestic gateway integration.
10. Admin APIs for projects, donations, transactions, media, and reports.
11. Controlled CMS for pages, menus, blog/news, SEO, and homepage sections.
12. Queue-backed notifications and background jobs.
13. Reports and CSV/XLSX exports.
14. Logging, backups, monitoring, and rate limiting.

## Avoid Overengineering Now

Do not build these until confirmed or technically necessary:

- Microservices.
- Multiple primary databases.
- Kubernetes.
- Kafka.
- Event sourcing.
- Full page-builder CMS.
- Custom video transcoding pipeline.
- International donations.
- Recurring donations.
- Complex accounting system.
- Advanced analytics warehouse.
- Support ticketing.
- Comments/ratings.
- Doctor booking/Q&A/play center reservations.
- Generic plugin system.

## Future Extraction Plan

Extract only after module boundaries are proven:

1. Worker process as a separate container.
2. Media processing service if video upload/transcoding grows.
3. Payment service if multiple products/projects reuse it or compliance requires isolation.
4. Notification service if message volume grows.
5. CMS package/module for reuse across websites.
6. Crowdfunding package/module for reuse across fundraising projects.

## Module Development Protocol

Before starting any module:

1. Read this backend architecture decision.
2. Read `docs/product/module-registry.md`.
3. Check whether the module status is `Core candidate`, `Needs confirmation`, `Future scope`, `In progress`, `Done`, or `Removed`.
4. Confirm open questions before coding if the module depends on unsettled scope.
5. Create or update a dedicated module note under `docs/product/modules/` when implementation starts.
6. Define the module boundary: owned entities, APIs, permissions, jobs, events, and dependencies.
7. Record any meaningful decision in `docs/decisions/change-log.md`.
8. Update `AGENTS.md` only with a short operational pointer or status change.

During module development, document:

- What was built.
- What was intentionally deferred.
- Which entities/tables were added.
- Which APIs/admin screens were added.
- Which permissions were added.
- Which jobs/notifications were added.
- Which tests or verification steps were completed.
- Which open questions remain.

## Per-Module Implementation Note Template

Use this template when a module begins implementation.

```md
# Module: <Module Name>

Status: In progress

Started: YYYY-MM-DD

## Purpose

## Backend Boundary

## Owned Data

## APIs

## Admin Capabilities

## Public/User Capabilities

## Permissions

## Background Jobs

## Integrations

## What Was Built

## Deferred

## Verification

## Open Questions

## Related Decisions
```

## Final Checklist

- Backend remains NestJS modular monolith unless a new decision changes it.
- PostgreSQL remains the primary database.
- Redis is used for queues/cache/rate limits, not primary data.
- Object storage is used for files and videos.
- Payment logic stays isolated from donation intent.
- Admin/RBAC/audit are built early.
- CMS starts controlled, not fully free-form.
- Future modules are prepared through boundaries, not built prematurely.
- Every module implementation updates the relevant docs.
