# Iran Autism Platform Change Log

Use this file to record confirmed decisions, scope changes, module status changes, and important project conclusions. Keep entries short, dated, and linked to the relevant detailed document when possible.

## 2026-05-24

### User Table Decision Simplified Before First Prisma Slice Commit

- Removed the earlier broad user/admin/auth/log decision draft because it was broader than the currently agreed database implementation slice.
- Updated the current database design so `USERS.mobile` is the canonical unique normalized mobile value, replacing `USERS.normalized_mobile`.
- Reduced the first Prisma database slice to only the agreed `USERS` table. Auth, admin membership, OTP, sessions, RBAC, permissions, audit logs, activity logs, and security events must be redesigned in a focused decision before implementation.

### Donation Privacy And Currency Storage Rules Accepted

- Updated `docs/decisions/iranautism-database-design-decisions.md` to distinguish registered donations, guest donations, and public anonymity.
- Decision: public anonymity controls public display only; guest donations may still retain internal checkout/payment snapshots for receipt, support, reconciliation, fraud prevention, legal/financial records, and future account matching.
- Decision: store all monetary amounts as integer IRR at the database level and display toman only at the view/UI level when appropriate.
- Updated `docs/product/modules/iranautism-database-table-design.md` so donation and payment transaction amount fields use integer IRR with `IRR` as the v1 canonical currency.

### Minimum Secure Payment Transaction Design Accepted

- Updated `docs/decisions/iranautism-database-design-decisions.md` and `docs/product/modules/iranautism-database-table-design.md` to define the v1 `PAYMENT_TRANSACTIONS` model as an idempotent, reconcilable payment-attempt table rather than a minimal gateway reference table.
- Decision: keep payment transactions related to donations for v1, but include amount/currency snapshots, gateway authority/reference fields, idempotency key, correlation ID, lifecycle timestamps, failure code, and safe provider response summaries.
- Rule: payment success must come from server-side gateway verification, and repeated callbacks must not double-confirm donations, duplicate Pump completions, duplicate receipts, or duplicate financial records.
- Updated `docs/analysis/iranautism-database-design-playground.mmd` to reflect the minimum secure payment transaction fields.

### Iran Autism Database Design Slice Captured

- Added `docs/decisions/iranautism-database-design-decisions.md` to capture the current working decisions for the first Iran Autism database design slice: users, guest/registered donations, payment transactions, and partner mission completion.
- Added `docs/product/modules/iranautism-database-table-design.md` as the table-level memory for the first registration, donation, payment, and partner mission implementation slice.
- Updated `docs/analysis/iranautism-database-design-playground.mmd` as the visual playground for the overall Iran Autism database design; the current slice supports nullable `user_id`, donor snapshots, public visibility, donation targets, and partner mission qualification by mobile.
- Current opinion: prefer OTP register/login before the first Pump donation, but keep `DONATIONS.user_id` nullable so product-supported guest/anonymous donation remains possible.

## 2026-05-23

### User, Admin, Auth, And Log Database Slice Drafted

- Added an earlier broad database-slice draft for users, profiles, mobile OTP auth, sessions/devices, admin membership, RBAC, permissions, audit logs, user activity logs, and auth security events.
- Recommended a shared `users` identity table with a separate `admin_accounts` membership model instead of fully separate admin identities.
- Established that permissions, not role names, should be the enforcement primitive for admin APIs; roles group permissions for manageability.
- Kept future donation, Pump, Peyman, CMS, media, reports, and project references compatible through stable user IDs plus generic audit targets without designing those full schemas yet.
- Marked AR-05 as in discussion and pointed it to this focused database-design decision.
- Note: this broad draft was removed on 2026-05-24 before implementation because it exceeded the agreed current schema slice.

### Pump and Peyman Feature Understanding Documented

- Added `docs/product/modules/partner-missions-pump.md` for the Pump partner mission integration.
- Captured the Pump verification rule: repeatable missions should return the user's mobile number plus `count`; non-repeatable missions should return the user's mobile number plus a status/flag, with incomplete missions returning `false`.
- Added `docs/product/modules/recurring-donations-peyman.md` for Peyman direct debit recurring donations.
- Added `M17 Partner Missions and Reward Integrations` to the module registry and marked it `In progress` because Pump is planned as the first feature to develop.
- Kept recurring donations documented as upcoming scope, with Peyman as the likely provider implementation.

## 2026-05-21

### Architecture Rule Progress Tracking Started

