# Architecture Rules Deep-Dive Agenda

Date: 2026-05-21

Status: Planning agenda

## Purpose

This file lists the architecture-rule topics that need deeper discussion before implementation hardens around hidden assumptions.

It is not the final rulebook. Each topic below should be reviewed one by one, then converted into a clear decision, module guideline, or implementation rule in the appropriate project document.

## How To Use This File

For each topic:

1. Discuss the product and technical risks.
2. Answer the open decision questions.
3. Record the accepted rule in `docs/decisions/`, `docs/product/modules/`, or another focused architecture document.
4. Update `docs/decisions/change-log.md` when a durable decision is accepted.
5. Update `AGENTS.md` only with the short operational pointer if the decision changes how future work should be done.

## Topic Index

| ID | Topic | Why it matters | Suggested output |
|---|---|---|---|
| AR-01 | Backend module boundaries | Prevents the modular monolith from becoming tangled as donations, payments, projects, CMS, media, and admin grow. | `docs/decisions/backend-module-boundaries.md` |
| AR-02 | Prisma and data ownership rules | Controls which module can read or write which tables, especially for financial and audit-sensitive data. | Section in backend module boundary decision |
| AR-03 | Donation, payment, transaction, and project-progress separation | Protects financial correctness and avoids mixing donor intent, gateway state, accounting records, and public progress. | `docs/decisions/financial-domain-boundaries.md` |
| AR-04 | Admin API, public API, account API, and webhook boundaries | Keeps admin-in-web from weakening backend security and makes future admin extraction easier. | Section in backend module boundary decision |
| AR-05 | Auth, RBAC, permissions, and audit logging | Defines who can do sensitive actions and what must be logged for accountability. | `docs/decisions/admin-auth-permissions-audit.md` |
| AR-06 | API contracts and frontend/backend type sharing | Prevents ad hoc fetch shapes and duplicated validation between NestJS and Next.js. | `docs/decisions/api-contracts.md` |
| AR-07 | Shared package ownership in the monorepo | Keeps `packages/ui`, `types`, `validation`, `api-client`, `icons`, and `config` focused instead of becoming dumping grounds. | `docs/decisions/shared-package-ownership.md` |
| AR-08 | Frontend route groups and feature boundaries | Keeps public, donation, account, CMS rendering, media, and admin code separated inside one Next.js app. | Section in frontend architecture decision or new frontend boundary file |
| AR-09 | Frontend data fetching and state ownership | Prevents Zustand, React state, URL state, server data, form state, auth state, and payment state from being mixed. | `docs/decisions/frontend-state-data-ownership.md` |
| AR-10 | CMS content model and editor control boundaries | Decides controlled sections vs flexible blocks, editor permissions, preview behavior, SEO fields, and safe content rendering. | `docs/decisions/cms-content-model.md` |
| AR-11 | Media, gallery, video, and file-storage rules | Defines upload ownership, object storage paths, media metadata, reuse, visibility, video hosting, and future processing triggers. | `docs/decisions/media-storage-boundaries.md` |
| AR-12 | Localization, RTL/LTR, and route strategy | Keeps Persian/RTL first-class while preparing for Arabic, English, Turkish, and Russian without rewrites. | `docs/decisions/localization-routing.md` |
| AR-13 | Configuration, environment variables, and secrets | Separates public config, server-only secrets, provider settings, feature flags, and deployment differences. | `docs/decisions/configuration-secrets.md` |
| AR-14 | Background jobs, queues, retries, and idempotency | Makes OTP, payment verification, exports, notifications, and cleanup reliable under failure. | `docs/decisions/background-jobs.md` |
| AR-15 | Reporting, exports, and analytics boundaries | Keeps operational reports useful without prematurely adding a warehouse or mixing reporting writes into core modules. | `docs/decisions/reporting-exports.md` |
| AR-16 | Error handling, logging, monitoring, and observability | Ensures payment/admin failures can be investigated and production issues are visible. | `docs/decisions/observability.md` |
| AR-17 | Testing strategy and quality gates | Defines what must be tested for payments, permissions, CMS, frontend flows, and future modules. | `docs/decisions/testing-quality-gates.md` |
| AR-18 | Deployment, migrations, backups, and release workflow | Protects production data and gives the project a repeatable path from local development to deployment. | `docs/decisions/deployment-operations.md` |
| AR-19 | Future extraction triggers | Defines when to split admin, worker, media, payment, notification, CMS, or crowdfunding capabilities into separate deployables or packages. | Section in repository/backend decisions |
| AR-20 | Security, privacy, and data-retention posture | Covers donor data, admin access, payment records, uploads, logs, OTPs, and retention expectations. | `docs/decisions/security-privacy.md` |

## AR-01: Backend Module Boundaries

### Questions To Answer

- Which modules are allowed to call each other directly?
- Which modules should communicate through application services or domain events?
- Which modules own public controllers, account controllers, admin controllers, and internal services?
- Which modules are reusable for future projects, and which are Iran Autism-specific?
- How do we prevent circular dependencies between donations, payments, projects, users, reports, and admin?

