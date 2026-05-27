## Why

The current frontend is functionally connected but still feels like a scaffold: the homepage is placeholder content, the app shell lacks a deliberate RTL navigation model, CTAs and form states are visually inconsistent, and the Pump journey does not yet feel like a polished public fundraising experience. This change is needed now because the first real user-facing slice is the Pump donation mission flow, and it should establish the visual standard for the broader Iran Autism platform instead of accumulating design debt.

## What Changes

- Redesign the global public app shell so navigation, brand placement, footer, page gutters, and RTL/LTR behavior feel intentional across desktop and mobile.
- Replace the placeholder Persian homepage with a real first-screen public experience that introduces Iran Autism and routes users toward Pump missions, login/profile, and future platform content.
- Refresh the design-token usage for buttons, links, cards, forms, alerts, empty states, loading states, and focus/hover states so interactive UI is readable, accessible, and visually coherent.
- Redesign the Pump mission listing and mission detail flow as one campaign experience: strong first viewport, clear mission selection, mobile identity explanation, amount selection, OTP step, payment preparation, and return-to-Pump expectations.
- Redesign `/fa/login`, `/fa/payments/sadad/result`, `/fa/profile`, and `/fa/profile/pump-missions` so auth, payment result, and account states match the same design language and do not feel like unfinished utility screens.
- Preserve existing backend contracts, routes, mission configuration, OTP/payment behavior, and Persian-first copy requirements.
- Add rendered QA expectations for desktop and mobile viewports, including browser screenshots, interaction checks, console health, and responsive inspection.

## Capabilities

### New Capabilities
- `public-site-experience`: Covers the public app shell and homepage experience, including brand/navigation layout, first-screen public content, footer treatment, responsive RTL behavior, and reusable public page composition.

### Modified Capabilities
- `frontend-foundation-packages`: Strengthen design-system requirements for accessible contrast, primary/secondary CTA styling, app shell primitives, interactive states, and reusable visual patterns.
- `frontend-auth-otp`: Require the login/register flow to match the redesigned public UI system and feel production-ready on desktop and mobile.
- `frontend-pump-missions`: Require the Pump mission list/detail journey to use a coherent campaign-style design and guide the user through selection, identity, amount, OTP, payment, and return expectations.
- `frontend-sadad-result`: Require payment result states to be full-page, clear, recoverable, accessible, and visually aligned with the redesigned journey.
- `frontend-user-pump-history`: Require profile and Pump history states to use the shared account/public design language, including polished anonymous, empty, loading, error, pending, and completed states.

## Impact

- Affected app routes:
  - `apps/web/src/app/[locale]/layout.tsx`
  - `apps/web/src/app/[locale]/(public)/page.tsx`
  - `apps/web/src/app/[locale]/(auth)/login/page.tsx`
  - `apps/web/src/app/[locale]/(public)/missions/pump/page.tsx`
  - `apps/web/src/app/[locale]/(public)/missions/pump/[missionId]/page.tsx`
  - `apps/web/src/app/[locale]/(payments)/payments/sadad/result/page.tsx`
  - `apps/web/src/app/[locale]/(account)/profile/page.tsx`
  - `apps/web/src/app/[locale]/(account)/profile/pump-missions/page.tsx`
- Affected feature/UI code:
  - `apps/web/src/features/auth/*`
  - `apps/web/src/features/pump-missions/*`
  - `apps/web/src/features/payments/*`
  - `apps/web/src/features/account/*`
  - `apps/web/src/constants/site.constants.ts`
  - `apps/web/src/app/globals.css`
  - `packages/ui/src/*`
  - `packages/design-tokens/src/*`
  - `packages/icons/src/*`
- No backend API or database behavior is expected to change.
- No new external UI framework should be introduced; the accepted pure CSS, design-token, Radix-style behavior primitive, and Tabler icon wrapper decisions remain in force.
