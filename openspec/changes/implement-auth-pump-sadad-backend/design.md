## Context

The backend currently has a NestJS modular monolith shell, Prisma/PostgreSQL integration, a `users` table, donation/payment/partner mission tables, and an initial Pump mission backend skeleton. The current Pump skeleton can create donation/payment records and update mission completions, but payment confirmation is still a placeholder and Sadad is not wired. Step 14 also introduced a Pump API-key guard for partner-facing endpoints, but that work is still uncommitted at the time this change is created.

The immediate product priority is narrower than the earlier full backend roadmap:

```txt
Mobile auth + Pump mission donations + Sadad payments
```

Pump users may arrive through two valid identity paths:

```txt
Path A: Registered/authenticated
Pump -> Iran Autism -> mobile OTP -> user_id + mobile_snapshot -> donation -> Sadad -> Pump count

Path B: Mobile-only
Pump -> Iran Autism -> mobile captured/normalized -> no user_id -> donation -> Sadad -> Pump count
```

Both paths must keep mobile as the verification anchor. The registered path improves donation history and future user dashboard support, while the mobile-only path reduces friction and still supports Pump verification by mobile number.

Sadad credentials must be configured through environment variables only. The terminal key shared in conversation must be treated as exposed if it is real and should be rotated before production.

## Goals / Non-Goals

**Goals:**

- Add mobile OTP authentication for registration/login.
- Allow Pump mission donations to qualify through either registered users or mobile-only donors.
- Integrate Sadad payment initiation/callback/verification through a provider abstraction.
- Confirm donations and update Pump mission completions only after Sadad verification succeeds.
- Keep Pump verification API protected and based on normalized mobile plus mission.
- Move useful temporary tracker knowledge into durable docs, then delete the temporary tracker.
- Keep each implementation step small enough to review and commit separately.

**Non-Goals:**

- Build admin panel, CMS, media, project/phase, broad reporting, or recurring donation features.
- Store real Sadad or Pump secrets in the repository.
- Build frontend screens in this backend change.
- Implement IP allowlisting until Pump provides production/staging server IPs.
- Treat every Pump user as required to register before mission completion.

## Decisions

### Decision: Mobile remains the mission identity anchor

Use normalized Iranian mobile numbers as the stable Pump verification key for both registered and mobile-only paths.

Alternatives considered:

- Require user registration for every Pump mission: simpler account modeling, but higher friction and not necessary for Pump count verification.
- Use only Pump-provided user IDs: not reliable enough yet because current documented Pump flow emphasizes mobile verification.

Rationale:

- Existing database design already stores `donations.mobile_snapshot` and `partner_mission_completions.mobile_snapshot`.
- Pump verification can count completions by mobile even when `user_id` is null.
- A future login can still attach history by mobile if the project chooses to build that reconciliation behavior.

### Decision: Donation completion is payment-verified, not partner-confirmed

Sadad callback and server-side verification must be the source of truth for payment success. Pump partner endpoints may verify completion state but must not mark a donation completed by themselves.

Alternatives considered:

- Keep `/confirm` as a partner-driven completion endpoint: useful for early skeleton testing but unsafe for real money flows.
- Mark donation confirmed after browser callback only: easier, but unsafe because callbacks can be repeated or forged without server-side verification.

Rationale:

- The payment architecture already states that donation confirmation happens only after server-side gateway verification.
- Pump completions must be a consequence of verified donation state.

### Decision: Sadad integration lives behind a gateway interface

Create a payment gateway abstraction with a Sadad implementation and a local fake/stub implementation for tests.

Alternatives considered:

- Call Sadad directly from `PaymentsService`: faster initially but couples business logic to one provider and makes tests brittle.
- Delay gateway abstraction until another provider appears: risky because provider callbacks and verification rules are the most sensitive part of the flow.

Rationale:

- Payment provider behavior is external, security-sensitive, and likely to change.
- The architecture already requires payments to stay isolated.

### Decision: OTP storage starts behind a service boundary

