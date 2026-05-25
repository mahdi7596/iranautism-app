## Context

The platform already has a NestJS payment module, a Sadad gateway adapter, payment transaction storage, Pump mission completion after verified payment, and a Persian frontend payment result screen. The adapter was implemented before the official Sadad PDF was reviewed in detail.

The provided Sadad document describes a token-based purchase flow:

```txt
PaymentRequest -> Token -> browser Purchase redirect -> HTTP POST ReturnUrl -> Verify -> deliver service
```

The PDF also introduces constraints that matter for live use:

- `PaymentRequest` uses `MerchantId`, `TerminalId`, `Amount`, numeric `OrderId`, `LocalDateTime`, `ReturnUrl`, and `SignData`.
- `SignData` for request is `TerminalId;OrderId;Amount`, encrypted with TripleDES ECB PKCS7 using the Base64 terminal key.
- The purchase page is reached by browser navigation to Sadad with the token.
- The gateway returns the result to `ReturnUrl` by HTTP POST.
- The merchant MUST call `Verify` and only deliver the service after verify succeeds.
- If `Verify` is not called in the allowed window, the payment can be automatically reversed.
- Sadad validates the browser referrer against the merchant's registered domain/IP configuration.

The current implementation follows the broad architecture, but it needs hardening for live correctness.

## Goals / Non-Goals

**Goals:**

- Match the official Sadad endpoint paths, request fields, redirect behavior, callback fields, and verify behavior.
- Keep internal UUID payment transaction IDs while sending Sadad a unique numeric order ID.
- Ensure Sadad returns to a backend-controlled callback path that records the callback and runs server-side verification before redirecting the user to the web result page.
- Keep the frontend result page dependent on backend payment truth, not on raw Sadad query/body fields.
- Preserve idempotent callback handling so duplicate Sadad callbacks do not double-confirm donations or double-count Pump missions.
- Store only safe provider response summaries and required gateway references.
- Add server-side environment placeholders for Sadad username/password only if needed, while keeping all real values out of source control.
- Keep user-facing messages Persian by default.

**Non-Goals:**

- Implement Sadad reverse/refund automation.
- Build admin reconciliation or finance reporting screens.
- Implement recurring Peyman donations.
- Add another payment gateway.
- Store real Sadad credentials in the repository.
- Implement IP allowlisting in app code; registered IP/domain alignment remains a deployment/Sadad portal operation.

## Decisions

### Decision: Keep Sadad behind the existing payment gateway adapter

The Sadad-specific HTTP contract stays in `apps/api/src/infrastructure/payment-gateways/`, while `PaymentsService` remains responsible for transaction lifecycle, donation confirmation, and Pump completion.

Alternatives considered:

- Move Sadad calls into `PaymentsService`: faster to patch, but it tangles external protocol details with donation business rules.
- Build a larger provider plugin architecture now: more flexible, but unnecessary for one live gateway.

Rationale:

- The existing gateway abstraction is already in place and tested.
- Sadad protocol details are volatile and should remain isolated.

### Decision: Add a provider-facing numeric Sadad order ID

Sadad `OrderId` will be a unique numeric value stored on the payment transaction or a closely related provider metadata field. The internal payment transaction UUID remains the application identity and API-facing identifier.

Alternatives considered:

- Continue sending UUID as `OrderId`: simplest, but the PDF documents `OrderId` as `Number(Long)`, and live Sadad may reject non-numeric values.
- Make the database primary key numeric: too broad and unnecessary.

Rationale:

- This preserves internal UUID safety while complying with Sadad's provider contract.
- The callback can locate transactions by provider order ID and/or token.

### Decision: Sadad ReturnUrl points to a backend callback verifier

Payment start will send Sadad a backend callback URL, not the frontend result page directly. The backend callback accepts Sadad POST fields, records callback receipt, performs verification, then redirects the browser to the frontend result URL with the internal payment transaction ID.

Alternatives considered:

- Return directly to the frontend and have the browser call verification: easier UI handoff, but browser-driven verification is fragile and does not match the PDF's server-confirm-first model.
- Add a Next.js route handler as the callback and proxy to the API: possible, but the API already owns payment truth and should be the primary callback surface.

Rationale:

- Donation confirmation and Pump completion must happen on the backend after `Verify`.
- The frontend result page should only display backend state.

### Decision: Preserve referrer through browser navigation

