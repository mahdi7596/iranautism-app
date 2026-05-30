# Pump Phase 1 User Flow Summary

Date: 2026-05-26

Status: Summarizes the user-facing and partner-facing flow implemented so far for Phase 1 Pump.

Related implementation scope:

- Mobile OTP login/register.
- Pump mission listing and mission detail pages.
- Pump donation intent creation for paid missions.
- Free Pump registration mission completion.
- Sadad payment start, callback verification, and result display.
- Pump partner verification endpoint.
- Authenticated profile Pump mission history.

## Summary

Phase 1 lets a Pump user complete an Iran Autism mission by choosing either a paid support mission or the free registration mission. Paid missions use mobile OTP, Sadad payment, backend verification, and return-to-Pump flow; the free registration mission uses mobile OTP registration/login and records completion without payment.

The implemented flow is mobile-first and Persian-first. User-facing messages, validation states, loading states, and payment result copy are shown in Persian. Mobile number is the main identity used for Pump mission completion, so the mission can be verified for both an authenticated Iran Autism user and a mobile-only Pump participant.

## Main User Flow

1. The user arrives from Pump or directly visits the Pump mission area at `/fa/missions/pump`.
2. The page shows the available Iran Autism missions:
   - medicine support;
   - rehabilitation support;
   - caregiving support;
   - free registration on the Iran Autism site.
3. The user selects a mission and opens `/fa/missions/pump/[missionId]`.
4. The mission detail page shows the mission title, medal text, reward details where available, and the relevant action for that mission.
5. If the user is not already authenticated, they enter an Iranian mobile number.
6. The system requests an OTP with the `pump_mission` purpose.
7. The user enters the OTP.
8. After successful verification, the frontend stores the session and treats the mobile number as the active mission identity.
9. For paid missions, the user clicks the payment/start mission button.
10. The frontend creates a Pump donation intent through the backend.
11. The backend creates a pending donation and a payment transaction for the selected mission, amount, mobile identity, and Sadad gateway.
12. The frontend starts the payment transaction and redirects the browser to Sadad.
13. The user completes, cancels, or fails payment at Sadad.
14. Sadad returns to the backend callback endpoint.
15. The backend records the callback, verifies the payment with Sadad server-to-server, and updates the internal payment status.
16. If payment is verified as successful, the backend confirms the donation and records the Pump mission completion for the stored mobile snapshot.
17. The browser is redirected to `/fa/payments/sadad/result` with the internal payment transaction ID.
18. The frontend reads payment truth from the backend by `paymentTransactionId`.
19. The user sees a Persian success, failed, pending, or retry-oriented result state.
20. The user can return to Pump using the configured Pump return URL.
21. In Pump, when the user asks Pump to check completion, Pump calls Iran Autism's protected verification API.
22. Iran Autism returns the mission completion result for the user's mobile number and mission.
23. Pump can grant the reward based on the verification response.

## Free Registration Mission Flow

The free registration mission exists so Pump users are not forced to pay money to complete every mission.

1. The user opens the registration mission from `/fa/missions/pump`.
2. If anonymous, the user verifies their mobile number through the Pump OTP flow.
3. If already logged in, the page uses the authenticated mobile and does not ask for mobile again.
4. The user confirms the free registration mission.
5. The backend records a status-based Pump mission completion for that user/mobile.
6. No donation, payment transaction, Sadad redirect, or Sadad verification is created.
7. When Pump verifies the mission, Iran Autism returns `completed: true` or `completed: false`.

The free mission is one-time per mobile number. A user who already registered through a paid Pump mission can still complete this free registration mission once after explicit mission intent.

## Authenticated User Flow

If the user is already logged in before opening a mission page:

- the mission page skips the mobile OTP form;
- it shows the current account mobile as the mission identity;
- the donation intent is created with registered user identity;
- the donation still stores a mobile snapshot so Pump verification remains mobile-based;
- after successful payment, the mission completion is recorded against that mobile identity.

The user can also log in through `/fa/login`, then continue to Pump pages or profile pages using local return paths.

## Mobile-Only Pump Flow

Phase 1 also supports users who are not intentionally managing a full Iran Autism profile:

- the user enters and verifies a mobile number on the mission detail page;
- the backend can create the donation intent with mobile identity;
- the donation may remain guest/mobile-only internally while still carrying the mobile snapshot;
- Pump verification still works because the partner check is based on normalized mobile and mission completion, not only on a registered account record.

## Payment Result Flow

The frontend result page does not trust raw Sadad query fields. It uses the internal `paymentTransactionId` to ask the backend for payment status.

Result handling currently supports:

- loading while the backend status is fetched;
- success messaging after verified payment;
- retry path when a payment can be retried;
- return-to-Pump action;
- error state when the payment transaction ID is missing or status lookup fails.

## Pump Verification Flow

Pump verification is server-to-server:

1. Pump calls `/api/partners/pump/missions/:missionId/verify`.
2. The request must pass the Pump API key guard.
3. Pump sends the user's mobile number.
4. Iran Autism validates the mission and mobile.
5. Iran Autism checks recorded successful mission completions.
6. Iran Autism returns the mission result for that mobile.

For repeatable missions, completion count is based on verified successful donation completions. Starting checkout does not count. Failed, pending, or unverified payments do not complete the mission.

## Profile Flow

Authenticated users can view Pump mission history at `/fa/profile/pump-missions`.

The profile history flow:

- requires authentication;
- redirects unauthenticated users toward login;
- loads mission history from the backend;
- shows empty, loading, error, pending, and completed states in Persian;
- displays completion count where available.

## Important Phase 1 Boundaries

Implemented Phase 1 covers paid Pump donation mission paths and the free registration mission path. It does not yet cover the broader product platform.

Still outside this current slice unless separately prioritized:

- full CMS and editable public website;
- admin panel and support investigation UI;
- broad financial reports and exports;
- construction project progress modules;
- Peyman recurring donations;
- media/gallery/storytelling modules;
- finalized Pump production return URL and any final field-name changes requested by Pump.

## Operational Notes

- Real Sadad credentials must stay in the server environment or secret store and must never be committed.
- For live Sadad, the public domain/referrer, backend callback URL, and server IP must match Sadad portal configuration.
- Pump reward wording should stay conservative until Pump confirms exact reward copy, repeatability limits, final registration mission image/source, and final verification field names.
