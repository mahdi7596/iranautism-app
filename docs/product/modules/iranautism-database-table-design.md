# Iran Autism Database Table Design

Date: 2026-05-24

Status: Working table design for the first Iran Autism database slice

This document records the current table intent for the Iran Autism platform database as it is being designed. The first implementation slice focuses on registration, donation, payment transaction, and the first Pump mission, but the file is not limited to Pump. The visual playground remains `docs/analysis/iranautism-database-design-playground.mmd`.

## USERS

Purpose: stable public identity for donors and mobile-based users.

| Column | Meaning |
|---|---|
| `id` | Primary key for the user. |
| `mobile` | Canonical unique mobile number after normalization. |
| `first_name` | Optional profile first name. |
| `last_name` | Optional profile last name. |
| `status` | Account state, such as active or blocked. |
| `last_login_at` | Last successful login time for admin/support visibility. |
| `last_login_ip_address` | Last successful login IP for support/security visibility. |
| `created_at` | Creation timestamp. |
| `updated_at` | Last update timestamp. |

Rules:

- Mobile is the identity anchor.
- Normalize before storing.
- The first Pump donation flow may create or log in a user with OTP before payment, but this is not mandatory for every Pump user.
- A Pump mission can also be completed through a mobile-only path when a normalized mobile number is captured and stored on the donation.
- The table must not be treated as required for every donation, because guest donation remains supported at the schema level.

Enum candidates:

| Column | Proposed values |
|---|---|
| `status` | `active`, `blocked`, `disabled` |

## DONATIONS

Purpose: donor intent and confirmed contribution record.

| Column | Meaning |
|---|---|
| `id` | Primary key for the donation. |
| `user_id` | Optional FK to `USERS`; null for guest donations. |
| `donor_kind` | Whether the donation came from a registered user or guest donor. |
| `donor_display_name` | Donor-facing name captured at donation time. |
| `mobile_snapshot` | Mobile number captured at donation time, even for guests. |
| `public_visibility` | How the donation may appear publicly. |
| `target_type` | What kind of target the donation supports: general, project, phase, item, campaign, or similar. |
| `target_id` | Optional target record ID when the target is a project, phase, item, or campaign. |
| `target_label_snapshot` | Human-readable target name captured at donation time. |
| `status` | Donation lifecycle state. |
| `amount` | Donation amount stored as integer IRR. |
| `currency` | Currency code; v1 canonical value is `IRR`. |
| `confirmed_at` | Timestamp when the donation became confirmed after verified payment success. |
| `created_at` | Creation timestamp. |

Rules:

- `user_id` is nullable.
- Registered donation: `user_id` is set and `donor_kind` is registered.
- Guest donation: `user_id` is null and `donor_kind` is guest.
- Pump mobile-only donation: `user_id` is null, `donor_kind` is guest, and `mobile_snapshot` stores the normalized mobile used for Pump verification.
- Pump registered donation: `user_id` is set, `donor_kind` is registered, and `mobile_snapshot` still stores the normalized mobile used for Pump verification.
- A logged-in donor can still choose public anonymity through `public_visibility`.
- Donation status changes to confirmed only after verified payment success.
- `public_visibility` controls public display only. It does not remove internal donation, payment, support, legal/financial, fraud-prevention, or account-matching records.
- Guest donation means no linked user account; it does not mean the platform stores no checkout/payment snapshots.
- Store monetary amounts as integer IRR in the database. Display toman in the UI when appropriate.
- Convert source/UI toman amounts to IRR before backend storage, comparison, reporting, or payment processing.

Enum candidates:

| Column | Proposed values |
|---|---|
| `donor_kind` | `registered`, `guest` |
| `public_visibility` | `anonymous`, `display_name`, `initials`, `hidden` |
| `target_type` | `general`, `project`, `phase`, `item`, `campaign` |
| `status` | `pending`, `confirmed`, `failed`, `cancelled`, `expired`, `refunded` |

Example rows:

| Scenario | `user_id` | `donor_kind` | `public_visibility` | `target_type` |
|---|---|---|---|---|
| Logged-in donor appears publicly | `user_123` | registered | display_name | project |
| Logged-in donor appears anonymous | `user_123` | registered | anonymous | general |
| Guest donor pays without account | null | guest | anonymous | campaign |
| Pump donation after OTP-created account | `user_456` | registered | anonymous | campaign |
| Pump mobile-only donation with captured mobile | null | guest | anonymous | campaign |

## PAYMENT_TRANSACTIONS

Purpose: idempotent, reconcilable payment gateway lifecycle for one donation payment attempt.

