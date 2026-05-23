# Architecture Rules Progress

Date started: 2026-05-21

This file tracks discussion and decision progress for the architecture-rule agenda. The agenda stays in `docs/architecture-rules/deep-dive-agenda.md`; accepted rules live in focused files under `docs/decisions/`.

## Status Labels

| Status | Meaning |
|---|---|
| `Not started` | Topic is listed in the agenda but discussion has not begun. |
| `In discussion` | Topic is currently being discussed or drafted. |
| `Accepted` | Decision has been accepted and documented. |
| `Deferred` | Topic is intentionally postponed. |
| `Needs revisit` | Topic has a provisional decision but needs another pass later. |

## Progress Tracker

| ID | Topic | Status | Decision file | Notes |
|---|---|---|---|---|
| AR-01 | Backend module boundaries | In discussion | `docs/decisions/backend-module-boundaries.md` | Started with module responsibility boundaries and owned business concepts, not final database tables. |
| AR-02 | Prisma and data ownership rules | Not started | TBD | Should follow backend module boundaries and precede initial database design. |
| AR-03 | Donation, payment, transaction, and project-progress separation | Not started | TBD | May become part of financial-domain boundary decision. |
| AR-04 | Admin API, public API, account API, and webhook boundaries | Not started | TBD | Shared concern with API contracts. |
| AR-05 | Auth, RBAC, permissions, and audit logging | Not started | TBD | Needs deeper role, permission, and audit event discussion. |
| AR-06 | API contracts and frontend/backend type sharing | Not started | TBD | Should define shared validation, DTOs, API client, and error shape. |
| AR-07 | Shared package ownership in the monorepo | Not started | TBD | Should align with frontend and backend boundaries. |
| AR-08 | Frontend route groups and feature boundaries | Not started | TBD | Frontend counterpart to backend module boundaries. |
| AR-09 | Frontend data fetching and state ownership | Not started | TBD | Should align with API contracts and route groups. |
| AR-10 | CMS content model and editor control boundaries | Not started | TBD | Should be discussed before CMS schema or admin editor work. |
| AR-11 | Media, gallery, video, and file-storage rules | Not started | TBD | Should be discussed before media schema and storage paths. |
| AR-12 | Localization, RTL/LTR, and route strategy | Not started | TBD | Should be discussed before frontend scaffolding hardens. |
| AR-13 | Configuration, environment variables, and secrets | Not started | TBD | Needed before real provider integrations. |
| AR-14 | Background jobs, queues, retries, and idempotency | Not started | TBD | Important for OTP, payment verification, exports, and cleanup. |
| AR-15 | Reporting, exports, and analytics boundaries | Not started | TBD | Should follow financial and admin boundary decisions. |
| AR-16 | Error handling, logging, monitoring, and observability | Not started | TBD | Needed before production deployment planning. |
| AR-17 | Testing strategy and quality gates | Not started | TBD | Should define required tests for sensitive flows. |
| AR-18 | Deployment, migrations, backups, and release workflow | Not started | TBD | Needed before deployment implementation. |
| AR-19 | Future extraction triggers | Not started | TBD | Should align with backend, frontend, and repository decisions. |
| AR-20 | Security, privacy, and data-retention posture | Not started | TBD | Needs special attention for donor, admin, payment, and OTP data. |

