# Partner Missions - Pump Integration

Date started: 2026-05-23

Status: In progress for documentation; planned as the first feature to implement.

Source files:

- `docs/source/client/pump/API Documentation V2.pdf`
- `docs/source/client/pump/V1.xlsx`
- `docs/source/client/pump/pumpLink`

## Purpose

Pump is a third-party game/reward platform. Users play games on Pump and may need tickets, points, or coins to continue. Pump can offer missions from partner organizations. Iran Autism is one of those partners.

The Iran Autism platform should provide mission landing pages and a secure mission verification API so Pump can confirm whether a user completed a selected Iran Autism mission.

This feature belongs in the Iran Autism platform because the selected missions are donation/support actions for Iran Autism, and their completion must be verified against Iran Autism-owned user, donation, and mission records.

## High-Level User Flow

1. A Pump user sees an Iran Autism mission card inside Pump.
2. The user clicks the mission card.
3. Pump shows mission details.
4. The user clicks the mission start button.
5. Pump sends the user to an Iran Autism landing page.
6. The user completes the mission on Iran Autism.
7. The user returns to Pump.
8. The user clicks "I have done it" in Pump.
9. Pump calls an Iran Autism API to verify the mission result.
10. Iran Autism returns the user's mobile number plus the required mission result property.
11. Pump grants the ticket/reward if the response qualifies.

## Mission Verification Rule

Pump has told us that the verification response depends on mission repeatability:

- If the mission is repeatable, Iran Autism should return the user's mobile number and a `count` value.
- If the mission is not repeatable, Iran Autism should return the user's mobile number and a flag/status value. If the mission is incomplete, the flag should be `false`.

Working response shape:

```json
{
  "mobile": "09xxxxxxxxx",
  "missionId": "iran-autism-general-donation",
  "count": 2
}
```

For non-repeatable missions:

```json
{
  "mobile": "09xxxxxxxxx",
  "missionId": "iran-autism-general-donation",
  "completed": true
}
```

If not completed:

```json
{
  "mobile": "09xxxxxxxxx",
  "missionId": "iran-autism-general-donation",
  "completed": false
}
```

Exact field names should be confirmed with Pump before implementation. Internally, Iran Autism should model the result as either `count-based` or `status-based` so the API adapter can adjust field names without changing domain logic.

## Current Implementation Focus

The current active implementation focus is Pump mission donations plus mobile auth plus Sadad payments.

Out of scope for the current backend focus:

- CMS
- admin panel
- broad reporting
- media/storage
- project and phase management
- Peyman recurring donations
- frontend implementation

Sadad payment credentials must be configured through environment variables only. Real merchant, terminal, username, or key values must not be committed to the repository or copied into durable documentation.

## User Identification

Use mobile-based identification as the preferred method.

Reason:

- Pump's documentation says mobile-based verification is more reliable.
- It works even if a user performs the action through their normal Iran Autism account path instead of only through the Pump landing link.
- It reduces support tickets caused by users completing the mission outside the original tracked URL.

The backend must support two mission-completion identity paths:

1. Registered/authenticated path:
   - user completes mobile OTP login/register;
   - donation stores `user_id`;
   - donation also stores `mobile_snapshot`;
   - Pump verification still uses normalized mobile.

2. Mobile-only path:
   - user provides a normalized mobile number without creating/logging into an account;
   - donation keeps `user_id` null;
   - donation stores `mobile_snapshot`;
   - Pump verification uses normalized mobile and can still return count/status.

The Iran Autism mission landing page may encourage OTP login because it improves donation history and future user dashboard support, but OTP registration must not be treated as the only valid Pump mission path unless the product owner later confirms that stricter rule.

## Missions From Client Spreadsheet

The client-provided `docs/source/client/pump/V1.xlsx` currently lists these mission candidates:

| Mission title | Medal title | Medal text | Known reward/limit details |
|---|---|---|---|
| کمک به هزینه دارو افراد اتیسم | نشان همراهی دارو | با خرید هر نشان دارو به یک فرد اتیسم کمک می‌کنید و این ماموریت براتون کامل میشه | Needs confirmation |
| کمک به هزینه توانبخشی افراد اتیسم | نشان همراهی توانبخشی | با خرید هر نشان توانبخشی به توانمند شدن یک فرد اتیسم کمک می‌کنید و این ماموریت براتون کامل میشه | Needs confirmation |
| کمک به هزینه پرستاری افراد اتیسم | نشان همراهی فرشته | با خرید هر نشان فرشته کمک به مراقبت از یک فرد اتیسم می‌کنید و این ماموریت براتون کامل میشه | Needs confirmation |
| کمک به انجمن اتیسم ایران | کمک طیف اتیسم | با هر کمک بالای ۲۰۰ هزار تومان به انجمن اتیسم ایران، این ماموریت براتون کامل میشه | Ticket count shown as `3000`; threshold text says donation above 200,000 toman |

The spreadsheet leaves several important columns blank for most missions:

- ticket count
- repeatability
- repeat cap
- landing page URL
- total mission budget

These must stay marked as needs confirmation until the client or Pump confirms them.

## Mission Types

Supported mission result types should be:

- `status-based`: one-time mission, returns mobile plus a boolean/status flag.
- `count-based`: repeatable mission, returns mobile plus a cumulative count.

Voucher-based verification should not be the default approach. It should only be used if Pump or the client explicitly requires voucher codes.

## Landing Pages

Each mission should have a dedicated or configurable Iran Autism landing page.

Landing pages should:

