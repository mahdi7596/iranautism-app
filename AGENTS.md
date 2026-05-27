# Iran Autism Project Orchestration

This file is the root coordination document for the Iran Autism platform workspace. It should stay short, current, and directional. Detailed thinking, source analysis, decisions, and module notes belong inside `docs/`.

## Workspace Structure

| Path | Purpose |
|---|---|
| `docs/source/client/` | Original client/source files that must be preserved. |
| `docs/analysis/` | Synthesized understanding, research, requirement analysis, and discovery notes. |
| `docs/product/` | Product scope, module registry, feature breakdowns, and implementation-facing requirements. |
| `docs/decisions/` | Decision log, scope changes, confirmations, and tradeoffs reached during discussion. |
| `AGENTS.md` | Root orchestration index and current project memory. |

## Preserved Source Files

- `docs/source/client/given-powerpoint-by-client.pptx`
- `docs/source/client/iran-autism-developer-proposal-fa.pdf`
- `docs/source/client/design/`
- `docs/source/client/pump/`
- `docs/source/client/debit-peyman/`

## Current Understanding Artifacts

- `docs/analysis/client-request-full-understanding.md`
- `docs/product/module-registry.md`
- `docs/decisions/change-log.md`
- `docs/decisions/backend-architecture.md`
- `docs/decisions/frontend-architecture.md`
- `docs/decisions/repository-architecture.md`
- `docs/architecture-rules/deep-dive-agenda.md`
- `docs/architecture-rules/progress.md`
- `docs/decisions/backend-module-boundaries.md`
- `docs/product/modules/partner-missions-pump.md`
- `docs/product/modules/pump-phase-1-user-flow-summary.md`
- `docs/product/modules/frontend-design-review-feedback-2026-05-27.md`
- `docs/product/modules/recurring-donations-peyman.md`
- `docs/analysis/iranautism-database-design-playground.mmd`
- `docs/decisions/iranautism-database-design-decisions.md`
- `docs/product/modules/iranautism-database-table-design.md`

## Project Memory Protocol

When discussion reaches a meaningful conclusion, update the documentation in two layers:

1. Update the relevant detailed file inside `docs/`.
2. Update this `AGENTS.md` only with the short operational summary, status, and pointer to the detailed file.

Do not treat the module list as fixed. Modules, features, and priorities may be added, removed, merged, split, deferred, or marked complete as the project becomes clearer.

## Current Product Direction

The product is a custom Iran Autism platform combining:

- Public website and CMS.
- Multi-project crowdfunding.
- Construction phase progress and transparency.
- Donation/payment system.
- Admin panel and financial reporting.
- Media, gallery, video, and storytelling features.
- User accounts with mobile OTP and donation history.
- Partner mission verification for Pump, starting with mobile-based mission completion checks.
- Recurring donations through Peyman direct debit, pending implementation priority after Pump unless priorities change.

The platform should be treated as a serious custom system, not a template website.

Current active implementation focus:

- Finish backend first for mobile auth/register/login, Pump mission donations, and Sadad payment verification.
- Pump mission donations must support both OTP-registered users and mobile-only users identified by normalized mobile.
- Broader CMS, admin, media, reports, project/phase, Peyman, and frontend work remains outside the immediate backend focus unless separately confirmed.
- All user-facing messages must be Persian by default across backend and frontend, including API error/success messages, validation text, form messages, toasts, empty states, and loading states.
- When deployment/server upload is requested, remind the project owner that real Sadad credentials must be added to the server-side environment file or secret store on the server, not committed to the repository.

## Current Backend Direction

The accepted backend baseline is documented in `docs/decisions/backend-architecture.md`.

Short version:

- Use a TypeScript/NestJS modular monolith.
- Use PostgreSQL as the single primary database.
- Use Prisma for ORM/migrations.
- Use Redis/BullMQ for queues, background jobs, OTP, retries, and exports.
- Use S3-compatible object storage for media/files/videos.
- Use Dockerized deployment.
- Keep module boundaries strict so future modules can be extracted or reused.
- Do not start with microservices, multiple primary databases, Go as the main backend, or Bun as the production runtime.

## Current Frontend Direction

The accepted frontend baseline is documented in `docs/decisions/frontend-architecture.md`.

Short version:

- Use a monorepo with the NestJS backend and one Next.js App Router frontend app.
- Keep public website, donation flow, user dashboard, CMS rendering, media experiences, and admin panel in one frontend app for v1.
- Keep admin internally separated by route groups and feature modules, but do not split it into a separate app yet.
- Use component-driven architecture with reusable packages for UI, icons, design tokens, validation, types, config, and API client.
- Use project-root `DESIGN.md`, pure CSS, semantic design tokens, and RTL-safe CSS as the styling/design-system source of truth.
- Use Radix-style headless accessible primitives where complex behavior is useful, while keeping all visual styling project-owned.
- Use Tabler Icons through a project-owned `icons.ts` wrapper/map.
- Use Zustand selectively for cross-component client UI state, not for server data, auth truth, payment truth, CMS content, or form state.