Implement OTP request/verify through an `AuthModule` and an OTP store/provider boundary. Use the simplest reliable storage supported by the current stack, while keeping the contract ready for Redis-backed rate limiting and expiry.

Alternatives considered:

- Hardcode OTP state in memory: easy for tests but unsafe for multi-process deployment.
- Add a full auth/session database schema immediately: more durable, but may be too broad before the exact session strategy is settled.

Rationale:

- The platform already expects Redis for OTP, retries, and background jobs.
- A service boundary lets implementation start small without locking the app into in-memory behavior.

### Decision: Secrets are env-only and documentation uses placeholders

Sadad values must be represented in docs/code as placeholders:

- `SADAD_MERCHANT_ID`
- `SADAD_TERMINAL_ID`
- `SADAD_TERMINAL_KEY`
- `SADAD_USERNAME`

Rationale:

- The terminal key was pasted into chat. If real, it should be considered exposed.
- Repository history must not contain real payment secrets.

### Decision: User-facing messages are Persian by default

All backend messages intended for users or frontend display must be Persian by default. Frontend UI copy must also be Persian by default.

This includes validation errors, auth/OTP messages, payment messages, donation/Pump mission messages, form messages, toasts, loading states, empty states, and confirmation states.

Alternatives considered:

- Keep backend messages in English and translate only on the frontend: keeps backend generic, but creates drift and makes API-driven error display inconsistent.
- Use English until a later localization layer exists: faster initially, but violates the Persian-first product direction and creates cleanup work.

Rationale:

- The platform is currently Persian-first.
- Backend and frontend behavior should be consistent from the first user-facing flows.
- Machine-readable codes can stay stable while human-readable messages are Persian.

## Risks / Trade-offs

- Real Sadad API details may differ from assumptions -> implement the gateway behind a narrow adapter and keep provider field mapping isolated.
- Mobile-only flow can create donations without a user account -> keep `mobile_snapshot` required for Pump mission donations and make account linking a later explicit feature.
- Duplicate Sadad callbacks can double-count Pump completions -> make payment verification and mission completion idempotent before production use.
- OTP abuse can create SMS cost/security risk -> add rate limiting and provider abstraction before live SMS.
- Pump field names may still change -> keep Pump response builders as adapter-level code and domain logic independent from exact response shape.
- Existing Step 14 `confirm` endpoint may conflict with the real payment-verified model -> preserve API-key protection if useful, but remove or repurpose partner-driven confirmation before production.
- English messages can leak into user flows from validation libraries or thrown exceptions -> centralize user-facing message text and review API responses/tests for Persian messages.

## Migration Plan

1. Commit or intentionally revise the current Pump API-key guard work.
2. Capture the narrowed scope in durable docs and delete `docs/temporary-development-tracker.md`.
3. Add auth/OTP backend schema or Redis-backed storage boundary if needed.
4. Implement mobile OTP request/verify and current-user access.
5. Update Pump donation-intent flow to support both registered and mobile-only paths.
6. Add Sadad gateway abstraction and local fake gateway.
7. Add Sadad initiation/callback/verification endpoints.
8. Make verified Sadad success confirm the donation and record Pump completion idempotently.
9. Add DB-backed tests for registered and mobile-only Pump mission completion.

Rollback strategy:

- The new flow should be added behind explicit endpoints/configuration.
- If Sadad live integration is not ready, keep fake/local gateway active for development and do not expose live payment routes.
- If mobile-only Pump flow causes policy concern, disable mobile-only creation at the controller/service boundary while preserving the database fields.

## Open Questions

- Does Sadad require a specific callback URL format, token field name, or hash/signature algorithm for this terminal?
- Should Pump mission donations have a fixed minimum amount per mission, and is the known 200,000 toman threshold only for the general mission?
- Will Pump send the mobile number to Iran Autism, or will the user always enter mobile on the Iran Autism landing page?
- Should OTP be mandatory for all Pump donations above a threshold, even if mobile-only mission completion is allowed?
- Should a later login automatically attach previous mobile-only donations by matching mobile snapshots?
