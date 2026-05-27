## 1. Baseline And Design System

- [x] 1.1 Audit the current dirty frontend changes and preserve unrelated user edits before implementation.
- [x] 1.2 Review `DESIGN.md`, `docs/decisions/frontend-architecture.md`, and the change specs before editing UI code.
- [x] 1.3 Update shared design tokens and UI primitive styles for button contrast, action hierarchy, focus states, disabled/loading states, alerts, empty states, and cards.
- [x] 1.4 Ensure all primary CTA text/icons are high-contrast and no primary action renders accidental black-on-orange text.
- [x] 1.5 Confirm all new styling uses pure CSS, design tokens, and RTL-safe logical properties.

## 2. Public App Shell And Homepage

- [x] 2.1 Redesign the global app shell header, navigation, page gutters, and footer for intentional Persian RTL desktop layout.
- [x] 2.2 Redesign the global app shell for mobile without overlap, clipping, horizontal scroll, or confusing nav order.
- [x] 2.3 Replace the `/fa` placeholder homepage with a production-ready Iran Autism public entry point.
- [x] 2.4 Add homepage CTAs and content paths to Pump missions and login/profile while avoiding claims that unfinished modules are live.
- [x] 2.5 Verify the homepage and shell render correctly on desktop and mobile.

## 3. Auth And Account Surfaces

- [x] 3.1 Redesign `/fa/login` desktop layout so explanation, mobile form, OTP step, and actions match the new public visual system.
- [x] 3.2 Redesign `/fa/login` mobile layout as a focused single-column OTP journey.
- [x] 3.3 Verify invalid mobile, OTP request loading, OTP sent, resend, edit-mobile, and API-error states use Persian polished UI.
- [x] 3.4 Redesign `/fa/profile` with mobile identity and Pump history entry state.
- [x] 3.5 Redesign `/fa/profile/pump-missions` anonymous, loading, empty, error, pending, completed, and count states.

## 4. Pump Mission Journey

- [x] 4.1 Redesign `/fa/missions/pump` as a campaign entry page with intentional imagery, clear first viewport, journey explanation, and four mission cards only.
- [x] 4.2 Redesign mission cards with consistent title, medal, amount, reward, icon, hover/focus, and CTA treatment.
- [x] 4.3 Redesign `/fa/missions/pump/[missionId]` as a guided mission checkout journey with mission context, amount, identity, OTP, payment, and post-payment expectations.
- [x] 4.4 Ensure authenticated users see their mobile identity and skip duplicate mobile entry.
- [x] 4.5 Ensure anonymous/mobile-only users understand mobile OTP is a valid Pump mission identity path.
- [x] 4.6 Verify amount stepper, validation, API-unavailable error, and payment-preparation error states preserve mission and amount context.
- [x] 4.7 Verify Pump list and detail pages on desktop and mobile for RTL direction, icon direction, no overlap, and no horizontal overflow.

## 5. Sadad Result And Recovery

- [x] 5.1 Redesign `/fa/payments/sadad/result` as full-page result states aligned with the public/Pump journey.
- [x] 5.2 Preserve backend-truth behavior: do not infer mission completion from local state or raw Sadad query fields.
- [x] 5.3 Verify success, failure/retry, pending, missing-ID, and lookup-error states have clear Persian copy and prioritized actions.
- [x] 5.4 Ensure result states avoid raw provider payloads, browser exception text, and stack traces.

## 6. Verification

- [x] 6.1 Run `pnpm --filter @iranautism/api-client test`.
- [x] 6.2 Run `pnpm --filter @iranautism/web test`.
- [x] 6.3 Run `pnpm --filter @iranautism/web typecheck`.
- [x] 6.4 Run `pnpm --filter @iranautism/web build`.
- [x] 6.5 Serve the app locally and inspect rendered desktop `1280x720` pages for `/fa`, `/fa/login`, `/fa/missions/pump`, mission detail, Sadad result, profile, and Pump history.
- [x] 6.6 Inspect rendered mobile `390x844` pages for `/fa`, `/fa/login`, `/fa/missions/pump`, mission detail, Sadad result, profile, and Pump history.
- [x] 6.7 Exercise real interactions with Playwright/Browser: mission card navigation, amount increment/decrement, invalid mobile validation, API-unavailable error, missing payment ID result, and anonymous history login path.
- [x] 6.8 Review browser console errors/warnings and fix relevant issues or document environment-only limitations.
- [x] 6.9 Capture screenshot evidence for the final QA summary.