Current frontend correction focus:

- OpenSpec change `refine-public-pump-frontend-design` captures the next design pass.
- Realign the public/Pump frontend with the referenced generated designs: flatter orange CTAs, no button shadows, smaller title typography, cleaner white/lavender surfaces, and purple reserved for identity/current states.
- Homepage hero should become a three-slide slider: corrected current concept, `Trust & Progress`, and Persian `شفافیت بالینی`.
- Pump page first section should become only a two-banner slider; mission cards should become featured-image cards in a one-row slider across desktop, tablet, and mobile.
- Login should use an auth-only layout without the public header/footer.
- Shared tokens and reusable components should be updated before page-level redesign to avoid repeated one-off UI code.

## Current Repository Direction

The accepted repository/tooling baseline is documented in `docs/decisions/repository-architecture.md`.

Short version:

- Use a monorepo with `pnpm` workspaces for v1.
- Start with `apps/api` and `apps/web`.
- Keep the admin panel inside `apps/web` for v1.
- Do not add Turborepo initially; keep it optional for later if task caching/orchestration becomes valuable.
- Create `apps/admin` later only if admin needs separate deployment, private hosting, separate release cadence, separate team ownership, or public bundle size isolation.
- Treat admin-in-web as a frontend organization choice only; backend admin auth, RBAC, permission checks, and audit logs remain mandatory.

## Architecture Rules Agenda

The architecture-rule discussion queue is maintained in `docs/architecture-rules/deep-dive-agenda.md`.
Discussion status is tracked in `docs/architecture-rules/progress.md`.

Short version:

- Use the agenda to work through durable architecture topics one by one before implementation locks in hidden assumptions.
- Track each architecture-rule topic as `Not started`, `In discussion`, `Accepted`, `Deferred`, or `Needs revisit` in `docs/architecture-rules/progress.md`.
- Priority topics include backend module boundaries, Prisma/data ownership, financial domain separation, admin/API boundaries, auth/RBAC/audit logging, API contracts, shared package ownership, frontend state/data ownership, CMS boundaries, background jobs, and testing quality gates.
- The agenda is not a final rulebook; accepted conclusions should become focused decision documents under `docs/decisions/` and be recorded in `docs/decisions/change-log.md`.

## Module Registry Snapshot

The authoritative module list is maintained in `docs/product/module-registry.md`.

| Module | Current status | Notes |
|---|---|---|
| Public Website Experience | Core candidate | Homepage, pages, navigation, service narrative, client PowerPoint content. |
| Crowdfunding and Donation System | In progress | First donation slice supports registered donations and schema-level guest donations through nullable user ownership plus donor snapshots. |
| Project and Construction Phase System | Core candidate | Includes the client-provided nine construction phases. |
| Transparency, Timeline, and Progress Reporting | Core candidate | Dated progress updates with media evidence and admin visibility control. |
| Media, Gallery, Video, and Storytelling | Core candidate | Gallery, short video page, timelapse, people/efforts stories. |
| CMS and Editable Content | Core candidate | Pages, menus, footer/header, blog/news, SEO fields, media reuse. |
| Admin Panel | Core candidate | Projects, donations, users, content, reports, transactions, platform settings. |
| Payment, Transactions, and Financial Reporting | Core candidate | Domestic gateway, transaction verification, exports, monitoring. |
| User Accounts, Authentication, and Profiles | In progress | Mobile OTP login/register and minimal profile/Pump history frontend are implemented; broader donation history remains later scope. |
| UI/UX and Design | Core candidate | UX flows, wireframes, UI, responsive design system. |
| Technical Architecture and Deployment | Core candidate | Suggested Next.js/NestJS/PostgreSQL/Prisma/Redis/Docker stack. |
| Future/Phase-Two Services | Future scope | Appointment booking, doctor profiles, Q&A, play center reservations. |
| Partner Missions and Reward Integrations | In progress | Pump backend and first frontend slice are implemented for four Excel missions, OTP identity, Sadad payment start/result, and profile mission history; final Pump return URL/field names still need confirmation. |
| Recurring Donations | Needs confirmation | Peyman direct debit documented as the likely recurring donation implementation. |
| User/Admin/Auth/Logs Database Slice | Needs revisit | Earlier broad auth/admin/log decision removed; current implemented database slice starts only with the agreed `USERS` table. |

## Status Log

