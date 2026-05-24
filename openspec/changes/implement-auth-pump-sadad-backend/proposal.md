## Why

The immediate backend priority is no longer the broad platform roadmap; it is the smallest production-shaped backend path for Pump missions, mobile authentication, and Sadad payment verification. Pump users may either register/login with OTP or complete a mission with only a mobile number, so the backend must support both paths while still confirming mission completion only after verified payment.

## What Changes

- Narrow the active backend implementation focus to user register/login, Pump mission completion, and Sadad payment integration.
- Add mobile OTP authentication for users who choose or need a registered account.
- Preserve a mobile-only Pump mission path where a donation can qualify by `mobile_snapshot` without requiring `user_id`.
- Replace the current placeholder Pump confirmation path with a payment-verified flow driven by Sadad transaction verification.
- Add Sadad gateway configuration through environment variables only; real credentials must not be committed.
- Keep Pump partner verification protected with API-key authentication.
- Update durable documentation and remove the temporary development tracker once useful history has been captured.
- Exclude admin, CMS, media, broad reporting, project/phase schema, recurring donations, and frontend implementation from this backend change.

## Capabilities

### New Capabilities

- `mobile-auth`: Mobile OTP registration/login, user lookup/creation by mobile, and authenticated current-user access.
- `pump-mission-donations`: Pump donation mission initiation and verification for both registered users and mobile-only users.
- `sadad-payments`: Sadad payment initiation, callback handling, server-side verification, and payment status mapping.
- `backend-scope-docs`: Durable documentation cleanup for the narrowed backend scope and removal of the temporary tracker.

### Modified Capabilities

- None.

## Impact

- Affected backend code:
  - `apps/api/src/modules/auth/`
  - `apps/api/src/modules/users/`
  - `apps/api/src/modules/donations/`
  - `apps/api/src/modules/payments/`
  - `apps/api/src/modules/partner-missions/`
  - `apps/api/src/infrastructure/sms/`
  - `apps/api/src/infrastructure/payment-gateways/`
  - `apps/api/prisma/schema.prisma`
- Affected API surfaces:
  - public OTP request/verify endpoints
  - current-user endpoint
  - Pump donation-intent endpoint
  - Pump verification endpoint
  - Sadad payment start/callback/verification endpoints
- Affected configuration:
  - SMS provider environment variables
  - Pump partner API key environment variable
  - Sadad merchant/terminal/username/key environment variables
- Affected documentation:
  - Pump module notes
  - database table design notes
  - backend architecture/change log where needed
  - root project memory if the narrowed scope needs a short pointer
- Security impact:
  - Sadad secrets and Pump API keys must stay in environment variables only.
  - The Sadad terminal key shared in conversation must be treated as exposed and should be rotated before production use if it is real.
