# Iran Autism Platform Module Registry

This registry tracks what we currently believe the platform should include. It is intentionally mutable: modules and features may be added, removed, split, merged, deferred, or marked complete as the project moves forward.

## Status Labels

| Status | Meaning |
|---|---|
| `Core candidate` | Appears to belong in the main platform scope, pending final confirmation. |
| `Needs confirmation` | Mentioned or inferred, but must be confirmed before being treated as MVP scope. |
| `Future scope` | Explicitly phase-two or out-of-scope for initial delivery. |
| `In progress` | Currently being designed, specified, or implemented. |
| `Done` | Completed and documented/verified. |
| `Removed` | Intentionally removed from scope with rationale in the decision log. |

## Modules

| ID | Module | Status | What it covers | Key open points |
|---|---|---|---|---|
| M01 | Public Website Experience | Core candidate | Homepage, header/footer, navigation, about/contact/services, news, project entry points, client PowerPoint sections. | Exact launch pages, press kit/licensing content model, Persian-only vs multilingual. |
| M02 | Crowdfunding and Donation System | In progress | Multi-project campaigns, donation targets, donor messages, project/phase/item/general support. First database table slice is documented in `docs/product/modules/iranautism-database-table-design.md`. | Donation Wall, full item sponsorship, offline donations, final guest/OTP checkout policy. |
| M03 | Project and Construction Phase System | Core candidate | Project types, project detail pages, construction phases, phase budgets/status/progress/media. | Financial vs operational progress, phase allocation rules, fixed vs configurable phases. |
| M04 | Transparency, Timeline, and Progress Reporting | Core candidate | Dated updates, progress reports, media evidence, phase/project timeline, public visibility. | Spend reporting depth, approval workflow, Jalali/Gregorian dates. |
| M05 | Media, Gallery, Video, and Storytelling | Core candidate | Media library, gallery, short videos/Reels page, timelapses, people and efforts gallery. | Video hosting/storage, upload limits, likes, random gallery behavior. |
| M06 | CMS and Editable Content | Core candidate | Editable pages, menus, header/footer, blog/news, categories/tags, SEO fields, media reuse. | Full page builder vs predefined sections, comments/ratings, multilingual CMS. |
| M07 | Admin Panel | Core candidate | Dashboard, project/admin CRUD, users, donations, transactions, reports, media, settings. | Roles/permissions, audit logs, ticketing/support, moderation workflows. |
| M08 | Payment, Transactions, and Financial Reporting | Core candidate | Domestic gateway, transaction lifecycle, callback verification, filters, exports, monitoring. | Gateway selection, refunds, manual reconciliation, recurring/international payments. |
| M09 | User Accounts, Authentication, and Profiles | In progress | Mobile OTP, profile, donation history, settings, possible follows/updates. Current first database-slice direction is captured in `docs/decisions/iranautism-database-design-decisions.md`. | OTP provider, project follow feature, privacy/data retention, whether guest donation requires OTP. |
| M10 | UI/UX and Design | Core candidate | UX flows, wireframes, high-fidelity UI, design system, responsive layouts. | Brand guide availability, Figma deliverables, admin UX depth. |
| M11 | Technical Architecture and Deployment | Core candidate | Suggested stack, deployment, Docker, database, queue/cache, security, backups. | Hosting environment, CDN/object storage, CI/CD level, monitoring provider. |
| M12 | Future/Phase-Two Services | Future scope | Appointment booking, doctor profiles, Q&A, reviews, play center reservations. | Prioritization and separate estimates after MVP. |
| M13 | International Donations | Needs confirmation | International provider/intermediary path, international transaction records, reporting. | Legal feasibility, provider, currencies, settlement, whether MVP includes it. |
| M14 | Recurring Donations | Needs confirmation | Monthly/automatic donations via provider mandate/token, cancellation, reporting. | Provider support, UX, retry rules, notification requirements. |
| M15 | Support Ticketing | Needs confirmation | User support tickets, departments, replies, attachments, admin assignment/status. | Whether it is MVP or developer-proposed optional scope. |
| M16 | Comments and Ratings | Needs confirmation | Comments and star ratings for articles/products or future services. | Target objects, moderation, spam control, product/store dependency. |
| M17 | Partner Missions and Reward Integrations | In progress | Pump mission landing pages, mobile-based verification API, mission completion logs, repeatable count/status responses, partner support investigations. Table-level first-slice design is documented in `docs/product/modules/iranautism-database-table-design.md`. | Final Pump field names, repeatability per mission, ticket counts, campaign start dates, Pump staging/production IPs. |

## Module Update Protocol

When a module changes:

1. Update its row in this file.
2. Add a dated entry in `docs/decisions/change-log.md`.
3. If the change is substantial, create or update a dedicated module file under `docs/product/modules/`.
4. Reflect only the high-level status in root `AGENTS.md`.
