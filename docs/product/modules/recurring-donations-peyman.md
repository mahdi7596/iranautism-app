# Recurring Donations - Peyman Direct Debit

Date started: 2026-05-23

Status: Documented for upcoming scope; planned after Pump unless priority changes.

Source files:

- `docs/source/client/debit-peyman/Payman-Services-V1.6.2-1404_10_10.pdf`
- `docs/source/client/debit-peyman/سقف تراکنش های بانک ها تعدادی و مبلغی _موسسه اتیسم ایران.xlsx`

## Purpose

Peyman direct debit lets Iran Autism collect recurring donations from a user's bank account after the user authorizes a bank mandate.

The user logs in to Iran Autism, chooses a bank and monthly amount, approves a mandate through the bank OAuth flow, and Iran Autism later performs scheduled withdrawals according to that mandate.

This feature should be treated as the concrete implementation of the platform's recurring donation capability.

## High-Level User Flow

1. User logs in or registers with mobile OTP.
2. User opens the recurring donation flow.
3. User chooses a supported bank.
4. User enters or confirms required identity information, including mobile number and national code.
5. User selects a monthly donation amount.
6. Iran Autism validates the selected amount against platform rules and bank/Peyman limits.
7. Iran Autism creates a local recurring donation mandate in a pending state.
8. Iran Autism calls Peyman's create Payman service.
9. Peyman returns a redirect URL.
10. User is redirected to the bank OAuth page in a browser.
11. User authenticates at the bank and confirms the mandate.
12. Peyman redirects the user back to Iran Autism with `payman_code` and status.
13. If the status is created, Iran Autism calls Peyman Get ID.
14. Iran Autism stores the returned `payman_id` and marks the mandate active.
15. A scheduled monthly job creates direct debit withdrawal attempts.
16. Each withdrawal is traced until it reaches a final state.
17. The recurring donation is counted only after a successful withdrawal.

## Peyman Services Understood From The PDF

Relevant services:

- Login: obtains a bearer token using client credentials.
- Create Payman: creates a bank mandate and returns an OAuth redirect URL with HTTP 302.
- Payman Get ID: exchanges a successful `payman_code` for a `payman_id` and activates the mandate.
- Trace Payman: checks mandate creation status by trace ID.
- Payman Status Change: changes mandate status.
- Update Payman: updates an existing mandate through another OAuth approval flow.
- Payman's List: lists mandates.
- Payman Pay: performs direct debit withdrawal.
- Pay Trace: checks withdrawal status by trace ID and date.
- Payman Transactions: lists transactions for one or more mandates.
- Merchant Transactions and reports: support financial reporting and reconciliation.
- Health Check: checks provider service availability.

## Supported Banks From Client Spreadsheet

Only banks with active institution access should be shown as available by default.

| Bank | Per-transaction limit | Daily amount limit | Daily count limit | Access |
|---|---:|---:|---:|---|
| ملی | 50,000,000 IRR | 150,000,000 IRR | 10 | Inactive |
| ملت | 30,000,000 IRR | 30,000,000 IRR | 25 | Active |
| کشاورزی | 150,000,000 IRR | 150,000,000 IRR | Not provided | Active |
| تجارت | 100,000,000 IRR | 150,000,000 IRR | Not provided | Inactive |
| دی | 250,000,000 IRR | 250,000,000 IRR | Not provided | Active |
| سینا | 100,000,000 IRR | 100,000,000 IRR | Not provided | Inactive |
| سامان | 100,000,000 IRR | 100,000,000 IRR | Not provided | Active |
| اقتصاد نوین | 150,000,000 IRR | 150,000,000 IRR | Not provided | Active |
| مهر ایران | 150,000,000 IRR | 150,000,000 IRR | Not provided | Active |
| ایران زمین | 150,000,000 IRR | 150,000,000 IRR | Not provided | Inactive |
| سرمایه | 150,000,000 IRR | 150,000,000 IRR | Not provided | Active |
| پست بانک | 150,000,000 IRR | 150,000,000 IRR | Not provided | Inactive |

Bank availability and limits should be stored as configuration, not hard-coded, because Peyman/bank access can change.

## Mandate Configuration

Each mandate should store:

- user ID;
- normalized mobile number;
- national code, stored securely;
- selected bank code;
- selected monthly amount;
- start date;
- expiration date;
- maximum transaction amount;
- daily maximum transaction amount if used;
- maximum daily transaction count;
- maximum monthly transaction count if used;
- Peyman trace ID;
- Peyman code during callback processing;
- Peyman ID after activation;
- current mandate status.

The PDF notes that some banks do not allow a mandate period longer than one year. The safest first version should create mandates for at most one year unless Peyman confirms longer allowed periods for all selected banks.

## Mandate Statuses

Internal statuses should include at least:

- `draft`
- `pending_authorization`
- `waiting_for_confirm`
- `active`
- `deactive`
- `cancelled`
- `expired`
- `failed`

Peyman callback statuses include:

- `Created`
- `Canceled`
- `InternalError`
- `Timeout`

Peyman list/status values include:

