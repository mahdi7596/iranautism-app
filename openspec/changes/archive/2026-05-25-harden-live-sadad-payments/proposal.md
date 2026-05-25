## Why

The current Sadad implementation is shaped correctly for token-based payment and server-side verification, but review of the official Sadad PDF surfaced live-gateway contract gaps that can break production payments: endpoint paths, numeric order IDs, callback routing, referrer behavior, and credential shape. This change hardens the Sadad gateway so Pump donations can safely move from local/fake payment behavior to a live Sadad flow without exposing secrets.

## What Changes

- Align the Sadad gateway adapter with the official Sadad payment request, purchase redirect, callback, and verify contract from the provided PDF.
- Use a Sadad-compatible unique numeric order identifier for provider calls while preserving internal UUID payment transaction IDs.
- Route Sadad's browser return to a server-side callback/verification path before showing the frontend result page.
- Record callback metadata and provider response summaries without storing card PAN, sensitive credentials, or excessive provider payloads.
- Keep donation confirmation and Pump mission completion dependent on successful Sadad server-side verification.
- Add environment configuration for the real merchant number, terminal number, terminal key, username, and password only as server-side secrets/placeholders.
- Preserve Persian user-facing payment errors and status messages while leaving Sadad protocol fields unchanged.
- Account for Sadad referrer requirements so browser navigation to the gateway keeps an acceptable origin/referrer from the registered website domain.
- Keep broader payment reporting, refund automation, recurring donation/Peyman, admin reconciliation screens, and non-Sadad gateways outside this change.

## Capabilities

### New Capabilities

- `live-sadad-payments`: Live Sadad payment contract for initiation, callback verification, provider order IDs, result redirect, idempotency, referrer-safe navigation, and secret-only configuration.

### Modified Capabilities

- None.

## Impact

- Affected backend code:
  - `apps/api/src/infrastructure/payment-gateways/`
  - `apps/api/src/modules/payments/`
  - `apps/api/src/modules/donations/`
  - `apps/api/src/modules/partner-missions/`
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/migrations/`
- Affected frontend code:
  - `apps/web/src/config/app.ts`
  - `apps/web/src/features/pump-missions/`
  - `apps/web/src/features/payments/`
  - `packages/api-client/`
- Affected APIs:
  - payment start endpoint
  - Sadad callback endpoint
  - payment status/result endpoint
- Affected configuration:
  - Sadad merchant number, terminal number, terminal key, username, and password placeholders in server-side environment examples only.
  - Public web/API base URL configuration used to construct callback and result redirects.
- Security and operations impact:
  - Real Sadad credentials must be placed in the server `.env` file or server secret store and never committed.
  - The live server IP/domain and callback URL must match what has been registered with Sadad.
  - If any real terminal key was ever shared outside the server secret store, it should be rotated before production use.
