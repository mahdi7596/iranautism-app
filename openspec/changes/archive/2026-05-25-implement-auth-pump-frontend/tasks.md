## 1. Contract Alignment And Dependencies

- [x] 1.1 Review `DESIGN.md`, `docs/decisions/frontend-architecture.md`, `docs/product/modules/partner-missions-pump.md`, and this change's specs before implementation.
- [x] 1.2 Add required frontend dependencies for React Hook Form, Zod, Tabler icons, and accessible dialog/toast primitives if not already present.
- [x] 1.3 Add OTP purpose support to backend DTOs and validation with allowed values `login` and `pump_mission`.
- [x] 1.4 Map `otpPurpose: "login"` to `SMS_OTP_LOGIN_TEMPLATE_ID` and `otpPurpose: "pump_mission"` to `SMS_OTP_PUMP_MISSION_TEMPLATE_ID` in the SMS provider boundary.
- [x] 1.5 Add backend tests proving normal login OTP and Pump mission OTP choose the correct template purpose without storing real SMS secrets.
- [x] 1.6 Add optional authenticated-user support to Pump donation intent creation so a valid bearer token links the donation to `user_id` and authenticated mobile snapshot.
- [x] 1.7 Add backend tests proving authenticated Pump donation intent creates a registered donation and ignores conflicting submitted mobile values.
- [x] 1.8 Add backend Pump mission seed/config entries for all four frontend mission keys.
- [x] 1.9 Add backend tests proving all four Pump mission IDs are recognized by the donation intent and verification logic.

## 2. Shared Frontend Package Foundation

- [x] 2.1 Configure package entrypoints and TypeScript settings for `packages/types`, `packages/validation`, `packages/api-client`, `packages/icons`, `packages/ui`, and `packages/design-tokens`.
- [x] 2.2 Add shared auth, Pump mission, payment, API response, and user history types in `packages/types`.
- [x] 2.3 Add shared validation schemas for Iranian mobile, OTP code, OTP purpose, mission ID, toman amount, and Pump donation form values in `packages/validation`.
- [x] 2.4 Add typed API client functions for OTP request, OTP verify, current user, Pump donation intent, payment start, and payment result/status lookup in `packages/api-client`.
- [x] 2.5 Add a project-owned Tabler icon wrapper/map in `packages/icons` with the icon names needed for auth, missions, amount controls, payment, success/failure, tickets, gifts, and navigation.
- [x] 2.6 Add design token CSS and base exports in `packages/design-tokens` aligned with `DESIGN.md`.
- [x] 2.7 Add initial `packages/ui` components for Button, IconButton, Field, Input, FormSummary, Alert, Toast, Modal, StatusBadge, Amount, JalaliDate, LoadingState, ErrorState, and EmptyState.
- [x] 2.8 Add unit tests for validation schemas, amount conversion between toman and IRR, and Jalali date formatting.

## 3. Web App Foundation And Design System

- [x] 3.1 Replace the current minimal global CSS with design-system CSS layers/tokens that follow pure CSS, RTL-safe logical properties, and `DESIGN.md`.
- [x] 3.2 Load IRANSans for default UI text and Ray only for allowed display/hero usage.
- [x] 3.3 Add web app config for API base URL, locale routes, Pump return URL `https://pwa.pumpgame.ir/missions`, and mission route builders.
- [x] 3.4 Add auth state bootstrap utilities that can read the stored token/session, call `/api/auth/me`, and expose current user to client flows.
- [x] 3.5 Add toast and modal providers to the relevant app layout without affecting server-rendered public pages unnecessarily.
- [x] 3.6 Verify `/` still redirects to `/fa` and Persian pages keep `lang="fa"` and RTL direction.

## 4. Login/Register OTP Flow

- [x] 4.1 Create `/fa/login` route group/page using the shared auth shell and reusable components.
- [x] 4.2 Build mobile input step with Persian labels, `+98`/LTR phone handling, validation, loading state, and normal `otpPurpose: "login"`.
- [x] 4.3 Build OTP entry step with segmented/step indicator, OTP inputs, resend timer, edit mobile action, and Persian error handling.
- [x] 4.4 Store authenticated user/token after successful OTP verify and redirect to the requested return path or profile/dashboard fallback.
- [x] 4.5 Handle invalid mobile, invalid OTP, expired OTP, rate limit, network failure, and duplicate submit states in Persian.
- [x] 4.6 Add tests for normal login mobile validation, OTP request payload purpose, OTP verification success, edit mobile, resend, and failed verification states.
- [x] 4.7 Browser-check the login page on mobile and desktop for RTL layout, long Persian text, focus states, and reduced motion.

## 5. Pump Mission Configuration And Listing Page

- [x] 5.1 Add feature-local Pump mission config for exactly four missions from `docs/source/client/pump/V1.xlsx`.
- [x] 5.2 Define stable frontend/backend mission keys for medicine support, rehabilitation support, caregiving support, and general Iran Autism support.
- [x] 5.3 Configure first three missions with minimum 10,000 toman, 10,000 toman step, repeatable behavior, and no displayed ticket count.
- [x] 5.4 Configure general donation mission with 200,000 toman threshold text and 3,000 displayed ticket count.
- [x] 5.5 Create `/fa/missions/pump` listing page with the existing Iran Autism banner asset, concise Persian copy, and four mission cards.
- [x] 5.6 Add mission card states for default, hover, focus-visible, selected, disabled/loading, and long text.
- [x] 5.7 Add light purposeful animations for hero/card entry while honoring `prefers-reduced-motion`.
- [x] 5.8 Add tests proving only four Excel-defined missions render and no registration-only mission appears.
- [x] 5.9 Browser-check Pump listing page on mobile and desktop for visual polish, spacing, RTL, and card readability.

