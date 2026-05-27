## Context

The frontend baseline is a Next.js App Router app with pure CSS, design tokens, shared UI primitives, Tabler icons through a project wrapper, Persian-first copy, and RTL-safe layout requirements. The current rendered site proves the routes and flows exist, but the visual experience is not yet production-quality: the homepage is placeholder content, the header and navigation lack a deliberate RTL model, CTAs have inconsistent contrast and hierarchy, and utility states such as login, payment result, and profile history do not feel like one coherent product.

The redesign should treat the Pump mission flow as the first public-facing campaign slice of a broader Iran Autism platform. It should establish reusable app-shell, public-page, form, card, result, and account patterns that later CMS, donation, construction progress, media, and admin work can reuse.

The implementation must preserve current backend contracts and the Phase 1 Pump user journey described in `docs/product/modules/pump-phase-1-user-flow-summary.md`.

## Goals / Non-Goals

**Goals:**
- Establish a coherent public visual language for Iran Autism across app shell, homepage, login, Pump missions, payment result, profile, and Pump history.
- Make the first viewport immediately useful and emotionally credible, not a technical placeholder.
- Fix interaction hierarchy issues, including primary CTA contrast, button text color, hover/focus states, disabled states, loading states, error states, and empty states.
- Make RTL navigation intentional on desktop and mobile, with brand, nav links, and primary actions placed according to Persian reading flow.
- Improve the Pump mission journey end to end without changing the backend contract: mission selection, amount selection, mobile OTP identity, payment preparation, Sadad result, return to Pump, and profile history.
- Keep all visible user-facing copy Persian by default.
- Verify the redesign with rendered browser QA on desktop and mobile.

**Non-Goals:**
- No backend API, database, payment gateway, Pump verification, or Sadad credential changes.
- No full CMS/admin implementation in this change.
- No new CSS framework, component library, or utility-first styling system.
- No final production Pump return URL or reward wording changes unless the project owner provides confirmed partner copy.
- No broad content strategy for all future website pages beyond the homepage and active Pump/auth/payment/account surfaces.

## Decisions

### Decision 1: Redesign from the app shell outward

The app shell should be the first implementation layer because every route currently inherits the weak header/footer and spacing model.

Implementation direction:
- Build a more deliberate public header with brand identity on the natural RTL start side, grouped navigation, and a visually distinct primary action where useful.
- Use the same shell on homepage, login, Pump pages, result pages, and account pages.
- Keep mobile navigation simple and visible for the current small route set; do not add a drawer until the navigation grows.

Alternatives considered:
- Redesign each page independently. Rejected because it would preserve the current mismatch between routes.
- Add a full mobile menu now. Deferred because the route set is small and a drawer would add behavior complexity without enough navigational value.

### Decision 2: Strengthen shared tokens and primitives before polishing feature pages

The current UI problems include black-looking CTA text, inconsistent action hierarchy, generic cards, and uneven state styling. These should be addressed in shared CSS/components first so feature work does not keep re-solving the same problems.

Implementation direction:
- Audit and adjust `packages/design-tokens`, `packages/ui`, and `apps/web/src/app/globals.css` together.
- Ensure `.ds-btn--primary` and any link styled as a primary button always render high-contrast text.
- Add or refine reusable shell, section, card, form, state, and action patterns using pure CSS and logical properties.
- Keep Tabler icons routed through `packages/icons`.

Alternatives considered:
- Patch only the classes visible in the current Pump pages. Rejected because the login/result/profile pages share the same visual problems.

### Decision 3: Treat the homepage as a real public entry point

The current homepage explicitly says it is only a scaffold. That undermines trust and makes the whole project feel unfinished.

Implementation direction:
- Replace placeholder copy with a concise public entry experience for Iran Autism.
- Include clear paths to Pump missions and login/profile.
- Use the design language that future public CMS pages can inherit: real brand signal, clear headline, supportive copy, and a structured preview of platform capabilities without pretending those future modules are complete.

Alternatives considered:
- Redirect `/fa` directly to Pump missions. Rejected because the platform is broader than Pump and needs a credible home entry.

