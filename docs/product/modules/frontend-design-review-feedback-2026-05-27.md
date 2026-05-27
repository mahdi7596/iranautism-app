# Frontend Design Review Feedback

Date: 2026-05-27

Status: Captured for proposal and implementation planning

Related visual references:

- `/Users/mahdi/.codex/generated_images/019e589d-3c0d-7482-86ae-2b1e5fd29c07/ig_0c70d01b6fa6502e016a1299f25ac48191b1acae9d78e83f71.png`
- `/Users/mahdi/.codex/generated_images/019e589d-3c0d-7482-86ae-2b1e5fd29c07/ig_0c70d01b6fa6502e016a12989075708191b6e42a07b4cd8020.png`

## Summary

The current frontend is visually better than the first scaffold, but it has drifted away from the earlier approved direction. The next frontend pass should not invent a new aesthetic. It should realign the whole public/Pump experience with the referenced designs, especially the flatter orange CTAs, clean white/lavender surfaces, purple as identity, smaller typography, purposeful imagery, and reusable component patterns.

The implementation should be treated as a design-system correction pass first, then a page redesign pass. This is important because many issues repeat across the homepage, Pump pages, mission detail, login, footer, and shared buttons.

## Skill And Method Expectations

Use these skills as the working stack for the next implementation pass:

- `openspec-explore` for categorizing feedback and shaping the change before implementation.
- `impeccable shape` for design brief discipline before code changes.
- `ui-ux-pro-max` for accessibility, interaction, responsive behavior, typography, and QA checklists.
- `frontend-design` for production visual craft, but constrained by the approved reference images and `DESIGN.md`.
- `next-best-practices` for App Router, image optimization, RSC/client boundaries, and bundle-conscious sliders.
- `web-design-guidelines` for a pre-ship review of changed UI files.

Because several skills overlap, the recommended division is:

- `impeccable` owns the design brief and reuse strategy.
- `ui-ux-pro-max` owns UX/accessibility/responsive validation.
- `frontend-design` owns final visual polish only after the direction is confirmed.
- `next-best-practices` owns implementation architecture.
- `web-design-guidelines` owns final audit findings.

## Global Design Direction

- Restore the visual direction of the two referenced images.
- Use the existing design as input, but do not treat it as final.
- Use purple for brand identity, selected/current states, and continuity.
- Use orange for primary CTAs only.
- Remove button shadows, especially from orange CTA buttons.
- Avoid purple for anonymous/account-entry icons when the user is not logged in.
- Use smaller titles across the app. The preferred practical target is close to Tailwind/DaisyUI `text-xl`, approximately `20px` with an appropriate Persian line-height.
- Avoid oversized section headings and hero-style typography outside true hero content.
- Keep the UI clean, flat, readable, and reusable.

## Header And Navigation

- The header is generally good, but the main navigation items should appear on the right side after the logo in RTL order.
- Header content alignment should use the same content width as the main page and footer content.
- Anonymous users should not see a purple profile icon.
- For anonymous users, use a clearer login/account-entry icon or button that links to the login page.
- Once the user is logged in, showing a profile icon is acceptable.
- Header links and icon buttons must remain accessible, keyboard reachable, and visually clear.

## Homepage Hero

- Convert the homepage hero into a three-slide hero.
- Slide 1 should be the current hero concept after fixes:
  - The left hero image should start exactly at the hero section start with no visual gap.
  - The animated heart above the mother's head should be visible.
  - Remove shadow styling from CTA buttons.
  - Keep the overall concept, but align it with the reference colors and flat CTA style.
- Slide 2 should use the earlier `Trust & Progress` design direction from the referenced image.
- Slide 3 should use the Persian `شفافیت بالینی` direction from the referenced image.
- Hero colors, CTA treatment, typography, and image treatments should follow the referenced images, not the current drifted style.
- The slider should work on desktop, tablet, and mobile without layout overlap or horizontal overflow.

## Typography

