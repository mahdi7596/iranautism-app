## 1. Direction And Design System

- [x] 1.1 Confirm skill authority/order for overlapping design guidance.
- [x] 1.2 Confirm whether hero/Pump sliders are manual-only or may auto-advance.
- [x] 1.3 Confirm source for Pump banners and mission featured images.
- [x] 1.4 Update `DESIGN.md` for smaller title scale, flat buttons, no CTA shadows, anonymous/login icon rules, and slider accessibility rules.
- [x] 1.5 Update shared tokens/CSS primitives before page-specific implementation.

## 2. Shared Frontend Reuse

- [x] 2.1 Extract or refine content-width/shell primitives for header, footer, and pre-footer alignment.
- [x] 2.2 Refine button and icon-button variants with no shadows and accessible states.
- [x] 2.3 Add or refine reusable title styles around the `text-xl` target.
- [x] 2.4 Add reusable slider composition for hero/banner/mission use cases.
- [x] 2.5 Keep interactive slider code in focused client components and keep static slide data outside where practical.

## 3. Header, Footer, And Login Shell

- [x] 3.1 Move main header navigation to the right side after the logo in RTL order.
- [x] 3.2 Replace anonymous purple profile icon with a clearer login/account control.
- [x] 3.3 Preserve profile icon behavior for logged-in users.
- [x] 3.4 Align footer and repeated pre-footer inner content width with the header.
- [x] 3.5 Remove global header/footer from the login page via layout structure.
- [x] 3.6 Keep login reachable from the public header login/account control.

## 4. Homepage Hero

- [x] 4.1 Convert the homepage hero into a three-slide hero.
- [x] 4.2 Fix the current hero image start gap.
- [x] 4.3 Restore the animated heart visibility above the mother's head.
- [x] 4.4 Remove CTA shadows from the current hero slide.
- [x] 4.5 Add a `Trust & Progress` reference-led slide.
- [x] 4.6 Add a Persian `شفافیت بالینی` reference-led slide.
- [x] 4.7 Verify desktop, tablet, mobile, keyboard, and reduced-motion behavior.

## 5. Pump List Page

- [x] 5.1 Remove the current first section.
- [x] 5.2 Add a two-banner slider as the only first section content.
- [x] 5.3 Remove the roadmap section.
- [x] 5.4 Redesign mission cards as featured-image cards.
- [x] 5.5 Show missions in one row through a slider on desktop, tablet, and mobile.
- [x] 5.6 Verify mission card focus, hover, keyboard, and touch behavior.

## 6. Pump Mission Detail Page

- [x] 6.1 Make the badge non-full-width.
- [x] 6.2 Change back navigation to an icon-only arrow without text.
- [x] 6.3 Put plus on the right and minus on the left in the amount card.
- [x] 6.4 Remove the toman button under the amount field.
- [x] 6.5 Remove the post-payment explanation content.
- [x] 6.6 Preserve amount validation, OTP identity, payment start, and backend contract behavior.

## 7. Verification

- [x] 7.1 Run relevant unit tests.
- [x] 7.2 Run typecheck.
- [x] 7.3 Run production build.
- [x] 7.4 Test rendered pages in browser at desktop, tablet, and mobile widths.
- [x] 7.5 Capture screenshots for homepage, Pump list, Pump detail, login, footer/pre-footer alignment.
- [x] 7.6 Run `web-design-guidelines` review on changed UI files.
- [x] 7.7 Fix or document all audit findings before completion.

## 8. Follow-Up Feedback Pass

- [x] 8.1 Make homepage, Pump banner, and Pump mission sliders auto-advance by default.
- [x] 8.2 Replace hash/anchor slider controls with button controls so indicator clicks do not scroll the page.
- [x] 8.3 Retune the second and third homepage hero slides to use the provided reference direction and lighter orange token.
- [x] 8.4 Make Pump mission cards roomier, hide noisy slider scrollbars, and keep mission cards in an auto-sliding row.
- [x] 8.5 Add the very small `تومان` label inside the amount field.
- [x] 8.6 Reposition the login shell away from the top edge.
- [x] 8.7 Re-run tests, typecheck, build, and browser interaction checks.