- `INITIALIZING`
- `ACTIVE`
- `DEACTIVE`
- `WATING_FOR_CONFIRM`
- `CANCELLED`
- `EXPIRED`

The misspelled `WATING_FOR_CONFIRM` should be handled exactly as provider output, but normalized internally.

## Withdrawal Flow

For each scheduled monthly donation:

1. Confirm the mandate is active.
2. Confirm the selected amount is within bank, platform, and mandate limits.
3. Avoid bank cut-off windows.
4. Create an internal transaction with a unique trace ID.
5. Call Peyman Pay.
6. Store the raw request metadata and response summary.
7. If response is final success, confirm the donation.
8. If response is in progress or timeout, queue trace/retry.
9. If response is failed or balance failed, do not confirm the donation.
10. Expose status to the user and admin.

Peyman transaction statuses include:

- `IN_PROGRESS`
- `FAILED`
- `SUCCEED`
- `REVERSED`
- `TIMEOUT`
- `BALANCE_FAILED`

## Bank Cut-Off Windows

Peyman documents bank cut-off windows where direct debit calls should not be made.

Examples:

- ملی: 23:30 to 00:05
- تجارت: 23:45 to 00:05
- most listed banks: 23:55 to 00:05

The worker should avoid these windows and retry later. This should be implemented as scheduling logic, not as a frontend warning only.

## Cancellation and Updates

Users must be able to cancel recurring donations from their account area.

Cancellation should:

- stop future scheduled withdrawals immediately inside Iran Autism;
- call Peyman status change where required;
- store provider response;
- audit the action;
- keep historical donations and transactions immutable.

Updates to amount, bank, or contract limits should require a new or updated bank authorization flow. The system should not silently increase a user's debit amount without bank/user confirmation.

## Security Requirements

This is a sensitive financial feature.

Required controls:

- Peyman client ID, secret, app key, and tokens must stay server-only.
- Access tokens should be cached server-side and renewed carefully to avoid login rate limits.
- User national code and mobile number must be protected and not exposed in public routes.
- All callbacks must be validated before changing mandate state.
- All provider trace IDs must be unique.
- Withdrawal jobs must be idempotent.
- A user must never be charged twice for the same scheduled donation period.
- Payment truth must come from server-side Peyman verification/tracing, not frontend redirects.
- Admin finance actions must require finance permissions.
- Create, cancel, update, withdrawal, retry, and reconciliation actions must be audit logged.
- Raw provider errors should not be shown directly to users if they expose internals.

## Edge Cases

Important cases to handle:

- user cancels on the bank OAuth page;
- Peyman callback returns timeout;
- callback arrives more than once;
- user closes the browser before returning;
- Payman Get ID fails after a created callback;
- mandate stays waiting for confirmation;
- mandate expires;
- mandate is cancelled from the bank/provider side;
- selected bank becomes inactive;
- user changes mobile or profile details;
- national code and mobile do not match;
- bank service is temporarily unavailable;
- direct debit returns insufficient balance;
- direct debit returns timeout and later succeeds;
- direct debit is reversed;
- trace ID is duplicated;
- monthly worker runs twice;
- amount exceeds bank, SLA, or mandate limits;
- withdrawal is attempted during bank cut-off time;
- report/reconciliation shows a provider-corrected transaction status.

## Platform Modules Involved

This feature depends on:

- Auth: mobile OTP login.
- Users: profile, mobile identity, national code handling.
- Donations: recurring donation intent and confirmed donation history.
- Payments: Peyman provider integration.
- Transactions: immutable withdrawal attempts and lifecycle.
- Reports: recurring donation and transaction exports.
- Notifications: user/admin messages for activation, success, failure, cancellation, and expiry.
- Audit Log: sensitive financial actions.
- Settings: Peyman credentials, bank limits, feature flags, retry policies.
- Background Jobs: monthly debit scheduling, tracing, retries, expiry checks.

## Initial Backend Shape

Recommended module shape:

- Keep user-facing recurring donation concepts in `Donations` or a dedicated `RecurringDonations` submodule.
- Keep Peyman HTTP/client integration inside `Payments`.
- Keep each withdrawal attempt and provider state transition in `Transactions`.
- Use background jobs for scheduled monthly withdrawals and tracing.

Initial endpoint families:

- `/api/account/recurring-donations/*` for user mandate creation, status, cancellation.
- `/api/payments/peyman/callback` or `/api/webhooks/peyman/*` for provider redirects/callbacks.
- `/api/admin/recurring-donations/*` for finance/admin visibility.

Exact route names should be finalized during implementation planning.

## Open Questions

- What monthly donation amounts should be offered to users?
- Should users be allowed to enter a custom amount?
- What should the default contract duration be: 3 months, 6 months, 1 year?
- Which bank accounts should receive funds for each donation type?
- Does Iran Autism want recurring donations allocated to general support only, or also projects/phases?
- What user notifications are required before each monthly withdrawal?
- Should failed withdrawals retry automatically, and how many times?
- What is the cancellation SLA promised to users?
- Does Peyman provide a server-to-server webhook, or are redirects plus trace/report APIs the only reliable state source?
- Which admin roles can view national code, cancel mandates, retry withdrawals, or export reports?