## 6. Pump Mission Detail And OTP Identity Flow

- [x] 6.1 Create `/fa/missions/pump/[missionId]` route for selected mission flow.
- [x] 6.2 Show mission title, medal text, short benefit copy, amount rule, and mission action summary for the selected mission.
- [x] 6.3 If the user is already authenticated, display the authenticated mobile as the identity anchor and skip mobile entry.
- [x] 6.4 If the user is anonymous, show Pump-specific mobile/OTP flow that sends `otpPurpose: "pump_mission"`.
- [x] 6.5 After Pump OTP verification, store authenticated state and continue the selected mission without losing selected amount or mission context.
- [x] 6.6 Handle authenticated-mobile conflict by using the authenticated mobile and explaining it in Persian.
- [x] 6.7 Add tests for logged-in mission entry, anonymous Pump OTP payload purpose, post-OTP continuation, and mobile conflict handling.

## 7. Pump Amount Selection And Payment Start

- [x] 7.1 Build reusable `AmountStepper` with toman display, plus/minus controls, keyboard-friendly numeric input, minimum enforcement, and 10,000 toman step behavior.
- [x] 7.2 Use `AmountStepper` for the first three missions with minimum 10,000 toman and for the general mission with the agreed 200,000 toman threshold.
- [x] 7.3 Convert submitted toman amount to integer IRR before calling the Pump donation intent API.
- [x] 7.4 Generate and pass idempotency/correlation values for payment preparation to reduce duplicate submit risk.
- [x] 7.5 Create Pump donation intent with selected mission, authenticated identity, amount, and gateway.
- [x] 7.6 Call payment start with the returned `paymentTransactionId` and a frontend/backend-compatible callback/result URL.
- [x] 7.7 Redirect the browser to the returned Sadad `redirectUrl` only after both API calls succeed.
- [x] 7.8 Disable payment controls and show Persian loading/toast states while payment preparation is pending.
- [x] 7.9 Add tests for amount min/step behavior, toman-to-IRR conversion, duplicate submit prevention, payment start success, and payment start failure.

## 8. Sadad Result And Mission Completion UX

- [x] 8.1 Create the frontend Sadad/Pump result route used by the payment callback flow.
- [x] 8.2 Add API client/status handling that reads backend payment verification status instead of trusting local state or raw Sadad query params.
- [x] 8.3 Show an animated Persian success modal for verified successful Pump mission payment with a short mission-completed message.
- [x] 8.4 Show a Persian failure modal for failed, cancelled, or mismatched payment with a retry/recover action.
- [x] 8.5 Show a Persian pending state for verification-pending or unknown statuses without claiming completion.
- [x] 8.6 Add the return-to-Pump action pointing to `https://pwa.pumpgame.ir/missions`.
- [x] 8.7 Ensure modal focus management, accessible title/description, escape/close behavior where appropriate, and reduced-motion support.
- [x] 8.8 Add tests for success, failure, pending, repeated refresh, and return-to-Pump behavior.
- [x] 8.9 Browser-check result modals on mobile and desktop for animation, readability, and no content overlap.

## 9. User Profile And Pump History

- [x] 9.1 Add a minimal authenticated profile/dashboard route if one does not already exist in `apps/web`.
- [x] 9.2 Add a visible Persian link from profile/dashboard to Pump mission history.
- [x] 9.3 Add a Pump mission history page/list that requires authentication.
- [x] 9.4 Add or consume a backend/account API for the authenticated user's Pump mission history if the current backend does not expose one.
- [x] 9.5 Display supported history fields only: mission title, completion status/count where available, and completion date.
- [x] 9.6 Use reusable Jalali date display for all user-visible dates in mission history.
- [x] 9.7 Add tests for authenticated access, anonymous redirect/login requirement, Jalali date formatting, and safe history field display.

## 10. Edge Cases, Polish, And Persian Copy

- [x] 10.1 Review all user-facing auth, Pump, payment, dashboard, loading, empty, toast, modal, and validation messages to ensure they are Persian.
- [x] 10.2 Add empty and error states for unavailable mission config, missing backend mission, API outage, and payment status lookup failure.
- [x] 10.3 Ensure all buttons, icon buttons, inputs, amount controls, toasts, and modals have accessible names and visible focus states.
- [x] 10.4 Ensure directional icons mirror only when direction conveys meaning and brand/logo imagery is not mirrored.
- [x] 10.5 Verify first three mission cards do not display invented ticket counts.
- [x] 10.6 Verify all amount displays clearly label toman and all API amounts remain IRR.
- [x] 10.7 Verify all mission content is short, direct, and based on the mission goals without unsupported reward promises.

## 11. Verification And Documentation

- [x] 11.1 Run API tests for OTP purpose, authenticated Pump intent, mission seeds, payment start, and Pump completion idempotency.
- [x] 11.2 Run frontend unit/component tests for validation, auth flow, mission config, amount stepper, payment result, and Jalali display.
- [x] 11.3 Run workspace typecheck and build.
- [x] 11.4 Start the local API and web app and complete a browser walkthrough of login/register, Pump mission selection, OTP, payment preparation, and result states.
- [x] 11.5 Capture browser screenshots or notes for mobile and desktop verification.
- [x] 11.6 Update `docs/product/modules/partner-missions-pump.md` with final frontend handoff and any remaining Pump questions.
- [x] 11.7 Update `docs/decisions/change-log.md`, `docs/product/module-registry.md`, and root `AGENTS.md` only with short operational status changes.
- [x] 11.8 Prepare the short casual Pump follow-up message asking whether they want a specific return URL instead of `https://pwa.pumpgame.ir/missions`.
