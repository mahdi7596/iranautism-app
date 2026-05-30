## Context

The project owner reviewed the current frontend design and compared it against earlier generated design references. The current UI works, but it has drifted from the desired visual direction. The next pass should restore the earlier design DNA: clean Persian RTL composition, flatter orange CTAs, purple as identity rather than decoration, smaller typography, confident white/lavender surfaces, and image-led public/Pump presentation.

Relevant visual references:

- `/Users/mahdi/.codex/generated_images/019e589d-3c0d-7482-86ae-2b1e5fd29c07/ig_0c70d01b6fa6502e016a1299f25ac48191b1acae9d78e83f71.png`
- `/Users/mahdi/.codex/generated_images/019e589d-3c0d-7482-86ae-2b1e5fd29c07/ig_0c70d01b6fa6502e016a12989075708191b6e42a07b4cd8020.png`

## Goals

- Preserve the accepted Next.js App Router, pure CSS, design-token, RTL-safe architecture.
- Make `DESIGN.md` match the new feedback before page-level implementation.
- Reduce title scale so most titles are around a `text-xl` equivalent.
- Remove button shadows and keep CTAs flat.
- Make the homepage hero a controlled three-slide hero.
- Make Pump list and mission cards more visual and simpler.
- Remove unwanted explanatory or roadmap content from the Pump first sections.
- Improve reuse by extracting repeated UI patterns into shared components/primitives.
- Verify with browser screenshots, responsive checks, and web guideline review.

## Non-Goals

- No backend changes.
- No payment gateway behavior changes.
- No Pump mission business logic changes.
- No new UI framework, Tailwind, DaisyUI, or Material UI.
- No broad CMS/admin redesign in this change.

## Design Direction

The selected direction is a refined version of `Trust & Progress` with the Persian `شفافیت بالینی` reference used as one hero slide. The surface should feel designed and warm but not over-decorated.

Rules:

- Orange CTAs are flat and shadowless.
- Purple is not used for anonymous account/profile icons.
- Section/card/page titles are smaller by default.
- Real or approved featured images carry Pump mission cards.
- Public sections are full-width bands where appropriate, with aligned inner content.
- Avoid nested card structures and page-local styling drift.

## Skill Use Plan

- Use `impeccable shape` before implementation to confirm the final brief.
- Use `ui-ux-pro-max` for accessibility, touch target, responsive, typography, and motion checks.
- Use `frontend-design` for final craft, constrained by the reference images and design docs.
- Use `next-best-practices` when implementing sliders/images/client boundaries:
  - `next/image` for visual assets;
  - explicit dimensions or stable aspect ratios;
  - client components only for interactive sliders/steppers;
  - no async client components;
  - keep static data and server-friendly layout outside client boundaries where possible.
- Use `web-design-guidelines` as the final changed-file audit.

## Reuse Strategy

Create or refine reusable pieces before page-specific work:

- Shell/content-width primitives for header/footer/pre-footer alignment.
- Button and icon-button variants.
- Anonymous login/account entry control.
- Hero slider primitive/composition.
- Banner slider primitive/composition.
- Mission card slider composition.
- Amount stepper with RTL-aware plus/minus placement.
- Auth-only layout for login.
- Typography/title tokens.

Generic UI belongs in `packages/ui`. Iran Autism feature-specific composition belongs under `apps/web/src/features/*`.

## Risks

- The current `DESIGN.md` still allows larger hero typography and shadowed depth, so implementation could drift unless the design system is updated first.
- Pump mission featured images may not exist yet. If missing, the implementation needs approved temporary assets or generated placeholders.
- Sliders can harm accessibility if controls, keyboard behavior, reduced motion, and focus order are not handled carefully.
- Removing header/footer from login may require route-group layout changes, not just CSS hiding.

## Open Questions

- Should `impeccable` or `ui-ux-pro-max` be the final authority when guidance overlaps? Recommended: `impeccable` for visual direction and `ui-ux-pro-max` for validation.
- Should homepage and Pump sliders auto-advance? Recommended: manual controls by default.
- Are Pump banner and mission featured images already available, or should the next pass create/select temporary approved assets?
- Should the `text-xl` title limit apply to true hero slide headlines too, or only to normal page/section/card titles?

