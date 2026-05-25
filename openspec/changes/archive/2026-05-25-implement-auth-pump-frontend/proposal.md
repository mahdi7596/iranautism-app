## Why

The backend slice for mobile auth, Pump mission donations, and Sadad payment verification is now implemented, but users still need a Persian, RTL, design-system based frontend flow to log in/register, complete Pump missions, pay through Sadad, and return to Pump with clear success or failure feedback.

This is urgent because Pump is the first planned partner feature and the frontend must match the already-agreed architecture, `DESIGN.md`, Pump Excel mission list, and mobile-first OTP flow without inventing additional missions or broad platform features.

## What Changes

- Add a Persian login/register page using mobile OTP where existing users log in and new mobile numbers register and log in through the same flow.
- Add Pump-specific OTP purpose handling so the SMS provider can use a different template for normal login and Pump mission login.
- Add frontend package foundations needed for this slice: shared types, validation schemas, API client calls, UI primitives, icon wrapper, and design-system CSS.
- Add Pump mission pages for exactly the four missions listed in `docs/source/client/pump/V1.xlsx`.
- Make all four Pump missions active:
  - the first three accept any donation amount from at least 10,000 toman, step by 10,000 toman, and do not display ticket count because the spreadsheet leaves ticket count blank;
  - the fourth uses the spreadsheet's 200,000 toman threshold text and 3,000 ticket count.
- Require or obtain OTP-authenticated mobile identity before starting a Pump mission donation; if the user is already logged in, use the authenticated mobile without asking again.
- Add Sadad payment preparation, redirect, callback/result UI, and animated Persian success/failure modal states driven by backend payment truth.
- Add a user dashboard/profile entry point and Pump mission history list with Jalali date display where dates are shown.
- Add the minimum backend contract adjustments needed for the frontend flow:
  - OTP request accepts `otpPurpose: "login" | "pump_mission"`;
  - Pump donation intent supports authenticated registered-user donations so `user_id` is attached when the user is logged in.
- Keep the temporary Pump return URL as `https://pwa.pumpgame.ir/missions` and prepare a short follow-up note asking Pump whether they want a specific return URL.
- Exclude CMS, admin panel, broad reports, media management, project/phase pages, Peyman recurring donations, and general crowdfunding UI from this change.

## Capabilities

### New Capabilities

- `frontend-auth-otp`: Persian mobile OTP login/register UI, route, state handling, validation, and reusable auth components.
- `frontend-pump-missions`: Pump mission landing/detail flow for the four spreadsheet-defined missions, including OTP identity, amount selection, mission start, and return-to-Pump behavior.
- `frontend-sadad-result`: Sadad payment preparation, redirect handling, result page, and animated success/failure modal UX.
- `frontend-user-pump-history`: User dashboard/profile entry point and Pump mission history list with Jalali date formatting.
- `frontend-foundation-packages`: Shared frontend package foundations for UI, icons, validation, types, API client, design-system CSS, toasts, modals, amounts, and Jalali date display.

### Modified Capabilities

- `mobile-auth`: OTP request gains a user-facing purpose value for normal login versus Pump mission OTP SMS template selection.
- `pump-mission-donations`: Pump donation intent supports authenticated registered-user starts as well as mobile-based mission identity, so the frontend can attach `user_id` when the user is already logged in or has just completed OTP.

## Impact

- Affected frontend code:
  - `apps/web/src/app/[locale]/(auth)/login`
  - `apps/web/src/app/[locale]/(public)/missions/pump`
  - `apps/web/src/app/[locale]/(public)/missions/pump/[missionId]`
  - `apps/web/src/app/[locale]/(payments)/sadad/result`
  - `apps/web/src/app/[locale]/(account)/profile`
  - `apps/web/src/features/auth`
  - `apps/web/src/features/pump-missions`
  - `apps/web/src/features/payments`
  - `apps/web/src/features/account`
  - `apps/web/src/config`
- Affected shared packages:
  - `packages/ui`
  - `packages/icons`
  - `packages/validation`
  - `packages/types`
  - `packages/api-client`
  - `packages/design-tokens`
- Affected backend code:
  - `apps/api/src/modules/auth`
  - `apps/api/src/modules/partner-missions/pump`
  - `apps/api/src/modules/donations`
  - `apps/api/src/infrastructure/sms`
- Affected API surfaces:
  - `POST /api/auth/otp/request`
  - `POST /api/auth/otp/verify`
  - `GET /api/auth/me`
  - `POST /api/public/missions/pump/donation-intents`
  - `POST /api/payments/:paymentTransactionId/start`
  - Sadad callback/result integration surfaces
- Affected dependencies likely include React Hook Form, Zod, Tabler Icons, Radix-style primitives where needed for accessible dialogs/toasts/tooltips, and a small date-formatting approach for Jalali display.
- Design impact: all UI must follow root `DESIGN.md`, Persian-first copy, RTL-safe CSS, Tabler icons through the project wrapper, purple identity, orange mission/payment CTAs, and restrained purposeful animation.
