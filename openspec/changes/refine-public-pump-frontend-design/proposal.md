## Why

The latest frontend redesign is functional but not aligned closely enough with the project owner's preferred visual direction. The current implementation has oversized headings, button shadows, a header order that does not match the desired RTL layout, anonymous account icon styling that feels wrong, a homepage hero that needs to become a three-slide reference-led hero, and Pump mission pages that feel visually weaker than the earlier approved design explorations.

This change captures the feedback as one coherent correction pass so implementation can improve the design system, shared frontend components, and affected pages without isolated one-off fixes.

## What Changes

- Realign the frontend visual language with the two referenced generated design images.
- Update design-system rules for smaller title typography, flat CTAs, no button shadows, and clearer anonymous/login account affordances.
- Adjust the public header so RTL navigation appears on the right side after the logo.
- Convert the homepage hero into a three-slide hero:
  - current hero concept with image gap and heart visibility fixed;
  - `Trust & Progress` reference slide;
  - Persian `شفافیت بالینی` reference slide.
- Redesign the Pump list page so the first section is only a two-banner slider.
- Remove the Pump roadmap section.
- Show Pump missions as image-led cards in a one-row slider across desktop, tablet, and mobile.
- Tighten the Pump mission detail page:
  - non-full-width badge;
  - icon-only back arrow;
  - plus on the right and minus on the left;
  - no toman button under the amount field;
  - no explanatory "after payment" content.
- Remove global header/footer from the login page and keep login reachable through a header login/account control.
- Align footer and repeated pre-footer content width with the header.
- Refactor toward reusable components and shared tokens instead of large repeated page-local UI blocks.

## Capabilities

### Modified Capabilities

- `public-site-experience`: Header, footer, homepage hero, login shell behavior, content width alignment, and public visual language.
- `frontend-pump-missions`: Pump list first section, banner slider, mission slider, mission featured images, and mission detail adjustments.
- `frontend-foundation-packages`: Shared tokens, buttons, typography, shell/container primitives, icon wrappers, slider primitives, and amount stepper reuse.
- `frontend-auth-otp`: Login page layout should be auth-only without global public header/footer.

## Impact

- Affected docs:
  - `DESIGN.md`
  - `docs/product/modules/frontend-design-review-feedback-2026-05-27.md`
- Affected app routes:
  - `apps/web/src/app/[locale]/layout.tsx`
  - `apps/web/src/app/[locale]/(public)/page.tsx`
  - `apps/web/src/app/[locale]/(public)/missions/pump/page.tsx`
  - `apps/web/src/app/[locale]/(public)/missions/pump/[missionId]/page.tsx`
  - `apps/web/src/app/[locale]/(auth)/login/page.tsx`
- Affected shared/frontend code:
  - `apps/web/src/app/[locale]/header-account-link.tsx`
  - `apps/web/src/app/globals.css`
  - `apps/web/src/features/auth/*`
  - `apps/web/src/features/pump-missions/*`
  - `packages/ui/src/*`
  - `packages/design-tokens/src/*`
  - `packages/icons/src/*`
- No backend API, payment, OTP, database, or Sadad contract changes are expected.
- No new CSS framework should be introduced.