### Decisions Needed

- Module dependency direction.
- Controller ownership.
- Cross-module write rules.
- Shared common utilities vs domain-owned logic.
- Naming conventions for modules, services, repositories, DTOs, and events.

## AR-02: Prisma And Data Ownership Rules

### Questions To Answer

- Can every service inject Prisma directly, or should modules use repositories/data-access services?
- Which module owns each table/model?
- Can one module write another module's tables?
- Are read-only cross-module queries allowed for reports/admin dashboards?
- How should Prisma migrations be organized and reviewed?

### Decisions Needed

- Model ownership map.
- Allowed read/write patterns.
- Transaction boundary rules.
- Migration ownership rules.
- Rules for report queries that span multiple modules.

## AR-03: Donation, Payment, Transaction, And Project-Progress Separation

### Questions To Answer

- What is the difference between donation intent, payment transaction, payment attempt, gateway callback, verified donation, and project progress?
- When does a donation become confirmed?
- Which module updates public collected totals?
- How do manual/offline donations work if they are confirmed later?
- How do refunds, failed payments, duplicate callbacks, and retry flows affect public totals?

### Decisions Needed

- Financial state machine.
- Idempotency rules.
- Public-total calculation rule.
- Admin override and reconciliation rules.
- Audit requirements for financial actions.

## AR-04: Admin API, Public API, Account API, And Webhook Boundaries

### Questions To Answer

- What belongs under `/api/public/*`, `/api/account/*`, `/api/admin/*`, and `/api/webhooks/*`?
- Which guards protect each API family?
- How do admin APIs remain secure while admin UI is inside `apps/web`?
- Which endpoints can be cached publicly?
- Which endpoints must never be exposed to public users?

### Decisions Needed

- API route prefix convention.
- Guard and permission convention.
- Webhook verification convention.
- Admin extraction readiness rules.

## AR-05: Auth, RBAC, Permissions, And Audit Logging

### Questions To Answer

- Are public users and admin users separate identities?
- Are admin permissions role-only, permission-based, or hybrid?
- Which roles exist at launch?
- Which actions require audit logs?
- How do we handle super-admin, finance actions, content publishing, media deletion, and settings changes?

### Decisions Needed

- Admin role model.
- Permission naming convention.
- Audit event catalog.
- Sensitive action list.
- Session and OTP security rules.

## AR-06: API Contracts And Type Sharing

### Questions To Answer

- Should frontend API types come from OpenAPI generation, shared Zod schemas, manually maintained types, or a hybrid?
- Where do request and response DTOs live?
- How do we avoid duplicating validation rules?
- How should the frontend call APIs: raw `fetch`, typed `api-client`, or generated client?
- How do we version or change API contracts safely?

### Decisions Needed

- API contract source of truth.
- `packages/api-client` responsibility.
- `packages/types` responsibility.
- `packages/validation` responsibility.
- Error response format.

## AR-07: Shared Package Ownership

### Questions To Answer

- What belongs in `packages/ui` vs `apps/web/src/features/*`?
- What belongs in `packages/types` vs app-local types?
- What belongs in `packages/config` vs app-local config?
- How do we prevent shared packages from becoming a dumping ground?
- When is a component or utility reusable enough to move into `packages/`?

### Decisions Needed

- Package ownership rules.
- Import boundary rules.
- Promotion rule from app-local to shared package.
- Naming conventions for internal package names.

## AR-08: Frontend Route Groups And Feature Boundaries

### Questions To Answer

- What exact route groups should exist under `apps/web/src/app/[locale]/`?
- Which feature folders own public, donation, account, admin, CMS, and media behavior?
- Can admin components import public feature components?
- Can public pages import admin-only helpers?
- Where should route builders and navigation definitions live?

### Decisions Needed

- Route group map.
- Feature folder map.
- Import rules between feature areas.
- Navigation ownership rules.

## AR-09: Frontend Data Fetching And State Ownership

### Questions To Answer

- Which data is fetched in Server Components?
- When do we use TanStack Query?
- What is allowed in Zustand?
- What belongs in URL search params?
- How are forms owned by React Hook Form and validated with Zod?

### Decisions Needed

- Server data ownership rule.
- Client UI state rule.
- Form state rule.
- URL state rule.
- Payment/auth truth rule.

## AR-10: CMS Content Model And Editor Control Boundaries

### Questions To Answer

- Is the CMS controlled sections, flexible blocks, or a hybrid?
- Which public pages are editable at launch?
- Which content types need SEO fields?
- What can editors publish without developer review?
- How do preview, draft, visibility, and approval work?

### Decisions Needed

- CMS model style.
- Launch content types.
- Editor permission model.
- Preview and publish workflow.
- Safe rich-text/rendering rules.

## AR-11: Media, Gallery, Video, And File-Storage Rules

### Questions To Answer

- How are object storage paths organized?
- Which module owns media metadata?
- How is media reused across pages, projects, phases, galleries, timelines, and videos?
- Are videos uploaded, externally embedded, or both?
- When would transcoding or CDN rules become necessary?

