# Backend Module Boundaries

Date started: 2026-05-21

Status: In discussion

Related agenda items:

- AR-01: Backend module boundaries
- AR-02: Prisma and data ownership rules
- AR-03: Donation, payment, transaction, and project-progress separation
- AR-04: Admin API, public API, account API, and webhook boundaries
- AR-05: Auth, RBAC, permissions, and audit logging

## Purpose

This document defines backend module responsibility boundaries for the Iran Autism platform before implementation starts.

This is not the final database design. At this stage, modules own business concepts and responsibilities, not finalized table names. Exact PostgreSQL tables, Prisma models, relationships, indexes, and migrations will be designed later in a dedicated database-design step.

## Current Working Direction

Use a NestJS modular monolith with clear domain modules. Modules should be small enough to reason about, but not split so aggressively that early development becomes slow or artificial.

Initial backend modules under discussion:

| Module | Primary responsibility | Owned business concepts, not final tables |
|---|---|---|
| Auth | Login, OTP, sessions, token issuing, rate limits | OTP challenges, sessions, authentication state, login attempts |
| Users | Public user identities and user profile behavior | Donor/user identity, profile information, account status, donation history references |
| Admin/RBAC | Admin identity and authorization | Admin users, roles, permissions, admin access checks |
| Audit Log | Accountability trail for sensitive actions | Audit events, actor/action/target metadata, before/after summaries where needed |
| Projects | Fundraising and public project records | Project identity, project status, public project information, fundraising target concepts |
| Construction Phases | Construction phase planning and progress structure | Phase definitions, phase status, phase budgets, phase operational progress |
| Donations | Donor intent and donation confirmation | Donation intent, donor display preferences, donation target selection, donation confirmation state |
| Payments | Gateway-facing payment workflow | Gateway selection, payment initiation, callbacks, verification, gateway errors |
| Transactions | Internal financial transaction lifecycle | Payment attempts, transaction state, reconciliation references, immutable financial history concepts |
| Media | File and media metadata management | Uploaded assets, media metadata, visibility, reuse references, storage ownership |
| CMS | Editable site content | Pages, menus, articles/news, homepage content, SEO content fields |
| Transparency Timeline | Public trust and progress reporting | Dated updates, public/private progress entries, media-backed evidence |
| Reports | Admin reports and exports | Report filters, export jobs, generated files, reporting views |
| Notifications | Outbound messages and delivery tracking | OTP messages, donation confirmations, admin alerts, provider delivery state |
| Settings | Platform and provider configuration | Site settings, gateway settings, SMS settings, feature flags |

## Boundaries Not Yet Final

The following items require deeper discussion before this decision can be accepted:

- Whether `Payments` and `Transactions` should be separate NestJS modules from day one or separate concepts inside one financial module at first.
- Whether `Construction Phases` should be its own module or a submodule under `Projects`.
- Whether `Audit Log` should expose a shared audit service only, or also own dedicated admin APIs from the start.
- Which modules may call each other directly and which must communicate through application services or events.
- How public, account, admin, and webhook controllers should be distributed across modules.
- How module ownership maps to the first database schema.

## Documentation Rule

When a boundary is accepted:

1. Update this file.
2. Mark the relevant topic in `docs/architecture-rules/progress.md`.
3. Add a short dated entry to `docs/decisions/change-log.md`.
4. Update root `AGENTS.md` only with a short operational pointer if future work rules changed.