- explain the mission in Persian;
- preserve any Pump campaign parameters if provided;
- ask the user to authenticate with mobile OTP if needed;
- route the user into the relevant donation/support action;
- show clear completion feedback after a qualifying action;
- avoid promising Pump rewards directly unless Pump has confirmed the exact wording.

## Campaign Start Date

Each Pump mission must have a campaign start date stored in Iran Autism.

Only actions completed after that start date should qualify for Pump verification. This is required by the Pump documentation.

## Repeatable Mission Counting

For repeatable missions:

- Iran Autism should store a cumulative count per normalized mobile number and mission.
- The count should not be reset.
- If a repeat cap exists, it should be enforced by mission configuration.
- The API should return the current qualifying count.
- Count increases only after the related mission action is verified. For donation missions, this means verified payment success, not merely starting checkout.

## One-Time Mission Flagging

For non-repeatable missions:

- Iran Autism should return `completed: true` only after the qualifying action is complete and verified.
- Iran Autism should return `completed: false` when no qualifying action exists.
- If the action is still being verified, Iran Autism may return a pending state internally, but Pump's accepted response format must be confirmed before exposing `pending`.

## Security Requirements

The Pump verification API should be protected by:

- API key authentication;
- IP allowlisting for Pump server IPs when Pump provides them;
- request rate limits;
- mission ID validation;
- normalized mobile validation;
- structured request and response logs;
- no public exposure of donation amount details unless explicitly required;
- no admin-only or financial internals in API responses.

## Support and Dispute Handling

Pump's documentation says if users complain that a completed mission did not grant a reward, Pump may send user lists by mission. Iran Autism should be able to investigate those cases.

Required admin/support capabilities:

- search mission verification logs by mobile and mission;
- see qualifying action status;
- see last API response returned to Pump;
- manually mark a support investigation result, without silently changing financial records;
- respond within Pump's stated support window when possible.

## Platform Modules Involved

This feature depends on:

- Auth: mobile OTP login.
- Users: normalized mobile identity.
- Donations: qualifying donation/support actions.
- Payments and Transactions: verified payment status for donation-based missions.
- Partner Missions: mission configuration, completions, and verification API.
- Reports: mission completion and support reports.
- Audit Log: manual support/admin actions.
- Settings: Pump API key, IP allowlist, campaign configuration.

For the current narrowed backend focus, Auth, Users, Donations, Payments/Transactions, and Partner Missions are active. Admin, reports, audit UI, CMS, media, and settings UI remain later backend/frontend work unless separately confirmed.

## Initial Backend Shape

Recommended module name: `PartnerMissionsModule`.

Core concepts:

- partner: `pump`
- mission configuration
- mission result type: `status-based` or `count-based`
- campaign start date
- landing path
- qualifying action rule
- mobile identity
- verification request log
- verification response log
- support investigation record

Initial endpoint family:

- `/api/partners/pump/*` for Pump server-to-server APIs.
- `/api/public/missions/pump/*` or normal public pages for user-facing landing pages.
- `/api/admin/partner-missions/*` for mission configuration and support views.

Exact route names should be finalized during implementation planning.

Payment-confirmation rule:

- Pump verification endpoints may read and return mission completion state.
- Pump partner endpoints must not be the source of truth for donation/payment completion.
- For Sadad-backed donation missions, Sadad server-side verification confirms the payment, then the backend confirms the donation and records the Pump mission completion.
- The implemented backend supports both registered OTP users and mobile-only users: both paths store `mobile_snapshot`, and verified Sadad success uses that mobile snapshot to update Pump completion.
- Repeated Sadad callbacks for the same already-successful payment are idempotent and must not increment Pump mission count more than once for the same qualifying donation.

Current backend endpoint handoff:

- User-facing Pump donation intent starts at `POST /api/public/missions/pump/donation-intents`.
- Gateway redirect data starts at `POST /api/payments/:paymentTransactionId/start`.
- Sadad callback is accepted at `GET /api/payments/sadad/callback` and `POST /api/payments/sadad/callback`.
- Pump server verification reads stored completion state at `GET /api/partners/pump/missions/:missionId/verify`.

Frontend handoff notes:

- The frontend now provides `/fa/login`, `/fa/missions/pump`, `/fa/missions/pump/[missionId]`, `/fa/payments/sadad/result`, `/fa/profile`, and `/fa/profile/pump-missions`.
- Normal login OTP sends `otpPurpose: "login"` and Pump mission OTP sends `otpPurpose: "pump_mission"` so SMS templates can differ.
- If the user is already authenticated, the Pump mission detail page uses the authenticated mobile and does not ask for mobile again.
- The first three Excel missions accept custom repeatable amounts from 10,000 toman with 10,000 toman step controls and do not display ticket counts.
- The general donation mission uses the 200,000 toman threshold and displays 3,000 tickets.
- After creating a Pump donation intent, the frontend calls the payment start endpoint and redirects the browser to the returned `redirectUrl`.
- Callback/result screens show Persian messages only and treat backend payment status from `GET /api/payments/:paymentTransactionId/status` as source of truth.
- User profile history reads `GET /api/account/pump-missions/history` and displays mission titles, completion status/count where available, and Jalali completion dates.
- Real Sadad credentials belong only in the server environment/secret store during deployment.

## Open Questions

- Should Pump use the current temporary return target `https://pwa.pumpgame.ir/missions`, or do they want a more specific campaign/session return URL?
- What API field names does Pump require exactly for mobile, count, and flag?
- Does Pump accept a `pending` status, or only true/false/count?
- What are Pump's production and staging server IPs?