- Reduce title sizes globally.
- Treat `20px` or a project token equivalent to `text-xl` as the preferred title size for most section/card/page titles.
- Keep larger sizes only where a true hero slide needs them.
- Update `DESIGN.md` and shared tokens before changing individual pages so the rule is reusable.
- Persian text must not use negative letter spacing and must wrap cleanly.

## Buttons And Actions

- Remove shadow styles from all buttons.
- Orange CTA buttons should be flat, confident, and close to the referenced design.
- Primary CTAs should use orange only when they are the main action.
- Secondary/quiet actions should not visually compete with primary CTAs.
- Icon-only buttons need accessible labels and tooltips when the icon is not universally obvious.

## Pump Mission List Page

- Remove the current first section because it is not visually acceptable.
- The first section should only be a slider showcasing two banners.
- Do not add extra content in the Pump first section.
- Remove the current roadmap section.
- Mission presentation should be redesigned.
- Each mission will have a featured image.
- All missions should be presented in one horizontal row through a slider on desktop, tablet, and mobile.
- Mission cards should be image-led, clean, and aligned with the visual reference direction.

## Pump Mission Detail Page

- The badge/batch at the top is full width now; it should not be full width.
- The back arrow to the Pump mission list should not include text.
- In the donation/amount card, the plus button should be on the right and the minus button on the left.
- Remove the toman button under the amount field.
- Remove the content explaining what will happen after payment.
- Keep the mission detail focused on amount selection, identity/OTP where needed, and payment start.
- Preserve existing backend and payment behavior.

## Footer And Pre-Footer

- The footer and repeated section above the footer should be full-width bands.
- Their inner content start and end should align exactly with the header content width.
- Avoid narrow or mismatched content containers that make the footer look disconnected.

## Login Page

- The login page should not show the global header or footer.
- Users should reach login through a login/account icon or button from the public header.
- The login flow itself should remain focused and not look like a normal content page.

## Reusability And Code Quality Requirements

- Do not solve each page with large one-off component code.
- Extract reusable primitives/compositions where patterns repeat:
  - public shell/header/footer container rules;
  - button variants;
  - icon button/login entry;
  - hero slider;
  - banner slider;
  - mission card slider;
  - section title/token styling;
  - amount stepper;
  - auth-free layout for login.
- Keep Iran Autism-specific feature components in `apps/web/src/features/*`.
- Keep generic reusable UI primitives in `packages/ui`.
- Keep icon usage behind `packages/icons`.
- Keep design constants in tokens/CSS, not scattered raw values.
- Preserve pure CSS and RTL-safe logical properties.
- Use `next/image` for real images and reserve image dimensions to avoid layout shift.
- Keep client components small and only use them where interaction requires it.

## Proposed Implementation Order

1. Update `DESIGN.md` and design tokens for smaller titles, flat buttons, no CTA shadows, and the clarified anonymous/login icon rule.
2. Refactor shared shell/container/button/icon/typography primitives enough to prevent repeated page-level fixes.
3. Update the public header and footer alignment.
4. Split login into an auth-only layout without header/footer.
5. Implement the homepage three-slide hero using the referenced visual directions.
6. Redesign Pump list first section as a two-banner slider.
7. Replace Pump mission display with an image-led mission slider.
8. Tighten Pump mission detail page controls and remove unwanted explanatory content.
9. Run UI quality checks, browser screenshots, responsive review, and web guideline review.

## Open Questions For Confirmation

- Which skill should be the final authority if design guidance conflicts: `impeccable` or `ui-ux-pro-max`? Recommendation: `impeccable` for visual direction, `ui-ux-pro-max` for accessibility/responsive validation.
- Should the homepage hero slider auto-advance, or should it be manual only with visible controls? Recommendation: manual by default, optional slow auto-advance only if it respects reduced motion.
- Are the two Pump banners already available as client assets, or should they be created from the referenced design direction?
- Do all four Pump missions already have featured images, or should temporary approved images be selected/generated until client-provided images arrive?
- Should all headings everywhere be capped at `20px`, or only section/card titles while true hero slide titles may remain larger?