- Added `docs/architecture-rules/progress.md` to track discussion status for the architecture-rule agenda.
- Started AR-01 backend module boundary discussion in `docs/decisions/backend-module-boundaries.md`.
- Clarified that early module-boundary work should define responsibilities and owned business concepts, not final database tables.

### Architecture Rules Deep-Dive Agenda Added

- Added `docs/architecture-rules/deep-dive-agenda.md` as the planning agenda for architecture-rule discussions.
- The agenda is not a final rulebook; it lists the topics, questions, and suggested output documents that should be handled one by one before implementation hardens around hidden assumptions.
- Initial priority topics: backend module boundaries, Prisma/data ownership, financial domain separation, auth/RBAC/audit, API contracts, shared package ownership, frontend state/data ownership, CMS boundaries, background jobs, and testing quality gates.

### Repository Architecture and Admin Placement Accepted

- Accepted the repository/tooling decision documented in `docs/decisions/repository-architecture.md`.
- Decision: use a monorepo with `pnpm` workspaces for v1, with `apps/api` for the NestJS backend and `apps/web` for the Next.js public website, donation flows, account area, CMS rendering, media experiences, and admin panel.
- Decision: do not add Turborepo initially; keep it optional for later when task caching, task orchestration, CI time, or package graph complexity justifies it.
- Decision: keep admin inside `apps/web` for v1 and create `apps/admin` later only if admin needs separate deployment, private hosting, separate release cadence, separate team ownership, or public bundle size becomes a real problem.
- Backend implication: admin-in-web is only a frontend organization decision; NestJS remains the security boundary through admin auth, RBAC, permission checks, and audit logs.

## 2026-05-18

### Frontend Architecture Baseline Accepted

- Accepted the frontend architecture baseline documented in `docs/decisions/frontend-architecture.md`.
- Decision: build a monorepo with the accepted NestJS backend and one Next.js App Router frontend app for v1.
- Public website, CMS-driven pages, donation/payment flows, user dashboard, media/video experiences, and admin panel will live in one frontend app initially, with strict route-group and feature-module boundaries.
- Styling/design system direction: project-root `DESIGN.md`, pure CSS, semantic design tokens, component-driven architecture, RTL-safe CSS, and reusable packages.
- Library decisions: use Radix-style headless accessible primitives where useful for complex behavior, Tabler Icons through a project-owned `icons.ts` wrapper/map, and Zustand selectively for cross-component client UI state.
- Confirmed that Radix primitives should be wrapped behind project-owned `packages/ui` components, admin should remain inside `apps/web` for v1, and future e-commerce should remain architecture-ready but outside MVP.
- Explicitly deferred separate public/admin frontend apps, microfrontends, a full drag-and-drop page builder, heavy global state architecture, and published external UI packages until justified.

## 2026-05-17

### Backend Architecture Baseline Accepted

- Accepted the backend architecture baseline documented in `docs/decisions/backend-architecture.md`.
- Decision: build a TypeScript/NestJS modular monolith with PostgreSQL, Prisma, Redis/BullMQ, S3-compatible object storage, Dockerized deployment, REST APIs, strong module boundaries, RBAC, audit logging, and isolated payment/transaction logic.
- Explicitly deferred microservices, multiple primary databases, Go as the main backend, Bun as the production runtime, full page-builder CMS, recurring/international payments, advanced analytics, and future service modules until confirmed or technically necessary.
- Added a module development protocol: before implementing a module, check the backend architecture decision, module registry, open questions, and maintain a dedicated module note under `docs/product/modules/` when work begins.

### Initial Understanding Completed

- Reviewed the available client/source documents.
- Produced the synthesized scope document at `docs/analysis/client-request-full-understanding.md`.
- Current understanding: the requested product is a custom Iran Autism platform combining public website, CMS, crowdfunding, construction progress transparency, payment/donation system, admin panel, reporting, and media/storytelling.

### Workspace Reorganized

- Preserved the client PowerPoint and Persian developer proposal under `docs/source/client/`.
- Removed the old intake files/folders that are no longer part of the clean workspace.
- Added root `AGENTS.md` as the orchestration file.
- Added `docs/product/module-registry.md` as the mutable registry of known modules and uncertain features.

### Scope Management Rule

- Module/functionality scope is not frozen.
- Features may be added, removed, split, merged, deferred, or completed as the project owner and client clarify priorities.
- Any meaningful scope change should update `docs/product/module-registry.md`, this change log, and the root `AGENTS.md` status snapshot.