| Column | Meaning |
|---|---|
| `id` | Primary key for the transaction. |
| `donation_id` | FK to the donation being paid. |
| `gateway` | Payment provider name. |
| `status` | Gateway/payment lifecycle state. |
| `amount` | Amount snapshot for this payment attempt, stored as integer IRR. |
| `currency` | Currency snapshot for this payment attempt; v1 canonical value is `IRR`. |
| `provider_authority` | Gateway authority/start-payment token when the provider uses one. |
| `provider_reference` | Gateway reference, verification reference, or receipt reference when available. |
| `idempotency_key` | Internal key used to avoid processing the same payment action twice. |
| `correlation_id` | Cross-flow trace ID connecting donation creation, payment initiation, callback, verification, mission completion, logs, and jobs. |
| `callback_received_at` | Timestamp when the gateway/browser callback was received. |
| `verified_at` | Timestamp when server-side gateway verification succeeded. |
| `failed_at` | Timestamp when the transaction reached a failed final state. |
| `failure_code` | Safe provider/internal failure code for support and reconciliation. |
| `provider_response_summary` | Safe provider status/response summary; no secrets or unsafe raw payloads. |
| `created_at` | Creation timestamp. |
| `updated_at` | Last update timestamp. |

Rules:

- For the initial implementation, payment transactions relate only to donations.
- A donation can have multiple transactions because payment may fail, be retried, or require later verification.
- Each payment transaction represents one gateway payment attempt.
- Donation status changes to confirmed only after server-side payment verification succeeds.
- Current payment provider focus is Sadad Bank gateway. Sadad merchant, terminal, username, and terminal key values must be configured through environment variables and must not be stored in repository docs or source files.
- Gateway callbacks and verification calls must be idempotent.
- Repeated callbacks for the same provider reference must not confirm the donation twice.
- Repeated callbacks must not create duplicate Pump completions, duplicate receipts, or duplicate financial records.
- `idempotency_key` or provider reference fields must be unique enough to detect repeated processing.
- Store safe provider summaries and references needed for support/reconciliation; do not store provider secrets or unsafe raw payloads.
- If future non-donation payments become real scope, revisit whether transactions need a generic payable target.

Indexes and uniqueness:

- Index `donation_id`.
- Index `status`.
- Index `gateway`.
- Index `correlation_id`.
- Unique `idempotency_key` when present.
- Unique `gateway + provider_authority` when `provider_authority` is present.
- Unique `gateway + provider_reference` when `provider_reference` is present.

Enum candidates:

| Column | Proposed values |
|---|---|
| `status` | `pending`, `redirected`, `verification_pending`, `successful`, `failed`, `cancelled`, `mismatch`, `expired`, `refunded` |

## PARTNER_MISSIONS

Purpose: mission configuration for Pump and future partner reward integrations.

| Column | Meaning |
|---|---|
| `id` | Primary key for the mission. |
| `partner` | Partner key, such as pump. |
| `mission_key` | Partner-facing unique mission key. |
| `result_type` | Whether Pump expects a count-based or status-based response. |
| `campaign_starts_at` | Only actions after this time qualify. |

Rules:

- Use this table even if Pump is the first partner, because Pump can have multiple missions and future partners may reuse the same model.
- Do not hardcode mission rules only in application code.

Enum candidates:

| Column | Proposed values |
|---|---|
| `result_type` | `count_based`, `status_based` |

## PARTNER_MISSION_COMPLETIONS

Purpose: completion and verification state for a user/mobile on a partner mission.

| Column | Meaning |
|---|---|
| `id` | Primary key for the completion record. |
| `mission_id` | FK to `PARTNER_MISSIONS`. |
| `user_id` | Optional FK to `USERS`; null if completion is tracked only by mobile snapshot. |
| `qualifying_donation_id` | Optional FK to the donation that qualified this mission. |
| `mobile_snapshot` | Mobile identity used for Pump verification and counting. |
| `completion_count` | Count for repeatable missions. |
| `completed` | Boolean flag for status-based missions. |
| `last_qualified_at` | Most recent time this mobile/user qualified. |
| `created_at` | Creation timestamp. |
| `updated_at` | Last update timestamp. |

Rules:

- `user_id` is nullable.
- The stable lookup for Pump counts is `mission_id + mobile_snapshot`.
- For donation-based Pump missions, `qualifying_donation_id` points to the donation that completed or last qualified the mission.
- For non-donation partner missions, `qualifying_donation_id` can remain null.

Example Pump flow:

1. User enters mobile on Iran Autism after coming from Pump.
2. Frontend may OTP-register/login the user, or the user may continue through a mobile-only path if the product flow allows it.
3. User donates to the Pump campaign target.
4. Sadad payment transaction succeeds and is verified server-to-server.
5. Donation becomes confirmed.
6. Partner mission completion is created or updated using mission and mobile.
7. Pump verification API returns the required count or status for that mobile.
