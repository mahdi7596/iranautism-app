## Context

The project already has accepted backend, frontend, repository, and design-system direction in `docs/decisions/` and root `DESIGN.md`. The frontend foundation exists only as a minimal Next.js App Router shell under `apps/web`, while the shared frontend packages are currently empty. The archived backend change `2026-05-25-implement-auth-pump-sadad-backend` implemented the backend path for mobile OTP, Pump donation intents, Sadad payment start/callback/verification, and Pump completion after verified payment.

The frontend now needs to make that backend usable for the urgent Pump integration. The user experience must be Persian-first, RTL, mobile-friendly, visually aligned with Iran Autism's purple/orange "Trust & Progress" system, and grounded in the four missions from `docs/source/client/pump/V1.xlsx` only. Hamkalan's login page is a UX reference for a calm two-step OTP flow, but its code and visual palette are not to be copied.

The desired product behavior is that Pump mission users authenticate through OTP before mission payment. Existing mobile numbers log in; new mobile numbers register and log in in the same OTP verification flow. Normal login and Pump mission OTP must use different SMS provider templates. If a user is already logged in before entering a Pump mission page, the frontend uses that authenticated mobile and does not ask for it again.

## Goals / Non-Goals

**Goals:**

- Build a reusable frontend foundation for the first production-shaped public/auth/payment slice.
- Implement `/fa/login` as a mobile OTP login/register page.
- Implement Pump mission listing/detail/payment flow for exactly the four spreadsheet missions.
- Use OTP-authenticated mobile identity before Pump mission donation.
- Support a different OTP purpose for normal login versus Pump mission login.
- Start Sadad payment from a Pump donation intent and redirect the browser to the returned gateway URL.
- Show Persian success, failure, pending, and recoverable states after payment callback/result.
- Add a minimal user dashboard/profile path with a Pump mission history link/list and Jalali date display.
- Keep UI components reusable, component-driven, and styled through pure CSS based on `DESIGN.md`.

**Non-Goals:**

- Do not build CMS, admin panel, broad reporting, media management, project/phase pages, Peyman recurring donations, or a general crowdfunding checkout outside the Pump flow.
- Do not add missions that are not present in `docs/source/client/pump/V1.xlsx`.
- Do not build a registration-only Pump mission unless the client later adds it to the mission list.
- Do not implement date pickers or calendars; this change only needs Jalali display.
- Do not add Turborepo, split `apps/admin`, or introduce Tailwind/Bootstrap/Material UI.
- Do not store real Sadad, Pump, or SMS secrets in the repository.

## Decisions

### Decision: OTP identity is mandatory before Pump mission donation

Pump mission donation UI will require an authenticated user session before starting the donation/payment flow. If the user is not authenticated, the mission page opens a Pump-specific OTP flow. If the user is authenticated, the page uses the current user's mobile and skips mobile entry.

Alternatives considered:

- Allow mobile-only Pump donations without OTP in the frontend. The backend can support mobile-only records, but the product owner prefers account creation/login so mission history is traceable in the user dashboard.
- Require users to leave the mission flow and visit `/fa/login`. This is simpler but creates friction and weakens Pump conversion.

Rationale:

- OTP authentication creates or finds the user and gives the frontend a stable authenticated current user.
- Mission history, future dashboard behavior, and support investigation become clearer.
- It still preserves the backend's mobile snapshot verification anchor.

### Decision: OTP request includes a purpose

`POST /api/auth/otp/request` will accept `otpPurpose: "login" | "pump_mission"`. The backend uses that purpose to select the SMS template ID. The frontend sends `login` from `/fa/login` and `pump_mission` from Pump mission pages.

Alternatives considered:

- Add separate endpoints for login OTP and Pump OTP. This duplicates validation and rate-limit behavior.
- Infer purpose from referrer or route. This is brittle and hard to test.

Rationale:

- A purpose field is explicit, typed, and easy to validate.
- It supports the two SMS panel patterns the project owner will configure.

### Decision: Add authenticated Pump donation intent support

The Pump donation intent endpoint must support the authenticated frontend flow by attaching `user_id` when a valid user token is present. The request still includes mission ID and amount, while mobile comes from the authenticated user or is checked against it if submitted.

Alternatives considered:

- Keep the current mobile-only public endpoint and let logged-in users still create guest donations. This would work for Pump verification but would not satisfy the user's requirement to track mission history by account.
- Create a separate account-only Pump endpoint. This is possible later, but not necessary for the first frontend slice if the existing endpoint can accept optional auth safely.

Rationale:

- The database and service contracts already distinguish registered and guest donation identity.
- The frontend can use one mission-payment flow for logged-in and just-authenticated users.

### Decision: Keep mission configuration app-owned for this slice

The frontend will define the four Pump missions in feature-local configuration derived from the Excel file. IDs must align with backend seeded mission keys. The first implementation currently has a confirmed backend seed for `iran-autism-general-donation`; the other three mission keys must be added consistently during implementation.

Alternatives considered:

