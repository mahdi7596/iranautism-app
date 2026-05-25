## 1. Scope And Existing Work Cleanup

- [x] 1.1 Decide whether to keep the current Pump API-key guard work and align it with this change.
- [x] 1.2 Capture the narrowed backend scope in durable project docs without storing real Sadad secrets.
- [x] 1.3 Remove `docs/temporary-development-tracker.md` after useful history is captured.
- [x] 1.4 Update environment examples with Pump, SMS, and Sadad placeholder variables only.
- [x] 1.5 Document Persian-by-default user-facing message rule for backend and frontend.

## 2. Mobile Auth Foundation

- [x] 2.1 Add Auth module boundaries, DTOs, and route tests for OTP request and OTP verification.
- [x] 2.2 Add OTP challenge storage/provider boundary with expiry and rate-limit behavior.
- [x] 2.3 Add SMS provider abstraction and local fake provider for development/tests.
- [x] 2.4 Implement OTP request flow with mobile validation and SMS dispatch.
- [x] 2.5 Implement OTP verification flow that finds or creates users by normalized mobile.
- [x] 2.6 Add user session/token issuing and authenticated current-user endpoint.

## 3. Pump Dual Identity Donation Flow

- [x] 3.1 Update Pump donation intent contracts to distinguish authenticated-user and mobile-only starts.
- [x] 3.2 Update donation intent service so authenticated Pump donations set `user_id` and mobile-only donations keep `user_id` null.
- [x] 3.3 Add mission seed/configuration path for initial Pump missions.
- [x] 3.4 Add tests for registered Pump donation intent persistence.
- [x] 3.5 Add tests for mobile-only Pump donation intent persistence.
- [x] 3.6 Remove or repurpose partner-driven Pump confirmation so mission completion comes from verified payment success.

## 4. Sadad Payment Integration

- [x] 4.1 Add payment gateway interface and local fake gateway implementation.
- [x] 4.2 Add Sadad environment config boundary using placeholders only.
- [x] 4.3 Add Sadad gateway adapter with initiation and verification methods.
- [x] 4.4 Add payment start endpoint that creates gateway redirect data for a pending donation transaction.
- [x] 4.5 Add Sadad callback endpoint that records callback receipt before verification.
- [x] 4.6 Add Sadad server-side verification flow that marks payment success/failure and confirms donation only on verified success.

## 5. Pump Completion After Verified Payment

- [ ] 5.1 Wire successful Sadad verification to record Pump mission completion by normalized mobile.
- [ ] 5.2 Ensure failed or mismatched payments do not confirm donations or update Pump completions.
- [ ] 5.3 Add DB-backed test for registered Pump donation completing after verified Sadad payment.
- [ ] 5.4 Add DB-backed test for mobile-only Pump donation completing after verified Sadad payment.
- [ ] 5.5 Keep Pump verification endpoint returning count/status based on stored completion records.

## 6. Idempotency, Safety, And Final Backend Checks

- [ ] 6.1 Make repeated Sadad callbacks and verification attempts idempotent.
- [ ] 6.2 Prevent duplicate Pump completion increments for the same successful payment transaction.
- [ ] 6.3 Add tests for duplicate callback/provider-reference behavior.
- [ ] 6.4 Verify API tests, database-backed tests, typecheck, Prisma validation, and full workspace build.
- [ ] 6.5 Update durable docs with final backend flow and remaining frontend handoff notes.