The redirect to Sadad should use a normal browser navigation from the registered web domain and should not set a restrictive `Referrer-Policy` such as `no-referrer` for the payment handoff. If a form-based redirect is needed to preserve referrer behavior, the frontend will use a minimal handoff page or regular navigation from the web app.

Alternatives considered:

- Ignore referrer validation: risky because the Sadad PDF explicitly documents referrer/domain checks.
- Rely on server-side redirects only: may produce the API domain as the referrer, which can fail if Sadad expects the public website domain.

Rationale:

- Sadad validates the requesting domain/IP configuration.
- The public web domain is the most natural registered origin for user payment navigation.

### Decision: Treat username/password as env-only optional contract fields

The core PDF payment request/verify flow uses merchant number, terminal number, and terminal key. Username/password will be represented as server-side environment placeholders because the project owner has those values, but implementation will only send them to Sadad if the actual live endpoint requires them.

Alternatives considered:

- Require password for all gateway configuration: may block payment even if the VPG API does not need it.
- Omit password entirely: misses the credential set the project owner received and could force another config change later.

Rationale:

- Env placeholders are safe and future-proof.
- Real values remain outside source control.

### Decision: Store safe summaries, not raw sensitive provider payloads

Callback and verify summaries may include `ResCode`, `OrderId`, token presence, `RetrivalRefNo`, `SystemTraceNo`, amount, and timestamps. They MUST NOT store card PAN, full masked-card details beyond what is required for support, terminal key, username, password, or raw unbounded provider payloads.

Alternatives considered:

- Store the whole provider payload for debugging: convenient, but too risky for payment data.
- Store no provider summaries: safer, but makes support and reconciliation harder.

Rationale:

- The platform needs enough information for support and reconciliation without expanding the sensitive data surface.

## Risks / Trade-offs

- Sadad's deployed endpoint may differ from the PDF version -> Keep endpoint paths centralized and covered by adapter tests.
- Numeric order ID migration adds a database change -> Use a backward-compatible nullable field first, backfill only if needed, and keep UUID IDs unchanged.
- Callback may arrive without token or order ID in unexpected casing -> Accept documented fields and common casing variants, fail safely with Persian messages when required fields are missing.
- Referrer behavior can vary by browser and deployment headers -> Verify live/staging payment handoff in a browser and document required web/API domains for Sadad registration.
- Verify must happen quickly or Sadad may reverse the payment -> Run verification during callback handling and return a clear pending/failure result if Sadad is temporarily unavailable.
- Duplicate callbacks can race -> Keep database uniqueness/idempotency around provider token/reference/order ID and do completion updates transactionally where practical.
- Real credentials are easy to leak during deployment -> Keep `.env.example` placeholders empty and remind that production values belong in server `.env` or secret store only.

## Migration Plan

1. Add the Sadad provider order ID field and migration without changing existing internal UUID identifiers.
2. Update environment examples with empty Sadad placeholders, including password if required by the final config model.
3. Update the Sadad gateway adapter endpoint paths, request payload, signing, response parsing, and verify parsing.
4. Update payment start so the backend constructs or validates the Sadad callback URL and stores result redirect context.
5. Update Sadad callback handling to accept POST, record safe metadata, verify server-to-server, then redirect to the frontend result page.
6. Update the frontend Pump payment flow so it redirects using backend-provided Sadad handoff data and displays backend status only.
7. Add adapter unit tests, payment controller tests, DB-backed idempotency tests, and frontend/API-client tests for the callback/result handoff.
8. Run the existing API and web verification commands.
9. Before deployment, configure real Sadad credentials only on the server and confirm the registered domain/IP/referrer settings in Sadad.

Rollback strategy:

- Keep the fake gateway usable when Sadad config is missing in local development.
- If live Sadad verification fails in staging, disable live Sadad env values to fall back to non-live behavior while preserving the code path for further testing.
- The numeric provider order ID field can remain unused if a later Sadad confirmation proves UUID order IDs are accepted, but the safer numeric field should stay available for reconciliation.

## Open Questions

- Does Iran Autism's Sadad terminal require the documented standard `Verify` endpoint or the payment-yari `AdviceEx/Verify` endpoint with `RefererUrl`?
- Which public domain and server IP have been registered with Sadad for referrer/IP validation?
- Does Sadad expect the password for payment APIs, or is it only for `portal.sadadpsp.ir` administration/reporting?
- Should the backend callback redirect to the Persian result page only, or should it preserve locale from the original payment start request?