| Date | Update |
|---|---|
| 2026-05-17 | Initial document analysis completed and synthesized into `docs/analysis/client-request-full-understanding.md`. |
| 2026-05-17 | Workspace reorganized so preserved source files and project knowledge live under `docs/`; root `AGENTS.md` added as orchestration file. |
| 2026-05-17 | Backend architecture baseline accepted and documented in `docs/decisions/backend-architecture.md`. |
| 2026-05-18 | Frontend architecture baseline accepted and documented in `docs/decisions/frontend-architecture.md`. |
| 2026-05-21 | Repository/tooling baseline accepted and documented in `docs/decisions/repository-architecture.md`. |
| 2026-05-21 | Architecture-rule deep-dive agenda added at `docs/architecture-rules/deep-dive-agenda.md`. |
| 2026-05-21 | Architecture-rule progress tracking started at `docs/architecture-rules/progress.md`; AR-01 backend module boundaries started at `docs/decisions/backend-module-boundaries.md`. |
| 2026-05-23 | Pump partner missions and Peyman direct debit feature understanding documented in `docs/product/modules/partner-missions-pump.md` and `docs/product/modules/recurring-donations-peyman.md`; Pump is the first planned feature to develop. |
| 2026-05-24 | First Iran Autism database-design slice documented in `docs/decisions/iranautism-database-design-decisions.md` and `docs/product/modules/iranautism-database-table-design.md`; visual playground updated at `docs/analysis/iranautism-database-design-playground.mmd`. |
| 2026-05-24 | Payment transaction design tightened to the minimum secure v1 shape: idempotent gateway attempts with amount/currency snapshots, gateway references, correlation IDs, lifecycle timestamps, and safe provider summaries. |
| 2026-05-24 | Donation identity wording clarified: registered donation, guest donation, and public anonymity are separate concepts; all database-level monetary amounts should be stored as integer IRR and displayed as toman in UI where appropriate. |
| 2026-05-24 | User table decision simplified before the first Prisma slice commit: `USERS.mobile` replaces `USERS.normalized_mobile`, and the first Prisma schema now starts only with the agreed `USERS` table. |
| 2026-05-24 | Backend implementation focus narrowed to mobile auth/register/login, Pump mission donations, and Sadad payment verification; Pump must support both registered and mobile-only mission completion paths. |
| 2026-05-24 | Project message-language rule accepted: all user-facing backend and frontend messages must be Persian by default. |
| 2026-05-25 | Deployment reminder rule added: when preparing upload/deployment to server, real Sadad credentials must be configured in the server environment/secret store and never committed to the repository. |
| 2026-05-25 | Pump frontend slice implemented: `/fa/login`, `/fa/missions/pump`, mission detail OTP/payment flow, Sadad result states, and profile Pump history; verified with tests, build, and browser screenshots. |
| 2026-05-25 | Live Sadad gateway contract hardened: numeric provider order IDs, PDF-aligned Sadad endpoints, backend callback verification before frontend result display, and documented Sadad referrer/domain deployment requirements. |
| 2026-05-26 | Phase 1 Pump user-flow summary documented at `docs/product/modules/pump-phase-1-user-flow-summary.md`, covering mission selection, OTP identity, Sadad payment verification, Pump return/verification, and profile history. |
| 2026-05-27 | Frontend design review feedback captured at `docs/product/modules/frontend-design-review-feedback-2026-05-27.md`; OpenSpec change `refine-public-pump-frontend-design` created and validated for the next correction pass. |

## Working Rules Going Forward

- Preserve original source documents in `docs/source/client/`.
- Keep detailed module notes in `docs/product/`.
- Record confirmed decisions and scope changes in `docs/decisions/change-log.md`.
- When a module is actively designed or implemented, update its status in `docs/product/module-registry.md`.
- Before implementing a backend module, check `docs/decisions/backend-architecture.md` and create/update a dedicated module note under `docs/product/modules/` when work begins.
- Before implementing users beyond the agreed `USERS` table, admins, authentication, authorization, sessions, OTP, audit logs, activity logs, or auth security events, create or update a focused decision document first.
- Before implementing frontend UI, check `docs/decisions/frontend-architecture.md`; create or update project-root `DESIGN.md` before serious UI implementation begins.
- Before implementing the next public/Pump frontend correction pass, check `docs/product/modules/frontend-design-review-feedback-2026-05-27.md` and OpenSpec change `refine-public-pump-frontend-design`; update shared tokens/components before page-specific redesign.
- All user-facing backend/frontend messages must be Persian by default. Use English only for internal code identifiers, logs intended only for developers/operators, protocol field names, or third-party provider constants.
- When asked to upload/deploy the app to a server, explicitly remind that real Sadad credentials belong in the server `.env` file or server secret store and must not be committed into any repo file.
- For live Sadad, ensure the public domain/referrer, backend callback URL, and server IP match the Sadad portal configuration; frontend result pages should display backend payment truth by internal `paymentTransactionId`, not raw Sadad `OrderId`.
- Before changing repo structure, workspace tooling, or admin app placement, check `docs/decisions/repository-architecture.md`.
- Before deciding durable module, data ownership, API, state, CMS, security, operations, or testing rules, check `docs/architecture-rules/deep-dive-agenda.md` and convert the relevant topic into a focused decision document.
- Mark unclear items as `Needs confirmation` until the client or project owner confirms them.
- If a feature is removed or deferred, record the reason and date in the decision log.