### Decision 4: Make Pump a guided campaign journey, not just a card grid

The Pump flow should feel like a short mission completion experience. Users need to know what happens, why mobile verification matters, and where they go after payment.

Implementation direction:
- Keep exactly the four current Pump missions.
- Present the list page as a campaign entry with mission selection and a concise journey explanation.
- Present mission detail as a focused form flow where the amount, mobile identity, OTP, and payment steps are visually connected.
- Keep authenticated-user and mobile-only-user paths clear.
- Preserve payment start behavior and result URL handling.

Alternatives considered:
- Use a generic donation checkout layout. Rejected because Pump has partner-specific mission verification and return expectations.

### Decision 5: Result and account states should be full-page, recoverable, and consistent

Payment result, anonymous profile history, empty history, loading, and error states currently feel sparse. They should be designed as first-class user journey moments.

Implementation direction:
- Show result states as clear full-page surfaces rather than relying on modal-only presentation.
- Provide obvious recovery actions: retry/select another mission, return to Pump, login, or go back to missions.
- Use Persian messages that explain what happened without exposing internal provider details.
- Keep backend truth as the only source for payment completion.

Alternatives considered:
- Keep the modal result pattern. Rejected because it hides the page state and feels disconnected from the journey.

### Decision 6: Browser QA is part of the implementation contract

This redesign is visual and interaction-heavy. Static tests are necessary but insufficient.

Implementation direction:
- Run unit/type/build checks.
- Run the app locally and inspect the rendered output with Browser/Playwright.
- Check at least desktop `1280x720` and mobile `390x844`.
- Exercise core interactions: mission selection, amount controls, invalid mobile validation, API-unavailable error, missing payment ID result, anonymous history login path.
- Capture screenshots or otherwise record visual evidence.

Alternatives considered:
- Rely on code review and build output only. Rejected because the main problem is rendered UX quality.

## Risks / Trade-offs

- [Risk] The redesign may overfit the small Phase 1 route set and need revision once CMS/admin/media pages arrive. → Mitigation: create reusable composition patterns and keep future module claims conservative.
- [Risk] The client has a specific visual direction in mind that is not yet fully articulated. → Mitigation: use a proposal/apply loop and verify rendered screenshots early before deep implementation.
- [Risk] Existing dirty worktree changes from earlier UI attempts may overlap with this change. → Mitigation: read diffs carefully and preserve unrelated user changes; keep implementation commits scoped.
- [Risk] Real OTP/payment completion cannot be verified without database, SMS, and Sadad environment setup. → Mitigation: verify frontend states up to the backend boundary and document any environment limitation.
- [Risk] Stronger visual assets may be needed for a premium homepage/campaign feel. → Mitigation: use existing client-provided imagery first; if insufficient, create or request approved image assets in a separate asset pass.
- [Risk] Improving global CSS may accidentally affect all routes. → Mitigation: verify every currently implemented route after changes and use shared primitives for intentional changes.

## Migration Plan

1. Update shared design tokens and UI primitive styling.
2. Update global app shell and public layout CSS.
3. Replace homepage placeholder with a production-ready public entry surface.
4. Redesign login, Pump list/detail, Sadad result, profile, and Pump history surfaces.
5. Run tests, typecheck, build, and rendered browser QA.
6. If a visual regression is found, fix before considering the change complete.

Rollback strategy: because this change is frontend-only, rollback can revert the changed frontend files and shared CSS/token files without database migration or backend state changes.

## Open Questions

- Should the main header include a persistent “حمایت مالی” primary action now, or should Pump remain the only visible donation CTA until broader donation modules are implemented?
- Should the homepage use only existing client-provided imagery, or is a generated/commissioned visual asset acceptable for the first production pass?
- Does the project owner want the brand name shown as “انجمن اتیسم ایران”, “ایران اتیسم”, or another exact public-facing label?
- Should Pump be visually co-branded with Pump, or should it remain primarily Iran Autism-branded with conservative Pump references until partner assets/copy are confirmed?