- Fetch mission configuration from a CMS/admin API. This is outside the urgent scope.
- Hardcode mission data directly inside page components. This would create duplication and make tests harder.

Rationale:

- Feature-local configuration is appropriate while admin/CMS mission management is out of scope.
- It keeps mission cards, validation rules, and tests aligned in one place.

### Decision: Toman display, IRR API values

The UI displays donation amounts in toman with clear labels. Before API calls, the frontend converts toman to integer IRR by multiplying by 10. Backend amount fields remain IRR.

Alternatives considered:

- Display IRR everywhere. This is less natural for users.
- Send toman to the backend. This violates the accepted database/payment rule.

Rationale:

- Existing decisions say money is stored as integer IRR and UI may display toman where explicit.
- Pump spreadsheet threshold is written in toman.

### Decision: Use Jalali display through a reusable formatter

Dates shown to users will use a reusable `JalaliDate` component/helper based on `Intl.DateTimeFormat("fa-IR-u-ca-persian")` unless implementation testing reveals a runtime support problem. No date input or calendar library is needed in this change.

Alternatives considered:

- Add a Jalali date library immediately. This is unnecessary for display-only formatting.
- Show Gregorian dates until later. The user explicitly requested Jalali display now.

Rationale:

- The platform is Persian-first.
- Native Intl keeps dependency surface smaller for display-only use.

### Decision: Use package foundations before feature screens

The first frontend slice will build minimal but real foundations in `packages/ui`, `packages/icons`, `packages/types`, `packages/validation`, and `packages/api-client` instead of implementing one-off local widgets in Pump pages.

Alternatives considered:

- Build feature-local components only and extract later. Faster at first, but conflicts with accepted frontend architecture and invites duplicate auth/payment UI.
- Fully build a large design-system package. Too broad for the urgent Pump slice.

Rationale:

- The accepted frontend architecture requires component-driven reusable packages.
- The slice needs several reusable primitives anyway: buttons, fields, OTP, amount, modal, toast, icons, date, and status.

### Decision: Result UI is frontend-owned but backend-truth driven

The frontend will show animated success/failure/pending modals after Sadad returns, but it must base final state on backend payment verification status. Frontend local state cannot mark a mission complete.

Alternatives considered:

- Trust query params from Sadad or browser callback alone. This is unsafe and conflicts with backend payment rules.
- Show only a static backend JSON response. This is poor UX for users returning from payment.

Rationale:

- Payment success must come from server-side verification.
- Users still need a clear, calm Persian result screen with a route back to Pump.

## Risks / Trade-offs

- Pump may later require a specific return URL per mission or session -> For now use `https://pwa.pumpgame.ir/missions`; after implementation send Pump a short note asking whether they want a specific return URL.
- First three mission ticket counts are blank -> UI must not invent ticket counts; verification can still use backend completion count where Pump protocol requires repeatable count.
- Backend currently seeds only the general donation mission -> Implementation must add consistent seed/config for the other three mission keys before enabling frontend cards.
- Authenticated Pump donation intent may require a backend change -> Keep the change narrow: optional auth token support and registered identity creation only.
- Users can refresh during payment preparation -> Use idempotency/correlation keys in the API client flow and disable duplicate submit buttons while pending.
- Sadad callback/result can be repeated -> Backend remains source of truth and idempotent; frontend must tolerate already-successful/already-failed statuses.
- Persian validation messages can drift between frontend and backend -> Keep validation messages in `packages/validation` and API errors Persian by default.
- Animation can distract or fail accessibility expectations -> Keep animation purposeful, honor `prefers-reduced-motion`, and never block form/payment completion.
- Jalali display with `Intl` may vary across runtimes -> Verify in the Next.js runtime; if unsupported, introduce a small documented date formatting dependency.

## Migration Plan

1. Add or update backend contracts for OTP purpose and authenticated Pump donation intent.
2. Add frontend shared package foundations and dependencies.
3. Add design-system CSS and reusable UI components.
4. Add login/register page and auth state bootstrap.
5. Add Pump mission configuration, listing, detail, OTP, amount, and payment-start flow.
6. Add Sadad result route and animated modal states.
7. Add minimal dashboard/profile Pump mission history entry and Jalali date display.
8. Verify with unit, component, API-client, build/typecheck, and browser visual tests.

Rollback strategy:

- If live Sadad is not available, keep the fake/local gateway path active for development and verify frontend behavior against local backend states.
- If authenticated Pump intent support is delayed, do not ship the frontend mission flow as account-tracked; keep the page behind a feature flag or route guard until the contract is complete.
- If Pump return URL changes, update the route constant in frontend config without changing the mission flow.

## Open Questions

- What exact mission keys should be used for the three non-general Pump missions so frontend config, backend seeds, and Pump partner setup match?
- Will Pump later send a `returnUrl` or campaign/session query parameter that should override the temporary `https://pwa.pumpgame.ir/missions` return target?
- Should user dashboard mission history display donation amount, or only mission title, completion date, and status/count to avoid exposing more financial detail than needed?