### Decisions Needed

- Storage path convention.
- Media metadata model.
- Visibility and reuse rules.
- Upload size/type rules.
- Future processing triggers.

## AR-12: Localization, RTL/LTR, And Route Strategy

### Questions To Answer

- Is `/fa` the required default route?
- How does `/` redirect?
- Which locales are architecture-ready but not launch scope?
- How do `lang`, `dir`, metadata, dates, numbers, and icons behave by locale?
- How are localized slugs handled?

### Decisions Needed

- Locale routing rule.
- Directionality rule.
- Localized metadata rule.
- Date/number formatting rule.
- Locale expansion rule.

## AR-13: Configuration, Environment Variables, And Secrets

### Questions To Answer

- Which values are public frontend config?
- Which values are server-only secrets?
- How do gateway, SMS, object storage, database, Redis, and feature flags get configured?
- Which settings are admin-editable and stored in the database?
- How do local, staging, and production configs differ?

### Decisions Needed

- Environment variable naming convention.
- Public vs server-only config rule.
- Admin settings model boundary.
- Feature flag ownership.
- Secret handling rule.

## AR-14: Background Jobs, Queues, Retries, And Idempotency

### Questions To Answer

- Which jobs exist at launch?
- Which jobs must be idempotent?
- How do retry policies differ for OTP, payment verification, reports, media, and notifications?
- Which jobs run in API process vs worker process?
- How are failed jobs monitored and retried manually?

### Decisions Needed

- Queue naming convention.
- Job payload convention.
- Retry/idempotency rules.
- Worker deployment rule.
- Failed-job monitoring rule.

## AR-15: Reporting, Exports, And Analytics Boundaries

### Questions To Answer

- Which reports are operational MVP reports?
- Which exports are required for finance/admin?
- Which modules may query across domains for reporting?
- Should exports be generated synchronously or through jobs?
- When would materialized views, replicas, or analytics storage be justified?

### Decisions Needed

- Report catalog.
- Export format rules.
- Report query permissions.
- Async export rule.
- Future analytics trigger.

## AR-16: Error Handling, Logging, Monitoring, And Observability

### Questions To Answer

- What is the standard API error response shape?
- Which errors are user-facing vs internal?
- What must be logged for payments, admin actions, webhooks, OTP, uploads, and jobs?
- What metrics or alerts are needed for launch?
- How do we trace a failed donation from user action to gateway callback?

### Decisions Needed

- Error response format.
- Logging fields and redaction rules.
- Alert list.
- Correlation/request ID rule.
- Payment traceability rule.

## AR-17: Testing Strategy And Quality Gates

### Questions To Answer

- Which backend modules need unit tests, integration tests, and end-to-end tests?
- Which frontend flows need browser tests?
- What is the minimum test coverage for payment verification, permissions, donation flow, CMS publishing, and admin actions?
- What must run before merge/deployment?
- How do we test Persian/RTL behavior?

### Decisions Needed

- Test pyramid for this project.
- Required tests by module type.
- CI quality gates.
- Browser testing rules.
- Seed/test data strategy.

## AR-18: Deployment, Migrations, Backups, And Release Workflow

### Questions To Answer

- What is the local, staging, and production deployment shape?
- How are Prisma migrations applied?
- How are database and object storage backups handled?
- How are rollbacks handled?
- What should a release checklist include?

### Decisions Needed

- Environment topology.
- Migration workflow.
- Backup policy.
- Release checklist.
- Rollback policy.

## AR-19: Future Extraction Triggers

### Questions To Answer

- When should `apps/admin` split from `apps/web`?
- When should workers become separate containers?
- When should payment, media, notification, CMS, or crowdfunding become separate services or packages?
- Which signals are real enough to justify extraction?
- What boundaries must exist now to make extraction possible later?

### Decisions Needed

- Extraction trigger checklist.
- Future deployable candidates.
- Shared package promotion rules.
- No-premature-extraction guardrail.

## AR-20: Security, Privacy, And Data-Retention Posture

### Questions To Answer

- What donor/user/admin data do we store?
- What data is sensitive?
- How long do OTPs, logs, gateway callback data, audit logs, and exports live?
- Who can view donor identities and financial records?
- What upload and rich-text safety rules are required?

### Decisions Needed

- Sensitive data classification.
- Retention rules.
- Admin access rules.
- Upload safety rules.
- Rich-text/content safety rules.

## Suggested Discussion Order

Start with the topics that shape everything else:

1. AR-01 Backend module boundaries
2. AR-02 Prisma and data ownership rules
3. AR-03 Donation, payment, transaction, and project-progress separation
4. AR-05 Auth, RBAC, permissions, and audit logging
5. AR-06 API contracts and frontend/backend type sharing
6. AR-07 Shared package ownership
7. AR-09 Frontend data fetching and state ownership
8. AR-10 CMS content model and editor control boundaries
9. AR-14 Background jobs, queues, retries, and idempotency
10. AR-17 Testing strategy and quality gates

The remaining topics can be handled as the relevant module design begins.

