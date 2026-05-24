# Iran Autism Database Design Decisions

Date: 2026-05-24

Status: Current working decision for the first Iran Autism database design slice

Related files:

- `docs/analysis/iranautism-database-design-playground.mmd`
- `docs/product/modules/iranautism-database-table-design.md`
- `docs/product/modules/partner-missions-pump.md`
- `docs/analysis/client-request-full-understanding.md`

## Context

This is the first step in designing the Iran Autism platform database. The first development slice is expected to start with mobile identity, the first donation flow, and the Pump partner mission, so those areas are documented first. The visual database file remains a playground for the whole database design, not a Pump-only diagram.

The source analysis says anonymous donation is part of the product specs, while one proposal line suggests donation may require an account. Because of that conflict, the schema should support both paths:

- donors who register or log in with mobile OTP before donation;
- donors who donate as guests without a full account, if the frontend or client later requires it.

## Decisions

### Users

- `USERS.normalized_mobile` is the canonical unique mobile value.
- Mobile input must be normalized before storage.
- `USERS.last_login_at` and `USERS.last_login_ip_address` are kept on the user row for simple admin/support visibility.
- The earlier `USER_AUTH_EVENTS` table was removed from the visual playground for now. Detailed auth/session logging can be revisited when the auth module is designed more deeply.

### Donations

- `DONATIONS.user_id` must be nullable in the real database.
- A registered donation uses `user_id`.
- A guest donation leaves `user_id` empty and relies on checkout-time snapshot fields.
- `donor_kind` records whether the donation came from a registered user or a guest.
- `donor_display_name` stores the donor-facing display name at the time of donation. This is needed for guest donors and for historical accuracy when registered users later edit their profile.
- `normalized_mobile_snapshot` stores the mobile number used at donation time. This supports receipts, support lookup, future account matching, and Pump verification without requiring that every donor already have a user account.
- `public_visibility` controls how the donation may appear publicly, such as anonymous, display name, initials, or hidden.
- `target_type`, `target_id`, and `target_label_snapshot` identify what the donation is for. The label snapshot protects old records if a project, phase, item, or campaign is renamed later.
- `status` tracks the donation lifecycle, such as pending, confirmed, failed, cancelled, expired, or refunded.

### Donation Identity, Guest Donations, And Public Anonymity

The platform must distinguish between three separate concepts:

1. Registered donation: a donation made by a user who has logged in or registered with mobile OTP. The donation is linked to `USERS` through `DONATIONS.user_id`.
2. Guest donation: a donation made without creating or logging into a full user account. In this case, `DONATIONS.user_id` is null, but checkout-time donor snapshots may still be stored for receipt, support, payment reconciliation, fraud prevention, legal/financial records, and future account matching.
3. Public anonymity: a donor's choice about how the donation appears publicly on the website, donation wall, reports, or campaign pages. Public anonymity does not mean the donation is untracked internally.

Rules:

- `public_visibility` controls public display only.
- A registered donor may choose to appear anonymous publicly.
- A guest donor may still have internal checkout/payment snapshots stored.
- Internal donation, payment, and support records may retain donor snapshots even when the public display is anonymous.
- The UI and admin wording must not imply that anonymous public display removes internal financial, payment, or support records.
- Sensitive donor data must not be exposed publicly or shared with partners unless explicitly required and approved.

### Money And Currency

- At the database level, store all monetary amounts as integer IRR.
- At the view/UI level, display amounts in toman when that is the expected user-facing format.
- Never store toman as the canonical database amount.
- When source material or UI copy mentions toman, convert to IRR before storing or comparing amounts in backend logic.
- Example: 200,000 toman is stored and evaluated as 2,000,000 IRR.
- Donation, payment transaction, recurring mandate, bank limit, campaign threshold, and report amounts should all follow the same IRR-at-rest rule unless a future provider explicitly requires a separate documented representation.

### Account Creation During Donation

The preferred first frontend flow can ask for mobile OTP and create or log in a `USERS` record before payment. This is a good default because it gives the donor donation history and gives Pump a stronger identity signal.

The database should still support guest donation because the product documents include anonymous donation and because the client may want a lower-friction donation path later.

### Payments

- `PAYMENT_TRANSACTIONS` remains related to `DONATIONS` for the initial implementation.
- A donation is the donor intent and contribution record.
- A payment transaction is the gateway-facing payment attempt/lifecycle record.
- One donation may have multiple payment transactions because payment can fail, retry, be verified late, or require reconciliation.
- The v1 payment transaction design should use the minimum secure field set needed for real payment safety: amount and currency snapshots, gateway identifiers, idempotency key, correlation ID, lifecycle timestamps, failure code, and a safe provider response summary.
- Gateway callbacks and server-side verification must be idempotent. Repeated callbacks or verification attempts for the same gateway reference must not confirm a donation twice, create duplicate Pump completions, send duplicate receipts, or create duplicate financial records.
- Payment success must come from server-side gateway verification, not from the browser redirect alone.
- Store safe provider status summaries and references needed for support/reconciliation. Do not store provider secrets or unsafe raw payloads in the transaction row.
- Future non-donation payments may require a more generic payment target model, but that is intentionally deferred until those modules become real scope.

### Partner Missions, With Pump As The First Case

- Pump is outside Iran Autism, but the qualifying action happens inside Iran Autism.
- Pump itself is not a donation.
- A Pump mission can be completed by a verified donation or another support action.
- `PARTNER_MISSIONS` stores mission configuration, such as partner, mission key, result type, and campaign start date.
- `PARTNER_MISSION_COMPLETIONS` stores whether a normalized mobile/user completed a mission and, for donation-based missions, which donation qualified it.
- `PARTNER_MISSION_COMPLETIONS.user_id` must be nullable in the real database.
- Pump completion counting should use `mission_id + normalized_mobile_snapshot`, not only `mission_id + user_id`, so accountless or newly created users can still be counted by mobile.
- The first Pump donation flow may create/login the user before payment, but the schema remains capable of mobile-snapshot-based verification.

## Current Opinion

For the first build, start with OTP-based mobile entry before donation and create/login a `USERS` row. This gives the platform better donation history, support visibility, and Pump verification quality.

Do not design the database so that an account is strictly required for every donation. Keeping `DONATIONS.user_id` nullable protects the anonymous/guest donation requirement already found in the product documents.

Do not merge Pump into donations. Keep core financial records clean, and let partner mission tables reference qualifying donations when the mission rule is donation-based.

## Items To Revisit

- Final public visibility values for Donation Wall behavior.
- Whether guest donations require OTP or can be paid with only minimal checkout information.
- Whether non-donation Pump missions will exist.
- Exact Pump API field names and repeatability rules per mission.
- Whether future non-donation payments require `PAYMENT_TRANSACTIONS` to support other payable entities.
- Exact gateway-specific naming for authority/reference fields after the first payment provider is selected.
